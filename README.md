# Payment SDK

A React-based payment SDK for merchant applications with secure iframe tokenization. This SDK provides a seamless and secure way to collect payment information from customers while maintaining PCI compliance.

## Features

- 🔒 **Secure Payment Processing** - Iframe-based tokenization keeps sensitive card data isolated
- ⚡ **Easy Integration** - Simple React component integration with minimal configuration
- 🎨 **Customizable UI** - Pre-built, modern payment form with responsive design
- 🔐 **PCI Compliant** - Card data never touches your servers
- 📱 **Mobile Responsive** - Works seamlessly across all device sizes
- ✅ **Form Validation** - Built-in validation for card numbers, expiry dates, CVV, and more

## Installation

```bash
npm install payment-sdk
```

## Quick Start

### Basic Usage

```javascript
import React from 'react';
import { PaymentSDK } from 'payment-sdk';

function CheckoutPage() {
  const handleTokenReceived = (tokenData) => {
    console.log('Payment token received:', tokenData);
    // Send token to your backend to complete the payment
    // Example: await fetch('/api/complete-payment', { 
    //   method: 'POST', 
    //   body: JSON.stringify(tokenData) 
    // });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle error appropriately
  };

  return (
    <PaymentSDK
      merchantId="your_merchant_id"
      apiKey="your_api_key"
      amount={5000}  // Amount in cents ($50.00)
      currency="USD"
      customer={{
        name: "John Doe",
        email: "john.doe@example.com"
      }}
      orderId="ORDER-123"
      description="Order #123 - Premium Package"
      onTokenReceived={handleTokenReceived}
      onPaymentError={handlePaymentError}
    />
  );
}

export default CheckoutPage;
```

## Component Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `merchantId` | `string` | Your unique merchant identifier |
| `apiKey` | `string` | Your API key for authentication |
| `amount` | `number` | Payment amount in cents (e.g., 5000 for $50.00) |
| `currency` | `string` | Currency code (e.g., "USD", "EUR", "GBP") |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customer` | `object` | `{}` | Customer information (`name`, `email`, `phone`) |
| `orderId` | `string` | Auto-generated | Your order/transaction ID |
| `description` | `string` | `""` | Payment description |
| `onTokenReceived` | `function` | `null` | Callback when payment token is created successfully |
| `onPaymentError` | `function` | `null` | Callback when an error occurs |
| `onClose` | `function` | `null` | Callback when payment form is closed |
| `autoOpen` | `boolean` | `false` | Automatically open payment form on mount |
| `className` | `string` | `""` | Additional CSS classes for styling |

## API Configuration

The SDK communicates with your payment backend. Configure the API base URL in `src/api/paymentApi.js`:

```javascript
const API_BASE_URL = 'https://your-payment-api.com/api/v1';
```

### Required Backend Endpoints

Your backend should implement these endpoints:

#### 1. Create Payment Session

**POST** `/payment/session/create`

Request:
```json
{
  "orderId": "ORDER-123",
  "amount": 5000,
  "currency": "USD",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }
}
```

Response:
```json
{
  "sessionId": "sess_abc123xyz",
  "amount": 5000,
  "currency": "USD",
  "orderId": "ORDER-123",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

#### 2. Authenticate Payment

**POST** `/payment/authenticate`

Request:
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

Response:
```json
{
  "result": {
    "resultCode": "Success"
  }
}
```

## Workflow

1. **Merchant Integration**: Merchant adds the `PaymentSDK` component to their checkout page
2. **Session Creation**: When user clicks "Pay Now", SDK creates a payment session with your backend
3. **Secure Form**: Payment form loads in an isolated iframe for security
4. **Token Generation**: Card details are submitted to create a payment token
5. **Token Callback**: Token is returned to merchant via `onTokenReceived` callback
6. **Payment Completion**: Merchant sends token to their backend to complete the payment

## Security

- **Iframe Isolation**: Card data is collected in an isolated iframe, never touching the parent page
- **Tokenization**: Card details are converted to tokens before being sent to your server
- **PCI Compliance**: By using this SDK, you reduce PCI compliance scope
- **HTTPS Required**: Always use HTTPS in production
- **Origin Validation**: In production, validate message origins for iframe communication

## Development & Testing

### Test Card Numbers

Use these test card numbers during development:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | Any future date |
| Mastercard | 5555 5555 5555 4444 | 123 | Any future date |
| Amex | 3782 822463 10005 | 1234 | Any future date |

### Building the SDK

```bash
# Build the SDK for distribution
npm run build:sdk

# Output will be in the `dist/` directory
```

## Error Handling

The SDK provides error callbacks for handling various error scenarios:

```javascript
const handlePaymentError = (error) => {
  switch(error) {
    case 'merchantId is required':
      // Handle missing merchant ID
      break;
    case 'amount must be a positive number':
      // Handle invalid amount
      break;
    case 'Failed to initialize payment. Please try again.':
      // Handle initialization failure
      break;
    default:
      // Handle generic errors
      console.error('Payment error:', error);
  }
};
```

## Styling

The SDK includes pre-built styles that can be customized. You can:

1. Use the `className` prop to add custom classes
2. Override CSS variables in your application
3. Modify the CSS files in `src/components/` before building

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## TypeScript Support

TypeScript definitions are planned for a future release. For now, you can create a declaration file:

```typescript
declare module 'payment-sdk' {
  export interface PaymentSDKProps {
    merchantId: string;
    apiKey: string;
    amount: number;
    currency: string;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    orderId?: string;
    description?: string;
    onTokenReceived?: (tokenData: any) => void;
    onPaymentError?: (error: string) => void;
    onClose?: () => void;
    autoOpen?: boolean;
    className?: string;
  }

  export const PaymentSDK: React.FC<PaymentSDKProps>;
}
```

## Contributing

This SDK is designed for merchant integration. For bugs or feature requests, please contact the development team.

## License

Proprietary - All rights reserved

## Support

For technical support or questions, please contact:
- Email: support@payment-sdk.com
- Documentation: https://docs.payment-sdk.com

## Changelog

### Version 1.0.0
- Initial release
- Iframe-based payment form
- Tokenization support
- Mobile responsive design
- Form validation
- Error handling
