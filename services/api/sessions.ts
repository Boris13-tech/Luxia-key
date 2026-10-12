import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { audit } from './audit.js';
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('base64url');
export const sessionSeconds = 3600;
export async function createSession(db: PoolClient, user: string, credential: string, correlation: string) {
  const raw = token();
  await db.query(`INSERT INTO sessions (id,user_id,credential_id,token_hash,expires_at)
    VALUES ($1,$2,$3,$4,now() + interval '1 hour')`, [randomUUID(),user,credential,hash(raw)]);
  await audit(db,'session.create','SUCCESS','OK',correlation,user,credential);
  return raw;
}
export async function findSession(db: Pool | PoolClient, raw: string | undefined) {
  if (!raw || !/^[A-Za-z0-9_-]{43}$/.test(raw)) return null;
  const result = await db.query<{ id: string; user_id: string; credential_id: string }>(`
    SELECT s.id,s.user_id,s.credential_id FROM sessions s
    JOIN credentials c ON c.id=s.credential_id AND c.user_id=s.user_id
    JOIN identity_security_states i ON i.user_id=s.user_id
    WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now()
      AND c.revoked_at IS NULL AND i.state='active'`, [hash(raw)]);
  return result.rows[0] ?? null;
}
