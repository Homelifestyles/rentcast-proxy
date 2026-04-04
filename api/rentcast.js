const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Quick health check
  if (req.query.ping) {
    res.status(200).json({ ok: true, hasKey: !!process.env.RENTCAST_API_KEY });
    return;
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'RENTCAST_API_KEY env var not configured' });
    return;
  }

  const endpoint = req.query.endpoint;
  const validEndpoints = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!endpoint || !validEndpoints.includes(endpoint)) {
    res.status(400).json({ error: 'Invalid or missing endpoint', valid: validEndpoints });
    return;
  }

  const params = Object.assign({}, req.query);
  delete params.endpoint;
  const qs = new URLSearchParams(params).toString();
  const path = '/v1/' + endpoint + (qs ? '?' + qs : '');

  const options = {
    hostname: 'api.rentcast.io',
    path: path,
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
      'Accept': 'application/json',
    },
  };

  try {
    const data = await new Promise((resolve, reject) => {
      const req2 = https.request(options, (r) => {
        let body = '';
        r.on('data', (chunk) => { body += chunk; });
        r.on('end', () => {
          try { resolve({ status: r.statusCode, body: JSON.parse(body) }); }
          catch (e) { reject(new Error('Bad JSON: ' + body.slice(0, 100))); }
        });
      });
      req2.on('error', reject);
      req2.setTimeout(8000, () => { req2.destroy(); reject(new Error('Timeout')); });
      req2.end();
    });

    res.status(data.status).json(data.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
