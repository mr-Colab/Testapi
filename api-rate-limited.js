/**
 * Rate-limited API wrapper
 * Automatically handles rate limiting to prevent hitting API limits
 */

const { sendChannelReaction } = require('./api-with-config');

class RateLimitedAPI {
  /**
   * Creates a rate-limited API client
   * @param {number} requestsPerMinute - Maximum requests allowed per minute (default: 10)
   * @param {number} delayBetweenRequests - Minimum delay between requests in ms (default: 1000)
   */
  constructor(requestsPerMinute = 10, delayBetweenRequests = 1000) {
    this.requestsPerMinute = requestsPerMinute;
    this.delayBetweenRequests = delayBetweenRequests;
    this.requestTimes = [];
    this.lastRequestTime = 0;
  }
  
  /**
   * Waits if necessary to respect rate limits
   */
  async waitForRateLimit() {
    const now = Date.now();
    
    // Ensure minimum delay between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.delayBetweenRequests) {
      const waitTime = this.delayBetweenRequests - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Check requests per minute limit
    const oneMinuteAgo = Date.now() - 60000;
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);
    
    if (this.requestTimes.length >= this.requestsPerMinute) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = oldestRequest + 60000 - Date.now();
      console.log(`⏳ Rate limit: Waiting ${Math.ceil(waitTime/1000)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime + 100));
      return this.waitForRateLimit(); // Recheck
    }
  }
  
  /**
   * Sends a reaction with automatic rate limiting
   * @param {string} channelLink - The channel post link
   * @param {string} emoji - The emoji reaction
   * @param {string} customJwt - Optional custom JWT token
   * @returns {Promise<Object>} API response
   */
  async sendReaction(channelLink, emoji, customJwt = null) {
    await this.waitForRateLimit();
    
    const now = Date.now();
    this.requestTimes.push(now);
    this.lastRequestTime = now;
    
    try {
      const result = await sendChannelReaction(channelLink, emoji, customJwt);
      console.log(`✓ Success: Reaction sent to ${channelLink}`);
      return { success: true, result };
    } catch (error) {
      console.log(`✗ Failed: ${error.message}`);
      
      // Handle rate limit errors from server
      if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
        console.log('⚠️  Server rate limit hit! Waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
      
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Sends reactions to multiple links with rate limiting
   * @param {Array<{link: string, emoji: string}>} items - Array of {link, emoji} objects
   * @param {string} customJwt - Optional custom JWT token
   * @returns {Promise<Array>} Array of results
   */
  async sendBatch(items, customJwt = null) {
    console.log(`\n📊 Batch processing ${items.length} reactions...`);
    console.log(`Rate limit: ${this.requestsPerMinute} requests/minute, ${this.delayBetweenRequests}ms between requests\n`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < items.length; i++) {
      const { link, emoji } = items[i];
      console.log(`[${i+1}/${items.length}] Processing: ${link}`);
      
      const result = await this.sendReaction(link, emoji, customJwt);
      results.push({ link, emoji, ...result });
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    console.log(`\n✅ Batch complete: ${successCount} succeeded, ${failCount} failed\n`);
    return results;
  }
  
  /**
   * Get current rate limit status
   * @returns {Object} Status information
   */
  getStatus() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentRequests = this.requestTimes.filter(time => time > oneMinuteAgo);
    
    return {
      requestsInLastMinute: recentRequests.length,
      requestsPerMinuteLimit: this.requestsPerMinute,
      remainingRequests: Math.max(0, this.requestsPerMinute - recentRequests.length),
      timeSinceLastRequest: now - this.lastRequestTime,
      minDelayBetweenRequests: this.delayBetweenRequests
    };
  }
  
  /**
   * Print current status
   */
  printStatus() {
    const status = this.getStatus();
    console.log('\n📊 Rate Limit Status:');
    console.log(`  Requests in last minute: ${status.requestsInLastMinute}/${status.requestsPerMinuteLimit}`);
    console.log(`  Remaining requests: ${status.remainingRequests}`);
    console.log(`  Time since last request: ${status.timeSinceLastRequest}ms`);
    console.log(`  Min delay between requests: ${status.minDelayBetweenRequests}ms\n`);
  }
}

module.exports = { RateLimitedAPI };
