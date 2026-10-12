import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { EXPECTED_MIGRATIONS } from './migration-manifest.js';
export function pool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('DATABASE_URL_REQUIRED');
  return new pg.Pool({ connectionString, max: 10, connectionTimeoutMillis: 5000,
    statement_timeout: 10000, idle_in_transaction_session_timeout: 15000 });
}
export async function transaction<T>(db: pg.Pool, fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await db.connect();
  try { await client.query('BEGIN'); const value = await fn(client); await client.query('COMMIT'); return value; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function migrate(db: pg.Pool) {
  const sql = await readFile(new URL('./migrations/001_foundation.sql', import.meta.url), 'utf8');
  const checksum = createHash('sha256').update(sql.replaceAll('\r\n', '\n')).digest('hex');
  const expected = EXPECTED_MIGRATIONS[0];
  if (expected.version !== 1 || checksum !== expected.checksum) throw new Error('MIGRATION_BUNDLE_MISMATCH');
  await transaction(db, async client => {
    await client.query('SELECT pg_advisory_xact_lock(1021202601)');
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version integer PRIMARY KEY, checksum text NOT NULL)');
    const existing = await client.query('SELECT version,checksum FROM schema_migrations ORDER BY version');
    if (existing.rowCount) {
      if (existing.rows.length !== EXPECTED_MIGRATIONS.length || existing.rows[0].version !== expected.version ||
          existing.rows[0].checksum !== checksum) throw new Error('MIGRATION_METADATA_MISMATCH');
      return;
    }
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations VALUES (1, $1)', [checksum]);
  });
}
