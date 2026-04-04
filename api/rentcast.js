export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (req.query.ping) {
    res.status(200).json({ ok: true, hasKey: !!process.env.RENTCAST_API_KEY });
    return;
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'RENTCAST_API_KEY not set in Vercel environment variables' });
    return;
  }

  const { endpoint, ...params } = req.query;
  const validEndpoints = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!endpoint || !validEndpoints.includes(endpoint)) {
    res.status(400).json({ error: 'Missing or invalid endpoint' });
    return;
  }

  const qs = new URLSearchParams(params).toString();
  const url = `https://api.rentcast.io/v1/${endpoint}${qs ? '?' + qs : ''}`;

  const upstream = await fetch(url, {
    headers: { 'X-Api-Key': apiKey, 'Accept': 'application/json' },
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
}
