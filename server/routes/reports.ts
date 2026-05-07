import { Router, Response } from 'express';
import pool from '../db.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create report
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { reported_user_id, reason, description } = req.body;

    if (!reported_user_id || !reason) {
      return res.status(400).json({ success: false, error: 'Reported user and reason required' });
    }

    const result = await pool.query(
      `INSERT INTO reports (reporter_id, reported_user_id, reason, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, reported_user_id, reason, description]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
});

// Block user (donor blocks receiver)
router.post('/block', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { blocked_id } = req.body;

    await pool.query(
      `INSERT INTO blocked_users (blocker_id, blocked_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.userId, blocked_id]
    );

    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to block user' });
  }
});

// Unblock user
router.delete('/block/:blockedId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
      [req.userId, req.params.blockedId]
    );
    res.json({ success: true, message: 'User unblocked' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unblock user' });
  }
});

export default router;
