/**
 * SDK Configuration
 * 
 * Merchants can configure these settings based on their environment
 */

// Default API Base URL
// This should be updated to point to your payment gateway API
export const API_BASE_URL = process.env.REACT_APP_PAYMENT_API_URL || 'http://localhost:8080/api/v1';

// API Timeout (in milliseconds)
export const API_TIMEOUT = 10000;

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Development mode settings
export const DEV_MODE = {
  // Enable test sessions in development
  enableTestSessions: !IS_PRODUCTION,
  // Show debug logs
  enableDebugLogs: !IS_PRODUCTION,
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  IS_PRODUCTION,
  DEV_MODE,
};

