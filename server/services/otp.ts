/**
 * OTP Service for Pakistan
 * 
 * This service generates and sends OTP codes via SMS.
 * For production, integrate with SMS providers like:
 * - Twilio (international)
 * - MSG91 (supports Pakistan)
 * - Telenor SMS API (Pakistan)
 * - Jazz SMS API (Pakistan)
 */

import pool from '../db.js';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in database
export async function storeOTP(phone: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await pool.query(
    `UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE phone = $3`,
    [otp, expiresAt, phone]
  );
}

// Verify OTP
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT otp_code, otp_expires_at FROM users WHERE phone = $1`,
    [phone]
  );

  if (result.rows.length === 0) {
    return false;
  }

  const { otp_code, otp_expires_at } = result.rows[0];

  // Check if OTP matches and hasn't expired
  if (otp_code !== otp) {
    return false;
  }

  if (new Date() > new Date(otp_expires_at)) {
    return false;
  }

  // Clear OTP after successful verification
  await pool.query(
    `UPDATE users SET otp_code = NULL, otp_expires_at = NULL, is_verified = true WHERE phone = $1`,
    [phone]
  );

  return true;
}

// Send OTP via SMS
export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    // For development: Log OTP to console
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    // TODO: Integrate with SMS provider for production
    // Example integrations:
    
    // 1. Twilio (International)
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your FoodShare verification code is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });
    
    // 2. MSG91 (Supports Pakistan)
    // const axios = require('axios');
    // await axios.get(`https://api.msg91.com/api/v5/otp`, {
    //   params: {
    //     authkey: process.env.MSG91_AUTH_KEY,
    //     mobile: phone,
    //     otp: otp,
    //     template_id: process.env.MSG91_TEMPLATE_ID
    //   }
    // });
    
    // 3. Local Pakistani SMS Provider
    // const axios = require('axios');
    // await axios.post('https://sms-provider.pk/api/send', {
    //   api_key: process.env.SMS_API_KEY,
    //   phone: phone,
    //   message: `Your FoodShare OTP is: ${otp}. Valid for 10 minutes.`
    // });
    
    // For now, return true (development mode)
    // In production, return the actual SMS send result
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
}

// Resend OTP with rate limiting
export async function canResendOTP(phone: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT otp_expires_at FROM users WHERE phone = $1`,
    [phone]
  );

  if (result.rows.length === 0) {
    return true;
  }

  const { otp_expires_at } = result.rows[0];
  
  // Allow resend if no OTP exists or if 2 minutes have passed
  if (!otp_expires_at) {
    return true;
  }

  const timeSinceLastOTP = Date.now() - (new Date(otp_expires_at).getTime() - 10 * 60 * 1000);
  return timeSinceLastOTP > 2 * 60 * 1000; // 2 minutes
}
