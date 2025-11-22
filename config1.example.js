/**
 * Configuration file for second JWT token
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config1.js'
 * 2. Add your second account's JWT token below
 * 3. Create config2.js, config3.js, etc. for more accounts
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
