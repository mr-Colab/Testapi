# Quick Start Guide

## What This Project Does

This project provides a tested API client for sending reactions to WhatsApp channel posts, with support for:
- ✅ Authentication management
- ✅ Rate limiting
- ✅ Multi-token rotation
- ✅ Comprehensive error handling
- ✅ 15 passing unit tests

## Choose Your Approach

### Option 1: Just Want to Test? (Easiest)

Run the mock tests that don't require authentication:

```bash
npm install
npm test
```

This runs 15 tests that verify the API logic works correctly (all passing ✓).

### Option 2: Use With Real API (Single Account)

If you have one account:

1. **Get your JWT token:**
   - Go to https://asitha.top and log in
   - Press F12 to open Developer Tools
   - Go to: Application > Cookies > https://asitha.top
   - Copy the "jwt" cookie value

2. **Setup:**
   ```bash
   cp config.example.js config.js
   ```
   Edit `config.js` and paste your JWT token

3. **Test:**
   ```bash
   node test-with-auth.js
   ```

4. **Use in your code:**
   ```javascript
   const { sendChannelReaction } = require('./api-with-config');
   
   await sendChannelReaction(
     'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
     '👍'
   );
   ```

### Option 3: High Volume Usage (Multiple Accounts)

⚠️ **WARNING**: Read MULTI-TOKEN-GUIDE.md first! Only use if you have legitimate multiple accounts.

1. **Setup multiple config files:**
   ```bash
   cp config.example.js config.js
   cp config1.example.js config1.js
   cp config2.example.js config2.js
   ```

2. **Add JWT tokens** (different token in each file)

3. **Test:**
   ```bash
   node test-multi-token.js
   ```

4. **Use in your code:**
   ```javascript
   const { MultiTokenAPI } = require('./api-multi-token');
   
   const api = new MultiTokenAPI();
   await api.sendBatch(items);
   ```

## Common Questions

### Q: Can I bypass authentication?
**A:** No. Authentication is server-enforced. See LIMITATIONS.md for details.

### Q: Can I bypass rate limits?
**A:** No. Rate limits are server-enforced. You can:
- Work within limits using `api-rate-limited.js`
- Use multiple legitimate accounts with `api-multi-token.js`
- Request higher limits from the API owner

### Q: How do I get a JWT token?
**A:** See AUTHENTICATION.md for step-by-step instructions.

### Q: My token expired, what do I do?
**A:** Get a fresh token from https://asitha.top (tokens expire periodically).

### Q: Is using multiple accounts safe?
**A:** Only if they're legitimate accounts with proper authorization. See MULTI-TOKEN-GUIDE.md for risks and best practices.

## File Overview

| File | Purpose |
|------|---------|
| `api.js` | Basic API client (hardcoded auth) |
| `api-with-config.js` | Configurable API client (recommended) |
| `api-rate-limited.js` | Rate-limited wrapper for single token |
| `api-multi-token.js` | Multi-token rotation system |
| `api.test.js` | Unit tests (15 tests, all passing) |
| `test-real-link.js` | Test connectivity to real API |
| `test-with-auth.js` | Test with your JWT token |
| `test-multi-token.js` | Test multi-token rotation |

## Documentation

- **README.md** - Full project documentation
- **AUTHENTICATION.md** - How to get and use JWT tokens
- **LIMITATIONS.md** - Understanding what you cannot do
- **MULTI-TOKEN-GUIDE.md** - Advanced multi-token setup
- **QUICK-START.md** - This file

## Need Help?

1. Read the error message carefully
2. Check the relevant .md documentation file
3. Make sure your JWT token is valid and not expired
4. Verify you're using the correct channel link format
5. Check that dependencies are installed: `npm install`

## Example: Send a Reaction

Simple example to send a reaction:

```javascript
const { sendChannelReaction } = require('./api-with-config');

async function main() {
  try {
    const result = await sendChannelReaction(
      'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
      '👍'
    );
    console.log('Success!', result);
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

main();
```

## Testing Status

✅ 15/15 unit tests passing  
✅ API endpoint reachable  
✅ Real channel link tested: `https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887`  
⚠️ Requires JWT token for authentication

Happy coding! 🚀
