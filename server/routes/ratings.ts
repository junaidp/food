import { Router, Response } from 'express';
import pool from '../db.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create rating (receiver rates donor only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'receiver') {
      return res.status(403).json({ success: false, error: 'Only receivers can rate donors' });
    }

    const { claim_id, rating, comment } = req.body;

    if (!claim_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Valid claim_id and rating (1-5) required' });
    }

    // Verify claim belongs to this receiver and is completed
    const claim = await pool.query(
      `SELECT * FROM claims WHERE id = $1 AND receiver_id = $2 AND status = 'picked_up'`,
      [claim_id, req.userId]
    );

    if (claim.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Can only rate completed pickups' });
    }

    // Check if already rated
    const existing = await pool.query(
      `SELECT id FROM ratings WHERE claim_id = $1 AND from_user_id = $2`,
      [claim_id, req.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Already rated' });
    }

    const result = await pool.query(
      `INSERT INTO ratings (claim_id, from_user_id, to_user_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [claim_id, req.userId, claim.rows[0].donor_id, rating, comment]
    );

    // Notify donor
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'new_rating', 'New Rating', $2, $3)`,
      [
        claim.rows[0].donor_id,
        `You received a ${rating}-star rating!`,
        JSON.stringify({ rating_id: result.rows[0].id }),
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create rating' });
  }
});

// Get ratings for a user
router.get('/user/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as from_name
       FROM ratings r
       JOIN users u ON r.from_user_id = u.id
       WHERE r.to_user_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );

    const avg = await pool.query(
      `SELECT AVG(rating)::numeric(3,2) as average, COUNT(*) as total 
       FROM ratings WHERE to_user_id = $1`,
      [req.params.userId]
    );

    res.json({
      success: true,
      data: {
        ratings: result.rows,
        average: parseFloat(avg.rows[0].average) || 0,
        total: parseInt(avg.rows[0].total),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get ratings' });
  }
});

export default router;
