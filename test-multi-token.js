/**
 * Test script for multi-token API rotation
 * 
 * SETUP:
 * 1. Create multiple config files:
 *    - cp config.example.js config.js
 *    - cp config1.example.js config1.js
 *    - cp config1.example.js config2.js
 *    - etc.
 * 2. Add different JWT tokens to each config file
 * 3. Run: node test-multi-token.js
 * 
 * ⚠️ WARNING: Read LIMITATIONS.md before using this!
 */

const { MultiTokenAPI } = require('./api-multi-token');

async function testMultiToken() {
  console.log('=== Multi-Token API Test ===\n');
  
  try {
    // Initialize with tokens from config files
    const api = new MultiTokenAPI();
    
    console.log('\n--- Test 1: Single Reaction ---');
    const result1 = await api.sendReaction(
      'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
      '👍'
    );
    
    if (result1.success) {
      console.log('✅ Single reaction test passed!');
    } else {
      console.log('❌ Single reaction test failed:', result1.error);
    }
    
    console.log('\n--- Test 2: Multiple Reactions ---');
    const items = [
      { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887', emoji: '👍' },
      { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34888', emoji: '❤️' },
      { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34889', emoji: '🔥' },
      { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34890', emoji: '👍' },
      { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34891', emoji: '😊' },
    ];
    
    const results = await api.sendBatch(items);
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n✅ Batch test complete: ${successCount}/${items.length} succeeded`);
    
    // Show final stats
    const stats = api.getStats();
    console.log('\n📊 Final Statistics:');
    console.log(`  Total tokens: ${stats.totalTokens}`);
    console.log(`  Active tokens: ${stats.activeTokens}`);
    console.log(`  Total requests: ${stats.totalRequests}`);
    console.log(`  Success rate: ${stats.successRate}`);
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    
    if (error.message.includes('No valid tokens')) {
      console.log('\n⚠️ No tokens found!');
      console.log('\nSetup instructions:');
      console.log('1. cp config.example.js config.js');
      console.log('2. cp config1.example.js config1.js');
      console.log('3. Edit each file and add JWT tokens');
      console.log('4. Run this test again');
    }
  }
}

// Example: Using explicit tokens instead of config files
async function testWithExplicitTokens() {
  console.log('\n=== Test with Explicit Tokens ===\n');
  
  const tokens = [
    'token1_here',
    'token2_here',
    'token3_here'
  ];
  
  try {
    const api = new MultiTokenAPI(tokens, 10, 1000);
    
    const result = await api.sendReaction(
      'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
      '👍'
    );
    
    console.log('Result:', result);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testMultiToken()
    .then(() => {
      console.log('\n=== Test Complete ===\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testMultiToken, testWithExplicitTokens };
