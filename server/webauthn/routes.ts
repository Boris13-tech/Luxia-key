import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { webAuthnService } from './service';
import { SESSION_COOKIE_NAME } from '../sessions/middleware';

const router = Router();

// Schema validation
const RegisterOptionsQuery = z.object({
  username: z.string().min(3).default('boris.legrand'),
  displayName: z.string().min(1).default('Boris Legrand'),
});

// 1. POST /api/webauthn/register/options
router.post('/register/options', async (req: Request, res: Response) => {
  try {
    const { username, displayName } = RegisterOptionsQuery.parse(req.body);
    const clientOrigin = req.headers.origin || req.headers.referer;
    const { options, userId } = await webAuthnService.getRegistrationOptions(username, displayName, clientOrigin);
    return res.json({ options, userId });
  } catch (err: any) {
    return res.status(400).json({ error: 'REGISTRATION_OPTIONS_ERROR', message: err.message });
  }
});

// 2. POST /api/webauthn/register/verify
router.post('/register/verify', async (req: Request, res: Response) => {
  try {
    const clientOrigin = req.headers.origin || req.headers.referer || 'http://localhost:3000';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await webAuthnService.verifyRegistration(req.body, clientOrigin, ip, userAgent);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: 'REGISTRATION_VERIFICATION_FAILED', message: err.message });
  }
});

// 3. POST /api/webauthn/auth/options
router.post('/auth/options', async (req: Request, res: Response) => {
  try {
    const clientOrigin = req.headers.origin || req.headers.referer;
    const username = req.body?.username as string | undefined;
    const { options } = await webAuthnService.getAuthenticationOptions(username, clientOrigin);
    return res.json({ options });
  } catch (err: any) {
    return res.status(400).json({ error: 'AUTH_OPTIONS_ERROR', message: err.message });
  }
});

// 4. POST /api/webauthn/auth/verify
router.post('/auth/verify', async (req: Request, res: Response) => {
  try {
    const clientOrigin = req.headers.origin || req.headers.referer || 'http://localhost:3000';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await webAuthnService.verifyAuthentication(req.body, clientOrigin, ip, userAgent);

    // Set secure HttpOnly cookie with session token
    res.cookie(SESSION_COOKIE_NAME, result.rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 3600 * 1000,
    });

    return res.json({
      verified: true,
      user: result.user,
      session: {
        id: result.session.id,
        createdAt: result.session.createdAt,
        expiresAt: result.session.expiresAt,
      },
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'AUTHENTICATION_FAILED', message: err.message });
  }
});

export const webAuthnRouter = router;
