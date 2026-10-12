import { expect,it } from 'vitest';
import request from 'supertest';
import type { Pool } from 'pg';
import { config,type Config } from '../../services/api/config.js';
import { cookiePolicy } from '../../services/api/cookies.js';
import { app } from '../../services/api/app.js';
const publicConfig = { WEBAUTHN_RP_ID: 'example.com',WEBAUTHN_ALLOWED_ORIGINS: 'https://example.com' };
it.each([undefined,'','prod','invalid'])('missing/invalid trusted runtime %s denies startup configuration',mode => {
  expect(() => config({ ...publicConfig,LUXIA_RUNTIME_MODE: mode,NODE_ENV: 'production' })).toThrow();
});
it.each(['development','test'])('public hosts cannot operate in %s even with HTTPS',mode => {
  expect(() => config({ ...publicConfig,LUXIA_RUNTIME_MODE: mode })).toThrow();
});
it.each(['staging','production'])('%s denies insecure origin/policy, independent of NODE_ENV',mode => {
  expect(() => config({ ...publicConfig,LUXIA_RUNTIME_MODE: mode,WEBAUTHN_ALLOWED_ORIGINS: 'http://example.com' })).toThrow();
  expect(() => cookiePolicy({ mode,rpID: 'example.com',origins: ['http://example.com'] } as Config)).toThrow();
  const trusted = config({ ...publicConfig,LUXIA_RUNTIME_MODE: mode,NODE_ENV: 'development' });
  expect(cookiePolicy(trusted).attributes).toEqual({ secure: true,httpOnly: true,path: '/',sameSite: 'strict' });
  expect(cookiePolicy(trusted).sessionName).toBe('__Host-luxia_session');
  expect(cookiePolicy(trusted).bindingName).toBe('__Host-luxia_flow');
  expect(Object.isFrozen(trusted)).toBe(true); expect(Object.isFrozen(trusted.origins)).toBe(true);
});
it.each(['localhost','127.0.0.1','[::1]'])('explicit loopback development %s is accepted',rpID => {
  const trusted = config({ LUXIA_RUNTIME_MODE: 'development',WEBAUTHN_RP_ID: rpID,WEBAUTHN_ALLOWED_ORIGINS: `http://${rpID}:3000` });
  expect(cookiePolicy(trusted).attributes.secure).toBe(false);
});
it.each(['Origin','Referer','X-Forwarded-Proto','X-Forwarded-Host'])('forged %s cannot downgrade trusted mode (mocked SQL)',async header => {
  const trusted = config({ ...publicConfig,LUXIA_RUNTIME_MODE: 'production' });
  const query = async () => ({ rows: [],rowCount: 0 });
  const db = { query,connect: async () => ({ query,release: () => {} }) } as unknown as Pool;
  const call = request(app(db,trusted)).post('/api/webauthn/register/options').set('Origin','https://example.com').set('X-Luxia-Request','1');
  const response = await call.set(header,header === 'X-Forwarded-Proto' ? 'http' : 'http://evil.test').send({});
  if (header === 'Origin') { expect(response.status).toBe(401); expect(response.headers['set-cookie']).toBeUndefined(); }
  else { expect(response.status).toBe(200); expect(String(response.headers['set-cookie'])).toContain('__Host-luxia_flow='); expect(String(response.headers['set-cookie'])).toContain('; Secure'); }
  expect(trusted.mode).toBe('production');
});
