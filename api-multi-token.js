/**
 * Multi-token API client
 * Rotates between multiple JWT tokens to distribute load
 * 
 * ⚠️ WARNING: Using multiple accounts to bypass rate limits may violate
 * the API's Terms of Service and could result in ALL accounts being banned.
 * Use at your own risk!
 * 
 * LEGITIMATE USE CASES:
 * - You have multiple authorized accounts (team members)
 * - Each account has given explicit permission
 * - You're distributing work across authorized users
 */

const { sendChannelReaction } = require('./api-with-config');
const fs = require('fs');
const path = require('path');

const { JWT_TOKEN_PLACEHOLDER } = require('./constants');

class MultiTokenAPI {
  /**
   * Creates a multi-token API client
   * @param {Array<string>} tokens - Array of JWT tokens to rotate between
   * @param {number} requestsPerTokenPerMinute - Max requests per token per minute
   * @param {number} delayBetweenRequests - Delay between requests in ms
   */
  constructor(tokens = [], requestsPerTokenPerMinute = 10, delayBetweenRequests = 1000) {
    if (!Array.isArray(tokens) || tokens.length === 0) {
      console.log('⚠️  No tokens provided. Loading from config files...');
      this.tokens = this.loadTokensFromConfigs();
    } else {
      this.tokens = tokens.filter(t => t && t !== JWT_TOKEN_PLACEHOLDER);
    }
    
    if (this.tokens.length === 0) {
      throw new Error('No valid tokens available. Please provide tokens or create config files.');
    }
    
    this.requestsPerTokenPerMinute = requestsPerTokenPerMinute;
    this.delayBetweenRequests = delayBetweenRequests;
    
    // Track requests per token
    this.tokenStats = {};
    this.tokens.forEach((token, index) => {
      this.tokenStats[index] = {
        token: token,
        requestTimes: [],
        totalRequests: 0,
        successCount: 0,
        failCount: 0,
        lastUsed: 0,
        active: true
      };
    });
    
    this.currentTokenIndex = 0;
    console.log(`✓ Initialized with ${this.tokens.length} tokens`);
  }
  
  /**
   * Load tokens from multiple config files (config.js, config1.js, config2.js, etc.)
   */
  loadTokensFromConfigs() {
    const tokens = [];
    const configFiles = ['config.js', 'config1.js', 'config2.js', 'config3.js', 'config4.js'];
    
    configFiles.forEach(filename => {
      const configPath = path.join(__dirname, filename);
      if (fs.existsSync(configPath)) {
        try {
          const config = require(configPath);
          if (config.jwt && config.jwt !== JWT_TOKEN_PLACEHOLDER) {
            tokens.push(config.jwt);
            console.log(`✓ Loaded token from ${filename}`);
          }
        } catch (error) {
          console.log(`✗ Error loading ${filename}:`, error.message);
        }
      }
    });
    
    return tokens;
  }
  
  /**
   * Get the next available token that's not rate limited
   */
  async getNextAvailableToken() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Try to find an available token
    let attempts = 0;
    while (attempts < this.tokens.length * 2) {
      const stats = this.tokenStats[this.currentTokenIndex];
      
      if (!stats.active) {
        this.currentTokenIndex = (this.currentTokenIndex + 1) % this.tokens.length;
        attempts++;
        continue;
      }
      
      // Clean old requests
      stats.requestTimes = stats.requestTimes.filter(time => time > oneMinuteAgo);
      
      // Check if this token is available
      if (stats.requestTimes.length < this.requestsPerTokenPerMinute) {
        const timeSinceLastUse = now - stats.lastUsed;
        if (timeSinceLastUse >= this.delayBetweenRequests) {
          return this.currentTokenIndex;
        } else {
          // Wait for minimum delay
          const waitTime = this.delayBetweenRequests - timeSinceLastUse;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this.currentTokenIndex;
        }
      }
      
      // Try next token
      this.currentTokenIndex = (this.currentTokenIndex + 1) % this.tokens.length;
      attempts++;
    }
    
