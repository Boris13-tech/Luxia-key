import { pool } from '../services/api/db.js';
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('/luxia_test')) throw new Error('Dedicated test database required');
const db = pool(url);
try {
  if (process.argv[2] === 'write') {
    await db.query('CREATE TABLE IF NOT EXISTS test_restart_probe (id integer PRIMARY KEY, marker text NOT NULL)');
    await db.query("INSERT INTO test_restart_probe VALUES (1,'durable') ON CONFLICT (id) DO UPDATE SET marker='durable'");
  } else {
    let connected = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      try { await db.query('SELECT 1'); connected = true; break; }
      catch { await new Promise(resolve => setTimeout(resolve,1000)); }
    }
    if (!connected) throw new Error('PostgreSQL restart unavailable');
    const marker = await db.query('SELECT marker FROM test_restart_probe WHERE id=1');
    if (marker.rows[0]?.marker !== 'durable') throw new Error('Restart persistence failed');
    const creds = await db.query('SELECT count(*)::integer AS count FROM credentials');
    if (creds.rows[0].count < 1) throw new Error('Credentials lost after restart');
  }
} finally { await db.end(); }
