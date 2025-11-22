/**
 * Example usage of the sendChannelReaction API function
 * This demonstrates how to use the API to send reactions to channel posts
 */

const { sendChannelReaction } = require('./api');

async function exampleUsage() {
  console.log('=== API Usage Examples ===\n');

  // Example 1: Send thumbs up reaction
  console.log('Example 1: Sending thumbs up reaction...');
  try {
    const result1 = await sendChannelReaction('https://example.com/channel/post/1', '👍');
    console.log('✓ Success:', result1);
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n---\n');

  // Example 2: Send heart reaction
  console.log('Example 2: Sending heart reaction...');
  try {
    const result2 = await sendChannelReaction('https://example.com/channel/post/2', '❤️');
    console.log('✓ Success:', result2);
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n---\n');

  // Example 3: Send fire reaction
  console.log('Example 3: Sending fire reaction...');
  try {
    const result3 = await sendChannelReaction('https://example.com/channel/post/3', '🔥');
    console.log('✓ Success:', result3);
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n=== Examples Complete ===');
}

// Run examples if this file is executed directly
if (require.main === module) {
  exampleUsage().catch(console.error);
}

module.exports = { exampleUsage };
