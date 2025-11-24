import * as axios from "axios";


import { API_BASE_URL, API_TIMEOUT } from '../config';

const apiClient = axios.default.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})


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
  return { ...HARDCODED_TEST_SESSIONS, ...stored };
}

/**
 * Create a payment session
 * @param {Object} customerDetails - Customer and payment details
 * @returns {Promise<Object>} Payment session object
 */
export async function createPaymentSession(customerDetails) {
  const payload = {
  "orderId": customerDetails.orderId,
  "amount": customerDetails.amount,
  "currency": customerDetails.currency || "AUD",
  "customer": {
    "name": customerDetails.customer?.name || "",
    "email": customerDetails.customer?.email || "",
    "phone": customerDetails.customer?.phone
  }
}

  try {
    const response = await apiClient.post('/payment/session/create', payload);
    const session = response.data;
    return session;
  } catch (error) {
    console.error('Payment session creation error:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to create payment session');
  }
}

/**
 * Get payment session details
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 */
export async function getPaymentSession(sessionId) {
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
export async function createPaymentToken(sessionId, paymentData) {
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
}

  try {
    const response = await apiClient.post('/payment/authenticate', payload);
    const result = response.data.result.resultCode;
    if (result === 'Success') {
      return true;
    }
    throw new Error('Payment authentication failed');
  } catch (error) {
    console.error('Payment token creation error:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to create payment token');
  }
}

/**
 * Get test session (for development/testing)
 * @param {string} sessionId - Session ID
 * @returns {Object} Test session
 */
export function getTestSession(sessionId = 'test-session-1') {
  return HARDCODED_TEST_SESSIONS[sessionId] || HARDCODED_TEST_SESSIONS['test-session-1'];
}

/**
 * Clear all sessions (for testing/development)
 */
export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
}
