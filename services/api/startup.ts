import type { Pool,PoolClient } from 'pg';
import { EXPECTED_MIGRATIONS } from './migration-manifest.js';
export async function validateSchema(db: Pool | PoolClient): Promise<void> {
  // Read-only and fail closed: query errors propagate; no CREATE, migration or recovery at startup.
  const result = await db.query<{ version: number; checksum: string }>('SELECT version,checksum FROM schema_migrations ORDER BY version');
  if (result.rows.length !== EXPECTED_MIGRATIONS.length || result.rowCount !== EXPECTED_MIGRATIONS.length ||
      EXPECTED_MIGRATIONS.some((expected,index) => result.rows[index]?.version !== expected.version || result.rows[index]?.checksum !== expected.checksum)) {
    throw new Error('UNSUPPORTED_SCHEMA_STATE');
  }
}
export async function afterValidatedSchema<T>(db: Pool | PoolClient,launch: () => T | Promise<T>): Promise<T> {
  await validateSchema(db);
  return launch();
}
