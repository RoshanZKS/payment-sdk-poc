# Payment SDK - Implementation Guide for Merchants

## Overview

This Payment SDK provides a secure, PCI-compliant way to collect payment information in your merchant application. The SDK uses iframe isolation to ensure card data never touches your servers, reducing your PCI compliance scope.

## Quick Start (5 Minutes)

### Step 1: Install the SDK

```bash
npm install payment-sdk
```

### Step 2: Configure Environment

Create or update `.env`:

```env
REACT_APP_PAYMENT_API_URL=https://your-payment-gateway.com/api/v1
```

### Step 3: Add to Your Checkout Page

```javascript
import React from 'react';
import { PaymentSDK } from 'payment-sdk';

function Checkout() {
  return (
    <PaymentSDK
      merchantId="your_merchant_id"
      apiKey="your_api_key"
      amount={5000}
      currency="USD"
      customer={{
        name: "Customer Name",
        email: "customer@email.com"
      }}
      orderId="ORDER-123"
      onTokenReceived={(tokenData) => {
        // Send token to your backend
        console.log('Token:', tokenData);
      }}
      onPaymentError={(error) => {
        // Handle error
        console.error('Error:', error);
      }}
    />
  );
}
```

### Step 4: Process Payment on Backend

```javascript
// Your backend endpoint
app.post('/api/process-payment', async (req, res) => {
  const { token } = req.body;
  
  // Use token to charge customer via payment gateway
  const result = await paymentGateway.charge({ token });
  
  res.json({ success: result.success });
});
```

## Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Merchant Application (Your Website/App)                │
│                                                           │
│  ┌──────────────────────────────────────────┐          │
│  │  PaymentSDK Component                     │          │
│  │                                             │          │
│  │  [Pay Now Button]                          │          │
│  └──────────┬───────────────────────────────┘          │
│             │ Click                                      │
│             ▼                                            │
│  ┌──────────────────────────────────────────┐          │
│  │  PaymentIframe Component                  │          │
│  │  ┌──────────────────────────────────┐   │          │
│  │  │ Isolated Iframe                   │   │          │
│  │  │                                    │   │          │
│  │  │  ┌─────────────────────────┐    │   │          │
│  │  │  │  PaymentForm            │    │   │          │
│  │  │  │                          │    │   │          │
│  │  │  │  Card Number: [____]    │    │   │          │
│  │  │  │  Expiry: [__]  CVV: [_] │    │   │          │
│  │  │  │  Name: [____________]    │    │   │          │
│  │  │  │                          │    │   │          │
│  │  │  │  [Submit Payment]        │    │   │          │
│  │  │  └─────────────────────────┘    │   │          │
│  │  │                                    │   │          │
│  │  └────────────────────────────────┘   │          │
│  └──────────────────────────────────────────┘          │
│                                                           │
└─────────────────────────────────────────────────────────┘
                        │
                        │ API Calls
                        ▼
        ┌───────────────────────────────┐
        │  Payment Gateway Backend       │
        │                                │
        │  /payment/session/create       │
        │  /payment/authenticate         │
        └───────────────────────────────┘
