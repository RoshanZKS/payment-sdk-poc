# Demo Testing Guide

## 🚀 Running the Demo

The SDK now includes a demo application for testing the payment flow locally.

### Prerequisites

1. Node.js installed (v14 or higher)
2. npm or yarn
3. Backend API running (optional for full testing)

### Step 1: Install Dependencies

```bash
cd /Users/sridhar/Desktop/payment-sdk/payment-sdk
npm install
```

### Step 2: Configure API Endpoint

Edit `src/config.js` or create `.env` file:

```env
REACT_APP_PAYMENT_API_URL=http://localhost:8080/api/v1
```

### Step 3: Start Development Server

```bash
npm start
```

The demo will open at `http://localhost:3000`

---

## 🎮 Using the Demo

### Demo Interface

The demo application has two panels:

#### Left Panel - Configuration
- **Amount**: Set payment amount in cents
- **Customer Name**: Enter test customer name
- **Customer Email**: Enter test email
- **Order ID**: Auto-generated
- **Currency**: USD (default)

#### Right Panel - Payment SDK
- Shows test card numbers
- Displays payment form when started
- Shows payment results

### Testing Flow

1. **Configure Payment**
   - Set amount (e.g., 5000 = $50.00)
   - Enter customer details
   - Click "Start Payment Test"

2. **Enter Payment Details**
   Use test cards:
   - Visa: `4111 1111 1111 1111`
   - Mastercard: `5555 5555 5555 4444`
   - CVV: `123`
   - Expiry: Any future date (e.g., 12/25)
   - Name: Any name
   - ZIP: Any 5 digits

3. **Submit Payment**
   - Click "Submit Payment Details"
   - Watch for success/error message
   - Check browser console for token data

4. **View Results**
   - Success banner shows token data
   - Error banner shows error message
   - Results auto-clear after 5 seconds

---

## 🔧 Testing Without Backend

If you don't have a backend API running, the SDK will use:

1. **Hardcoded test sessions** (defined in `src/api/paymentApi.js`)
2. **Mock responses** for development
3. **LocalStorage** for session management

The payment form will still work and show the complete flow, but won't connect to a real payment gateway.

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Payment
1. Use valid test card: 4111 1111 1111 1111
2. Fill all fields correctly
3. Submit
4. ✅ Should see success message with token

### Scenario 2: Invalid Card
1. Use invalid card number: 1234 5678 9012 3456
2. Submit
3. ❌ Should see validation error

### Scenario 3: Expired Card
1. Use test card with past expiry date
2. Submit
3. ❌ Should see "Card has expired" error

### Scenario 4: Missing Fields
1. Leave CVV or name empty
2. Try to submit
3. ❌ Should see validation errors

### Scenario 5: Close Flow
1. Start payment
2. Click "Cancel Test"
3. Form should close

---

## 📊 What to Check

### Browser Console
- Payment session creation logs
- Token creation logs
- API request/response logs
- Any errors

### Network Tab
- POST to `/payment/session/create`
- POST to `/payment/authenticate`
- Response status codes
- Request/response payloads

### UI Elements
- Form validation working
- Error messages displaying
- Success messages showing
- Iframe rendering correctly
- Responsive on mobile

---

## 🐛 Troubleshooting

### Issue: "Failed to initialize payment"

**Cause**: Backend API not accessible

**Solutions**:
- Check if backend is running
- Verify API_BASE_URL in `src/config.js`
- Check browser console for CORS errors
- Test API endpoint manually: `curl http://localhost:8080/api/v1/payment/session/create`

### Issue: Demo doesn't start

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: CORS errors

**Backend needs CORS headers**:
```javascript
// Add to your backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

### Issue: Port 3000 already in use

**Change port**:
```bash
PORT=3001 npm start
```

---

## 📱 Mobile Testing

### Local Network Testing

1. Find your IP address:
```bash
# macOS/Linux
ifconfig | grep "inet "
# Should show something like: 192.168.1.100
```

2. Start dev server:
```bash
npm start
```

3. Open on mobile:
```
http://192.168.1.100:3000
```

### Responsive Testing in Browser

1. Open demo
2. Press F12 (Developer Tools)
3. Click device icon (or Cmd+Shift+M on Mac)
4. Test different screen sizes

---

## 🎯 Test Checklist

- [ ] Demo loads successfully
- [ ] Can configure payment amount
- [ ] Can enter customer details
- [ ] Payment form opens in iframe
- [ ] Test cards work correctly
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success messages display
- [ ] Token data appears in console
- [ ] Can close payment form
- [ ] Mobile responsive works
- [ ] HTTPS works (if deployed)

---

## 🔐 Security Testing

### Test Cases

1. **XSS Prevention**
   - Try entering `<script>alert('xss')</script>` in name field
   - Should be sanitized

2. **Iframe Isolation**
   - Check that parent page can't access iframe DOM
   - Verify postMessage communication only

3. **Token Security**
   - Verify token is not logged in production
   - Check token is passed securely

---

## 📝 Notes

- **Demo Mode**: Main page shows demo UI
- **Iframe Mode**: When hash contains `#payment`, shows payment form
- **Auto-switch**: The app detects mode automatically
- **Development Only**: This demo is for testing, not production

---

## 🚢 Preparing for Production

Before deploying to production:

1. **Remove demo files** (optional):
   - `src/DemoApp.js`
   - `src/DemoApp.css`
   - Update `src/index.js` to only use PaymentFormPage

2. **Update configuration**:
   - Set production API URL
   - Enable HTTPS
   - Remove test data

3. **Test with real backend**:
   - Connect to staging API
   - Test with real payment gateway
   - Verify error handling

---

## 🆘 Need Help?

1. Check browser console for errors
2. Review `README.md` for SDK documentation
3. See `USAGE_EXAMPLE.md` for integration examples
4. Check `SDK_IMPLEMENTATION_GUIDE.md` for architecture

---

## 📞 Common Commands

```bash
# Start demo
npm start

# Build SDK for production
npm run build:sdk

# Check for errors
# Open browser console (F12)

# Test API manually
curl -X POST http://localhost:8080/api/v1/payment/session/create \
  -H "Content-Type: application/json" \
  -d '{"orderId":"TEST-123","amount":5000,"currency":"USD","customer":{"name":"Test","email":"test@example.com"}}'
```

---

**Happy Testing! 🎉**

If everything works in demo, you're ready to integrate the SDK into your merchant application.

