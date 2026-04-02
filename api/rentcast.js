export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Rentcast-Key',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const apiKey = req.headers.get('x-rentcast-key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 401, headers });
  }

  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');
  searchParams.delete('endpoint');

  const validEndpoints = ['properties', 'avm/rent/long-term', 'avm/value'];
  if (!validEndpoints.includes(endpoint)) {
    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { status: 400, headers });
  }

  const query = searchParams.toString();
  const url = `https://api.rentcast.io/v1/${endpoint}${query ? '?' + query : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error', detail: err.message }), { status: 500, headers });
  }
}
