import { app } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';
const cfg = config();
const db = pool();
await db.query('SELECT version FROM schema_migrations WHERE version=1');
const server = app(db,cfg).listen(Number(process.env.PORT ?? 3001),'127.0.0.1');
for (const signal of ['SIGTERM','SIGINT'] as const) process.on(signal,() => {
  server.close(() => { void db.end(); });
});
