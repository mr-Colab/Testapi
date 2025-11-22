/**
 * API module with configurable authentication
 * Use this version if you want to provide your own JWT token
 */

const fs = require('fs');
const path = require('path');

/**
 * Load configuration from config.js if it exists
 */
function loadConfig() {
  const configPath = path.join(__dirname, 'config.js');
  
  if (fs.existsSync(configPath)) {
    try {
      return require('./config');
    } catch (error) {
      console.error('Error loading config.js:', error.message);
      console.log('Please check your config.js file format.');
      return null;
    }
  } else {
    console.log('⚠️  config.js not found!');
    console.log('To use this API with authentication:');
    console.log('1. Copy config.example.js to config.js');
    console.log('2. Add your JWT token to config.js');
    console.log('3. Run this script again');
    return null;
  }
}

/**
 * Sends a reaction to a channel post with configurable JWT token
 * @param {string} channelLink - The link to the channel post
 * @param {string} emoji - The emoji reaction to send
 * @param {string} customJwt - Optional: custom JWT token to use instead of config
 * @returns {Promise<Object>} The API response
 */
async function sendChannelReaction(channelLink, emoji, customJwt = null) {
  const config = loadConfig();
  
  const { JWT_TOKEN_PLACEHOLDER } = require('./constants');
  
  let jwtToken;
  if (customJwt) {
    jwtToken = customJwt;
  } else if (config && config.jwt && config.jwt !== JWT_TOKEN_PLACEHOLDER) {
    jwtToken = config.jwt;
  } else {
    throw new Error('No valid JWT token provided. Please configure config.js or pass a JWT token.');
  }
  
  const url = config?.apiEndpoint || "https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post";
  
  const headers = {
    'authority': 'foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'ar-AE,ar;q=0.9,fr-MA;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'content-type': 'application/json',
    'cookie': `jwt=${jwtToken}`,
    'origin': 'https://asitha.top',
    'referer': 'https://asitha.top/',
    'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Linux; Android 12; SM-A217F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36'
  };
  
  const data = {
    "post_link": channelLink,
    "reacts": emoji
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending channel reaction:', error.message);
    throw error;
  }
}

module.exports = { sendChannelReaction, loadConfig };