```

### Security Flow

1. **Session Creation**: SDK calls your backend to create a payment session
2. **Iframe Isolation**: Payment form loads in an isolated iframe
3. **Card Data Collection**: User enters card details (stays in iframe)
4. **Tokenization**: Card data is sent to payment gateway, token is returned
5. **Token Callback**: Token is passed to parent page via postMessage
6. **Payment Completion**: Merchant sends token to backend to complete payment

## Backend Requirements

You need to implement 2 endpoints:

### 1. Create Payment Session

**Endpoint**: `POST /payment/session/create`

**Request**:
```json
{
  "orderId": "ORDER-123",
  "amount": 5000,
  "currency": "USD",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response**:
```json
{
  "sessionId": "sess_abc123xyz",
  "amount": 5000,
  "currency": "USD",
  "orderId": "ORDER-123",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Authenticate Payment

**Endpoint**: `POST /payment/authenticate`

**Request**:
```json
{
  "recordLocator": "ABC123",
  "paymentDetail": {
    "paymentReference": "PAY123456",
    "formOfPayment": {
      "type": "CC",
      "fopCode": "VI"
    },
    "paymentCard": {
      "cardCode": "VI",
      "cardNumber": "411111######1111",
      "cardSecurityCode": "###",
      "expireDate": "122025",
      "cardHolderName": {
        "name": "TESTCARD",
        "firstName": "TESTCARD",
        "lastName": ""
      }
    },
    "amount": 499.00
  }
}
```

**Response**:
```json
{
  "result": {
    "resultCode": "Success"
  }
}
```

## Component Props Reference

### Required Props

| Prop | Type | Example | Description |
|------|------|---------|-------------|
| `merchantId` | string | `"merchant_123"` | Your merchant identifier |
| `apiKey` | string | `"sk_live_abc123"` | Your API key |
| `amount` | number | `5000` | Amount in cents (5000 = $50.00) |
| `currency` | string | `"USD"` | Currency code |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customer` | object | `{}` | Customer details |
| `customer.name` | string | - | Customer name |
| `customer.email` | string | - | Customer email |
| `customer.phone` | string | - | Customer phone |
| `orderId` | string | Auto | Your order ID |
| `description` | string | `""` | Payment description |
| `onTokenReceived` | function | - | Success callback |
| `onPaymentError` | function | - | Error callback |
| `onClose` | function | - | Close callback |
| `autoOpen` | boolean | `false` | Auto-open form |
| `className` | string | `""` | Custom CSS class |

## Testing

### Test Card Numbers

| Brand | Card Number | CVV | Expiry |
|-------|-------------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | Any future |
| Mastercard | 5555 5555 5555 4444 | 123 | Any future |
| Amex | 3782 822463 10005 | 1234 | Any future |

### Test Environment Setup

```javascript
// Use test API endpoint for development
REACT_APP_PAYMENT_API_URL=http://localhost:8080/api/v1

// Use production endpoint for live
REACT_APP_PAYMENT_API_URL=https://api.payment-gateway.com/api/v1
```

## Common Integration Patterns

### Pattern 1: E-commerce Checkout

```javascript
function Checkout({ cart, customer }) {
  const totalAmount = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  return (
    <PaymentSDK
      merchantId="merchant_123"
      apiKey="sk_live_abc"
      amount={totalAmount}
      currency="USD"
      customer={customer}
      orderId={`ORD-${Date.now()}`}
      description={`Cart with ${cart.length} items`}
      onTokenReceived={async (token) => {
        const result = await completeOrder(token, cart);
        if (result.success) {
          window.location.href = '/order-success';
        }
      }}
    />
  );
}
```

### Pattern 2: Subscription Billing

```javascript
function SubscriptionCheckout({ plan, user }) {
  return (
    <PaymentSDK
      merchantId="merchant_123"
      apiKey="sk_live_abc"
      amount={plan.monthlyPrice}
      currency="USD"
      customer={{
        name: user.name,
        email: user.email
      }}
      orderId={`SUB-${plan.id}-${user.id}`}
      description={`${plan.name} Subscription`}
      onTokenReceived={async (token) => {
        await createSubscription(user.id, plan.id, token);
      }}
    />
  );
}
```

### Pattern 3: One-time Payment

```javascript
function DonationPage() {
  const [amount, setAmount] = useState(2500);

  return (
    <div>
      <input
        type="number"
        value={amount / 100}
        onChange={(e) => setAmount(e.target.value * 100)}
      />
      
      <PaymentSDK
        merchantId="merchant_123"
        apiKey="sk_live_abc"
        amount={amount}
        currency="USD"
        description="Donation"
        onTokenReceived={(token) => {
          processDonation(token, amount);
        }}
      />
    </div>
  );
}
```

## Error Handling

```javascript
const handlePaymentError = (error) => {
  // Map error to user-friendly message
  const errorMessages = {
    'merchantId is required': 'Configuration error. Please contact support.',
    'amount must be a positive number': 'Invalid payment amount.',
    'Failed to initialize payment': 'Unable to connect to payment service.',
  };

  const message = errorMessages[error] || 'Payment failed. Please try again.';
  
  // Show error to user
  showNotification(message, 'error');
  
  // Log for debugging
  console.error('Payment error:', error);
  
  // Track in analytics
  analytics.track('payment_error', { error });
};
```

## Security Best Practices

### 1. Environment Variables

```javascript
// ✅ Good - Use environment variables
const apiKey = process.env.REACT_APP_API_KEY;

// ❌ Bad - Hardcoded credentials
const apiKey = "sk_live_abc123";
```

### 2. HTTPS Only

```javascript
// Always use HTTPS in production
if (window.location.protocol !== 'https:' && 
    process.env.NODE_ENV === 'production') {
  window.location.protocol = 'https:';
}
```

### 3. Origin Validation

```javascript
// In PaymentIframe.js, validate message origin
const handleMessage = (event) => {
  // Validate origin in production
  if (process.env.NODE_ENV === 'production' && 
      event.origin !== window.location.origin) {
    return; // Ignore messages from unauthorized origins
  }
  // Process message...
};
```

### 4. Don't Log Sensitive Data

```javascript
// ❌ Bad
console.log('Card data:', cardNumber, cvv);

// ✅ Good
console.log('Payment processed for order:', orderId);
```

## Customization

### Custom Styling

```css
/* Add to your CSS */
.payment-sdk-container .payment-sdk-button {
  background-color: #your-brand-color;
  font-family: your-brand-font;
  border-radius: 8px;
}

.payment-form-container {
  font-family: your-brand-font;
}
```

### Custom Button Text

The SDK button displays "Pay Now" by default. To customize, modify the PaymentSDK component or wrap it in your own UI.

## Troubleshooting

### Issue: "Failed to initialize payment"

**Cause**: Backend endpoint not accessible
**Solution**: 
- Check API_BASE_URL in `.env`
- Verify backend is running
- Check network tab for errors

### Issue: "merchantId is required"

**Cause**: Missing required props
**Solution**: Ensure all required props are passed to PaymentSDK

### Issue: Token not received

**Cause**: Iframe communication blocked
**Solution**: 
- Check browser console for errors
- Verify postMessage is working
- Check origin validation

### Issue: CORS errors

**Cause**: Backend not allowing requests from your domain
**Solution**: Add CORS headers on backend:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-domain.com');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Performance Optimization

### Lazy Loading

```javascript
import React, { lazy, Suspense } from 'react';

const PaymentSDK = lazy(() => import('payment-sdk'));

function Checkout() {
  return (
    <Suspense fallback={<div>Loading payment form...</div>}>
      <PaymentSDK {...props} />
    </Suspense>
  );
}
```

### Preload on Hover

```javascript
import { PaymentSDK } from 'payment-sdk';

function CheckoutButton() {
  const handleMouseEnter = () => {
    // Preload payment form assets
    import('payment-sdk');
  };

  return (
    <button onMouseEnter={handleMouseEnter}>
      Checkout
    </button>
  );
}
```

## Support & Resources

- **Documentation**: `README.md`
- **Examples**: `USAGE_EXAMPLE.md`
- **Changelog**: `CHANGELOG.md`
- **Source Code**: `src/` directory

## Deployment Checklist

- [ ] API endpoints implemented and tested
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Test cards working in test environment
- [ ] Error handling implemented
- [ ] Payment success flow tested
- [ ] Payment failure flow tested
- [ ] Analytics/tracking added
- [ ] Security headers configured
- [ ] CORS configured on backend
- [ ] Documentation reviewed
- [ ] Team trained on integration

## Next Steps

1. Review the code in `src/` directory
2. Read through `USAGE_EXAMPLE.md` for detailed examples
3. Set up your backend endpoints
4. Test with test cards
5. Deploy to production

---

**Need Help?** Contact your integration support team or refer to the documentation files included with this SDK.

