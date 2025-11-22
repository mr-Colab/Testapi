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

### Unit Tests (Mocked)

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

### Real API Tests

Test with real channel link (requires JWT token):
```bash
node test-real-link.js
```

Test with authentication (requires config.js):
```bash
node test-with-auth.js
```

Test with multiple tokens (requires multiple config files):
```bash
node test-multi-token.js
```

**Note:** Real API tests require valid JWT tokens. See AUTHENTICATION.md for setup instructions.

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

## Advanced Features

### 1. Rate-Limited API Client

Automatically handles rate limiting:

```javascript
const { RateLimitedAPI } = require('./api-rate-limited');

const api = new RateLimitedAPI(10, 1000); // 10 req/min, 1s delay
await api.sendReaction(channelLink, emoji);
```

See `api-rate-limited.js` for full documentation.

### 2. Multi-Token Rotation

Distribute load across multiple accounts:

```javascript
const { MultiTokenAPI } = require('./api-multi-token');

const api = new MultiTokenAPI(); // Loads tokens from config files
await api.sendBatch(items);
```

⚠️ **WARNING**: Read MULTI-TOKEN-GUIDE.md and LIMITATIONS.md before using!

See MULTI-TOKEN-GUIDE.md for complete setup and usage instructions.

## Documentation

- **AUTHENTICATION.md** - How to get and use JWT tokens
- **LIMITATIONS.md** - Understanding rate limits and restrictions
- **MULTI-TOKEN-GUIDE.md** - Advanced multi-token setup (use responsibly!)

## Security

- Never commit JWT tokens to Git
- config.js and config[0-9].js files are in .gitignore
- Treat JWT tokens like passwords
- Get fresh tokens when they expire

## Files

- `api.js` - Basic API client with hardcoded headers
- `api-with-config.js` - Configurable API client (uses config.js)
- `api-rate-limited.js` - Rate-limited wrapper for single token
- `api-multi-token.js` - Multi-token rotation system
- `api.test.js` - Unit tests (mocked responses)
- `test-real-link.js` - Test with actual API (checks connectivity)
- `test-with-auth.js` - Test with your JWT token
- `test-multi-token.js` - Test multi-token rotation
- `example.js` - Basic usage examples