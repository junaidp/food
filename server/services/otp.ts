/**
 * OTP Service
 * 
 * Primary: EasySendSMS via RapidAPI (works for Pakistan)
 * Fallback: Twilio Verify API
 * Dev mode: OTP logged to console, use 123456 to verify
 */

import pool from '../db.js';
import axios from 'axios';
import twilio from 'twilio';

// ── SMS Provider toggle ──────────────────────────────────────
// Set SMS_PROVIDER in .env: 'easysend' | 'twilio' | 'dev'
const SMS_PROVIDER = process.env.SMS_PROVIDER || 'easysend';

// ── EasySendSMS (RapidAPI) config ────────────────────────────
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const EASYSEND_USERNAME = process.env.EASYSEND_USERNAME || '';
const EASYSEND_PASSWORD = process.env.EASYSEND_PASSWORD || '';
const EASYSEND_FROM = process.env.EASYSEND_FROM || 'FoodShare';

// ── Twilio config (fallback) ─────────────────────────────────
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ── Helpers ──────────────────────────────────────────────────

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone for international format (Pakistan)
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+92' + cleaned.substring(1);
  } else if (cleaned.startsWith('92') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+92' + cleaned;
  }
  return cleaned;
}

// Format phone without + for EasySendSMS (e.g. 923445535506)
function formatPhoneNoPlus(phone: string): string {
  return formatPhoneNumber(phone).replace('+', '');
}

// Store OTP in database with 10-minute expiry
async function storeOTP(phone: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query(
    `UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE phone = $3`,
    [otp, expiresAt, phone]
  );
}

// ── Send via EasySendSMS (RapidAPI) ──────────────────────────
async function sendViaEasySend(phone: string, otp: string): Promise<boolean> {
  const to = formatPhoneNoPlus(phone);
  const text = `Your FoodShare verification code is: ${otp}. Valid for 10 minutes.`;

  try {
    const params = new URLSearchParams();
    params.append('username', EASYSEND_USERNAME);
    params.append('password', EASYSEND_PASSWORD);
    params.append('from', EASYSEND_FROM);
    params.append('to', to);
    params.append('text', text);
    params.append('type', '0');

    const response = await axios.post(
      'https://easysendsms.p.rapidapi.com/bulksms',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'easysendsms.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    console.log(`✅ SMS sent via EasySendSMS to ${to}. Response:`, response.data);
    return true;
  } catch (error: any) {
    console.error('❌ EasySendSMS failed:', error.response?.data || error.message);
    return false;
  }
}

// ── Send via Twilio Verify (fallback) ────────────────────────
async function sendViaTwilio(phone: string): Promise<boolean> {
  if (!TWILIO_VERIFY_SERVICE_SID) {
    console.log('⚠️  TWILIO_VERIFY_SERVICE_SID not set. Cannot use Twilio fallback.');
    return false;
  }
  const formattedPhone = formatPhoneNumber(phone);
  try {
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: formattedPhone, channel: 'sms' });
    console.log(`✅ OTP sent via Twilio Verify. Status: ${verification.status}`);
    return true;
  } catch (error: any) {
    console.error('❌ Twilio Verify failed:', error.message);
    return false;
  }
}

// ── Public API ───────────────────────────────────────────────

// Send OTP to user's phone
export async function sendOTP(phone: string): Promise<boolean> {
  const otp = generateOTP();
  console.log(`📱 OTP for ${phone}: ${otp}`);

  // Always store OTP in our DB (needed for easysend & dev modes)
  await storeOTP(phone, otp);

  if (SMS_PROVIDER === 'twilio') {
    // Twilio Verify generates its own code, but we still store ours as backup
    return sendViaTwilio(phone);
  }

  if (SMS_PROVIDER === 'easysend') {
    const sent = await sendViaEasySend(phone, otp);
    if (sent) return true;
    // Fallback to Twilio if EasySendSMS fails
    console.log('🔄 Falling back to Twilio...');
    return sendViaTwilio(phone);
  }

  // Dev mode
  console.log('⚠️  [DEV MODE] OTP logged to console only. Use code shown above.');
  return true;
}

// Verify OTP code entered by user
export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  // If using Twilio Verify as primary, check with Twilio first
  if (SMS_PROVIDER === 'twilio' && TWILIO_VERIFY_SERVICE_SID) {
    const formattedPhone = formatPhoneNumber(phone);
    try {
      const check = await twilioClient.verify.v2
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: formattedPhone, code });
      if (check.status === 'approved') {
        await pool.query(`UPDATE users SET otp_code = NULL, otp_expires_at = NULL, is_verified = true WHERE phone = $1`, [phone]);
        console.log(`✅ OTP verified via Twilio for ${formattedPhone}`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Twilio verification error:', error.message);
      return false;
    }
  }

  // For easysend & dev mode, verify against our database
  const result = await pool.query(
    `SELECT otp_code, otp_expires_at FROM users WHERE phone = $1`,
    [phone]
  );

  if (result.rows.length === 0) return false;

  const { otp_code, otp_expires_at } = result.rows[0];

  if (!otp_code || otp_code !== code) return false;
  if (new Date() > new Date(otp_expires_at)) return false;

  // OTP valid — mark user verified & clear OTP
  await pool.query(
    `UPDATE users SET otp_code = NULL, otp_expires_at = NULL, is_verified = true WHERE phone = $1`,
    [phone]
  );
  console.log(`✅ OTP verified for ${phone}`);
  return true;
}

// Resend OTP
export async function resendOTP(phone: string): Promise<boolean> {
  // Rate limit: check if last OTP was sent less than 1 minute ago
  const result = await pool.query(
    `SELECT otp_expires_at FROM users WHERE phone = $1`,
    [phone]
  );
  if (result.rows.length > 0 && result.rows[0].otp_expires_at) {
    const sentAt = new Date(result.rows[0].otp_expires_at).getTime() - 10 * 60 * 1000;
    if (Date.now() - sentAt < 60 * 1000) {
      console.log('⏳ Resend too soon, rate limited');
      return false;
    }
  }
  return sendOTP(phone);
}
