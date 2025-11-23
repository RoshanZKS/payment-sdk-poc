import React, { useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';
import './PaymentFormPage.css';

// This component is designed to be rendered inside an iframe
// It reads the sessionId from URL parameters
export default function PaymentFormPage() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Get sessionId from URL hash (e.g., #payment?sessionId=xxx)
    const hash = window.location.hash;
    if (hash) {
      const hashParts = hash.split('?');
      if (hashParts.length > 1) {
        const params = new URLSearchParams(hashParts[1]);
        const id = params.get('sessionId');
        if (id) {
          setSessionId(id);
          return;
        }
      }
    }
    
    // Fallback: Get sessionId from URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('sessionId');
    if (id) {
      setSessionId(id);
    }
  }, []);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      // In production, you should validate event.origin for security
      if (event.data && event.data.type === 'PAYMENT_SESSION_ID') {
        setSessionId(event.data.sessionId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleTokenCreated = (tokenData) => {
    // Send token to parent window via postMessage
    if (window.parent) {
      window.parent.postMessage({
        type: 'TOKEN_CREATED',
        status: tokenData.status,
      }, '*'); // In production, specify the exact origin
    }
  };

  const handlePaymentError = (error) => {
    // Send message to parent window
    if (window.parent) {
      window.parent.postMessage({
        type: 'PAYMENT_ERROR',
        error: error
      }, '*'); // In production, specify the exact origin
    }
  };

  if (!sessionId) {
    return (
      <div className="payment-form-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form-page">
      <PaymentForm
        sessionId={sessionId}
        onTokenCreated={handleTokenCreated}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
}

