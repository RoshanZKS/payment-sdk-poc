import React, { useState, useEffect } from 'react';
import { getPaymentSession, createPaymentToken } from '../api/paymentApi';
import './PaymentForm.css';

export default function PaymentForm({ sessionId, onTokenCreated, onPaymentError }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const sessionData = await getPaymentSession(sessionId);
      setSession(sessionData);
      setLoading(false);
    } catch (error) {
      // Try to use a test session as fallback for development
      try {
        const { getTestSession } = await import('../api/paymentApi');
        const testSession = getTestSession();
        setSession(testSession);
        setLoading(false);
      } catch (fallbackError) {
        setLoading(false);
      }
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (name === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').substring(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!formData.zipCode || formData.zipCode.length < 5) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Send card data to backend and get token
      const result = await createPaymentToken(sessionId, formData);
      
      if (result) {
        // Token created successfully - send to parent via callback
        if (onTokenCreated) {
          onTokenCreated({
            status: 'success',
          });
        }
      } else {
        if (onPaymentError) {
          onPaymentError(result.error || 'Failed to create token');
        }
      }
    } catch (error) {
      if (onPaymentError) {
        onPaymentError(error.message || 'An error occurred while creating token');
      }
    } finally {
      setProcessing(false);
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="payment-form-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="payment-form-container">
        <div className="error-message">
          <p>Unable to load payment session. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <div className="payment-summary">
        <div className="summary-row">
          <span>Order ID:</span>
          <span>{session.orderId}</span>
        </div>
        <div className="summary-row">
          <span>Name:</span>
          <span>{session.customer?.name || 'N/A'}</span>
        </div>
        {/* <div className="summary-row">
          <span>Email:</span>
          <span>{session.customer?.email || 'N/A'}</span>
        </div> */}
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span className="amount">{formatAmount(session.amount, session.currency)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              className={errors.cvv ? 'error' : ''}
            />
            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleInputChange}
            placeholder="John Doe"
            className={errors.cardholderName ? 'error' : ''}
          />
          {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="12345"
            maxLength="10"
            className={errors.zipCode ? 'error' : ''}
          />
          {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={processing}
        >
          {processing ? (
            <>
              <span className="button-spinner"></span>
              Creating Token...
            </>
          ) : (
            `Submit Payment Details`
          )}
        </button>
      </form>

      <div className="payment-footer">
        <div className="security-badges">
          <span className="badge">🔒 Secure</span>
          <span className="badge">🔐 Encrypted</span>
        </div>
        <p className="footer-text">Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
}

