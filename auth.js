const SURL = 'https://sdtzxnrrxfvilyrjtfcd.supabase.co';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdHp4bnJyeGZ2aWx5cmp0ZmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTUxNDUsImV4cCI6MjA5MjYzMTE0NX0.r6m3IwQhh7j-951oMs4ownXGQs80m80NOcQOMm-BUNs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

module.exports = async (req, res) => {
  // Set CORS headers on every response
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { table, method = 'GET', filter = '', order = '', limit = '', select = '*' } = req.query;
    if (!table) return res.status(400).json({ error: 'Missing table parameter' });

    let url = `${SURL}/rest/v1/${table}?select=${select}`;
    if (filter) url += `&${filter}`;
    if (order)  url += `&order=${order}`;
    if (limit)  url += `&limit=${limit}`;

    const headers = {
      'apikey': SKEY,
      'Authorization': `Bearer ${SKEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const opts = { method, headers };
    if (req.body && ['POST', 'PATCH'].includes(method)) {
      opts.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(url, opts);
    const text = await upstream.text();
    return res.status(upstream.status).send(text || '[]');

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
