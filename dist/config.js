"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.IS_PRODUCTION = exports.DEV_MODE = exports.API_TIMEOUT = exports.API_BASE_URL = void 0;
/**
 * SDK Configuration
 * 
 * Merchants can configure these settings based on their environment
 */

// Default API Base URL
// This should be updated to point to your payment gateway API
const API_BASE_URL = exports.API_BASE_URL = process.env.REACT_APP_PAYMENT_API_URL || 'http://localhost:8080/api/v1';

// API Timeout (in milliseconds)
const API_TIMEOUT = exports.API_TIMEOUT = 10000;

// Environment
const IS_PRODUCTION = exports.IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Development mode settings
const DEV_MODE = exports.DEV_MODE = {
  // Enable test sessions in development
  enableTestSessions: !IS_PRODUCTION,
  // Show debug logs
  enableDebugLogs: !IS_PRODUCTION
};
var _default = exports.default = {
  API_BASE_URL,
  API_TIMEOUT,
  IS_PRODUCTION,
  DEV_MODE
};