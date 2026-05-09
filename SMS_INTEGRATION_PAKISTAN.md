# SMS Integration Guide for Pakistan 🇵🇰

This guide explains how to integrate SMS OTP verification for Pakistani phone numbers.

## Current Status

✅ **OTP System Implemented** - Backend generates and verifies OTPs  
⚠️ **SMS Sending** - Currently logs to console (development mode)  
📱 **Production Ready** - Just needs SMS provider integration

## Development Mode

In development, OTP codes are logged to the server console:
```
📱 OTP for 03001234567: 123456
```

Users can see the OTP in the terminal and enter it in the app.

## Production SMS Providers for Pakistan

### Option 1: Twilio (International - Recommended for Testing)

**Pros:**
- Easy setup
- Reliable delivery
- Good documentation
- Works in Pakistan

**Cons:**
- More expensive than local providers
- International rates

**Setup:**
```bash
npm install twilio
```

**Environment Variables:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Code (in `server/services/otp.ts`):**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    await client.messages.create({
      body: `Your FoodShare verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone // Format: +923001234567
    });
    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}
```

### Option 2: MSG91 (Supports Pakistan)

**Pros:**
- Supports Pakistan
- Affordable
- Good for Asian markets

**Setup:**
```bash
npm install axios
```

**Environment Variables:**
```env
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
```

**Code:**
```typescript
import axios from 'axios';

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    await axios.get('https://api.msg91.com/api/v5/otp', {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: phone.replace('+92', '92'), // Format: 923001234567
        otp: otp,
        template_id: process.env.MSG91_TEMPLATE_ID
      }
    });
    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}
```

### Option 3: Jazz SMS API (Pakistan Local)

**Pros:**
- Local Pakistani provider
- Competitive pricing
- Direct carrier integration

**Contact:** Jazz Business Solutions for API access

**Code:**
```typescript
import axios from 'axios';

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    await axios.post('https://jazz-sms-api.pk/send', {
      api_key: process.env.JAZZ_API_KEY,
      sender_id: 'FoodShare',
      phone: phone,
      message: `Your FoodShare OTP: ${otp}. Valid for 10 minutes.`
    });
    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}
```

### Option 4: Telenor SMS API (Pakistan Local)

**Pros:**
- Major Pakistani carrier
- Good coverage
- Reliable delivery

**Contact:** Telenor Business for API access

### Option 5: EoceanSMS (Pakistan)

**Pros:**
- Pakistani SMS gateway
- Affordable rates
- Easy integration

**Website:** https://www.eoceansms.com/

## Phone Number Format for Pakistan

Pakistani phone numbers should be in one of these formats:

- **Local:** `03001234567` (11 digits starting with 0)
- **International:** `+923001234567` (with country code)
- **Without +:** `923001234567`

**Validation Regex:**
```typescript
const pakistaniPhoneRegex = /^((\+92)|(0092)|(92)|(0))?3[0-9]{9}$/;
```

## Implementation Steps

### 1. Choose SMS Provider

Select one of the providers above based on:
- Budget
- Reliability requirements
- Delivery speed
- Coverage in Pakistan

### 2. Get API Credentials

Sign up with the provider and get:
- API Key / Auth Token
- Sender ID (if required)
- Template ID (if using templates)

### 3. Update Environment Variables

Add to your `.env` file:
```env
# SMS Provider Credentials
SMS_PROVIDER=twilio  # or msg91, jazz, etc.
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Update `server/services/otp.ts`

Replace the development code with your chosen provider's implementation.

### 5. Test in Production

1. Deploy to Render
2. Test with real Pakistani phone numbers
3. Monitor delivery rates
4. Check SMS logs

## Cost Estimates (Approximate)

| Provider | Cost per SMS | Monthly (1000 SMS) |
|----------|-------------|-------------------|
| Twilio | $0.05 - $0.10 | $50 - $100 |
| MSG91 | $0.01 - $0.03 | $10 - $30 |
| Local (Jazz/Telenor) | PKR 0.50 - 2 | PKR 500 - 2000 |

## Security Best Practices

✅ **Rate Limiting** - Already implemented (2 min between resends)  
✅ **OTP Expiry** - 10 minutes  
✅ **One-time Use** - OTP cleared after verification  
✅ **Secure Storage** - OTP hashed in database (optional)  
✅ **HTTPS Only** - All API calls over HTTPS  

## Troubleshooting

### OTP Not Received

1. **Check phone number format** - Must be valid Pakistani number
2. **Verify SMS provider status** - Check provider dashboard
3. **Check server logs** - Look for error messages
4. **Test with different number** - Try another carrier

### OTP Expired

- Default expiry: 10 minutes
- User can request new OTP after 2 minutes

### SMS Delivery Delayed

- Normal delay: 5-30 seconds
- Peak hours may be slower
- Consider using multiple providers for redundancy

## Testing

### Development Testing

```bash
# Start server
npm run dev

# Register new user
# Check console for OTP:
# 📱 OTP for 03001234567: 123456

# Enter OTP in app
```

### Production Testing

1. Use test phone numbers provided by SMS provider
2. Monitor delivery in provider dashboard
3. Check server logs for errors
4. Verify OTP delivery time

## Monitoring

Track these metrics:
- **Delivery Rate** - % of SMS successfully delivered
- **Delivery Time** - Average time to receive SMS
- **Failed Attempts** - Number of failed OTP verifications
- **Resend Rate** - How often users request new OTP

## Support

For SMS integration help:
- **Twilio:** https://www.twilio.com/docs
- **MSG91:** https://docs.msg91.com/
- **Local Providers:** Contact their business support

---

**Next Steps:**
1. Choose SMS provider
2. Get API credentials
3. Update `server/services/otp.ts`
4. Test with real numbers
5. Deploy to production

Your OTP system is ready - just add SMS provider! 🚀
