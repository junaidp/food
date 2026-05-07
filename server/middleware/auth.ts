import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

export function donorMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'donor' && req.userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Donor access required' });
  }
  next();
}

export function receiverMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'receiver' && req.userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Receiver access required' });
  }
  next();
}
