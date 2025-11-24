# Payment SDK - Usage Examples

## Example 1: Basic Integration

```javascript
import React, { useState } from 'react';
import { PaymentSDK } from 'payment-sdk';

function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleTokenReceived = (tokenData) => {
    console.log('Token received:', tokenData);
    setPaymentStatus('success');
    
    // Send to your backend
    fetch('/api/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokenData)
    });
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
  };

  return (
    <div className="checkout-page">
      <h1>Complete Your Purchase</h1>
      
      <PaymentSDK
        merchantId="merchant_123"
        apiKey="sk_live_abc123"
        amount={9999}
        currency="USD"
        customer={{
          name: "John Doe",
          email: "john@example.com"
        }}
        orderId={`ORDER-${Date.now()}`}
        description="Premium Subscription"
        onTokenReceived={handleTokenReceived}
        onPaymentError={handleError}
      />

      {paymentStatus === 'success' && (
        <div className="success-message">Payment successful!</div>
      )}
    </div>
  );
}
```

## Example 2: E-commerce Shopping Cart

```javascript
import React, { useState, useMemo } from 'react';
import { PaymentSDK } from 'payment-sdk';

function ShoppingCartCheckout() {
  const [cart] = useState([
    { id: 1, name: 'Product A', price: 2999, quantity: 2 },
    { id: 2, name: 'Product B', price: 1499, quantity: 1 }
  ]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const orderDescription = useMemo(() => {
    return cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
  }, [cart]);

  const handleTokenReceived = async (tokenData) => {
    try {
      const response = await fetch('/api/complete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenData.token,
          cart: cart,
          totalAmount: totalAmount
        })
      });
      
      const result = await response.json();
      if (result.success) {
        window.location.href = '/order-confirmation';
      }
    } catch (error) {
      console.error('Order completion failed:', error);
    }
  };

  return (
    <div className="cart-checkout">
      <div className="cart-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.quantity}x {item.name}</span>
            <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="cart-total">
          <strong>Total:</strong>
          <strong>${(totalAmount / 100).toFixed(2)}</strong>
        </div>
      </div>

      <PaymentSDK
        merchantId="merchant_123"
        apiKey="sk_live_abc123"
        amount={totalAmount}
        currency="USD"
        customer={{
          name: "Jane Smith",
          email: "jane@example.com"
        }}
        orderId={`CART-${Date.now()}`}
        description={orderDescription}
        onTokenReceived={handleTokenReceived}
        onPaymentError={(error) => alert(`Payment failed: ${error}`)}
      />
    </div>
  );
}
```

## Example 3: Subscription Payment

```javascript
import React, { useState } from 'react';
import { PaymentSDK } from 'payment-sdk';

function SubscriptionCheckout({ plan }) {
  const [processing, setProcessing] = useState(false);

  const handleTokenReceived = async (tokenData) => {
    setProcessing(true);
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenData.token,
          planId: plan.id,
          customerId: localStorage.getItem('customerId')
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect to success page
        window.location.href = '/subscription/active';
      } else {
        alert('Subscription creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="subscription-checkout">
      <div className="plan-details">
        <h2>{plan.name}</h2>
        <p className="price">${plan.price / 100}/month</p>
        <ul>
          {plan.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>

      {!processing ? (
        <PaymentSDK
          merchantId="merchant_123"
          apiKey="sk_live_abc123"
          amount={plan.price}
          currency="USD"
          customer={{
            name: "Customer Name",
            email: "customer@example.com"
          }}
          orderId={`SUB-${plan.id}-${Date.now()}`}
          description={`${plan.name} Subscription`}
          onTokenReceived={handleTokenReceived}
          onPaymentError={(error) => {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
          }}
        />
      ) : (
        <div className="processing">Processing your subscription...</div>
      )}
    </div>
  );
}
```

## Example 4: Multi-step Checkout Flow

```javascript
import React, { useState } from 'react';
import { PaymentSDK } from 'payment-sdk';

function MultiStepCheckout() {
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orderDetails] = useState({
    amount: 15000,
    description: 'Premium Package',
    orderId: `ORD-${Date.now()}`
  });

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleTokenReceived = async (tokenData) => {
    setStep(3);
    
    // Process payment
    await fetch('/api/finalize-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...tokenData,
        customer: customerInfo,
        order: orderDetails
      })
    });
  };

  return (
    <div className="multi-step-checkout">
      <div className="steps">
        <div className={step >= 1 ? 'active' : ''}>1. Customer Info</div>
        <div className={step >= 2 ? 'active' : ''}>2. Payment</div>
        <div className={step >= 3 ? 'active' : ''}>3. Confirmation</div>
      </div>

      {step === 1 && (
        <form onSubmit={handleCustomerSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          />
          <button type="submit">Continue to Payment</button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h2>Payment Information</h2>
          <div className="order-summary">
            <p>Amount: ${orderDetails.amount / 100}</p>
            <p>Description: {orderDetails.description}</p>
          </div>
          
          <PaymentSDK
            merchantId="merchant_123"
            apiKey="sk_live_abc123"
            amount={orderDetails.amount}
            currency="USD"
            customer={customerInfo}
            orderId={orderDetails.orderId}
            description={orderDetails.description}
            onTokenReceived={handleTokenReceived}
            onPaymentError={(error) => {
              alert(`Payment failed: ${error}`);
            }}
            onClose={() => setStep(1)}
          />
          
          <button onClick={() => setStep(1)}>Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="confirmation">
          <h2>✓ Payment Successful!</h2>
          <p>Thank you for your purchase.</p>
          <p>Order ID: {orderDetails.orderId}</p>
        </div>
      )}
    </div>
  );
}
```

## Example 5: Custom Styling

```javascript
import React from 'react';
import { PaymentSDK } from 'payment-sdk';
import './custom-payment-styles.css';

function CustomStyledPayment() {
  return (
    <div className="custom-payment-container">
      <PaymentSDK
        merchantId="merchant_123"
        apiKey="sk_live_abc123"
        amount={4999}
        currency="USD"
        customer={{
          name: "John Doe",
          email: "john@example.com"
        }}
        orderId="ORDER-123"
        description="Custom Styled Payment"
        className="my-custom-payment-sdk"
        onTokenReceived={(tokenData) => {
          console.log('Payment completed:', tokenData);
        }}
        onPaymentError={(error) => {
          console.error('Error:', error);
        }}
      />
    </div>
  );
}

export default CustomStyledPayment;
```

```css
/* custom-payment-styles.css */
.my-custom-payment-sdk .payment-sdk-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.my-custom-payment-sdk .payment-sdk-button:hover {
  transform: scale(1.05);
}
```

## Environment Configuration

Create a `.env` file in your project root:

```env
# Production
REACT_APP_PAYMENT_API_URL=https://api.payment-gateway.com/api/v1

# Development
# REACT_APP_PAYMENT_API_URL=http://localhost:8080/api/v1
```

## Backend Integration Example

```javascript
// Node.js/Express backend example
app.post('/api/process-payment', async (req, res) => {
  const { token, customer, amount } = req.body;

  try {
    // Use token to charge the customer via payment gateway
    const result = await paymentGateway.charge({
      token: token,
      amount: amount,
      currency: 'USD',
      customer: customer
    });

    if (result.success) {
      // Save order to database
      await saveOrder({
        customerId: customer.id,
        amount: amount,
        status: 'completed',
        transactionId: result.transactionId
      });

      res.json({ success: true, orderId: result.orderId });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```

