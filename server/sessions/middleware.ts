import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { Session, User } from '../db/schema';

export interface AuthenticatedRequest extends Request {
  session?: Session;
  user?: User;
}

export const SESSION_COOKIE_NAME = 'luxia_session_token';

export function authenticateSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Read token from secure HttpOnly cookie or Authorization header fallback
  const rawToken =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!rawToken) {
    return next();
  }

  const session = db.validateSession(rawToken);
  if (!session) {
    // If token was invalid, clear stale cookie
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return next();
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    return next();
  }

  req.session = session;
  req.user = user;
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.session || !req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
  }

  // Check if account is in Identity Lockdown
  const secState = db.getSecurityState(req.user.id);
  if (secState.locked) {
    // In lockdown, non-whitelisted sensitive mutations are blocked
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return res.status(423).json({
        error: 'IDENTITY_LOCKED',
        message: 'Account identity is currently locked down for security protection.',
      });
    }
  }

  next();
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const csrfHeader = req.headers['x-csrf-token'];
  // Custom header verification acts as strong origin defense
  if (!csrfHeader) {
    return res.status(403).json({ error: 'CSRF_TOKEN_REQUIRED', message: 'Missing X-CSRF-Token header' });
  }

  next();
}
