# Authentication Guide

## Understanding the API Authentication

The API endpoint requires JWT (JSON Web Token) authentication. **There is no way to bypass this authentication** as it's implemented on the server side for security reasons.

### Why Authentication is Required

1. **Security**: Prevents unauthorized access and spam
2. **User Tracking**: Associates reactions with specific users
3. **Rate Limiting**: Controls how many requests each user can make
4. **Account Safety**: Protects the service from abuse

## How to Use the API with Authentication

### Option 1: Using the Configuration File (Recommended)

This is the easiest and most secure way to use your JWT token.

#### Step 1: Copy the Example Config

```bash
cp config.example.js config.js
```

#### Step 2: Get Your JWT Token

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Navigate to **https://asitha.top**
3. Log in to your account if you haven't already
4. Open Developer Tools:
   - **Windows/Linux**: Press `F12` or `Ctrl+Shift+I`
   - **Mac**: Press `Cmd+Option+I`
   - Or right-click anywhere and select "Inspect"

5. In Developer Tools, go to the **Application** tab (or **Storage** in Firefox)
6. In the left sidebar, expand **Cookies**
7. Click on **https://asitha.top**
8. Find the cookie named **`jwt`**
9. Click on the `jwt` cookie row
10. Copy the entire **Value** column (it will be a long string)

#### Step 3: Update config.js

Open `config.js` in your text editor and replace `YOUR_JWT_TOKEN_HERE` with your copied JWT token:

```javascript
module.exports = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Your actual token here
  apiEndpoint: 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post'
};
```

#### Step 4: Run the Test

```bash
node test-with-auth.js
```

If successful, you'll see:
```
✅ SUCCESS! Reaction sent successfully!
```

### Option 2: Pass JWT Token Directly in Code

You can also pass the JWT token directly when calling the function:

```javascript
const { sendChannelReaction } = require('./api-with-config');

const myJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const result = await sendChannelReaction(
  'https://whatsapp.com/channel/0029VaeNfM11HspqGPHmUb0c/34887',
  '👍',
  myJwtToken  // Pass token as third parameter
);
```

### Option 3: Update the Original api.js File

If you prefer to use the original `api.js` file, simply edit line 9:

```javascript
'cookie': 'jwt=YOUR_ACTUAL_TOKEN_HERE',
```

Replace `YOUR_ACTUAL_TOKEN_HERE` with your JWT token.

## Important Security Notes

⚠️ **NEVER commit your JWT token to Git!**

- The `config.js` file is already in `.gitignore` to prevent accidental commits
- Your JWT token is like a password - keep it secret
- Don't share your token in public repositories or with others
- If your token is compromised, log out and log back in to get a new one

## Troubleshooting

### "401 Unauthorized" Error

**Problem**: Your JWT token is invalid, expired, or missing.

**Solutions**:
- Get a fresh JWT token from your browser (tokens expire)
- Make sure you copied the entire token value
- Ensure there are no extra spaces or quotes around the token
- Log out and log back in to https://asitha.top to get a new token

### "config.js not found" Error

**Problem**: The configuration file doesn't exist.

**Solution**:
```bash
cp config.example.js config.js
```
Then edit `config.js` with your JWT token.

### Token Keeps Expiring

JWT tokens have an expiration time set by the server. If your token expires frequently:

1. Get a new token from https://asitha.top
2. Update your config.js with the new token
3. Consider adding a token refresh mechanism if you're building a production app

## Testing Without Authentication

If you want to test the API structure without authentication, use the mock tests:

```bash
npm test
```

These tests use mocked responses and don't require a real JWT token. They verify the API function works correctly but don't make real API calls.

## Alternative: Cannot Get JWT Token?

If you cannot access https://asitha.top or get a JWT token, you have limited options:

1. **Request API Access**: Contact the API owner to request access or a service account
2. **Use Mock Tests**: Run `npm test` to verify the code works with mocked responses
3. **Build Your Own**: Create a similar API endpoint with your own authentication

**Note**: There is no legitimate way to bypass the authentication. The server requires valid credentials, and attempting to bypass this would be:
- Technically not possible (server-side validation)
- Against the API's terms of service
- Potentially illegal depending on jurisdiction

## Summary

✅ **What You Can Do**:
- Get your JWT token from browser cookies
- Use `api-with-config.js` with a config file
- Test the API with your own authentication

❌ **What You Cannot Do**:
- Bypass authentication (server enforces it)
- Use someone else's token (security violation)
- Access the API without valid credentials

The API is working correctly - it just requires you to authenticate with your own account!
