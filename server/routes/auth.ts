import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { sendOTP, verifyOTP, resendOTP } from '../services/otp.js';

const router = Router();

// Step 1: Register (creates user but unverified)
router.post('/register', async (req, res) => {
  try {
    const { phone, name, role, password } = req.body;

    if (!phone || !name || !role || !password) {
      return res.status(400).json({ success: false, error: 'All fields required' });
    }

    if (!['donor', 'receiver'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Role must be donor or receiver' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Phone number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (phone, name, password_hash, role, is_verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, phone, name, role, is_verified`,
      [phone, name, passwordHash, role]
    );

    const user = result.rows[0];

    // Send OTP via Twilio Verify
    const sent = await sendOTP(phone);
    if (!sent) {
      return res.status(500).json({ success: false, error: 'Failed to send OTP. Please try again.' });
    }

    res.json({ 
      success: true, 
      data: { 
        userId: user.id,
        phone: user.phone,
        message: 'OTP sent to your phone number. Please verify to complete registration.' 
      } 
    });
  } catch (error: any) {
    console.error('Register error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return more specific error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Registration failed';
    
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP required' });
    }

    const isValid = await verifyOTP(phone, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Get user and generate token
    const result = await pool.query(
      `SELECT id, phone, name, role, is_verified, is_blocked, latitude, longitude, created_at, updated_at
       FROM users WHERE phone = $1`,
      [phone]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({ success: true, data: { token, user } });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number required' });
    }

    const sent = await resendOTP(phone);
    if (!sent) {
      return res.status(429).json({ success: false, error: 'Please wait before requesting another OTP' });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to resend OTP' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, error: 'Phone and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (user.is_blocked) {
      return res.status(403).json({ success: false, error: 'Account is blocked' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    const { password_hash, ...safeUser } = user;
    res.json({ success: true, data: { token, user: safeUser } });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, phone, name, role, avatar_url, is_verified, is_blocked, latitude, longitude, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

// Update location
router.put('/location', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    await pool.query(
      'UPDATE users SET latitude = $1, longitude = $2, updated_at = NOW() WHERE id = $3',
      [latitude, longitude, req.userId]
    );
    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update location' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, phone, name, role, avatar_url, is_verified, is_blocked, latitude, longitude, created_at, updated_at`,
      [name, req.userId]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;
