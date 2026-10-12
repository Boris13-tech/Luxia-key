import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import { generateRegistrationOptions, generateAuthenticationOptions, verifyRegistrationResponse,
  verifyAuthenticationResponse, type RegistrationResponseJSON, type AuthenticationResponseJSON,
  type AuthenticatorTransport } from '@simplewebauthn/server';
import type { Config } from './config.js';
import { transaction } from './db.js';
import { audit } from './audit.js';
import { createSession, hash } from './sessions.js';
export class Denied extends Error { constructor() { super('DENIED'); } }
interface Challenge { challenge: string; origin: string; rp_id: string; user_id: string | null; display_name: string | null }
export class WebAuthn {
  constructor(private db: Pool, private cfg: Config) {}
  async options(purpose: 'registration' | 'authentication', origin: string, binding: string, correlation: string, displayName = 'LUXIA Key user') {
    if (!this.cfg.origins.includes(origin)) throw new Denied();
    const user = purpose === 'registration' ? randomUUID() : null;
    const options = purpose === 'registration'
      ? await generateRegistrationOptions({ rpName: 'LUXIA Key', rpID: this.cfg.rpID,
        userID: new TextEncoder().encode(user!), userName: user!, userDisplayName: displayName,
        attestationType: 'none', supportedAlgorithmIDs: [-7, -257],
        authenticatorSelection: { residentKey: 'required', userVerification: 'required' } })
      : await generateAuthenticationOptions({ rpID: this.cfg.rpID, userVerification: 'required' });
    await transaction(this.db, async client => {
      await client.query(`INSERT INTO authentication_challenges
        (id,challenge,purpose,origin,rp_id,binding_hash,user_id,display_name,expires_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now()+interval '5 minutes')`,
      [randomUUID(),options.challenge,purpose,origin,this.cfg.rpID,hash(binding),user,purpose === 'registration' ? displayName : null]);
      await audit(client,`${purpose}.options`,'SUCCESS','OK',correlation);
    });
    return options;
  }
  async consume(clientDataJSON: string, purpose: string, origin: string, binding: string): Promise<Challenge> {
    if (!this.cfg.origins.includes(origin) || !binding || typeof clientDataJSON !== 'string' || clientDataJSON.length > 16384) throw new Denied();
    let challenge: unknown;
    try { challenge = JSON.parse(Buffer.from(clientDataJSON,'base64url').toString('utf8')).challenge; }
    catch { throw new Denied(); }
    if (typeof challenge !== 'string' || challenge.length > 1024) throw new Denied();
    // Separate committed atomic UPDATE: failed verification also burns the challenge.
    const result = await this.db.query<Challenge>(`UPDATE authentication_challenges SET used_at=now()
      WHERE challenge=$1 AND purpose=$2 AND origin=$3 AND rp_id=$4 AND binding_hash=$5
      AND expires_at>now() AND used_at IS NULL
      RETURNING challenge,origin,rp_id,user_id,display_name`, [challenge,purpose,origin,this.cfg.rpID,hash(binding)]);
    if (!result.rows[0]) throw new Denied();
    return result.rows[0];
  }
  async register(response: RegistrationResponseJSON, origin: string, binding: string, correlation: string) {
    const ch = await this.consume(response.response.clientDataJSON,'registration',origin,binding);
    const result = await verifyRegistrationResponse({ response, expectedChallenge: ch.challenge,
      expectedOrigin: ch.origin, expectedRPID: ch.rp_id, requireUserVerification: true });
    if (!result.verified || !result.registrationInfo || !ch.user_id) throw new Denied();
    const { credential, credentialDeviceType, credentialBackedUp } = result.registrationInfo;
    return transaction(this.db, async client => {
      // Only new anonymous identities. Existing-user credential enrollment requires a later reviewed flow.
      await client.query('INSERT INTO users (id,display_name) VALUES ($1,$2)',[ch.user_id,ch.display_name]);
      await client.query("INSERT INTO identity_security_states (user_id,state) VALUES ($1,'active')",[ch.user_id]);
      await client.query(`INSERT INTO credentials (id,user_id,public_key,counter,device_type,backed_up,transports)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,[credential.id,ch.user_id,Buffer.from(credential.publicKey),credential.counter,
        credentialDeviceType,credentialBackedUp,credential.transports ?? []]);
      await audit(client,'registration.verify','SUCCESS','OK',correlation,ch.user_id,credential.id);
      return { verified: true, userId: ch.user_id };
    });
  }
  async authenticate(response: AuthenticationResponseJSON, origin: string, binding: string, correlation: string, oldToken?: string) {
    const ch = await this.consume(response.response.clientDataJSON,'authentication',origin,binding);
    return transaction(this.db, async client => {
      const lookup = await client.query<{ user_id: string }>('SELECT user_id FROM credentials WHERE id=$1',[response.id]);
      const user = lookup.rows[0]?.user_id;
      if (!user) throw new Denied();
      // Consistent lock order: user security state, credential, session; serializes revoke-all and login.
      const state = await client.query("SELECT state FROM identity_security_states WHERE user_id=$1 FOR UPDATE",[user]);
      if (state.rows[0]?.state !== 'active') throw new Denied();
      const result = await client.query<{ id: string; user_id: string; public_key: Buffer; counter: string;
        transports: AuthenticatorTransport[]; revoked_at: Date | null }>(
        'SELECT id,user_id,public_key,counter,transports,revoked_at FROM credentials WHERE id=$1 FOR UPDATE',[response.id]);
      const cred = result.rows[0];
      if (!cred || cred.revoked_at || (ch.user_id && ch.user_id !== cred.user_id)) throw new Denied();
      if (!response.response.userHandle || Buffer.from(response.response.userHandle,'base64url').toString('utf8') !== user) throw new Denied();
      const verified = await verifyAuthenticationResponse({ response, expectedChallenge: ch.challenge,
        expectedOrigin: ch.origin, expectedRPID: ch.rp_id, requireUserVerification: true,
        credential: { id: cred.id, publicKey: new Uint8Array(cred.public_key), counter: Number(cred.counter), transports: cred.transports } });
      if (!verified.verified) throw new Denied();
      await client.query('UPDATE credentials SET counter=$1,last_used_at=now(),backed_up=$2 WHERE id=$3',
        [verified.authenticationInfo.newCounter,verified.authenticationInfo.credentialBackedUp,cred.id]);
      if (oldToken) await client.query('UPDATE sessions SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL',[hash(oldToken)]);
      const rawToken = await createSession(client,user,cred.id,correlation);
      await audit(client,'authentication.verify','SUCCESS','OK',correlation,user,cred.id);
      return { rawToken, userId: user };
    });
  }
}
