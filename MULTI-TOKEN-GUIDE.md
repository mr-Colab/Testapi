# Multi-Token Guide

## ⚠️ IMPORTANT WARNING

Using multiple accounts to bypass rate limits **MAY VIOLATE** the API's Terms of Service. This could result in:
- **All accounts being permanently banned**
- **IP address blocked**
- **Legal consequences** (in extreme cases)

## When is Multi-Token Usage Legitimate?

✅ **Acceptable scenarios:**
1. **Team collaboration**: Each token belongs to a different authorized team member
2. **Distributed work**: Coordinating work across multiple legitimate users
3. **Business accounts**: Using officially sanctioned multiple accounts
4. **Testing**: Testing with multiple test accounts in a development environment

❌ **Unacceptable scenarios:**
1. Creating multiple fake accounts to bypass limits
2. Using stolen or shared credentials
3. Automated account creation
4. Circumventing rate limits with one person's multiple accounts

**Always check the Terms of Service first!**

## How Multi-Token Rotation Works

The system automatically rotates between multiple JWT tokens to distribute API requests:

```
Request 1 → Token A → API
Request 2 → Token B → API
Request 3 → Token C → API
Request 4 → Token A → API (cycles back)
```

### Benefits:
- Distributes load across multiple tokens
- Each token has its own rate limit
- Automatic failover if one token expires
- Fair distribution of requests

### How it respects limits:
- Tracks rate limits per token individually
- Waits if all tokens are rate limited
- Automatically disables invalid/expired tokens
- Maintains minimum delay between requests

## Setup Instructions

### Method 1: Multiple Config Files (Recommended)

#### Step 1: Create config files for each account

```bash
# First account
cp config.example.js config.js

# Second account
cp config1.example.js config1.js

# Third account
cp config1.example.js config2.js

# Fourth account (if needed)
cp config1.example.js config3.js
```

#### Step 2: Get JWT tokens for each account

For **each separate account**:

1. Log in to that account at https://asitha.top
2. Open Developer Tools (F12)
3. Go to: Application > Cookies > https://asitha.top
4. Copy the `jwt` cookie value
5. Paste into the corresponding config file

**Example config.js:**
```javascript
module.exports = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Account 1's token
  apiEndpoint: 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post'
};
```

**Example config1.js:**
```javascript
module.exports = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Account 2's token (different!)
  apiEndpoint: 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post'
};
```

#### Step 3: Test the setup

```bash
node test-multi-token.js
```

### Method 2: Explicit Token Array

Pass tokens directly in your code:

```javascript
const { MultiTokenAPI } = require('./api-multi-token');

const tokens = [
  'jwt_token_from_account_1',
  'jwt_token_from_account_2',
  'jwt_token_from_account_3'
];

const api = new MultiTokenAPI(tokens, 10, 1000);
```

## Usage Examples

### Example 1: Simple Multi-Token Usage

```javascript
const { MultiTokenAPI } = require('./api-multi-token');

async function sendReactions() {
  // Initialize (loads tokens from config files automatically)
  const api = new MultiTokenAPI();
  
  // Send a single reaction
  const result = await api.sendReaction(
    'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
    '👍'
  );
  
  console.log(result);
}

sendReactions();
```

### Example 2: Batch Processing with Multiple Tokens

```javascript
const { MultiTokenAPI } = require('./api-multi-token');

async function processBatch() {
  const api = new MultiTokenAPI();
  
  const items = [
    { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887', emoji: '👍' },
    { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34888', emoji: '❤️' },
    { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34889', emoji: '🔥' },
    { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34890', emoji: '😊' },
    { link: 'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34891', emoji: '👏' },
    // ... more items
  ];
  
  const results = await api.sendBatch(items);
  
  const successful = results.filter(r => r.success).length;
  console.log(`Completed: ${successful}/${results.length} successful`);
  
  // Show statistics
  api.printStats();
}

processBatch();
```

### Example 3: Custom Configuration

```javascript
const { MultiTokenAPI } = require('./api-multi-token');

// Custom settings:
// - 5 requests per token per minute
// - 2000ms (2 seconds) between each request
const api = new MultiTokenAPI(null, 5, 2000);

await api.sendReaction(link, emoji);
```

### Example 4: Check Statistics

