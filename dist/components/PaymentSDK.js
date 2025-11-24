"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PaymentSDK;
var _react = _interopRequireWildcard(require("react"));
var _paymentApi = require("../api/paymentApi");
var _PaymentIframe = _interopRequireDefault(require("./PaymentIframe"));
require("./PaymentSDK.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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

function PaymentSDK(_ref) {
  let {
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
    apiKey
  } = _ref;
  const [sessionId, setSessionId] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);

  // Validate required props
  (0, _react.useEffect)(() => {
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
  const handleStartPayment = (0, _react.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      // Create payment session with merchant details
      const session = await (0, _paymentApi.createPaymentSession)({
        customer,
        amount,
        currency,
        orderId
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
  const handleTokenReceived = tokenData => {
    if (onTokenReceived) {
      onTokenReceived(tokenData);
    }
    // Optionally close the iframe after receiving token
    // setSessionId(null);
  };
  const handlePaymentError = errorMessage => {
    setError(errorMessage);
    if (onPaymentError) {
      onPaymentError(errorMessage);
    }
  };

  // If session is created, show the payment iframe
  if (sessionId) {
    return /*#__PURE__*/_react.default.createElement(_PaymentIframe.default, {
      sessionId: sessionId,
      onClose: handleClose,
      onTokenReceived: handleTokenReceived,
      onPaymentError: handlePaymentError
    });
  }

  // Show error state
  if (error) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-sdk-container ".concat(className)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-sdk-error"
    }, /*#__PURE__*/_react.default.createElement("p", null, "Error: ", error)));
  }

  // If autoOpen is true, show loading state
  if (autoOpen && loading) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-sdk-container ".concat(className)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-sdk-loading"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "spinner"
    }), /*#__PURE__*/_react.default.createElement("p", null, "Initializing payment...")));
  }

  // Default: show button to start payment (unless autoOpen is true)
  if (!autoOpen) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-sdk-container ".concat(className)
    }, /*#__PURE__*/_react.default.createElement("button", {
      onClick: handleStartPayment,
      className: "payment-sdk-button",
      disabled: loading || !!error
    }, loading ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
      className: "button-spinner"
    }), "Initializing...") : "Pay Now"));
  }
  return null;
}