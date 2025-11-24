"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearAllSessions = clearAllSessions;
exports.createPaymentSession = createPaymentSession;
exports.createPaymentToken = createPaymentToken;
exports.getPaymentSession = getPaymentSession;
exports.getTestSession = getTestSession;
var axiosModule = _interopRequireWildcard(require("axios"));
var _config = require("../config");
var _axiosModule$default, _axiosModule$default2; // import axios from "axios";
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let axiosInstance;
if (typeof ((_axiosModule$default = axiosModule.default) === null || _axiosModule$default === void 0 ? void 0 : _axiosModule$default.create) === 'function') {
  axiosInstance = axiosModule.default;
} else if (typeof axiosModule.create === 'function') {
  axiosInstance = axiosModule;
} else if (typeof ((_axiosModule$default2 = axiosModule.default) === null || _axiosModule$default2 === void 0 || (_axiosModule$default2 = _axiosModule$default2.default) === null || _axiosModule$default2 === void 0 ? void 0 : _axiosModule$default2.create) === 'function') {
  axiosInstance = axiosModule.default.default;
} else {
  // Fallback: try to find axios in the module
  axiosInstance = axiosModule.default || axiosModule;
}
const apiClient = axiosInstance.create({
  baseURL: _config.API_BASE_URL,
  timeout: _config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock payment API with sample JSON data
// This will be replaced with actual backend API calls later

// Hardcoded test sessions that are always available
const HARDCODED_TEST_SESSIONS = {
  'test-session-1': {
    sessionId: 'test-session-1',
    amount: 5000,
    currency: 'USD',
    merchantName: 'Test Merchant',
    orderId: 'ORD-TEST-001',
    description: 'Test Payment Transaction - $50.00',
    customer: {
      name: 'Test User',
      email: 'test@example.com'
    }
  },
  'test-session-2': {
    sessionId: 'test-session-2',
    amount: 2500,
    currency: 'USD',
    merchantName: 'Test Merchant',
    orderId: 'ORD-TEST-002',
    description: 'Test Payment Transaction - $25.00',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  },
  'test-session-3': {
    sessionId: 'test-session-3',
    amount: 10000,
    currency: 'USD',
    merchantName: 'Test Merchant',
    orderId: 'ORD-TEST-003',
    description: 'Test Payment Transaction - $100.00',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    }
  }
};

// Storage key for sessions
const STORAGE_KEY = 'payment_sdk_sessions';

// Get all sessions from storage
function getStoredSessions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
}

// Save sessions to storage
function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Get all sessions (hardcoded + stored)
function getAllSessions() {
  const stored = getStoredSessions();
  return _objectSpread(_objectSpread({}, HARDCODED_TEST_SESSIONS), stored);
}

/**
 * Create a payment session
 * @param {Object} customerDetails - Customer and payment details
 * @returns {Promise<Object>} Payment session object
 */
async function createPaymentSession(customerDetails) {
  var _customerDetails$cust, _customerDetails$cust2, _customerDetails$cust3;
  const payload = {
    "orderId": customerDetails.orderId,
    "amount": customerDetails.amount,
    "currency": customerDetails.currency || "AUD",
    "customer": {
      "name": ((_customerDetails$cust = customerDetails.customer) === null || _customerDetails$cust === void 0 ? void 0 : _customerDetails$cust.name) || "",
      "email": ((_customerDetails$cust2 = customerDetails.customer) === null || _customerDetails$cust2 === void 0 ? void 0 : _customerDetails$cust2.email) || "",
      "phone": (_customerDetails$cust3 = customerDetails.customer) === null || _customerDetails$cust3 === void 0 ? void 0 : _customerDetails$cust3.phone
    }
  };
  try {
    const response = await apiClient.post('/payment/session/create', payload);
    const session = response.data;
    return session;
  } catch (error) {
    var _error$response;
    console.error('Payment session creation error:', error.message);
    throw new Error(((_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Failed to create payment session');
  }
}

/**
 * Get payment session details
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 */
async function getPaymentSession(sessionId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const allSessions = getAllSessions();
  if (allSessions[sessionId]) {
    return allSessions[sessionId];
  }

  // Return a default test session if not found (for development/testing)
  return HARDCODED_TEST_SESSIONS['test-session-1'];
}

/**
 * Create payment token from card data
 * @param {string} sessionId - Session ID
 * @param {Object} paymentData - Payment form data
 * @returns {Promise<boolean>} Success status
 */
async function createPaymentToken(sessionId, paymentData) {
  const cardNumber = paymentData.cardNumber ? paymentData.cardNumber.replace(/\s/g, '') : '';
  const payload = {
    "recordLocator": "ABC123",
    "paymentDetail": {
      "paymentReference": "PAY123456",
      "formOfPayment": {
        "type": "CC",
        "fopCode": "VI"
      },
      "paymentCard": {
        "cardCode": "VI",
        "cardNumber": "411111######1111",
        "cardSecurityCode": "###",
        "expireDate": "122025",
        "cardHolderName": {
          "name": "TESTCARD",
          "firstName": "TESTCARD",
          "lastName": ""
        }
      },
      "amount": 499.00
    }
  };
  try {
    const response = await apiClient.post('/payment/authenticate', payload);
    const result = response.data.result.resultCode;
    if (result === 'Success') {
      return true;
    }
    throw new Error('Payment authentication failed');
  } catch (error) {
    var _error$response2;
    console.error('Payment token creation error:', error.message);
    throw new Error(((_error$response2 = error.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'Failed to create payment token');
  }
}

/**
 * Get test session (for development/testing)
 * @param {string} sessionId - Session ID
 * @returns {Object} Test session
 */
function getTestSession() {
  let sessionId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test-session-1';
  return HARDCODED_TEST_SESSIONS[sessionId] || HARDCODED_TEST_SESSIONS['test-session-1'];
}

/**
 * Clear all sessions (for testing/development)
 */
function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
}