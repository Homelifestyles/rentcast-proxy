// v2 - force fresh build
'use strict';

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.query.ping) {
    res.status(200).end(JSON.stringify({ ok: true, hasKey: !!process.env.RENTCAST_API_KEY }));
    return;
  }

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    res.status(500).end(JSON.stringify({ error: 'RENTCAST_API_KEY not set' }));
    return;
  }

  const https = require('https');
  const { endpoint, ...params } = req.query;
  const valid = ['properties', 'avm/rent/long-term', 'avm/value'];

  if (!endpoint || !valid.includes(endpoint)) {
    res.status(400).end(JSON.stringify({ error: 'Invalid endpoint' }));
    return;
  }

  const qs = new URLSearchParams(params).toString();
  const path = '/v1/' + endpoint + (qs ? '?' + qs : '');

  const options = {
    hostname: 'api.rentcast.io',
    path: path,
    method: 'GET',
    headers: { 'X-Api-Key': apiKey, 'Accept': 'application/json' },
  };

  const upstream = https.request(options, function (r) {
    let body = '';
    r.on('data', function (chunk) { body += chunk; });
    r.on('end', function () {
      res.status(r.statusCode).end(body);
    });
  });

  upstream.on('error', function (err) {
    res.status(500).end(JSON.stringify({ error: err.message }));
  });

  upstream.setTimeout(8000, function () {
    upstream.destroy();
    res.status(504).end(JSON.stringify({ error: 'Timeout' }));
  });

  upstream.end();
};
