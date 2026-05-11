# Twilio SMS Setup Guide 📱

## ✅ Twilio Integration Implemented

Your Twilio credentials should be set in your `.env` file (never commit secrets to git).

**Account SID:** Set `TWILIO_ACCOUNT_SID` in `.env`  
**Auth Token:** Set `TWILIO_AUTH_TOKEN` in `.env`

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get a Twilio Phone Number

1. Go to https://console.twilio.com/
2. Login with your Twilio account
3. Navigate to **Phone Numbers** → **Manage** → **Buy a number**
4. Select a number that supports SMS
5. For Pakistan, any US/international number works
6. Copy your phone number (format: `+1234567890`)

### Step 2: Update Environment Variables

Create/update your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your-account-sid-from-twilio-console
TWILIO_AUTH_TOKEN=your-auth-token-from-twilio-console
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
```

**Important:** Replace `+1234567890` with your actual Twilio phone number!

### Step 3: Test It!

```bash
# Start the server
npm run dev

# Register a new user with a Pakistani number
# Format: 03001234567 or +923001234567

# Check console output:
📱 OTP for 03001234567: 123456
📞 Sending SMS to: +923001234567
✅ SMS sent successfully! Message SID: SM...
```

---

## 📱 Phone Number Formats

The system automatically handles these formats:

| Input Format | Converted To | Status |
|-------------|--------------|--------|
| `03001234567` | `+923001234567` | ✅ |
| `923001234567` | `+923001234567` | ✅ |
| `+923001234567` | `+923001234567` | ✅ |

---

## 🔧 How It Works

### 1. User Registers
```
User enters: 03001234567
System formats: +923001234567
```

### 2. OTP Generated
```
6-digit code: 123456
Expires in: 10 minutes
```

### 3. SMS Sent via Twilio
```javascript
twilioClient.messages.create({
  body: "Your FoodShare verification code is: 123456. Valid for 10 minutes.",
  from: "+1234567890",  // Your Twilio number
  to: "+923001234567"   // User's number
})
```

### 4. User Receives SMS
```
"Your FoodShare verification code is: 123456. 
Valid for 10 minutes. Do not share this code with anyone."
```

---

## 💰 Twilio Pricing

**SMS to Pakistan:**
- Outbound SMS: ~$0.05 - $0.10 per message
- Check current rates: https://www.twilio.com/sms/pricing/pk

**Example Costs:**
- 100 users/day = $5-10/day
- 1,000 users/month = $50-100/month

**Free Trial:**
- Twilio gives $15 free credit
- Test with verified numbers for free

---

## 🧪 Testing

### Development Mode (No Twilio Number)

If `TWILIO_PHONE_NUMBER` is not set:
- OTP is logged to console only
- No SMS is sent
- Users can see OTP in terminal

```
📱 OTP for 03001234567: 123456
⚠️  Twilio phone number not configured. OTP logged to console only.
```

### Production Mode (With Twilio Number)

If `TWILIO_PHONE_NUMBER` is set:
- OTP is logged to console (for debugging)
- SMS is sent via Twilio
- Users receive SMS on their phone

```
📱 OTP for 03001234567: 123456
📞 Sending SMS to: +923001234567
✅ SMS sent successfully! Message SID: SM1234567890abcdef
```

---

## 🔍 Monitoring

### Check Twilio Console

1. Go to https://console.twilio.com/
2. Navigate to **Monitor** → **Logs** → **Messaging**
3. See all sent messages, delivery status, errors

### Check Server Logs

```bash
# Success
✅ SMS sent successfully! Message SID: SM...

# Error
❌ Failed to send OTP via Twilio: [error message]
```

---

## ⚠️ Troubleshooting

### Error: "The 'To' number is not a valid phone number"

**Solution:** Phone number format issue
```javascript
// Make sure number has country code
+923001234567  ✅
03001234567    ✅ (auto-converted)
3001234567     ❌ (missing prefix)
```

### Error: "The number is unverified"

**Solution:** In trial mode, verify the number in Twilio console
1. Go to https://console.twilio.com/
2. Navigate to **Phone Numbers** → **Verified Caller IDs**
3. Add and verify the test number

### Error: "Insufficient funds"

**Solution:** Add credit to your Twilio account
1. Go to https://console.twilio.com/billing
2. Add payment method
3. Add credit

### SMS Not Received

**Check:**
1. ✅ Twilio phone number is set in `.env`
2. ✅ Phone number format is correct
3. ✅ Twilio account has credit
4. ✅ Number is not blocked/blacklisted
5. ✅ Check Twilio logs for delivery status

---

## 🔐 Security Best Practices

### ✅ Already Implemented

- Credentials in environment variables (not hardcoded)
- OTP expires after 10 minutes
- Rate limiting (2 minutes between resends)
- OTP cleared after verification
- Secure message content

### 🔒 Additional Recommendations

1. **Rotate Auth Token Regularly**
   - Generate new token every 3-6 months
   - Update in environment variables

2. **Monitor Usage**
   - Set up billing alerts in Twilio
   - Track unusual SMS volume

3. **Use Subaccounts** (Optional)
   - Separate dev/prod environments
   - Better cost tracking

---

## 📊 Deployment to Render

### Add Environment Variables

1. Go to your Render dashboard
2. Select your web service
3. Navigate to **Environment**
4. Add these variables:

```
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
```

5. Click **Save Changes**
6. Service will auto-redeploy

---

## 🎯 Next Steps

1. **Get Twilio Phone Number**
   - Buy a number from Twilio console
   - Any number that supports SMS works

2. **Update .env File**
   - Add `TWILIO_PHONE_NUMBER=+1234567890`

3. **Test Locally**
   ```bash
   npm run dev
   # Register with real Pakistani number
   # Check if SMS is received
   ```

4. **Deploy to Production**
   ```bash
   git add .
   git commit -m "Add Twilio SMS integration"
   git push
   ```

5. **Monitor**
   - Check Twilio console for delivery
   - Monitor server logs
   - Track costs

---

## 📞 Support

**Twilio Support:**
- Documentation: https://www.twilio.com/docs/sms
- Support: https://support.twilio.com/
- Status: https://status.twilio.com/

**FoodShare Integration:**
- Code: `server/services/otp.ts`
- Logs: Check server console
- Issues: Verify environment variables

---

## ✨ Summary

✅ Twilio SDK installed  
✅ Credentials configured  
✅ Phone number formatting implemented  
✅ Error handling added  
✅ Logging for debugging  
✅ Ready for production  

**Just add your Twilio phone number and you're ready to send SMS!** 📱🚀
