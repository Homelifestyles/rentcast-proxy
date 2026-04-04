const https = require('https');

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error('Invalid JSON from upstream: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RENTCAST_API_KEY env var not set on server' });
  }

  const { endpoint, ...params } = req.query;

  const validEndpoints = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!endpoint || !validEndpoints.includes(endpoint)) {
    return res.status(400).json({ error: 'Invalid or missing endpoint', valid: validEndpoints });
  }

  const qs = new URLSearchParams(params).toString();
  const url = `https://api.rentcast.io/v1/${endpoint}${qs ? '?' + qs : ''}`;

  try {
    const result = await httpsGet(url, {
      'X-Api-Key': apiKey,
      'Accept': 'application/json',
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
};
