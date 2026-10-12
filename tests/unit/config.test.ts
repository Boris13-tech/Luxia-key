import { describe,it,expect } from 'vitest';
import { config } from '../../services/api/config.js';
import { hash,token } from '../../services/api/sessions.js';
describe('trusted configuration and tokens',() => {
  it('requires explicit RP and origins',() => { expect(() => config({})).toThrow(); });
  it.each(['https://evil.test','http://example.com','https://example.com/path','https://example.com/'])('rejects %s',origin => {
    expect(() => config({ WEBAUTHN_RP_ID: 'example.com',WEBAUTHN_ALLOWED_ORIGINS: origin,NODE_ENV: 'production' })).toThrow();
  });
  it('accepts configured HTTPS origin',() => { expect(config({ WEBAUTHN_RP_ID: 'example.com',WEBAUTHN_ALLOWED_ORIGINS: 'https://login.example.com' }).rpID).toBe('example.com'); });
  it('creates independent 256-bit tokens and one-way storage representations',() => {
    const a = token(); expect(a).toHaveLength(43); expect(token()).not.toBe(a); expect(hash(a)).toHaveLength(64); expect(hash(a)).not.toBe(a);
  });
});
