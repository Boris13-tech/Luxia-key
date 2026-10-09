import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../sessions/middleware';
import { db } from '../db';

const router = Router();

// GET /api/audit
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const events = db.getAuditEvents(limit);
  return res.json({ events });
});

export const auditRouter = router;
