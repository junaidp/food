import { Router, Response } from 'express';
import pool from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get user notifications
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get notifications' });
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
      [req.userId]
    );
    res.json({ success: true, data: { count: parseInt(result.rows[0].count) } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get unread count' });
  }
});

// Mark as read
router.put('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId]
    );
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark as read' });
  }
});

// Mark all as read
router.put('/read-all', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1`,
      [req.userId]
    );
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark all as read' });
  }
});

export default router;
