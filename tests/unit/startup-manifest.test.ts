import { expect,it,vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Pool } from 'pg';
import { EXPECTED_MIGRATIONS } from '../../services/api/migration-manifest.js';
import { afterValidatedSchema } from '../../services/api/startup.js';
it('reviewed immutable manifest matches the bundled SQL bytes with portable newlines',() => {
  for (const expected of EXPECTED_MIGRATIONS) {
    const sql = readFileSync(`services/api/migrations/${expected.file}`,'utf8').replaceAll('\r\n','\n');
    expect(createHash('sha256').update(sql).digest('hex')).toBe(expected.checksum);
    expect(Object.isFrozen(expected)).toBe(true);
  }
  expect(Object.isFrozen(EXPECTED_MIGRATIONS)).toBe(true);
});
it('startup waits for successful metadata read before invoking listener (mock supplements SQL tests)',async () => {
  let finish!: (value: unknown) => void;
  const pending = new Promise(resolve => { finish = resolve; });
  const db = { query: vi.fn(() => pending) } as unknown as Pool;
  const launch = vi.fn(() => 'ready'); const start = afterValidatedSchema(db,launch);
  expect(launch).not.toHaveBeenCalled();
  finish({ rowCount: EXPECTED_MIGRATIONS.length,rows: EXPECTED_MIGRATIONS });
  await expect(start).resolves.toBe('ready'); expect(launch).toHaveBeenCalledTimes(1);
  expect(db.query).toHaveBeenCalledWith('SELECT version,checksum FROM schema_migrations ORDER BY version');
});
