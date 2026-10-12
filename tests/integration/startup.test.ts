import { beforeAll,afterAll,it,expect,vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import request from 'supertest';
import type { Pool } from 'pg';
import { pool,migrate } from '../../services/api/db.js';
import { afterValidatedSchema,validateSchema } from '../../services/api/startup.js';
import { EXPECTED_MIGRATIONS } from '../../services/api/migration-manifest.js';
import { config } from '../../services/api/config.js';
import { app } from '../../services/api/app.js';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('/luxia_test')) throw new Error('Dedicated TEST_DATABASE_URL ending /luxia_test required; tests never skip');
const admin = pool(url);
beforeAll(async () => { await admin.query('SELECT 1'); });
afterAll(async () => { await admin.end(); });
// Every adversarial metadata state is isolated from the core integration suite.
async function isolated<T>(fn: (db: Pool,schema: string) => Promise<T>): Promise<T> {
  const schema = `lk_startup_${randomUUID().replaceAll('-','')}`;
  await admin.query(`CREATE SCHEMA "${schema}"`);
  const connection = new URL(url!); connection.searchParams.set('options',`-c search_path=${schema}`);
  const db = pool(connection.toString());
  try { return await fn(db,schema); }
  finally { await db.end(); await admin.query(`DROP SCHEMA "${schema}" CASCADE`); }
}
async function metadata(db: Pool,rows: { version: number; checksum: string }[] = []) {
  await db.query('CREATE TABLE schema_migrations (version integer PRIMARY KEY,checksum text NOT NULL)');
  for (const row of rows) await db.query('INSERT INTO schema_migrations VALUES ($1,$2)',[row.version,row.checksum]);
}
async function mustDeny(db: Parameters<typeof afterValidatedSchema>[0]) {
  const launch = vi.fn(() => 'LISTENER_REACHED');
  await expect(afterValidatedSchema(db,launch)).rejects.toThrow();
  expect(launch).not.toHaveBeenCalled();
}
it('correct real migration permits an actual loopback listener and API request',async () => isolated(async db => {
  await migrate(db); await migrate(db); // Applied migration checksum is verified, not reapplied.
  const trusted = config({ LUXIA_RUNTIME_MODE: 'test',WEBAUTHN_RP_ID: 'localhost',WEBAUTHN_ALLOWED_ORIGINS: 'http://localhost:3000' });
  const server = await afterValidatedSchema(db,async () => {
    const listener = app(db,trusted).listen(0,'127.0.0.1'); await once(listener,'listening'); return listener;
  });
  try {
    expect(server.listening).toBe(true);
    const result = await request(server).post('/api/webauthn/register/options').set('Origin','http://localhost:3000').set('X-Luxia-Request','1').send({});
    expect(result.status).toBe(200);
  } finally { await new Promise<void>((resolve,reject) => server.close(error => error ? reject(error) : resolve())); }
}));
it('missing migration table denies before listener',async () => isolated(async db => { await mustDeny(db); }));
it('empty metadata denies before listener',async () => isolated(async db => { await metadata(db); await mustDeny(db); }));
it.each([
  ['missing expected migration',[{ version: 0,checksum: 'unknown' }]],
  ['old version',[{ version: -1,checksum: EXPECTED_MIGRATIONS[0].checksum }]],
  ['future incompatible version',[{ version: 2,checksum: EXPECTED_MIGRATIONS[0].checksum }]],
  ['wrong checksum',[{ version: 1,checksum: '0'.repeat(64) }]],
  ['partial/extra metadata',[{ version: 1,checksum: EXPECTED_MIGRATIONS[0].checksum },{ version: 2,checksum: 'unknown' }]],
] as const)('%s denies before listener',async (_reason,rows) => isolated(async db => {
  await metadata(db,[...rows]); await mustDeny(db);
}));
it('query failure due to incompatible metadata shape denies before listener',async () => isolated(async db => {
  await db.query('CREATE TABLE schema_migrations (version integer PRIMARY KEY)'); await mustDeny(db);
}));
it('actual PostgreSQL permission denied does not reach listener',async () => isolated(async (db,schema) => {
  await migrate(db);
  const role = `lk_deny_${randomUUID().replaceAll('-','')}`;
  await admin.query(`CREATE ROLE "${role}" NOLOGIN`);
  const client = await db.connect();
  try {
    await admin.query(`GRANT USAGE ON SCHEMA "${schema}" TO "${role}"`);
    await client.query(`SET ROLE "${role}"`);
    await mustDeny(client);
  } finally {
    await client.query('RESET ROLE'); client.release();
    await admin.query(`REVOKE USAGE ON SCHEMA "${schema}" FROM "${role}"`);
    await admin.query(`DROP ROLE "${role}"`);
  }
}));
it('actual PostgreSQL statement timeout denies before listener',async () => isolated(async db => {
  await migrate(db); const locker = await db.connect(); const reader = await db.connect();
  try {
    await locker.query('BEGIN'); await locker.query('LOCK TABLE schema_migrations IN ACCESS EXCLUSIVE MODE');
    await reader.query("SET statement_timeout='100ms'"); await mustDeny(reader);
  } finally { await locker.query('ROLLBACK'); locker.release(); reader.release(); }
}));
it('unavailable PostgreSQL endpoint denies before listener',async () => {
  const unavailable = new URL(url!); unavailable.hostname = '127.0.0.1'; unavailable.port = '1';
  const db = pool(unavailable.toString()); try { await mustDeny(db); } finally { await db.end(); }
});
it('read-only schema gate works without table-mutation privileges',async () => isolated(async (db,schema) => {
  await migrate(db);
  const role = `lk_read_${randomUUID().replaceAll('-','')}`;
  await admin.query(`CREATE ROLE "${role}" NOLOGIN`); const client = await db.connect();
  try {
    await admin.query(`GRANT USAGE ON SCHEMA "${schema}" TO "${role}"`);
    await db.query(`GRANT SELECT ON schema_migrations TO "${role}"`);
    await client.query(`SET ROLE "${role}"`); await expect(validateSchema(client)).resolves.toBeUndefined();
    await expect(client.query('DELETE FROM schema_migrations')).rejects.toThrow();
  } finally {
    await client.query('RESET ROLE'); client.release();
    await db.query(`REVOKE SELECT ON schema_migrations FROM "${role}"`);
    await admin.query(`REVOKE USAGE ON SCHEMA "${schema}" FROM "${role}"`); await admin.query(`DROP ROLE "${role}"`);
  }
}));
it('explicit migration refuses unknown future metadata without creating domain tables',async () => isolated(async db => {
  await metadata(db,[{ version: 2,checksum: 'future' }]);
  await expect(migrate(db)).rejects.toThrow('MIGRATION_METADATA_MISMATCH');
  expect((await db.query("SELECT to_regclass('users') AS users")).rows[0].users).toBeNull();
  expect((await db.query('SELECT version FROM schema_migrations')).rows).toEqual([{ version: 2 }]);
}));
