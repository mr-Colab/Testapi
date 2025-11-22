/**
 * Configuration file for third JWT token
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config2.js'
 * 2. Add your third account's JWT token below
 * 
 * ⚠️ WARNING: Using multiple accounts may violate Terms of Service
 * Only use this if:
 * - You have legitimate multiple accounts
 * - Each account belongs to a different authorized user
 * - You're coordinating work across team members
 */

const { JWT_TOKEN_PLACEHOLDER, DEFAULT_API_ENDPOINT } = require('./constants');

module.exports = {
  jwt: JWT_TOKEN_PLACEHOLDER,
  apiEndpoint: DEFAULT_API_ENDPOINT
};
