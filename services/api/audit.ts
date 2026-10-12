import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
export type Operation = 'registration.options' | 'registration.verify' | 'authentication.options' |
  'authentication.verify' | 'session.create' | 'session.logout' | 'session.revoke_all' | 'session.read' | 'request';
export type Reason = 'OK' | 'DENIED' | 'INVALID_REQUEST' | 'DEPENDENCY_UNAVAILABLE';
// Allowlisted fields only. Never accept request bodies, headers, exception messages or arbitrary details.
export async function audit(db: Pool | PoolClient, operation: Operation, result: 'SUCCESS' | 'DENIED',
  reason: Reason, correlation: string, actor: string | null = null, credential: string | null = null) {
  await db.query(`INSERT INTO audit_events (id, actor_id, credential_id, operation, result, reason, correlation_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`, [randomUUID(), actor, credential, operation, result, reason, correlation]);
}
