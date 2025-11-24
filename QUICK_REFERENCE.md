# Payment SDK - Quick Reference Card

## Installation

```bash
npm install payment-sdk
```

## Environment Setup

```env
REACT_APP_PAYMENT_API_URL=https://your-api.com/api/v1
```

## Basic Integration

```javascript
import { PaymentSDK } from 'payment-sdk';

<PaymentSDK
  merchantId="merchant_123"
  apiKey="sk_live_abc123"
  amount={5000}              // $50.00 in cents
  currency="USD"
  customer={{
    name: "John Doe",
    email: "john@example.com"
  }}
  orderId="ORDER-123"
  description="Payment for Order #123"
  onTokenReceived={(tokenData) => {
    // Send token to your backend
    fetch('/api/process-payment', {
      method: 'POST',
      body: JSON.stringify(tokenData)
    });
  }}
  onPaymentError={(error) => {
    console.error('Payment error:', error);
  }}
/>
```

## Required Props

| Prop | Type | Example |
|------|------|---------|
| `merchantId` | string | `"merchant_123"` |
| `apiKey` | string | `"sk_live_abc"` |
| `amount` | number | `5000` (cents) |
| `currency` | string | `"USD"` |

## Optional Props

| Prop | Type | Default |
|------|------|---------|
| `customer` | object | `{}` |
| `orderId` | string | Auto-generated |
| `description` | string | `""` |
| `onTokenReceived` | function | `null` |
| `onPaymentError` | function | `null` |
| `onClose` | function | `null` |
| `autoOpen` | boolean | `false` |
| `className` | string | `""` |

## Backend Endpoints Required

### 1. Create Session
```
POST /payment/session/create
{
  "orderId": "ORDER-123",
  "amount": 5000,
  "currency": "USD",
  "customer": { "name": "...", "email": "..." }
}
```

### 2. Authenticate Payment
```
POST /payment/authenticate
{
  "recordLocator": "ABC123",
  "paymentDetail": { ... }
}
```

## Test Cards

| Brand | Number | CVV | Expiry |
|-------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | 12/25 |
| Mastercard | 5555 5555 5555 4444 | 123 | 12/25 |
| Amex | 3782 822463 10005 | 1234 | 12/25 |

## Common Patterns

### E-commerce Cart
```javascript
<PaymentSDK
  amount={cartTotal}
  orderId={`CART-${Date.now()}`}
  description={`${cartItems.length} items`}
  {...otherProps}
/>
```

### Subscription
```javascript
<PaymentSDK
  amount={plan.monthlyPrice}
  orderId={`SUB-${planId}-${userId}`}
  description={`${plan.name} Subscription`}
  {...otherProps}
/>
```

### One-time Payment
```javascript
<PaymentSDK
  amount={donationAmount}
  orderId={`DONATION-${Date.now()}`}
  description="One-time donation"
  {...otherProps}
/>
```

## Error Handling

```javascript
onPaymentError={(error) => {
  switch(error) {
    case 'merchantId is required':
      // Config error
      break;
    case 'amount must be a positive number':
      // Invalid amount
      break;
    default:
      // Generic error
      alert('Payment failed. Please try again.');
  }
}
```

## Customization

```css
.payment-sdk-container .payment-sdk-button {
  background-color: #your-brand-color;
  border-radius: 8px;
  padding: 16px 32px;
}
```

## Build & Deploy

```bash
# Build SDK
npm run build:sdk

# Output: dist/ directory
```

## Configuration

Edit `src/config.js`:
```javascript
export const API_BASE_URL = 'https://your-api.com/api/v1';
export const API_TIMEOUT = 10000;
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Store API keys in environment variables
- [ ] Validate message origins in iframe
- [ ] Never log sensitive payment data
- [ ] Implement proper error handling

## File Structure

```
payment-sdk/
├── dist/                  # Built SDK
├── src/                   # Source code
│   ├── components/        # React components
│   ├── api/              # API client
│   ├── config.js         # Configuration
│   └── PaymentSDK.js     # Main export
├── README.md             # Full documentation
├── USAGE_EXAMPLE.md      # Code examples
└── package.json          # Package config
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to initialize payment" | Check API_BASE_URL |
| "merchantId is required" | Pass all required props |
| CORS errors | Add CORS headers on backend |
| Token not received | Check iframe postMessage |

## Resources

- **README.md** - Full documentation
- **USAGE_EXAMPLE.md** - Integration examples
- **SDK_IMPLEMENTATION_GUIDE.md** - Detailed guide
- **CHANGELOG.md** - Version history
- **CLEANUP_SUMMARY.md** - What changed

## Support

- API Reference: See README.md
- Code Examples: See USAGE_EXAMPLE.md
- Implementation: See SDK_IMPLEMENTATION_GUIDE.md

---

**Quick Start**: Install → Configure `.env` → Add component → Test with test cards → Deploy

**Most Common Issue**: Wrong API_BASE_URL → Check `src/config.js` or `.env`

**Best Practice**: Always test with test cards before going live

