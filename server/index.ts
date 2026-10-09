import express from 'express';
import cookieParser from 'cookie-parser';
import { authenticateSession } from './sessions/middleware';
import { webAuthnRouter } from './webauthn/routes';
import { authRouter } from './sessions/routes';
import { auditRouter } from './audit/routes';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(authenticateSession);

// Health & Environment API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'LUXIA-KEY-SECURITY-CORE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    securityMode: process.env.SECURITY_MODE || 'real',
    rpName: 'LUXIA Key Security Core',
    version: '1.0.0',
  });
});

// Mounted Security Routes
app.use('/api/webauthn', webAuthnRouter);
app.use('/api/auth', authRouter);
app.use('/api/audit', auditRouter);

// Start server when run directly
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[LUXIA-KEY] Security Core server listening on port ${PORT}`);
  });
}
