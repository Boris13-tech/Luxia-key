import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth, SESSION_COOKIE_NAME } from './middleware';
import { db } from '../db';

const router = Router();

// GET /api/auth/me
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.session) {
    return res.json({
      authenticated: false,
      user: null,
      session: null,
    });
  }

  const credentials = db.getCredentialsByUserId(req.user.id).map((c) => ({
    id: c.id,
    credentialId: c.credentialId,
    counter: c.counter,
    deviceType: c.deviceType,
    createdAt: c.createdAt,
    lastUsedAt: c.lastUsedAt,
  }));

  const securityState = db.getSecurityState(req.user.id);

  return res.json({
    authenticated: true,
    user: req.user,
    session: {
      id: req.session.id,
      createdAt: req.session.createdAt,
      expiresAt: req.session.expiresAt,
    },
    credentials,
    securityState,
  });
});

// POST /api/auth/logout
router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  const rawToken = req.cookies?.[SESSION_COOKIE_NAME];
  if (rawToken) {
    db.revokeSession(rawToken);
  }

  if (req.user) {
    db.logAuditEvent({
      userId: req.user.id,
      eventType: 'session.logout',
      status: 'SUCCESS',
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: { action: 'user_logged_out' },
    });
  }

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/auth/revoke-all
router.post('/revoke-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'UNAUTHORIZED' });

  const revokedCount = db.revokeAllUserSessions(req.user.id);

  db.logAuditEvent({
    userId: req.user.id,
    eventType: 'session.revoke_all',
    status: 'WARNING',
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    details: { revokedCount },
  });

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.json({ success: true, revokedCount });
});

export const authRouter = router;
