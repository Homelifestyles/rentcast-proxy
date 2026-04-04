export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // API key comes from Vercel environment variable — never exposed to the browser
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'RENTCAST_API_KEY not configured on server' });

  const { endpoint, ...params } = req.query;

  const validEndpoints = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!endpoint || !validEndpoints.includes(endpoint)) {
    return res.status(400).json({ error: 'Invalid or missing endpoint', valid: validEndpoints });
  }

  const qs = new URLSearchParams(params).toString();
  const url = `https://api.rentcast.io/v1/${endpoint}${qs ? '?' + qs : ''}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
