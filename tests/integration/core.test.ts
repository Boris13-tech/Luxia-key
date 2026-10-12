import { beforeAll,afterAll,it,expect } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { pool,migrate } from '../../services/api/db.js';
import { app } from '../../services/api/app.js';
import { authenticator } from '../fixtures/authenticator.js';
import { hash } from '../../services/api/sessions.js';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('/luxia_test')) throw new Error('Dedicated TEST_DATABASE_URL ending /luxia_test required; tests never skip');
const db = pool(url);
const cfg = { rpID: 'localhost',origins: ['http://localhost:3000'],production: false };
const api = app(db,cfg);
const origin = cfg.origins[0];
const post = (path: string,body: object = {},cookie = '') => request(api).post(`/api/${path}`).set('Origin',origin).set('X-Luxia-Request','1').set('Cookie',cookie).send(body);
const cookies = (res: { headers: Record<string,unknown> }) => (res.headers['set-cookie'] as string[]).map(x => x.split(';')[0]).join('; ');
beforeAll(async () => { await migrate(db); });
afterAll(async () => { await db.end(); });
async function enrolled() {
  const auth = authenticator();
  const options = await post('webauthn/register/options',{ displayName: `test-${randomUUID()}` });
  expect(options.status).toBe(200);
  expect(options.body.options.authenticatorSelection.userVerification).toBe('required');
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

