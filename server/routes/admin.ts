import { Router, Response } from 'express';
import pool from '../db';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get admin stats
router.get('/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [users, donors, receivers, listings, activeListings, claims, completedClaims, pendingReports] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'donor'"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'receiver'"),
      pool.query('SELECT COUNT(*) FROM food_listings'),
      pool.query("SELECT COUNT(*) FROM food_listings WHERE status = 'active'"),
      pool.query('SELECT COUNT(*) FROM claims'),
      pool.query("SELECT COUNT(*) FROM claims WHERE status = 'picked_up'"),
      pool.query("SELECT COUNT(*) FROM reports WHERE status = 'pending'"),
    ]);

    res.json({
      success: true,
      data: {
        total_users: parseInt(users.rows[0].count),
        total_donors: parseInt(donors.rows[0].count),
        total_receivers: parseInt(receivers.rows[0].count),
        total_listings: parseInt(listings.rows[0].count),
        active_listings: parseInt(activeListings.rows[0].count),
        total_claims: parseInt(claims.rows[0].count),
        completed_claims: parseInt(completedClaims.rows[0].count),
        pending_reports: parseInt(pendingReports.rows[0].count),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, phone, name, role, is_verified, is_blocked, created_at,
        (SELECT AVG(rating)::numeric(3,2) FROM ratings WHERE to_user_id = users.id) as avg_rating,
        (SELECT COUNT(*) FROM ratings WHERE to_user_id = users.id) as rating_count
       FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
});

// Toggle user verification
router.put('/users/:id/verify', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `UPDATE users SET is_verified = NOT is_verified, updated_at = NOW() WHERE id = $1
       RETURNING id, phone, name, role, is_verified, is_blocked`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// Toggle user block
router.put('/users/:id/block', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `UPDATE users SET is_blocked = NOT is_blocked, updated_at = NOW() WHERE id = $1
       RETURNING id, phone, name, role, is_verified, is_blocked`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// Get all reports
router.get('/reports', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
        u1.name as reporter_name, u1.phone as reporter_phone,
        u2.name as reported_name, u2.phone as reported_phone
       FROM reports r
       JOIN users u1 ON r.reporter_id = u1.id
       JOIN users u2 ON r.reported_user_id = u2.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get reports' });
  }
});

// Update report status
router.put('/reports/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update report' });
  }
});

// Get all listings (admin)
router.get('/listings', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT fl.*, u.name as donor_name, u.phone as donor_phone
       FROM food_listings fl
       JOIN users u ON fl.donor_id = u.id
       ORDER BY fl.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get listings' });
  }
});

// Delete listing (admin)
router.delete('/listings/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM food_listings WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete listing' });
  }
});

export default router;
