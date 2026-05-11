# Debug Registration Error 🔍

## Error: "Registration failed"

This generic error means something went wrong in the registration process. Let's debug step by step.

---

## Step 1: Check Server Logs

**Look at your terminal where `npm run dev` is running.**

You should see detailed error output like:
```
Register error: Error: relation "users" does not exist
```

**Common errors you might see:**

### Error 1: "relation 'users' does not exist"
**Cause:** Database not migrated

**Fix:**
```bash
# Stop the server (Ctrl+C)
npm run db:migrate
# Restart server
npm run dev
```

---

### Error 2: "column 'otp_code' does not exist"
**Cause:** Database migrated but missing new columns

**Fix:** Run migration again or manually add columns:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_received_at TIMESTAMP WITH TIME ZONE;
```

---

### Error 3: "connect ECONNREFUSED" or "connection refused"
**Cause:** Database connection failed

**Fix:** Check your `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

Test connection:
```bash
psql "your_database_url"
```

---

## Step 2: Verify Database Setup

### Check if tables exist:

```bash
# Connect to your database
psql "your_database_url"

# List tables
\dt

# Should show:
# users
# food_listings
# claims
# ratings
# reports
# notifications
# blocked_users
```

### Check users table structure:

```sql
\d users

-- Should include these columns:
-- id, phone, name, password_hash, role
-- is_verified, is_blocked
-- otp_code, otp_expires_at, last_received_at  ← NEW
-- latitude, longitude
-- created_at, updated_at
```

---

## Step 3: Manual Database Fix

If migration didn't work, run this SQL manually:

```sql
-- Connect to database
psql "your_database_url"

-- Add missing columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_received_at TIMESTAMP WITH TIME ZONE;

-- Verify
\d users
```

---

## Step 4: Test Registration Again

### Using curl:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "03445535506",
    "name": "jp",
    "role": "donor",
    "password": "Password1@"
  }'
```

### Expected Success Response:

```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "phone": "03445535506",
    "message": "OTP sent to your phone number. Please verify to complete registration."
  }
}
```

### Check Server Console:

```
📱 OTP for 03445535506: 123456
⚠️  Twilio phone number not configured. OTP logged to console only.
```

---

## Step 5: Common Issues

### Issue: "Phone number already registered"

**Cause:** You already registered with this number

**Fix:** Use different number or delete existing user:
```sql
DELETE FROM users WHERE phone = '03445535506';
```

---

### Issue: OTP service error

**Cause:** Twilio configuration issue

**Fix:** This shouldn't block registration. Check if you see OTP in console.

---

## Quick Fix Script

Run this to reset and test:

```bash
# 1. Stop server
# Press Ctrl+C

# 2. Run migration
npm run db:migrate

# 3. Start server
npm run dev

# 4. In another terminal, test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "03001234567",
    "name": "Test User",
    "role": "receiver",
    "password": "test123"
  }'
```

---

## Detailed Error Logging

To see more detailed errors, update the registration route temporarily:

Edit `server/routes/auth.ts` line 51-53:

```typescript
} catch (error: any) {
  console.error('Register error:', error);
  console.error('Error details:', error.message);
  console.error('Error stack:', error.stack);
  res.status(500).json({ success: false, error: error.message || 'Registration failed' });
}
```

This will show the actual error message instead of generic "Registration failed".

---

## Most Likely Cause

**99% chance it's one of these:**

1. ✅ **Database not migrated** → Run `npm run db:migrate`
2. ✅ **Missing OTP columns** → Run migration or add manually
3. ✅ **Database connection issue** → Check `DATABASE_URL` in `.env`

---

## Next Steps

1. **Check server terminal** for detailed error
2. **Run migration** if not done: `npm run db:migrate`
3. **Test again** with curl or app
4. **Share the error** from server console if still failing

---

**Let me know what error you see in the server console!** 🔍
