import { Router, Response } from 'express';
import pool from '../db.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { getIO } from '../socket.js';

const router = Router();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get my claims (receiver)
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.*, fl.title as listing_title, fl.latitude as listing_latitude, fl.longitude as listing_longitude,
              u.name as donor_name, u.phone as donor_phone
       FROM claims c
       JOIN food_listings fl ON c.listing_id = fl.id
       JOIN users u ON c.donor_id = u.id
       WHERE c.receiver_id = $1
       ORDER BY c.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get claims' });
  }
});

// Get claims for a listing (donor)
router.get('/listing/:listingId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name as receiver_name, u.phone as receiver_phone,
              u.latitude as receiver_lat, u.longitude as receiver_lng
       FROM claims c
       JOIN users u ON c.receiver_id = u.id
       WHERE c.listing_id = $1 AND c.donor_id = $2
       ORDER BY c.created_at DESC`,
      [req.params.listingId, req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get claims' });
  }
});

// Get donor's incoming claims
router.get('/incoming', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.*, fl.title as listing_title, fl.latitude as listing_latitude, fl.longitude as listing_longitude,
              u.name as receiver_name, u.phone as receiver_phone,
              u.latitude as receiver_lat, u.longitude as receiver_lng
       FROM claims c
       JOIN food_listings fl ON c.listing_id = fl.id
       JOIN users u ON c.receiver_id = u.id
       WHERE c.donor_id = $1
       ORDER BY c.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get incoming claims' });
  }
});

// Create claim (receiver requests food)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'receiver') {
      return res.status(403).json({ success: false, error: 'Only receivers can claim food' });
    }

    const { listing_id } = req.body;

    // Check 6-hour cooldown after last received food
    const userCheck = await pool.query(
      `SELECT last_received_at FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userCheck.rows.length > 0 && userCheck.rows[0].last_received_at) {
      const lastReceived = new Date(userCheck.rows[0].last_received_at);
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      if (lastReceived > sixHoursAgo) {
        const timeRemaining = new Date(lastReceived.getTime() + 6 * 60 * 60 * 1000 - Date.now());
        const hoursLeft = Math.floor(timeRemaining.getTime() / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeRemaining.getTime() % (60 * 60 * 1000)) / (60 * 1000));
        
        return res.status(429).json({ 
          success: false, 
          error: `You can request food again in ${hoursLeft}h ${minutesLeft}m. Please wait to give others a chance.` 
        });
      }
    }

    // Check listing exists and has remaining quantity
    const listing = await pool.query(
      `SELECT * FROM food_listings WHERE id = $1 AND status = 'active' AND is_available = true AND remaining_quantity > 0 AND expires_at > NOW()`,
      [listing_id]
    );

    if (listing.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Food is no longer available' });
    }

    // Check receiver hasn't already claimed from this listing
    const existingClaim = await pool.query(
      `SELECT id FROM claims WHERE listing_id = $1 AND receiver_id = $2 AND status NOT IN ('rejected', 'cancelled', 'expired')`,
      [listing_id, req.userId]
    );

    if (existingClaim.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'You already have a claim for this food' });
    }

    // Check receiver doesn't have too many active claims
    const activeClaims = await pool.query(
      `SELECT COUNT(*) FROM claims WHERE receiver_id = $1 AND status IN ('pending', 'accepted')`,
      [req.userId]
    );

    if (parseInt(activeClaims.rows[0].count) >= 3) {
      return res.status(400).json({ success: false, error: 'You have too many active claims. Complete or cancel existing ones first.' });
    }

    const pickupCode = generateCode();
    const donorId = listing.rows[0].donor_id;

    const result = await pool.query(
      `INSERT INTO claims (listing_id, receiver_id, donor_id, pickup_code)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [listing_id, req.userId, donorId, pickupCode]
    );

    // Create notification for donor
    const receiverInfo = await pool.query('SELECT name FROM users WHERE id = $1', [req.userId]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'claim_request', 'New Food Request', $2, $3)`,
      [
        donorId,
        `${receiverInfo.rows[0].name} has requested food from your listing "${listing.rows[0].title}"`,
        JSON.stringify({ claim_id: result.rows[0].id, listing_id }),
      ]
    );

    // Emit socket event to donor
    const io = getIO();
    io.to(`user_${donorId}`).emit('new_claim', {
      claim: result.rows[0],
      listing_title: listing.rows[0].title,
      receiver_name: receiverInfo.rows[0].name,
    });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ success: false, error: 'Failed to create claim' });
  }
});

