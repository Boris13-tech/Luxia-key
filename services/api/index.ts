import { app } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';
import { afterValidatedSchema } from './startup.js';
const cfg = config();
const db = pool();
let server;
try {
  server = await afterValidatedSchema(db,() => app(db,cfg).listen(Number(process.env.PORT ?? 3001),'127.0.0.1'));
} catch (error) {
  await db.end();
  throw error;
}
for (const signal of ['SIGTERM','SIGINT'] as const) process.on(signal,() => {
  server.close(() => { void db.end(); });
});
