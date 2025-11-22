# Testapi

API scrape logic with comprehensive tests for sending reactions to channel posts.

## Project Structure

- `api.js` - Main API module containing the `sendChannelReaction` function
- `api.test.js` - Comprehensive test suite with 15 tests
- `package.json` - Node.js project configuration
- `jest.config.js` - Jest testing framework configuration

## Installation

```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with verbose output:
```bash
npm run test:verbose
```

Run tests with coverage report:
```bash
npm run test:coverage
```

## API Function

### `sendChannelReaction(channelLink, emoji)`

Sends a reaction to a channel post via the external API.

**Parameters:**
- `channelLink` (string) - The URL link to the channel post
- `emoji` (string) - The emoji reaction to send (e.g., '👍', '❤️', '🔥')

**Returns:**
- Promise<Object> - The API response

**Example:**
```javascript
const { sendChannelReaction } = require('./api');

async function example() {
  try {
    const result = await sendChannelReaction('https://example.com/post/123', '👍');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Test Coverage

The test suite includes:

1. **Successful API calls** - Tests for valid inputs and correct data handling
2. **Error handling** - Tests for HTTP errors (400, 404, 500), network errors, and JSON parse errors
3. **API endpoint validation** - Verifies correct endpoint and HTTP method
4. **Different emoji reactions** - Tests multiple emoji types
5. **Different channel links** - Tests various URL formats

All 15 tests are passing ✓