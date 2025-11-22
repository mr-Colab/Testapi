const { sendChannelReaction } = require('./api');

// Mock fetch globally
global.fetch = jest.fn();

describe('sendChannelReaction API Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Successful API calls', () => {
    test('should successfully send a reaction with valid inputs', async () => {
      const mockResponse = {
        success: true,
        message: 'Reaction sent successfully'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await sendChannelReaction('https://example.com/channel/123', '👍');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: expect.stringContaining('"post_link":"https://example.com/channel/123"')
        })
      );
    });

    test('should send correct data payload', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://test.com/post/456', '❤️');

      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toEqual({
        post_link: 'https://test.com/post/456',
        reacts: '❤️'
      });
    });

    test('should include all required headers', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://test.com/post', '😊');

      const fetchCall = global.fetch.mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers).toHaveProperty('content-type', 'application/json');
      expect(headers).toHaveProperty('accept');
      expect(headers).toHaveProperty('user-agent');
    });
  });

  describe('Error handling', () => {
    test('should throw error when API returns non-OK status', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(
        sendChannelReaction('https://test.com/post', '👍')
      ).rejects.toThrow('HTTP error! status: 400');
    });

    test('should throw error when API returns 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(
        sendChannelReaction('https://test.com/post', '👍')
      ).rejects.toThrow('HTTP error! status: 404');
    });

    test('should throw error when API returns 500', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        sendChannelReaction('https://test.com/post', '👍')
      ).rejects.toThrow('HTTP error! status: 500');
    });

    test('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        sendChannelReaction('https://test.com/post', '👍')
      ).rejects.toThrow('Network error');
    });

    test('should handle JSON parse errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(
        sendChannelReaction('https://test.com/post', '👍')
      ).rejects.toThrow('Invalid JSON');
    });
  });

  describe('API endpoint validation', () => {
    test('should call the correct API endpoint', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://test.com/post', '👍');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post',
        expect.any(Object)
      );
    });

    test('should use POST method', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://test.com/post', '👍');

      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].method).toBe('POST');
    });
  });

  describe('Different emoji reactions', () => {
    test('should handle thumbs up emoji', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await sendChannelReaction('https://test.com/post', '👍');
      expect(result).toEqual(mockResponse);
    });

    test('should handle heart emoji', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await sendChannelReaction('https://test.com/post', '❤️');
      expect(result).toEqual(mockResponse);
    });

    test('should handle fire emoji', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await sendChannelReaction('https://test.com/post', '🔥');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Different channel links', () => {
    test('should handle standard HTTPS URLs', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://example.com/channel/post/123', '👍');

      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.post_link).toBe('https://example.com/channel/post/123');
    });

    test('should handle URLs with query parameters', async () => {
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await sendChannelReaction('https://example.com/post?id=123&ref=share', '👍');

      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.post_link).toBe('https://example.com/post?id=123&ref=share');
    });
  });
});
