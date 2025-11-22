/**
 * Test script that uses the configurable API with your own JWT token
 * 
 * SETUP:
 * 1. Copy config.example.js to config.js
 * 2. Add your JWT token to config.js
 * 3. Run: node test-with-auth.js
 */

const { sendChannelReaction } = require('./api-with-config');

async function testWithAuthentication() {
  console.log('=== Testing API with Authentication ===\n');
  
  // Real WhatsApp channel link
  const channelLink = 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887';
  const emoji = '👍';
  
  console.log('Channel Link:', channelLink);
  console.log('Emoji Reaction:', emoji);
  console.log('\nAttempting to send reaction...\n');
  
  try {
    const result = await sendChannelReaction(channelLink, emoji);
    console.log('✅ SUCCESS! Reaction sent successfully!');
    console.log('\nAPI Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n=== Test Passed - API is fully functional! ===');
    return true;
  } catch (error) {
    console.log('❌ FAILED');
    console.log('\nError:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n⚠️  Authentication Error');
      console.log('Your JWT token is invalid or expired.');
      console.log('\nPlease update your JWT token in config.js:');
      console.log('1. Go to https://asitha.top and log in');
      console.log('2. Open Developer Tools (F12)');
      console.log('3. Go to: Application > Cookies > https://asitha.top');
      console.log('4. Copy the "jwt" cookie value');
      console.log('5. Update config.js with the new token');
    } else if (error.message.includes('No valid JWT token')) {
      console.log('\n⚠️  Configuration Missing');
      console.log('Please create config.js with your JWT token.');
      console.log('\nQuick setup:');
      console.log('1. cp config.example.js config.js');
      console.log('2. Edit config.js and add your JWT token');
      console.log('3. Run this script again');
    }
    
    console.log('\n=== Test Failed ===');
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  testWithAuthentication()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testWithAuthentication };
