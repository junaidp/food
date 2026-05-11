# Test Twilio SMS Integration 🧪

## Quick Test Guide

### Step 1: Get Your Twilio Phone Number

1. Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. If you don't have a number, click **Buy a number**
3. Select any number that supports SMS
4. Copy the phone number (e.g., `+15551234567`)

### Step 2: Update Your .env File

Create or update `/Users/jp/IdeaProjects/food/.env`:

```env
# Database (your existing config)
DATABASE_URL=your_database_url

# JWT (your existing config)
JWT_SECRET=your_secret

# Server
PORT=3001
NODE_ENV=development

# Twilio (fallback) - Get from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
```

### Step 3: Run Database Migration

```bash
npm run db:migrate
```

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Test Registration

1. Open your app: http://localhost:5173
2. Click **Register**
3. Fill in the form:
   - **Name:** Test User
   - **Phone:** 03001234567 (or your real Pakistani number)
   - **Password:** test123
   - **Role:** Receiver
4. Click **Create Account**

### Step 6: Check Console Output

You should see in your terminal:

```
📱 OTP for 03001234567: 123456
📞 Sending SMS to: +923001234567
✅ SMS sent successfully! Message SID: SM1234567890abcdef
```

### Step 7: Check Your Phone

- If you used a real Pakistani number, you should receive an SMS
- The SMS will say: "Your FoodShare verification code is: 123456. Valid for 10 minutes. Do not share this code with anyone."

### Step 8: Enter OTP

1. Enter the 6-digit code from the SMS (or from console)
2. Click **Verify & Continue**
3. You should be logged in!

---

## 🧪 Test Scenarios

### Scenario 1: Test with Console OTP (No Twilio Number)

**Setup:** Don't set `TWILIO_PHONE_NUMBER` in .env

**Expected:**
```
📱 OTP for 03001234567: 123456
⚠️  Twilio phone number not configured. OTP logged to console only.
```

**Result:** OTP only in console, no SMS sent

---

### Scenario 2: Test with Twilio (Production Mode)

**Setup:** Set `TWILIO_PHONE_NUMBER` in .env

**Expected:**
```
📱 OTP for 03001234567: 123456
📞 Sending SMS to: +923001234567
✅ SMS sent successfully! Message SID: SM...
```

**Result:** SMS sent to phone + OTP in console

---

### Scenario 3: Test Phone Number Formats

Try registering with different formats:

| Format | Auto-Converted To | Works? |
|--------|------------------|--------|
| `03001234567` | `+923001234567` | ✅ |
| `923001234567` | `+923001234567` | ✅ |
| `+923001234567` | `+923001234567` | ✅ |
| `0300 123 4567` | `+923001234567` | ✅ |

---

### Scenario 4: Test OTP Expiry

1. Register and get OTP
2. Wait 11 minutes
3. Try to verify with old OTP
4. Should see: "Invalid or expired OTP"

---

### Scenario 5: Test Resend OTP

1. Register and get OTP
2. Click **Resend OTP** immediately
3. Should see: "Please wait before requesting another OTP"
4. Wait 2 minutes
5. Click **Resend OTP** again
6. Should get new OTP

---

## 🔍 Verify in Twilio Console

1. Go to: https://console.twilio.com/us1/monitor/logs/sms
2. You should see your sent messages
3. Check delivery status:
   - **Delivered** ✅ - SMS received
   - **Sent** 🟡 - In transit
   - **Failed** ❌ - Check error

---

## ❌ Common Issues

### Issue 1: "Twilio phone number not configured"

**Cause:** `TWILIO_PHONE_NUMBER` not set in .env

**Fix:**
```env
TWILIO_PHONE_NUMBER=+15551234567
```

---

### Issue 2: "The 'To' number is not a valid phone number"

**Cause:** Invalid phone format

**Fix:** Use Pakistani format:
- `03001234567` ✅
- `+923001234567` ✅

---

### Issue 3: "The number is unverified"

**Cause:** Trial account, number not verified

**Fix:**
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **Add a new Caller ID**
3. Verify your test number

---

### Issue 4: SMS Not Received

**Check:**
1. ✅ Correct phone number
2. ✅ Phone has signal
3. ✅ Not blocked by carrier
4. ✅ Check Twilio logs for delivery status
5. ✅ Try different number

---

## 📊 Monitor Costs

### Check Twilio Usage

1. Go to: https://console.twilio.com/us1/billing/usage
2. See SMS count and costs
3. Set up billing alerts

### Estimated Costs

- **Development:** ~$0.05 per test SMS
- **Production:** ~$0.05-0.10 per user registration

---

## ✅ Success Checklist

- [ ] Twilio phone number obtained
- [ ] `.env` file updated with phone number
- [ ] Database migrated
- [ ] Server running
- [ ] Test registration completed
- [ ] OTP received via SMS
- [ ] OTP verification successful
- [ ] User logged in

---

## 🚀 Next Steps

Once testing is successful:

1. **Deploy to Render**
   - Add environment variables in Render dashboard
   - Deploy the app

2. **Test in Production**
   - Register with real Pakistani numbers
   - Verify SMS delivery

3. **Monitor**
   - Check Twilio logs
   - Track delivery rates
   - Monitor costs

---

## 📞 Need Help?

**Twilio Issues:**
- Console: https://console.twilio.com/
- Docs: https://www.twilio.com/docs/sms
- Support: https://support.twilio.com/

**App Issues:**
- Check server console logs
- Verify environment variables
- Check database connection

---

**Your Twilio integration is ready to test!** 🎉

Just add your Twilio phone number to `.env` and start testing!
