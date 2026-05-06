import { Router, Response } from 'express';
import pool from '../db';
import { AuthRequest, authMiddleware, donorMiddleware } from '../middleware/auth';

const router = Router();

// Get all active listings (for receivers map view)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;
    
    let query = `
      SELECT fl.*, u.name as donor_name
      FROM food_listings fl
      JOIN users u ON fl.donor_id = u.id
      WHERE fl.status = 'active'
        AND fl.is_available = true
        AND fl.remaining_quantity > 0
        AND fl.expires_at > NOW()
        AND u.is_blocked = false
    `;
    const params: any[] = [];

    // Filter by blocked users
    if (req.userRole === 'receiver') {
      query += ` AND fl.donor_id NOT IN (
        SELECT blocker_id FROM blocked_users WHERE blocked_id = $${params.length + 1}
      )`;
      params.push(req.userId);
    }

    query += ' ORDER BY fl.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ success: false, error: 'Failed to get listings' });
  }
});

// Get donor's own listings
router.get('/my', authMiddleware, donorMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT fl.*, 
        (SELECT COUNT(*) FROM claims c WHERE c.listing_id = fl.id AND c.status = 'pending') as pending_claims,
        (SELECT COUNT(*) FROM claims c WHERE c.listing_id = fl.id AND c.status = 'accepted') as active_claims
       FROM food_listings fl
       WHERE fl.donor_id = $1
       ORDER BY fl.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get listings' });
  }
});

// Get single listing
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT fl.*, u.name as donor_name, u.phone as donor_phone
       FROM food_listings fl
       JOIN users u ON fl.donor_id = u.id
       WHERE fl.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get listing' });
  }
});

// Create listing (donor only)
router.post('/', authMiddleware, donorMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, food_type, quantity, latitude, longitude, address, expires_at } = req.body;

    if (!title || !quantity || !latitude || !longitude || !expires_at) {
      return res.status(400).json({ success: false, error: 'Title, quantity, location, and expiry are required' });
    }

    const result = await pool.query(
      `INSERT INTO food_listings (donor_id, title, description, food_type, quantity, remaining_quantity, latitude, longitude, address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.userId, title, description, food_type, quantity, latitude, longitude, address, expires_at]
    );

    // Update donor location
    await pool.query(
      'UPDATE users SET latitude = $1, longitude = $2 WHERE id = $3',
      [latitude, longitude, req.userId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, error: 'Failed to create listing' });
  }
});

// Toggle listing availability
router.put('/:id/toggle', authMiddleware, donorMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `UPDATE food_listings 
       SET is_available = NOT is_available, 
           status = CASE WHEN is_available THEN 'inactive' ELSE 'active' END,
           updated_at = NOW()
       WHERE id = $1 AND donor_id = $2
       RETURNING *`,
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to toggle listing' });
  }
});

// Update listing
router.put('/:id', authMiddleware, donorMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, food_type, quantity, latitude, longitude, address, expires_at } = req.body;

    const result = await pool.query(
      `UPDATE food_listings 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           food_type = COALESCE($3, food_type),
           quantity = COALESCE($4, quantity),
           remaining_quantity = COALESCE($4, remaining_quantity),
           latitude = COALESCE($5, latitude),
           longitude = COALESCE($6, longitude),
           address = COALESCE($7, address),
           expires_at = COALESCE($8, expires_at),
           updated_at = NOW()
       WHERE id = $9 AND donor_id = $10
       RETURNING *`,
      [title, description, food_type, quantity, latitude, longitude, address, expires_at, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update listing' });
  }
});

// Delete listing
router.delete('/:id', authMiddleware, donorMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM food_listings WHERE id = $1 AND donor_id = $2',
      [req.params.id, req.userId]
    );
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete listing' });
  }
});

export default router;
