import express from 'express';
import { randomUUID } from 'node:crypto';
import { parse } from 'cookie';
import { rateLimit } from 'express-rate-limit';
import type { Pool } from 'pg';
import { validateConfig, type Config } from './config.js';
import { cookiePolicy } from './cookies.js';
import { validVerificationEnvelope } from './verification-envelope.js';
import { WebAuthn, Denied } from './webauthn.js';
import { findSession, token, sessionSeconds } from './sessions.js';
import { transaction } from './db.js';
import { audit, type Operation } from './audit.js';
export function app(db: Pool, input: Config) {
  const cfg = validateConfig(input);
  const api = express();
  const webauthn = new WebAuthn(db,cfg);
  const { sessionName,bindingName,attributes: cookie } = cookiePolicy(cfg);
  api.disable('x-powered-by');
  api.use((_req,res,next) => {
    res.locals.correlation = randomUUID();
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Request-ID': res.locals.correlation });
    next();
  });
  api.use('/api',rateLimit({ windowMs: 60000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }));
  api.use(express.json({ limit: '32kb', type: 'application/json' }));
  api.use('/api', (req,_res,next) => {
    // No CORS: same-origin deployment only. Exact trusted Origin plus custom header protects all API requests.
    if (!cfg.origins.includes(req.get('origin') ?? '') || req.get('x-luxia-request') !== '1' ||
        (req.method === 'POST' && !req.is('application/json'))) return next(new Denied());
    next();
  });
  api.post('/api/webauthn/:flow/options',async (req,res,next) => {
    const purpose = req.params.flow === 'register' ? 'registration' : req.params.flow === 'auth' ? 'authentication' : null;
    if (!purpose) return next(new Denied());
    res.locals.operation = `${purpose}.options`;
    try {
      const displayName: unknown = req.body?.displayName ?? 'LUXIA Key user';
      if (typeof displayName !== 'string' || displayName.length < 1 || displayName.length > 100) throw new Denied();
      const binding = token();
      const options = await webauthn.options(purpose,req.get('origin')!,binding,res.locals.correlation,displayName);
      res.cookie(bindingName,binding,{ ...cookie,maxAge: 300000 }).json({ options });
    } catch (error) { next(error); }
  });
  api.post('/api/webauthn/:flow/verify',async (req,res,next) => {
    const purpose = req.params.flow === 'register' ? 'registration' : req.params.flow === 'auth' ? 'authentication' : null;
    if (!purpose) return next(new Denied());
    res.locals.operation = `${purpose}.verify`;
    try {
      const cookies = parse(req.headers.cookie ?? '');
      // Malformed envelopes do not establish a bound verification attempt and do not consume a nonce.
      if (!validVerificationEnvelope(req.body,purpose)) throw new Denied();
      if (purpose === 'registration') {
        const result = await webauthn.register(req.body,req.get('origin')!,cookies[bindingName] ?? '',res.locals.correlation);
        res.clearCookie(bindingName,cookie).json(result);
      } else {
        const result = await webauthn.authenticate(req.body,req.get('origin')!,cookies[bindingName] ?? '',res.locals.correlation,cookies[sessionName]);
        res.clearCookie(bindingName,cookie).cookie(sessionName,result.rawToken,{ ...cookie,maxAge: sessionSeconds*1000 })
          .json({ verified: true,userId: result.userId });
      }
    } catch (error) { next(error); }
  });
  api.post('/api/session/:action',async (req,res,next) => {
    const action = req.params.action;
    if (!['read','logout','revoke-all'].includes(action)) return next(new Denied());
    res.locals.operation = action === 'revoke-all' ? 'session.revoke_all' : `session.${action}`;
    try {
      const raw = parse(req.headers.cookie ?? '')[sessionName];
      const result = await transaction(db,async client => {
        const preliminary = await findSession(client,raw);
        if (!preliminary) throw new Denied();
        await client.query('SELECT state FROM identity_security_states WHERE user_id=$1 FOR UPDATE',[preliminary.user_id]);
        const session = await findSession(client,raw);
        if (!session) throw new Denied();
        if (action === 'logout') await client.query('UPDATE sessions SET revoked_at=now() WHERE id=$1',[session.id]);
        if (action === 'revoke-all') await client.query('UPDATE sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',[session.user_id]);
        await audit(client,res.locals.operation,'SUCCESS','OK',res.locals.correlation,session.user_id,session.credential_id);
        return { userId: session.user_id };
      });
      if (action !== 'read') res.clearCookie(sessionName,cookie);
      res.json(result);
    } catch (error) { next(error); }
  });
  api.use((_req,res) => { res.status(404).json({ error: 'NOT_FOUND' }); });
  api.use(async (_error: unknown,_req: express.Request,res: express.Response,_next: express.NextFunction) => {
    void _next; // Express identifies error middleware by its four-argument arity.
    try {
      await audit(db,(res.locals.operation ?? 'request') as Operation,'DENIED','DENIED',res.locals.correlation);
      res.status(401).json({ error: 'DENIED',correlationId: res.locals.correlation });
    } catch { res.status(503).json({ error: 'DEPENDENCY_UNAVAILABLE',correlationId: res.locals.correlation }); }
  });
  return api;
}
