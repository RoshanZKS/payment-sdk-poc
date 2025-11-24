import React, { useState } from 'react';
import PaymentSDK from './components/PaymentSDK';
import './DemoApp.css';

/**
 * Demo Application for Testing Payment SDK
 * This is for development/testing purposes only
 */
function DemoApp() {
  const [amount, setAmount] = useState(5000); // $50.00
  const [currency] = useState('USD');
  const [customerName, setCustomerName] = useState('John Doe');
  const [customerEmail, setCustomerEmail] = useState('john.doe@example.com');
  const [orderId] = useState(`TEST-${Date.now()}`);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleTokenReceived = (tokenData) => {
    console.log('✅ Token received:', tokenData);
    setPaymentResult({
      success: true,
      message: 'Payment token created successfully!',
      data: tokenData
    });
    // Reset after 5 seconds
    setTimeout(() => {
      setPaymentResult(null);
      setShowForm(false);
    }, 5000);
  };

  const handlePaymentError = (error) => {
    console.error('❌ Payment error:', error);
    setPaymentResult({
      success: false,
      message: error,
      data: null
    });
  };

  const handleStartPayment = () => {
    setPaymentResult(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setPaymentResult(null);
  };

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(cents / 100);
  };

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1>💳 Payment SDK Demo</h1>
        <p className="subtitle">Test the Payment SDK integration</p>
      </header>

      <div className="demo-container">
        {/* Configuration Panel */}
        <div className="config-panel">
          <h2>Payment Configuration</h2>
          
          <div className="form-group">
            <label>Amount (in cents)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="100"
              step="100"
            />
            <small>Display: {formatAmount(amount)}</small>
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Order ID</label>
            <input
              type="text"
              value={orderId}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <input
              type="text"
              value={currency}
              disabled
            />
          </div>

          {!showForm && (
            <button 
              className="start-payment-btn"
              onClick={handleStartPayment}
            >
              Start Payment Test
            </button>
          )}
        </div>

        {/* Payment SDK Panel */}
        <div className="payment-panel">
          {showForm ? (
            <>
              <h2>Payment Form</h2>
              <div className="payment-details">
                <p><strong>Amount:</strong> {formatAmount(amount)}</p>
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Order:</strong> {orderId}</p>
              </div>

              <PaymentSDK
                merchantId="merchant_demo_123"
                apiKey="sk_test_demo_key"
                amount={amount}
                currency={currency}
                customer={{
                  name: customerName,
                  email: customerEmail
                }}
                orderId={orderId}
                description={`Test payment - ${formatAmount(amount)}`}
                onTokenReceived={handleTokenReceived}
                onPaymentError={handlePaymentError}
                onClose={handleClose}
              />

              <button 
                className="cancel-btn"
                onClick={handleClose}
              >
                Cancel Test
              </button>
            </>
          ) : (
            <div className="placeholder">
              <h2>Payment SDK</h2>
              <p>Click "Start Payment Test" to begin</p>
              <div className="test-cards-info">
                <h3>Test Card Numbers</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Card</th>
                      <th>Number</th>
                      <th>CVV</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Visa</td>
                      <td>4111 1111 1111 1111</td>
                      <td>123</td>
                    </tr>
                    <tr>
                      <td>Mastercard</td>
                      <td>5555 5555 5555 4444</td>
                      <td>123</td>
                    </tr>
                    <tr>
                      <td>Amex</td>
                      <td>3782 822463 10005</td>
                      <td>1234</td>
                    </tr>
                  </tbody>
                </table>
                <p className="note">Use any future expiry date</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Panel */}
      {paymentResult && (
        <div className={`result-panel ${paymentResult.success ? 'success' : 'error'}`}>
          <div className="result-content">
            <span className="result-icon">
              {paymentResult.success ? '✅' : '❌'}
            </span>
            <div className="result-text">
              <h3>{paymentResult.success ? 'Success!' : 'Error'}</h3>
              <p>{paymentResult.message}</p>
              {paymentResult.success && paymentResult.data && (
                <pre className="result-data">
                  {JSON.stringify(paymentResult.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <footer className="demo-footer">
        <div className="info-box">
          <h3>ℹ️ API Configuration</h3>
          <p>Configure API endpoint in <code>src/config.js</code></p>
          <p>Current: Check browser console for API calls</p>
        </div>
        <div className="info-box">
          <h3>📝 Notes</h3>
          <ul>
            <li>This is a demo/test environment</li>
            <li>Use test card numbers above</li>
            <li>Check browser console for logs</li>
            <li>Backend API must be running</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default DemoApp;

