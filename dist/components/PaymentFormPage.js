"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PaymentFormPage;
var _react = _interopRequireWildcard(require("react"));
var _PaymentForm = _interopRequireDefault(require("./PaymentForm"));
require("./PaymentFormPage.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// This component is designed to be rendered inside an iframe
// It reads the sessionId from URL parameters
function PaymentFormPage() {
  const [sessionId, setSessionId] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
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
  (0, _react.useEffect)(() => {
    const handleMessage = event => {
      // In production, you should validate event.origin for security
      if (event.data && event.data.type === 'PAYMENT_SESSION_ID') {
        setSessionId(event.data.sessionId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  const handleTokenCreated = tokenData => {
    // Send token to parent window via postMessage
    if (window.parent) {
      window.parent.postMessage({
        type: 'TOKEN_CREATED',
        status: tokenData.status
      }, '*'); // In production, specify the exact origin
    }
  };
  const handlePaymentError = error => {
    // Send message to parent window
    if (window.parent) {
      window.parent.postMessage({
        type: 'PAYMENT_ERROR',
        error: error
      }, '*'); // In production, specify the exact origin
    }
  };
  if (!sessionId) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-form-page"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "loading-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "spinner"
    }), /*#__PURE__*/_react.default.createElement("p", null, "Loading payment session...")));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "payment-form-page"
  }, /*#__PURE__*/_react.default.createElement(_PaymentForm.default, {
    sessionId: sessionId,
    onTokenCreated: handleTokenCreated,
    onPaymentError: handlePaymentError
  }));
}