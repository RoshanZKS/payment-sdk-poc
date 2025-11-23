import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/v1';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // <-- 10 seconds
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

// Create a payment session (mock)
// Accepts either (amount, currency) for backward compatibility or merchantDetails object
export async function createPaymentSession(customerDetails) {
  // Simulate API delay
  console.log('Creating payment session with details:', customerDetails);

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
    console.log('API response:', response);
    const session = response.data;
    return session;
  } catch (e) {
    // Ignore
    console.error('payment session error', e);
  }
  
  
  return session;
}

// Get payment session details
export async function getPaymentSession(sessionId) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allSessions = getAllSessions();
  
  if (allSessions[sessionId]) {
    console.log('Found session:', sessionId, allSessions[sessionId]);
    return allSessions[sessionId];
  }
  
  console.error('Session not found:', sessionId);
  console.log('Available sessions:', Object.keys(allSessions));
  
  // Return a default test session if not found (for testing)
  console.warn('Session not found, returning default test session');
  return HARDCODED_TEST_SESSIONS['test-session-1'];
}

// Create payment token from card data (mock)
// This sends card data to backend and returns a token
export async function createPaymentToken(sessionId, paymentData) {
  // Simulate API delay
  
  // Extract card number (remove spaces)
  const cardNumber = paymentData.cardNumber ? paymentData.cardNumber.replace(/\s/g, '') : '';
  const cardLast4 = cardNumber.slice(-4);
  
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
    console.log('API response:', response);
    const result = response.data.result.resultCode;
    if (result === 'Success') {
      return true
    }
  } catch (e) {
    console.error('create payment token error', e);
  }
  return
}

// Helper function to get test session (for easy testing)
export function getTestSession(sessionId = 'test-session-1') {
  return HARDCODED_TEST_SESSIONS[sessionId] || HARDCODED_TEST_SESSIONS['test-session-1'];
}

// Clear all sessions (for testing)
export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('All sessions cleared');
}