// Accept claim (donor)
router.put('/:id/accept', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const claim = await pool.query(
      `SELECT c.*, fl.remaining_quantity, fl.title as listing_title FROM claims c
       JOIN food_listings fl ON c.listing_id = fl.id
       WHERE c.id = $1 AND c.donor_id = $2 AND c.status = 'pending'`,
      [req.params.id, req.userId]
    );

    if (claim.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Claim not found or already processed' });
    }

    if (claim.rows[0].remaining_quantity <= 0) {
      return res.status(400).json({ success: false, error: 'No remaining food available' });
    }

    // Accept claim and set expiry (1 hour to pick up)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const result = await pool.query(
      `UPDATE claims SET status = 'accepted', accepted_at = NOW(), expires_at = $1 WHERE id = $2 RETURNING *`,
      [expiresAt, req.params.id]
    );

    // Decrease remaining quantity
    await pool.query(
      `UPDATE food_listings SET remaining_quantity = remaining_quantity - 1, updated_at = NOW() WHERE id = $1`,
      [claim.rows[0].listing_id]
    );

    // Check if listing is now fully claimed
    const updatedListing = await pool.query(
      'SELECT remaining_quantity FROM food_listings WHERE id = $1',
      [claim.rows[0].listing_id]
    );
    if (updatedListing.rows[0].remaining_quantity <= 0) {
      await pool.query(
        `UPDATE food_listings SET status = 'completed', is_available = false WHERE id = $1`,
        [claim.rows[0].listing_id]
      );
    }

    // Notify receiver
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'claim_accepted', 'Food Request Accepted!', $2, $3)`,
      [
        claim.rows[0].receiver_id,
        `Your request for "${claim.rows[0].listing_title}" has been accepted! Your pickup code is: ${claim.rows[0].pickup_code}. You have 1 hour to collect.`,
        JSON.stringify({
          claim_id: req.params.id,
          pickup_code: claim.rows[0].pickup_code,
        }),
      ]
    );

    const io = getIO();
    io.to(`user_${claim.rows[0].receiver_id}`).emit('claim_accepted', {
      claim: result.rows[0],
      pickup_code: claim.rows[0].pickup_code,
      listing_title: claim.rows[0].listing_title,
    });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Accept claim error:', error);
    res.status(500).json({ success: false, error: 'Failed to accept claim' });
  }
});

// Reject claim (donor)
router.put('/:id/reject', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `UPDATE claims SET status = 'rejected' WHERE id = $1 AND donor_id = $2 AND status = 'pending' RETURNING *`,
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    // Notify receiver
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'claim_rejected', 'Food Request Update', 'Your food request was not accepted. Try other available listings!', $2)`,
      [result.rows[0].receiver_id, JSON.stringify({ claim_id: req.params.id })]
    );

    const io = getIO();
    io.to(`user_${result.rows[0].receiver_id}`).emit('claim_rejected', {
      claim_id: req.params.id,
    });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reject claim' });
  }
});

// Confirm pickup with code (donor verifies receiver's code)
router.put('/:id/pickup', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const claim = await pool.query(
      `SELECT * FROM claims WHERE id = $1 AND donor_id = $2 AND status = 'accepted'`,
      [req.params.id, req.userId]
    );

    if (claim.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    if (claim.rows[0].pickup_code !== code) {
      return res.status(400).json({ success: false, error: 'Invalid pickup code' });
    }

    const result = await pool.query(
      `UPDATE claims SET status = 'picked_up', picked_up_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    // Update receiver's last_received_at timestamp for 6-hour cooldown
    await pool.query(
      `UPDATE users SET last_received_at = NOW() WHERE id = $1`,
      [claim.rows[0].receiver_id]
    );

    // Notify receiver
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'pickup_confirmed', 'Pickup Confirmed', 'Your food pickup has been confirmed. Enjoy your meal! You can request food again in 6 hours.', $2)`,
      [claim.rows[0].receiver_id, JSON.stringify({ claim_id: req.params.id })]
    );

    const io = getIO();
    io.to(`user_${claim.rows[0].receiver_id}`).emit('pickup_confirmed', {
      claim_id: req.params.id,
    });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to confirm pickup' });
  }
});

// Cancel claim (receiver)
router.put('/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const claim = await pool.query(
      `SELECT * FROM claims WHERE id = $1 AND receiver_id = $2 AND status IN ('pending', 'accepted')`,
      [req.params.id, req.userId]
    );

    if (claim.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    await pool.query(
      `UPDATE claims SET status = 'cancelled' WHERE id = $1`,
      [req.params.id]
    );

    // If it was accepted, restore the quantity
    if (claim.rows[0].status === 'accepted') {
      await pool.query(
        `UPDATE food_listings SET remaining_quantity = remaining_quantity + 1, 
         status = 'active', is_available = true, updated_at = NOW() 
         WHERE id = $1`,
        [claim.rows[0].listing_id]
      );
    }

    res.json({ success: true, message: 'Claim cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to cancel claim' });
  }
});

// Notify arrival (receiver at donor location)
router.put('/:id/arrived', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const claim = await pool.query(
      `SELECT c.*, u.name as receiver_name FROM claims c
       JOIN users u ON c.receiver_id = u.id
       WHERE c.id = $1 AND c.receiver_id = $2 AND c.status = 'accepted'`,
      [req.params.id, req.userId]
    );

    if (claim.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    // Notify donor
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, 'receiver_arrived', 'Receiver Has Arrived!', $2, $3)`,
      [
        claim.rows[0].donor_id,
        `${claim.rows[0].receiver_name} has arrived at your location to collect food.`,
        JSON.stringify({ claim_id: req.params.id }),
      ]
    );

    const io = getIO();
    io.to(`user_${claim.rows[0].donor_id}`).emit('receiver_arrived', {
      claim_id: req.params.id,
      receiver_name: claim.rows[0].receiver_name,
    });

    res.json({ success: true, message: 'Arrival notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to notify arrival' });
  }
});

export default router;
