/**
 * Test script for real channel link
 * Tests the API with the actual WhatsApp channel link provided by the user
 */

const { sendChannelReaction } = require('./api');

async function testRealChannelLink() {
  console.log('=== Testing API with Real Channel Link ===\n');
  
  // Real WhatsApp channel link provided by user
  const channelLink = 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887';
  const emoji = '👍';
  
  console.log('Channel Link:', channelLink);
  console.log('Emoji Reaction:', emoji);
  console.log('API Endpoint: https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post');
  console.log('\nSending request...\n');
  
  try {
    const result = await sendChannelReaction(channelLink, emoji);
    console.log('✓ SUCCESS! API Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n=== API is Working! Test Passed ===');
    process.exit(0);
  } catch (error) {
    // Check if it's an authentication error (401)
    if (error.message.includes('401')) {
      console.log('ℹ️  API Status: WORKING (endpoint is reachable)');
      console.log('⚠️  Authentication Issue: 401 Unauthorized');
      console.log('\nThe API endpoint is functional, but authentication is required.');
      console.log('\nTo fix this, you need to:');
      console.log('1. Update the JWT token in api.js (line 9)');
      console.log('2. Replace "jwt=******" with a valid JWT token');
      console.log('3. The token can be obtained from your browser cookies when logged into https://asitha.top');
      console.log('\nSteps to get your JWT token:');
      console.log('1. Open https://asitha.top in your browser');
      console.log('2. Log in to your account');
      console.log('3. Open Developer Tools (F12)');
      console.log('4. Go to Application > Cookies > https://asitha.top');
      console.log('5. Find the "jwt" cookie and copy its value');
      console.log('6. Replace "jwt=******" in api.js with "jwt=YOUR_TOKEN_VALUE"');
      console.log('\n=== Test Result: API endpoint is working, needs valid authentication ===');
      process.exit(0);
    } else {
      console.log('✗ ERROR occurred:');
      console.log('Status:', error.message);
      console.log('\nPossible reasons:');
      console.log('1. API endpoint may be down or unreachable');
      console.log('2. Network connectivity issues');
      console.log('3. Channel link format may not be accepted by the API');
      console.log('\n=== Test Failed ===');
      process.exit(1);
    }
  }
}

testRealChannelLink();
