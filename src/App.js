import React, { useState, useEffect, useMemo } from "react";
import PaymentSDK from "./components/PaymentSDK";
import PaymentFormPage from "./components/PaymentFormPage";
import ShoppingCart from "./components/ShoppingCart";
import "./App.css";

const demoProducts = [
  {
    id: "premium_support",
    name: "Economy Class",
    description: "24/7 access to our concierge team and dedicated Slack channel.",
    category: "Support add-on",
    price: 150000,
  },
  {
    id: "priority_processing",
    name: "Premium Economy",
    description: "Expedite every payout and transaction review in real-time.",
    category: "Payment ops",
    price: 250000,
  },
  {
    id: "fraud_insights",
    name: "Buisness Class",
    description: "AI powered risk monitoring with detailed anomaly reports.",
    category: "Risk toolkit",
    price: 1050000,
  },
];

function App() {
  const [paymentResult, setPaymentResult] = useState(null);
  const [isIframeMode, setIsIframeMode] = useState(false);
  const [cart, setCart] = useState(() =>
    demoProducts.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [orderId] = useState(() => `ORD-${Date.now()}`);
  const currencyCode = "USD";

  // Check if we're in iframe mode (payment form page)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('payment')) {
      setIsIframeMode(true);
    }
  }, []);

  const totalAmount = useMemo(
    () =>
      demoProducts.reduce(
        (sum, product) => sum + product.price * (cart[product.id] || 0),
        0
      ),
    [cart]
  );

  const hasItemsInCart = totalAmount > 0;

  const selectedProducts = useMemo(
    () => demoProducts.filter((product) => (cart[product.id] || 0) > 0),
    [cart]
  );

  const paymentDescription = selectedProducts.length
    ? `Cart: ${selectedProducts
        .map((product) => `${cart[product.id]}x ${product.name}`)
        .join(", ")}`
    : "Demo shopping cart checkout";

  const formatCurrency = (valueInCents) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
      }).format(valueInCents / 100);
    } catch {
      return `${currencyCode} ${(valueInCents / 100).toFixed(2)}`;
    }
  };

  const handleIncrement = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setCart((prev) => {
      const nextValue = Math.max(0, (prev[productId] || 0) - 1);
      return { ...prev, [productId]: nextValue };
    });
  };

  const handleContinueToPayment = () => {
    if (hasItemsInCart) {
      setIsPaymentStep(true);
    }
  };

  const handleBackToCart = () => {
    setIsPaymentStep(false);
  };

  // Handle token received from PaymentSDK
  const handleTokenReceived = (tokenData) => {
    console.log("Token received from PaymentSDK:", tokenData);
    setPaymentResult({
      success: true,
      token: tokenData.token,
      tokenId: tokenData.tokenId,
      paymentIntentId: tokenData.paymentIntentId,
      cardToken: tokenData.cardToken,
      cardLast4: tokenData.cardLast4,
      cardholderName: tokenData.cardholderName
    });

    // Here merchant would send token to their backend to finalize payment
    // Example: await merchantBackend.finalizePayment(tokenData.token);
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setPaymentResult({
      success: false,
      error: error
    });
  };

  const handleClose = () => {
    setPaymentResult(null);
    setIsPaymentStep(false);
  };

  // If in iframe mode, render the payment form page
  if (isIframeMode) {
    return <PaymentFormPage />;
  }

  return (
    <div className="App">
      {paymentResult && !paymentResult.success && (
        <div className="error-banner">
          <p>✕ Payment Error: {paymentResult.error}</p>
        </div>
      )}


      <div className="demo-layout">
        {!isPaymentStep ? (
          <ShoppingCart
            products={demoProducts}
            cart={cart}
            currency={currencyCode}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onContinue={handleContinueToPayment}
            totalAmount={totalAmount}
            continueDisabled={!hasItemsInCart}
          />
        ) : (
          <div className="payment-step-card">
            <div className="payment-step-header">
              <div>
                <p className="payment-step-label">Ready to pay</p>
                <h3>{selectedProducts.length} product(s) in cart</h3>
              </div>
              <div className="payment-step-total">
                <p>Total due</p>
                <h2>{formatCurrency(totalAmount)}</h2>
              </div>
            </div>

            <p className="payment-step-description">{paymentDescription}</p>

            <div className="payment-step-actions">
              {/* <button
                type="button"
                className="edit-cart-button"
                onClick={handleBackToCart}
              >
                ← Edit cart
              </button> */}
            </div>

            <PaymentSDK
              merchantId="merchant_demo_123"
              apiKey="sk_test_demo_key_abc123"
              amount={totalAmount}
              currency={currencyCode}
              customer={{
                name: "Demo Customer",
                email: "demo@example.com"
              }}
              orderId={orderId}
              description={paymentDescription}
              onTokenReceived={handleTokenReceived}
              onPaymentError={handlePaymentError}
              onClose={handleClose}
            />
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
