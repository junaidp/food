# Quick Start Guide - Pakistan Deployment 🇵🇰

## ✅ What's New

1. **OTP Phone Verification** - Users must verify phone number with OTP
2. **6-Hour Cooldown** - Receivers can only get food once every 6 hours
3. **Prominent Arrival Button** - Clear "I've Arrived" notification
4. **Real Map Data** - Uses actual GPS coordinates in Pakistan

---

## 🚀 Quick Deploy (5 Steps)

### Step 1: Update Database
```bash
npm run db:migrate
```

This adds:
- `otp_code` - Stores verification code
- `otp_expires_at` - OTP expiry time
- `last_received_at` - For 6-hour cooldown

### Step 2: Test Locally
```bash
npm run dev
```

Register a new user and check console for OTP:
```
📱 OTP for 03001234567: 123456
```

### Step 3: Choose SMS Provider

**Quick Option (Twilio):**
```bash
npm install twilio
```

Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

Update `server/services/otp.ts` line 60-80 with Twilio code (see SMS_INTEGRATION_PAKISTAN.md)

### Step 4: Deploy
```bash
git add .
git commit -m "Add Pakistan features: OTP, cooldown, arrival notifications"
git push
```

### Step 5: Test in Production
1. Register with real Pakistani number
2. Receive OTP via SMS
3. Verify and login
4. Test food request
5. Test arrival notification
6. Confirm 6-hour cooldown

---

## 📱 Phone Number Format

Pakistani numbers work in these formats:
- `03001234567` ✅
- `+923001234567` ✅
- `923001234567` ✅

---

## 🔧 Troubleshooting

### OTP Not Showing in App?
**Development:** Check server console for OTP  
**Production:** Check SMS provider dashboard

### Can't Request Food?
Check if 6-hour cooldown is active:
```sql
SELECT last_received_at FROM users WHERE phone = '03001234567';
```

### Map Not Loading?
- Check browser location permissions
- Verify internet connection
- Map uses OpenStreetMap (free, no API key needed)

### Arrival Button Not Working?
- Check Socket.IO connection
- Verify donor is online
- Check browser console for errors

---

## 📊 Key Features Explained

### OTP Verification
- **When:** During registration
- **Expiry:** 10 minutes
- **Resend:** After 2 minutes
- **Format:** 6-digit code

### 6-Hour Cooldown
- **Starts:** When donor confirms pickup
- **Duration:** 6 hours
- **Message:** Shows time remaining
- **Purpose:** Fair food distribution

### Arrival Notification
- **Location:** Tracking page
- **Button:** "I've Arrived - Notify Donor"
- **Effect:** Instant notification to donor
- **Benefit:** No need to call/ring doorbell

### Real Map
- **Provider:** OpenStreetMap
- **Coverage:** All of Pakistan
- **Features:** Live GPS, distance, routing
- **Cost:** Free

---

## 🎯 User Journey

### Donor
1. Register → Verify OTP → Login
2. Create food listing with location
3. Receive request from receiver
4. Accept/reject request
5. Wait for "Receiver Arrived" notification
6. Verify pickup code
7. Confirm pickup

### Receiver
1. Register → Verify OTP → Login
2. View food on map
3. Request food
4. Wait for acceptance
5. Navigate to location
6. Tap "I've Arrived" button
7. Show pickup code to donor
8. **Wait 6 hours before next request**

---

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your-secret-key

# Server
PORT=3001
NODE_ENV=production

# SMS (choose one)
# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# OR MSG91
MSG91_AUTH_KEY=...
MSG91_TEMPLATE_ID=...

# OR Local Pakistani Provider
SMS_API_KEY=...
SMS_SENDER_ID=FoodShare
```

---

## 🔐 Security Features

✅ Phone verification (OTP)  
✅ Password hashing (bcrypt)  
✅ JWT authentication  
✅ Rate limiting (OTP resend)  
✅ Cooldown enforcement  
✅ HTTPS only in production  

---

## 📈 Monitoring

Track these metrics:
- **OTP Delivery Rate** - % of successful SMS
- **Verification Rate** - % of users who verify
- **Cooldown Violations** - Attempts during cooldown
- **Arrival Notifications** - Usage rate
- **Map Usage** - GPS accuracy

---

## 🆘 Support

**Documentation:**
- `IMPLEMENTATION_SUMMARY.md` - Complete feature details
- `SMS_INTEGRATION_PAKISTAN.md` - SMS provider setup
- `PWA_SETUP.md` - Mobile app installation

**Common Issues:**
1. OTP not received → Check SMS provider
2. Cooldown error → Wait or check database
3. Map not loading → Check permissions
4. Arrival not working → Check Socket.IO

---

## ✨ Success Checklist

Before going live in Pakistan:

- [ ] Database migrated
- [ ] OTP system tested
- [ ] SMS provider integrated
- [ ] 6-hour cooldown verified
- [ ] Arrival notifications working
- [ ] Map loading correctly
- [ ] Tested with Pakistani numbers
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Monitoring setup

---

## 🎉 You're Ready!

All features are implemented and ready for Pakistan deployment.

**Next:** Choose SMS provider and deploy to production.

**Questions?** Check the detailed documentation files.

---

**Made with ❤️ for Pakistan** 🇵🇰