    // All tokens are rate limited, wait for the soonest available
    console.log('⏳ All tokens rate limited, waiting...');
    const waitTime = this.getTimeUntilNextAvailable();
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.getNextAvailableToken();
  }
  
  /**
   * Calculate time until next token becomes available
   */
  getTimeUntilNextAvailable() {
    const now = Date.now();
    let minWaitTime = 60000; // Default 1 minute
    
    Object.values(this.tokenStats).forEach(stats => {
      if (stats.active && stats.requestTimes.length > 0) {
        const oldestRequest = Math.min(...stats.requestTimes);
        const waitTime = (oldestRequest + 60000) - now;
        if (waitTime < minWaitTime) {
          minWaitTime = waitTime;
        }
      }
    });
    
    return Math.max(1000, minWaitTime); // At least 1 second
  }
  
  /**
   * Send a reaction using token rotation
   */
  async sendReaction(channelLink, emoji) {
    const tokenIndex = await this.getNextAvailableToken();
    const token = this.tokens[tokenIndex];
    const stats = this.tokenStats[tokenIndex];
    
    const now = Date.now();
    stats.requestTimes.push(now);
    stats.lastUsed = now;
    stats.totalRequests++;
    
    try {
      console.log(`[Token ${tokenIndex + 1}/${this.tokens.length}] Sending reaction to ${channelLink}`);
      const result = await sendChannelReaction(channelLink, emoji, token);
      
      stats.successCount++;
      console.log(`✓ Success with token ${tokenIndex + 1}`);
      
      // Move to next token for fair distribution
      this.currentTokenIndex = (tokenIndex + 1) % this.tokens.length;
      
      return { success: true, result, tokenIndex };
    } catch (error) {
      stats.failCount++;
      console.log(`✗ Failed with token ${tokenIndex + 1}: ${error.message}`);
      
      // If 401, mark token as inactive
      if (error.message.includes('401')) {
        console.log(`⚠️  Token ${tokenIndex + 1} is invalid/expired - marking as inactive`);
        stats.active = false;
        
        // Check if we have any active tokens left
        const activeTokens = Object.values(this.tokenStats).filter(s => s.active).length;
        if (activeTokens === 0) {
          throw new Error('All tokens are invalid or expired. Please update your tokens.');
        }
      }
      
      return { success: false, error: error.message, tokenIndex };
    }
  }
  
  /**
   * Send reactions to multiple links using token rotation
   */
  async sendBatch(items) {
    console.log(`\n📊 Multi-token batch processing ${items.length} reactions...`);
    console.log(`Using ${this.tokens.length} tokens with ${this.requestsPerTokenPerMinute} requests/token/minute\n`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    const startTime = Date.now();
    
    for (let i = 0; i < items.length; i++) {
      const { link, emoji } = items[i];
      console.log(`\n[${i+1}/${items.length}] Processing: ${link}`);
      
      const result = await this.sendReaction(link, emoji);
      results.push({ link, emoji, ...result });
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Print progress every 5 items
      if ((i + 1) % 5 === 0) {
        this.printStats();
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Batch complete in ${duration}s: ${successCount} succeeded, ${failCount} failed\n`);
    this.printStats();
    
    return results;
  }
  
  /**
   * Print statistics for all tokens
   */
  printStats() {
    console.log('\n📊 Token Statistics:');
    Object.entries(this.tokenStats).forEach(([index, stats]) => {
      const idx = parseInt(index) + 1;
      const status = stats.active ? '✓' : '✗';
      const successRate = stats.totalRequests > 0 
        ? ((stats.successCount / stats.totalRequests) * 100).toFixed(1)
        : '0';
      
      console.log(`  Token ${idx} ${status}: ${stats.totalRequests} total, ${stats.successCount} success, ${stats.failCount} fail (${successRate}% success rate)`);
    });
    
    const activeTokens = Object.values(this.tokenStats).filter(s => s.active).length;
    console.log(`\n  Active tokens: ${activeTokens}/${this.tokens.length}`);
  }
  
  /**
   * Get overall statistics
   */
  getStats() {
    const activeTokens = Object.values(this.tokenStats).filter(s => s.active).length;
    const totalRequests = Object.values(this.tokenStats).reduce((sum, s) => sum + s.totalRequests, 0);
    const totalSuccess = Object.values(this.tokenStats).reduce((sum, s) => sum + s.successCount, 0);
    const totalFail = Object.values(this.tokenStats).reduce((sum, s) => sum + s.failCount, 0);
    
    return {
      totalTokens: this.tokens.length,
      activeTokens,
      totalRequests,
      totalSuccess,
      totalFail,
      successRate: totalRequests > 0 ? ((totalSuccess / totalRequests) * 100).toFixed(2) + '%' : '0%'
    };
  }
}

module.exports = { MultiTokenAPI };
