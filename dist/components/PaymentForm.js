"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PaymentForm;
var _react = _interopRequireWildcard(require("react"));
var _paymentApi = require("../api/paymentApi");
require("./PaymentForm.css");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function PaymentForm(_ref) {
  var _session$customer;
  let {
    sessionId,
    onTokenCreated,
    onPaymentError
  } = _ref;
  const [session, setSession] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(true);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [formData, setFormData] = (0, _react.useState)({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    zipCode: ''
  });
  const [errors, setErrors] = (0, _react.useState)({});
  (0, _react.useEffect)(() => {
    loadSession();
  }, [sessionId]);
  const loadSession = async () => {
    try {
      const sessionData = await (0, _paymentApi.getPaymentSession)(sessionId);
      setSession(sessionData);
      setLoading(false);
    } catch (error) {
      // Try to use a test session as fallback for development
      try {
        const {
          getTestSession
        } = await Promise.resolve().then(() => _interopRequireWildcard(require('../api/paymentApi')));
        const testSession = getTestSession();
        setSession(testSession);
        setLoading(false);
      } catch (fallbackError) {
        setLoading(false);
      }
    }
  };
  const formatCardNumber = value => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
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
  const formatExpiryDate = value => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
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
    setFormData(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => _objectSpread(_objectSpread({}, prev), {}, {
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
      } else if (parseInt(year) < currentYear || parseInt(year) === currentYear && parseInt(month) < currentMonth) {
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
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setProcessing(true);
    try {
      // Send card data to backend and get token
      const result = await (0, _paymentApi.createPaymentToken)(sessionId, formData);
      if (result) {
        // Token created successfully - send to parent via callback
        if (onTokenCreated) {
          onTokenCreated({
            status: 'success'
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-form-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "loading-spinner"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "spinner"
    }), /*#__PURE__*/_react.default.createElement("p", null, "Loading payment details...")));
  }
  if (!session) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-form-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "error-message"
    }, /*#__PURE__*/_react.default.createElement("p", null, "Unable to load payment session. Please try again.")));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "payment-form-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "payment-summary"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/_react.default.createElement("span", null, "Order ID:"), /*#__PURE__*/_react.default.createElement("span", null, session.orderId)), /*#__PURE__*/_react.default.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/_react.default.createElement("span", null, "Name:"), /*#__PURE__*/_react.default.createElement("span", null, ((_session$customer = session.customer) === null || _session$customer === void 0 ? void 0 : _session$customer.name) || 'N/A')), /*#__PURE__*/_react.default.createElement("div", {
    className: "summary-row total"
  }, /*#__PURE__*/_react.default.createElement("span", null, "Total Amount:"), /*#__PURE__*/_react.default.createElement("span", {
    className: "amount"
  }, formatAmount(session.amount, session.currency)))), /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit,
    className: "payment-form"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "cardNumber"
  }, "Card Number"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    id: "cardNumber",
    name: "cardNumber",
    value: formData.cardNumber,
    onChange: handleInputChange,
    placeholder: "1234 5678 9012 3456",
    maxLength: "19",
    className: errors.cardNumber ? 'error' : ''
  }), errors.cardNumber && /*#__PURE__*/_react.default.createElement("span", {
    className: "error-text"
  }, errors.cardNumber)), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "expiryDate"
  }, "Expiry Date"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    id: "expiryDate",
    name: "expiryDate",
    value: formData.expiryDate,
    onChange: handleInputChange,
    placeholder: "MM/YY",
    maxLength: "5",
    className: errors.expiryDate ? 'error' : ''
  }), errors.expiryDate && /*#__PURE__*/_react.default.createElement("span", {
    className: "error-text"
  }, errors.expiryDate)), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "cvv"
  }, "CVV"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    id: "cvv",
    name: "cvv",
    value: formData.cvv,
    onChange: handleInputChange,
    placeholder: "123",
    maxLength: "4",
    className: errors.cvv ? 'error' : ''
  }), errors.cvv && /*#__PURE__*/_react.default.createElement("span", {
    className: "error-text"
  }, errors.cvv))), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "cardholderName"
  }, "Cardholder Name"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    id: "cardholderName",
    name: "cardholderName",
    value: formData.cardholderName,
    onChange: handleInputChange,
    placeholder: "John Doe",
    className: errors.cardholderName ? 'error' : ''
  }), errors.cardholderName && /*#__PURE__*/_react.default.createElement("span", {
    className: "error-text"
  }, errors.cardholderName)), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "zipCode"
  }, "ZIP Code"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    id: "zipCode",
    name: "zipCode",
    value: formData.zipCode,
    onChange: handleInputChange,
    placeholder: "12345",
    maxLength: "10",
    className: errors.zipCode ? 'error' : ''
  }), errors.zipCode && /*#__PURE__*/_react.default.createElement("span", {
    className: "error-text"
  }, errors.zipCode)), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit",
    className: "submit-button",
    disabled: processing
  }, processing ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    className: "button-spinner"
  }), "Creating Token...") : "Submit Payment Details")), /*#__PURE__*/_react.default.createElement("div", {
    className: "payment-footer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "security-badges"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "badge"
  }, "\uD83D\uDD12 Secure"), /*#__PURE__*/_react.default.createElement("span", {
    className: "badge"
  }, "\uD83D\uDD10 Encrypted")), /*#__PURE__*/_react.default.createElement("p", {
    className: "footer-text"
  }, "Your payment information is secure and encrypted")));
}