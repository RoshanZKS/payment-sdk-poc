"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PaymentIframe;
var _react = _interopRequireWildcard(require("react"));
require("./PaymentIframe.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function PaymentIframe(_ref) {
  let {
    sessionId,
    onClose,
    onTokenReceived,
    onPaymentError
  } = _ref;
  const iframeRef = (0, _react.useRef)(null);
  const [tokenResult, setTokenResult] = (0, _react.useState)(null);

  // Listen for messages from iframe
  (0, _react.useEffect)(() => {
    const handleMessage = event => {
      // In production, validate event.origin for security
      if (event.data && event.data.type === 'TOKEN_CREATED') {
        const tokenData = {
          token: event.data.token,
          status: event.data.status
        };
        setTokenResult(_objectSpread({
          success: true
        }, tokenData));
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
  (0, _react.useEffect)(() => {
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
  // The iframe loads /index.html with payment mode hash
  const iframeUrl = "/index.html#payment?sessionId=".concat(sessionId);
  if (tokenResult) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-iframe-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "payment-result"
    }, tokenResult.success ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "success-icon"
    }, "\u2713"), /*#__PURE__*/_react.default.createElement("h2", null, "Token Created!"), /*#__PURE__*/_react.default.createElement("p", {
      className: "success-message"
    }, "Payment token has been created successfully"), /*#__PURE__*/_react.default.createElement("button", {
      onClick: handleClose,
      className: "close-button"
    }, "Close")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "error-icon"
    }, "\u2715"), /*#__PURE__*/_react.default.createElement("h2", null, "Token Creation Failed"), /*#__PURE__*/_react.default.createElement("p", {
      className: "error-message"
    }, tokenResult.error), /*#__PURE__*/_react.default.createElement("button", {
      onClick: () => setTokenResult(null),
      className: "retry-button"
    }, "Try Again"), /*#__PURE__*/_react.default.createElement("button", {
      onClick: handleClose,
      className: "close-button secondary"
    }, "Close"))));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "payment-iframe-container"
  }, /*#__PURE__*/_react.default.createElement("iframe", {
    ref: iframeRef,
    src: iframeUrl,
    style: {
      width: "100%",
      height: "100%",
      border: "0",
      borderRadius: "8px"
    },
    title: "Secure Payment Form"
  }));
}