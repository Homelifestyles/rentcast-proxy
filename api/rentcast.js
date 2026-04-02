export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = req.headers['x-rentcast-key'];
  if (!key) return res.status(401).json({ error: 'No key' });

  const { endpoint, ...rest } = req.query;
  const qs = new URLSearchParams(rest).toString();
  const url = `https://api.rentcast.io/v1/${endpoint}?${qs}`;

  const upstream = await fetch(url, {
    headers: { 'X-Api-Key': key, 'Accept': 'application/json' }
  });

  const body = await upstream.json();
  return res.status(upstream.status).json(body);
}
