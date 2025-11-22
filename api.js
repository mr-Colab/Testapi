/**
 * Sends a reaction to a channel post
 * @param {string} channelLink - The link to the channel post
 * @param {string} emoji - The emoji reaction to send
 * @returns {Promise<Object>} The API response
 */
async function sendChannelReaction(channelLink, emoji) {
  const url = "https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post";
  
  const headers = {
    'authority': 'foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'ar-AE,ar;q=0.9,fr-MA;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'content-type': 'application/json',
    'cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGNkODZhMDI0NmVlM2VmN2FlMGFmZiIsImlhdCI6MTc2MjQ1OTA2NCwiZXhwIjoxNzYzMDYzODY0fQ.CuAYqAeMtgLNKNl_SbEOI2mxuyno9xlE0hdje4zAwm4',
    'origin': 'https://asitha.top',
    'referer': 'https://asitha.top/',
    'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Linux; Android 12; SM-A217F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36'
  };
  
  const data = {
    "post_link": channelLink,
    "reacts": emoji
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending channel reaction:', error);
    throw error;
  }
}

module.exports = { sendChannelReaction };
