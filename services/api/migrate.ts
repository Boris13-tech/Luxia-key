import { pool, migrate } from './db.js';
const db = pool();
try { await migrate(db); } finally { await db.end(); }
