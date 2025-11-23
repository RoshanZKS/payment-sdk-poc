import React, { useState, useEffect, useRef } from 'react';
import './PaymentIframe.css';

export default function PaymentIframe({ sessionId, onClose, onTokenReceived, onPaymentError }) {
  const iframeRef = useRef(null);
  const [tokenResult, setTokenResult] = useState(null);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // In production, validate event.origin for security
      console.log('Received message from iframe:', event);
      if (event.data && event.data.type === 'TOKEN_CREATED') {
        const tokenData = {
          token: event.data.token,
          status: event.data.status,
        };
        setTokenResult({
          success: true,
          ...tokenData
        });
        if (onTokenReceived) {
          onTokenReceived(tokenData);
        }
      } else if (event.data && event.data.type === 'PAYMENT_ERROR') {
        setTokenResult({
          success: false,
          error: event.data.error
        });
        if (onPaymentError) {
          onPaymentError(event.data.error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onTokenReceived, onPaymentError]);

  // Send sessionId to iframe when it loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && sessionId) {
      const handleLoad = () => {
        // Send sessionId to iframe via postMessage
        iframe.contentWindow.postMessage({
          type: 'PAYMENT_SESSION_ID',
          sessionId: sessionId
        }, '*'); // In production, specify the exact origin
      };

      iframe.addEventListener('load', handleLoad);
      
      // If iframe is already loaded, send immediately
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        handleLoad();
      }

      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [sessionId]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Create iframe URL - using hash to pass sessionId
  // The iframe loads /index.html with payment mode hash-
  const iframeUrl = `/index.html#payment?sessionId=${sessionId}`;
  console.log('token result:', tokenResult);
  if (tokenResult) {
    return (
      <div className="payment-iframe-container">
        <div className="payment-result">
          {/* {tokenResult.success ? (
            <>
              <div className="success-icon">✓</div>
              <h2>Token Created!</h2>
              <p className="success-message">Payment token has been created successfully</p>
              
              <button onClick={handleClose} className="close-button">
                Close
              </button>
            </>
          ) : (
            <>
              <div className="error-icon">✕</div>
              <h2>Token Creation Failed</h2>
              <p className="error-message">{tokenResult.error}</p>
              <button onClick={() => setTokenResult(null)} className="retry-button">
                Try Again
              </button>
              <button onClick={handleClose} className="close-button secondary">
                Close
              </button>
            </>
          )} */}
          <div className="success-icon">✓</div>
              <h2>SUCCESS</h2>
              <p className="success-message">Payment token has been created successfully</p>
              
              <button onClick={handleClose} className="close-button">
                Close
              </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-iframe-container">
      {/* {onClose && (
        <button className="close-iframe-button" onClick={handleClose} aria-label="Close">
          ×
        </button>
      )} */}
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "8px",
        }}
        title="Secure Payment Form"
      />
    </div>
  );
}
