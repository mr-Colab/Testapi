/**
 * Configuration file for API authentication
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config.js' (don't commit config.js)
 * 2. Replace 'YOUR_JWT_TOKEN_HERE' with your actual JWT token
 * 3. Save the file
 * 
 * HOW TO GET YOUR JWT TOKEN:
 * 1. Open https://asitha.top in your browser
 * 2. Log in to your account
 * 3. Open Developer Tools (F12 or Right-click > Inspect)
 * 4. Go to: Application tab > Storage > Cookies > https://asitha.top
 * 5. Find the cookie named "jwt"
 * 6. Copy the entire value of the jwt cookie
 * 7. Paste it below, replacing YOUR_JWT_TOKEN_HERE
 */

module.exports = {
  jwt: 'YOUR_JWT_TOKEN_HERE',
  
  // API endpoint - you shouldn't need to change this
  apiEndpoint: 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post'
};
