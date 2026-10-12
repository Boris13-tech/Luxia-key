import { beforeAll,beforeEach,afterAll,it,expect } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { pool,migrate } from '../../services/api/db.js';
import { app } from '../../services/api/app.js';
import { authenticator } from '../fixtures/authenticator.js';
import { hash } from '../../services/api/sessions.js';
import { config } from '../../services/api/config.js';
import { WEBAUTHN_ALGORITHMS } from '../../services/api/algorithm-policy.js';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('/luxia_test')) throw new Error('Dedicated TEST_DATABASE_URL ending /luxia_test required; tests never skip');
const db = pool(url);
const cfg = config({ LUXIA_RUNTIME_MODE: 'test',WEBAUTHN_RP_ID: 'localhost',WEBAUTHN_ALLOWED_ORIGINS: 'http://localhost:3000' });
let api = app(db,cfg);
const origin = cfg.origins[0];
const post = (path: string,body: object = {},cookie = '') => request(api).post(`/api/${path}`).set('Origin',origin).set('X-Luxia-Request','1').set('Cookie',cookie).send(body);
const cookies = (res: { headers: Record<string,unknown> }) => (res.headers['set-cookie'] as string[]).map(x => x.split(';')[0]).join('; ');
beforeAll(async () => { await migrate(db); });
beforeEach(() => { api = app(db,cfg); }); // Isolated HTTP server/rate-limit state per case.
afterAll(async () => { await db.end(); });
async function enrolled(algorithm: -7 | -257 = -7) {
  const auth = authenticator(algorithm);
  const options = await post('webauthn/register/options',{ displayName: `test-${randomUUID()}` });
  expect(options.status).toBe(200);
  expect(options.body.options.authenticatorSelection.userVerification).toBe('required');
  expect(options.body.options.pubKeyCredParams.map((p: { alg: number }) => p.alg)).toEqual([...WEBAUTHN_ALGORITHMS]);
  const response = auth.registration(options.body.options.challenge,options.body.options.user.id);
  const result = await post('webauthn/register/verify',response,cookies(options));
  expect(result.status).toBe(200);
  return { auth,user: result.body.userId as string };
}
async function login(auth: ReturnType<typeof authenticator>) {
  const options = await post('webauthn/auth/options');
  expect(options.body.options.userVerification).toBe('required');
  const response = auth.authentication(options.body.options.challenge);
  const result = await post('webauthn/auth/verify',response,cookies(options));
  expect(result.status).toBe(200);
  return { result,response,flowCookie: cookies(options),session: cookies(result) };
}
it('valid registration and signed authentication persist public credentials; replay denied',async () => {
  const { auth } = await enrolled();
  const { session,response,flowCookie,result } = await login(auth);
  expect(String(result.headers['set-cookie'])).toContain('HttpOnly');
  expect(String(result.headers['set-cookie'])).toContain('SameSite=Strict');
  expect((await post('session/read',{},session)).status).toBe(200);
  expect((await post('webauthn/auth/verify',response,flowCookie)).status).toBe(401);
  const raw = /luxia_session=([^;]+)/.exec(session)![1];
  const stored = await db.query('SELECT token_hash FROM sessions WHERE token_hash=$1',[hash(raw)]);
  expect(stored.rowCount).toBe(1); expect(stored.rows[0].token_hash).not.toBe(raw);
});
it.each(['invalid','expired','replay','origin','rp','uv','binding'])('registration denies %s',async kind => {
  const auth = authenticator();
  const options = await post('webauthn/register/options');
  const ch = options.body.options.challenge;
  if (kind === 'expired') await db.query("UPDATE authentication_challenges SET created_at=now()-interval '10 minutes',expires_at=now()-interval '1 minute' WHERE challenge=$1",[ch]);
  const response = auth.registration(kind === 'invalid' ? 'invalid' : ch,options.body.options.user.id,
    kind === 'origin' ? 'https://evil.test' : origin,kind === 'rp' ? 'evil.test' : 'localhost',kind !== 'uv');
  if (kind === 'replay') expect((await post('webauthn/register/verify',response,cookies(options))).status).toBe(200);
  expect((await post('webauthn/register/verify',response,kind === 'binding' ? '' : cookies(options))).status).toBe(401);
});
it.each(['expired','origin','rp','uv','revoked','signature','user','locked'])('authentication denies %s',async kind => {
  const { auth,user } = await enrolled();
  const options = await post('webauthn/auth/options');
  const ch = options.body.options.challenge;
  if (kind === 'expired') await db.query("UPDATE authentication_challenges SET created_at=now()-interval '10 minutes',expires_at=now()-interval '1 minute' WHERE challenge=$1",[ch]);
  if (kind === 'revoked') await db.query('UPDATE credentials SET revoked_at=now() WHERE id=$1',[auth.id]);
  if (kind === 'locked') await db.query("UPDATE identity_security_states SET state='locked' WHERE user_id=$1",[user]);
  const response = auth.authentication(ch,kind === 'origin' ? 'https://evil.test' : origin,kind === 'rp' ? 'evil.test' : 'localhost',kind !== 'uv');
  if (kind === 'signature') response.response.signature = 'invalid';
  if (kind === 'user') response.response.userHandle = Buffer.from(randomUUID()).toString('base64url');
  expect((await post('webauthn/auth/verify',response,cookies(options))).status).toBe(401);
});
it('concurrent challenge submissions admit one verifier',async () => {
  const { auth } = await enrolled();
  const options = await post('webauthn/auth/options');
  const response = auth.authentication(options.body.options.challenge);
  const results = await Promise.all([post('webauthn/auth/verify',response,cookies(options)),post('webauthn/auth/verify',response,cookies(options))]);
  expect(results.map(x => x.status).sort()).toEqual([200,401]);
});
it('session expiry, logout and revoke-all deny subsequent access',async () => {
  const { auth,user } = await enrolled();
  const first = await login(auth);
  await db.query("UPDATE sessions SET created_at=now()-interval '2 hours',expires_at=now()-interval '1 hour' WHERE user_id=$1",[user]);
  expect((await post('session/read',{},first.session)).status).toBe(401);
  const second = await login(auth);
  expect((await post('session/logout',{},second.session)).status).toBe(200);
  expect((await post('session/read',{},second.session)).status).toBe(401);
  const third = await login(auth); const fourth = await login(auth);
  expect((await post('session/revoke-all',{},third.session)).status).toBe(200);
  expect((await post('session/read',{},fourth.session)).status).toBe(401);
});
it('audit excludes attacker secrets and is append-only',async () => {
  const sentinel = 'sensitive-test-value';
  await post('webauthn/register/verify',{ secret: sentinel,rawToken: sentinel,recoveryCode: sentinel,privateKey: sentinel });
  const events = await db.query('SELECT operation,result,reason FROM audit_events');
  expect(JSON.stringify(events.rows)).not.toContain(sentinel);
  expect(events.rows.some(x => x.result === 'DENIED')).toBe(true);
  await expect(db.query("UPDATE audit_events SET reason='changed'")).rejects.toThrow('append-only');
});
it('CSRF and missing binding deny; persistence survives a new pool/API instance',async () => {
  expect((await request(api).post('/api/webauthn/register/options').send({})).status).toBe(401);
  const { auth } = await enrolled(); const { session } = await login(auth);
  const restarted = pool(url);
  try {
    const res = await request(app(restarted,cfg)).post('/api/session/read').set('Origin',origin).set('X-Luxia-Request','1').set('Cookie',session).send({});
    expect(res.status).toBe(200);
  } finally { await restarted.end(); }
});
it('reauthentication rotates the presented session and revokes the old token',async () => {
  const { auth } = await enrolled(); const first = await login(auth);
  const options = await post('webauthn/auth/options');
  const response = auth.authentication(options.body.options.challenge);
  const result = await post('webauthn/auth/verify',response,`${cookies(options)}; ${first.session}`);
  expect(result.status).toBe(200);
  expect((await post('session/read',{},first.session)).status).toBe(401);
  expect((await post('session/read',{},cookies(result))).status).toBe(200);
});
it('revoked credentials and missing state invalidate existing sessions',async () => {
  const first = await enrolled(); const logged = await login(first.auth);
  await db.query('UPDATE credentials SET revoked_at=now() WHERE id=$1',[first.auth.id]);
  expect((await post('session/read',{},logged.session)).status).toBe(401);
  const second = await enrolled(); const logged2 = await login(second.auth);
  await db.query('DELETE FROM identity_security_states WHERE user_id=$1',[second.user]);
  expect((await post('session/read',{},logged2.session)).status).toBe(401);
});
it('production cookies have Secure and __Host attributes',async () => {
  const prod = app(db,config({ LUXIA_RUNTIME_MODE: 'production',WEBAUTHN_RP_ID: 'example.com',WEBAUTHN_ALLOWED_ORIGINS: 'https://example.com' }));
  const result = await request(prod).post('/api/webauthn/register/options').set('Origin','https://example.com').set('X-Luxia-Request','1').send({});
  expect(result.status).toBe(200);
  expect(String(result.headers['set-cookie'])).toContain('__Host-luxia_flow=');
  expect(String(result.headers['set-cookie'])).toContain('Secure');
});
it('unavailable database denies without fallback or raw diagnostic leakage',async () => {
  const unavailable = pool(url); await unavailable.end();
  const result = await request(app(unavailable,cfg)).post('/api/webauthn/auth/options').set('Origin',origin).set('X-Luxia-Request','1').send({});
  expect(result.status).toBe(503);
  expect(result.body.error).toBe('DEPENDENCY_UNAVAILABLE');
  expect(JSON.stringify(result.body)).not.toContain(url);
});
it.each([-7,-257] as const)('advertised algorithm %s registers and authenticates with real library/SQL',async algorithm => {
  const { auth } = await enrolled(algorithm); await login(auth);
});
it.each([-8,12345] as const)('unoffered COSE algorithm %s is denied, not stored, and burns the bound challenge',async algorithm => {
  const auth = algorithm === -8 ? authenticator(-8) : authenticator(-7,algorithm);
  const options = await post('webauthn/register/options');
  const ch = options.body.options.challenge;
  const body = auth.registration(ch,options.body.options.user.id);
  expect((await post('webauthn/register/verify',body,cookies(options))).status).toBe(401);
  expect((await db.query('SELECT id FROM credentials WHERE id=$1',[auth.id])).rowCount).toBe(0);
  expect((await db.query('SELECT used_at FROM authentication_challenges WHERE challenge=$1',[ch])).rows[0].used_at).not.toBeNull();
  expect((await post('webauthn/register/verify',body,cookies(options))).status).toBe(401);
});
it.each(['missing-id','array','invalid-client-data'] as const)('malformed %s leaves challenge available for a valid bound request',async kind => {
  const auth = authenticator(); const options = await post('webauthn/register/options');
  const ch = options.body.options.challenge; const body = auth.registration(ch,options.body.options.user.id);
  const malformed = kind === 'missing-id' ? { ...body,id: undefined } : kind === 'array' ? [] :
    { ...body,response: { ...body.response,clientDataJSON: 'not-json' } };
  expect((await post('webauthn/register/verify',malformed,cookies(options))).status).toBe(401);
  expect((await db.query('SELECT used_at FROM authentication_challenges WHERE challenge=$1',[ch])).rows[0].used_at).toBeNull();
  expect((await post('webauthn/register/verify',body,cookies(options))).status).toBe(200);
  expect((await post('webauthn/register/verify',body,cookies(options))).status).toBe(401);
});
it('wrong browser binding cannot burn another browser challenge',async () => {
  const auth = authenticator(); const first = await post('webauthn/register/options'); const other = await post('webauthn/register/options');
  const ch = first.body.options.challenge; const body = auth.registration(ch,first.body.options.user.id);
  expect((await post('webauthn/register/verify',body,cookies(other))).status).toBe(401);
  expect((await db.query('SELECT used_at FROM authentication_challenges WHERE challenge=$1',[ch])).rows[0].used_at).toBeNull();
  expect((await post('webauthn/register/verify',body,cookies(first))).status).toBe(200);
});
it('valid-shaped cryptographic failure burns challenge and a later valid signature is denied',async () => {
  const { auth } = await enrolled(); const options = await post('webauthn/auth/options');
  const ch = options.body.options.challenge; const valid = auth.authentication(ch);
  const invalid = { ...valid,response: { ...valid.response,signature: 'invalid' } };
  expect((await post('webauthn/auth/verify',invalid,cookies(options))).status).toBe(401);
  expect((await db.query('SELECT used_at FROM authentication_challenges WHERE challenge=$1',[ch])).rows[0].used_at).not.toBeNull();
  expect((await post('webauthn/auth/verify',valid,cookies(options))).status).toBe(401);
});
it.each(['staging','production'])('%s flow and real verified session cookies are Secure, HttpOnly, Path=/ and host-only',async mode => {
  const trustedOrigin = 'https://example.com';
  const secureApp = app(db,config({ LUXIA_RUNTIME_MODE: mode,WEBAUTHN_RP_ID: 'example.com',WEBAUTHN_ALLOWED_ORIGINS: trustedOrigin }));
  const send = (path: string,body: object = {},cookie = '') => request(secureApp).post(`/api/${path}`).set('Origin',trustedOrigin)
    .set('X-Luxia-Request','1').set('X-Forwarded-Proto','http').set('X-Forwarded-Host','evil.test').set('Referer','http://evil.test').set('Cookie',cookie).send(body);
  const auth = authenticator(); const options = await send('webauthn/register/options');
  const checkCookie = (value: string,name: string) => {
    expect(value).toContain(`${name}=`); expect(value).toContain('; Secure'); expect(value).toContain('; HttpOnly');
    expect(value).toContain('; Path=/'); expect(value).toContain('; SameSite=Strict'); expect(value).not.toMatch(/;\s*Domain=/i);
  };
  checkCookie(String(options.headers['set-cookie']),'__Host-luxia_flow');
  expect((await send('webauthn/register/verify',auth.registration(options.body.options.challenge,options.body.options.user.id,trustedOrigin,'example.com'),cookies(options))).status).toBe(200);
  const loginOptions = await send('webauthn/auth/options');
  const result = await send('webauthn/auth/verify',auth.authentication(loginOptions.body.options.challenge,trustedOrigin,'example.com'),cookies(loginOptions));
  expect(result.status).toBe(200); checkCookie(String(result.headers['set-cookie']),'__Host-luxia_session');
  expect((await send('session/read',{},cookies(result))).status).toBe(200);
  expect((await send('session/logout',{},cookies(result))).status).toBe(200);
  expect((await send('session/read',{},cookies(result))).status).toBe(401);
});
