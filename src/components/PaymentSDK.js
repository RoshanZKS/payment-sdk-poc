import React, { useState, useEffect, useCallback } from "react";
import { createPaymentSession } from "../api/paymentApi";
import PaymentIframe from "./PaymentIframe";
import "./PaymentSDK.css";

/**
 * PaymentSDK Component
 * 
 * This is the main component that merchants will import and use in their applications.
 * 
 * @param {Object} props - Component props
 * @param {string} props.merchantId - Merchant's unique identifier
 * @param {string} props.apiKey - Merchant's API key for authentication
 * @param {number} props.amount - Payment amount in cents (e.g., 5000 for $50.00)
 * @param {string} props.currency - Currency code (e.g., "USD", "EUR")
 * @param {Object} props.customer - Customer information
 * @param {string} props.customer.name - Customer name
 * @param {string} props.customer.email - Customer email
 * @param {string} props.orderId - Optional order ID
 * @param {string} props.description - Optional payment description
 * @param {Function} props.onTokenReceived - Callback when payment token is created
 * @param {Function} props.onPaymentError - Callback when payment error occurs
 * @param {Function} props.onClose - Callback when payment form is closed
 * @param {boolean} props.autoOpen - Whether to automatically open payment form (default: false)
 * @param {string} props.className - Additional CSS classes
 */

export default function PaymentSDK({
  amount,
  currency = "USD",
  customer = {},
  orderId,
  description,
  onTokenReceived,
  onPaymentError,
  onClose,
  autoOpen = false,
  className = "",
  merchantId,
  apiKey,
}) {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate required props
  useEffect(() => {
    if (!merchantId) {
      setError("merchantId is required");
    } else if (!apiKey) {
      setError("apiKey is required");
    } else if (!amount || amount <= 0) {
      setError("amount must be a positive number");
    } else {
      setError(null);
    }
  }, [merchantId, apiKey, amount]);

  const handleStartPayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create payment session with merchant details
      const session = await createPaymentSession({
        customer,
        amount,
        currency,
        orderId,
      });
      setSessionId(session.sessionId);
    } catch (err) {
      const errorMessage = err.message || "Failed to initialize payment. Please try again.";
      setError(errorMessage);
      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [currency, customer, orderId]);



  const handleClose = () => {
    setSessionId(null);
    setError(null);
    if (onClose) {
      onClose();
    }
  };

  const handleTokenReceived = (tokenData) => {
    if (onTokenReceived) {
      onTokenReceived(tokenData);
    }
    // Optionally close the iframe after receiving token
    // setSessionId(null);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    if (onPaymentError) {
      onPaymentError(errorMessage);
    }
  };

  // If session is created, show the payment iframe
  if (sessionId) {
    return (
      <PaymentIframe
        sessionId={sessionId}
        onClose={handleClose}
        onTokenReceived={handleTokenReceived}
        onPaymentError={handlePaymentError}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`payment-sdk-container ${className}`}>
        <div className="payment-sdk-error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // If autoOpen is true, show loading state
  if (autoOpen && loading) {
    return (
      <div className={`payment-sdk-container ${className}`}>
        <div className="payment-sdk-loading">
          <div className="spinner"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  // Default: show button to start payment (unless autoOpen is true)
  if (!autoOpen) {
    return (
      <div className={`payment-sdk-container ${className}`}>
        <button
          onClick={handleStartPayment}
          className="payment-sdk-button"
          disabled={loading || !!error}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Initializing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    );
  }

  return null;
}

