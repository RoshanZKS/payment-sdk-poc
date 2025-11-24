# 🚀 Quick Start - Demo Testing

## ✅ Demo Environment Created!

I've added a complete demo testing application to your Payment SDK. Here's how to run it:

---

## 📋 Prerequisites

- Node.js (v14+)
- npm
- Backend API running at `http://localhost:8080/api/v1` (optional)

---

## 🎯 Quick Start (3 Steps)

### Step 1: Fix npm permissions (if needed)

If you see npm permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 2: Install dependencies

```bash
cd /Users/sridhar/Desktop/payment-sdk/payment-sdk
npm install
```

This will install `react-scripts` and other dependencies needed to run the demo.

### Step 3: Start the demo

```bash
npm start
```

The demo will automatically open at `http://localhost:3000`

---

## 🎮 What You'll See

### Demo Interface

**Left Panel - Payment Configuration**
- Set payment amount
- Enter customer details (name, email)
- View auto-generated order ID
- Click "Start Payment Test" button

**Right Panel - Payment SDK**
- Test card numbers reference
- Payment form (appears after clicking "Start Payment Test")
- Real-time payment processing

**Bottom - Info Boxes**
- API configuration info
- Testing notes and tips

---

## 💳 Test Cards

Use these cards to test the payment flow:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| **Visa** | `4111 1111 1111 1111` | `123` | `12/25` |
| **Mastercard** | `5555 5555 5555 4444` | `123` | `12/25` |
| **Amex** | `3782 822463 10005` | `1234` | `12/25` |

> Use any future expiry date and any 5-digit ZIP code

---

## 🧪 Testing Flow

1. **Set Amount**: e.g., 5000 (= $50.00)
2. **Enter Customer Info**: Name and email
3. **Click "Start Payment Test"**
4. **Fill Payment Form** with test card
5. **Submit** and watch for results
6. **Check Browser Console** for token data

---

## 🔧 Configuration

### Backend API Setup

Edit `src/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8080/api/v1';
```

Or create `.env` file:

```env
REACT_APP_PAYMENT_API_URL=http://localhost:8080/api/v1
```

### Without Backend

If you don't have a backend running, the SDK will use:
- Mock test sessions
- LocalStorage for session management
- Test responses for development

The demo will still work and show the complete payment flow!

---

## 📊 What to Test

### ✅ Success Scenarios

1. **Valid Payment**
   - Use Visa test card: 4111 1111 1111 1111
   - Fill all fields correctly
   - Should see ✅ success message

2. **Different Amounts**
   - Try various amounts (100, 5000, 10000)
   - Verify correct display

3. **Different Cards**
   - Test Visa, Mastercard, Amex
   - All should work

### ❌ Error Scenarios

1. **Invalid Card Number**
   - Use: 1234 5678 9012 3456
   - Should see validation error

2. **Expired Card**
   - Use expiry: 01/20
   - Should see "Card has expired"

3. **Missing Fields**
   - Leave CVV empty
   - Should see validation error

4. **Short CVV**
   - Enter: 12 (instead of 123)
   - Should see validation error

---

## 🔍 Debugging

### Browser Console

Open developer tools (F12) and check:

```javascript
// You'll see logs like:
// ✅ Token received: {...}
// 📤 Creating payment session with details: {...}
// 📥 Session loaded: {...}
```

### Network Tab

Monitor API calls:
- `POST /payment/session/create`
- `POST /payment/authenticate`

### Common Issues

**Port 3000 already in use?**
```bash
PORT=3001 npm start
```

**CORS errors?**
- Backend needs CORS headers
- Check backend is running
- Verify API URL in config

**Can't install dependencies?**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Mobile Testing

### Local Network Testing

1. Find your IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. Access from mobile:
```
http://YOUR_IP:3000
```

Example: `http://192.168.1.100:3000`

---

## 🎨 Demo Features

### Interactive UI
- ✨ Beautiful gradient background
- 📱 Fully responsive design
- 🎯 Real-time validation
- 💫 Smooth animations
- 🎭 Success/error states

### Real SDK Integration
- 🔒 Uses actual PaymentSDK component
- 📦 Same code merchants will use
- 🔐 Secure iframe isolation
- 🎯 Token generation
- ✅ Complete payment flow

---

## 📁 Demo Files Created

```
src/
├── DemoApp.js          # Demo application UI
├── DemoApp.css         # Demo styles
└── index.js            # Updated to support demo mode
```

---

## 🔄 Switching Between Modes

The app automatically detects the mode:

- **Demo Mode**: Main page (`/`)
  - Shows demo interface
  - Testing environment
  
- **Iframe Mode**: Hash contains `#payment`
  - Shows payment form only
  - Used inside SDK iframe

---

## 🚀 Next Steps After Testing

Once demo testing is complete:

1. **Review Integration**
   - Check `USAGE_EXAMPLE.md` for real examples
   - See `SDK_IMPLEMENTATION_GUIDE.md` for details

2. **Implement in Your App**
   ```javascript
   import { PaymentSDK } from 'payment-sdk';
   
   <PaymentSDK
     merchantId="your_id"
     apiKey="your_key"
     amount={5000}
     currency="USD"
     customer={{ name: "...", email: "..." }}
     onTokenReceived={(token) => {
       // Process payment
     }}
   />
   ```

3. **Connect Real Backend**
   - Implement `/payment/session/create`
   - Implement `/payment/authenticate`
   - Test with staging environment

4. **Deploy to Production**
   - Update API URLs
   - Enable HTTPS
   - Test with real payment gateway

---

## 📞 Support

- **Full Docs**: `README.md`
- **Usage Examples**: `USAGE_EXAMPLE.md`
- **Implementation Guide**: `SDK_IMPLEMENTATION_GUIDE.md`
- **This Guide**: `DEMO_TESTING.md`

---

## 🎉 That's It!

You now have a fully functional demo environment to test the Payment SDK!

```bash
# Start testing now:
npm start
```

**Happy Testing! 💳✨**