```javascript
const api = new MultiTokenAPI();

// Send some reactions...
await api.sendBatch(items);

// Get statistics
const stats = api.getStats();
console.log(`Total tokens: ${stats.totalTokens}`);
console.log(`Active tokens: ${stats.activeTokens}`);
console.log(`Success rate: ${stats.successRate}`);

// Print detailed stats
api.printStats();
```

## How Token Rotation Works

### Automatic Token Selection

The system automatically:

1. **Finds available token**: Checks which token is not rate limited
2. **Respects delays**: Ensures minimum delay between requests
3. **Rotates fairly**: Distributes requests evenly across tokens
4. **Handles failures**: Disables invalid/expired tokens automatically

### Rate Limit Management

For each token, the system tracks:
- Requests in the last minute
- Time of last request
- Success/failure count
- Active/inactive status

When all tokens are rate limited:
- Calculates wait time until next token is available
- Automatically waits
- Resumes when a token becomes available

### Automatic Failover

If a token receives 401 (Unauthorized):
- Token is marked as inactive
- System switches to next active token
- Continues processing with remaining tokens

## Performance Expectations

### With 1 Token:
- Max 10 requests/minute (default limit)
- ~6 seconds per request average

### With 3 Tokens:
- Max 30 requests/minute
- ~2 seconds per request average
- 3x faster throughput

### With 5 Tokens:
- Max 50 requests/minute
- ~1.2 seconds per request average
- 5x faster throughput

**Note**: Actual limits depend on the API's rate limiting policy.

## Troubleshooting

### Problem: "No valid tokens available"

**Solution:**
1. Make sure you've created config files (config.js, config1.js, etc.)
2. Each config file must have a valid JWT token
3. Tokens must not be 'YOUR_JWT_TOKEN_HERE'

### Problem: All tokens showing as inactive

**Solution:**
1. All your JWT tokens have expired
2. Get fresh tokens from https://asitha.top
3. Update all config files with new tokens

### Problem: Low success rate

**Possible causes:**
1. Expired tokens - update them
2. Invalid channel links - verify the links
3. API is down - check API status
4. Rate limits too aggressive - increase delays

### Problem: "All accounts banned"

**This is the risk!** If the API detects abuse:
1. Stop using multi-token immediately
2. Contact the API provider
3. Explain your use case
4. Request legitimate multi-account access

## Best Practices

### ✅ DO:

1. **Use legitimate accounts only**
   - Each token from a real, authorized user
   - Proper permission from each account owner

2. **Respect rate limits**
   - Keep requestsPerTokenPerMinute conservative (default: 10)
   - Use delays between requests (minimum 1000ms)

3. **Monitor token health**
   - Check statistics regularly
   - Replace expired tokens promptly

4. **Log your activity**
   - Keep records of what you're doing
   - Be transparent about multi-account usage

5. **Have a backup plan**
   - If accounts get banned, be prepared
   - Don't rely solely on automation

### ❌ DON'T:

1. **Create fake accounts**
   - Violates ToS
   - Gets you banned
   - Potentially illegal

2. **Use stolen tokens**
   - Unauthorized access
   - Criminal offense in many jurisdictions

3. **Ignore warnings**
   - If API returns warnings, heed them
   - Don't push limits aggressively

4. **Share tokens publicly**
   - Never commit tokens to Git
   - Never share in public forums
   - Treat like passwords

5. **Automate without permission**
   - Get explicit authorization first
   - Follow API's automation policies

## Legal and Ethical Considerations

### Terms of Service

Before using multi-token:
1. Read the API's Terms of Service
2. Check if multiple accounts are allowed
3. Verify automation policies
4. Get written permission if unsure

### Ethical Use

Ask yourself:
- Am I using this for legitimate business purposes?
- Do I have permission from all account owners?
- Am I being transparent about my usage?
- Would I be comfortable explaining this to the API owner?

If you answer "no" to any of these, **don't use multi-token**.

### Consequences of Abuse

Potential consequences:
- ⚠️ Account suspension (temporary)
- 🚫 Account ban (permanent)
- 💰 Financial penalties
- ⚖️ Legal action (in extreme cases)
- 📛 Reputation damage

## Summary

Multi-token rotation can be a legitimate tool for:
- Team collaboration
- Distributed workloads
- Authorized business operations

But it **must not** be used to:
- Bypass security measures
- Create fake accounts
- Abuse the API
- Violate Terms of Service

**When in doubt, ask for permission first!**

Use responsibly and ethically. The API tests work great with a single token - multi-token is only needed for high-volume legitimate use cases.
