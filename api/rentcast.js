export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Rentcast-Key');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = req.headers['x-rentcast-key'];
  if (!apiKey) return res.status(401).json({ error: 'Missing API key' });

  const endpoint = req.query.endpoint;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const valid = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!valid.includes(endpoint)) return res.status(400).json({ error: 'Invalid endpoint' });

  const params = { ...req.query };
  delete params.endpoint;
  const query = new URLSearchParams(params).toString();
  const url = `https://api.rentcast.io/v1/${endpoint}${query ? '?' + query : ''}`;

  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': apiKey, 'Accept': 'application/json' }
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
