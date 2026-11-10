import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';
import { createContactLimiter } from '../middleware/rateLimiter.js';
import { buildAlertText, notifyNewMessage } from '../utils/notify.js';

const saved = [];
let dbReady = true;
const fakeStore = {
  isReady: () => dbReady,
  async save(data) {
    saved.push(data);
    return { id: `fake-${saved.length}`, createdAt: new Date() };
  },
};

const valid = {
  name: 'Test Visitor',
  email: 'Visitor@Example.com',
  subject: 'Internship opportunity',
  message: 'Hello, I would like to talk about an internship.',
};

let server;
let base;
const alerts = [];
let alertShouldFail = false;
const fakeNotifier = async (data) => {
  alerts.push(data);
  if (alertShouldFail) throw new Error('alert service down');
};

const start = (options) =>
  new Promise((resolve) => {
    const app = createApp({ store: fakeStore, notifier: fakeNotifier, allowedOrigins: ['http://localhost:5173'], ...options });
    const s = app.listen(0, () => resolve(s));
  });

const post = (url, body, headers = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

before(async () => {
  server = await start({ limiter: createContactLimiter({ max: 1000 }) });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('GET /api/health returns ok', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(res.headers.get('x-powered-by'), null);
  assert.ok(res.headers.get('x-content-type-options'), 'helmet headers are set');
});

test('POST /api/contact stores a valid message (201)', async () => {
  const res = await post(`${base}/api/contact`, valid);
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(saved.at(-1).email, 'visitor@example.com');
});

test('POST /api/contact rejects invalid data (400) with field errors', async () => {
  const before = saved.length;
  const res = await post(`${base}/api/contact`, { name: 'A', email: 'nope', subject: '', message: 'short' });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(Object.keys(body.errors).sort(), ['email', 'message', 'name', 'subject']);
  assert.equal(saved.length, before);
});

test('POST /api/contact rejects non-string values and missing body', async () => {
  const res1 = await post(`${base}/api/contact`, { ...valid, email: { $gt: '' } });
  assert.equal(res1.status, 400);
  const res2 = await post(`${base}/api/contact`, {});
  assert.equal(res2.status, 400);
});

test('POST /api/contact strips HTML and control characters', async () => {
  const res = await post(`${base}/api/contact`, {
    ...valid,
    name: '  <b>Bold</b> Name\u0000 ',
    message: 'Line one <script>alert(1)</script>\r\n\r\n\r\n\r\nLine two   with   spaces',
  });
  assert.equal(res.status, 201);
  const last = saved.at(-1);
  assert.equal(last.name, 'Bold Name');
  assert.equal(last.message, 'Line one alert(1)\n\nLine two with spaces');
});

test('POST /api/contact ignores unknown fields', async () => {
  const res = await post(`${base}/api/contact`, { ...valid, read: true, role: 'admin' });
  assert.equal(res.status, 201);
  assert.deepEqual(Object.keys(saved.at(-1)).sort(), ['email', 'message', 'name', 'subject']);
});

test('honeypot submissions are accepted but not stored', async () => {
  const before = saved.length;
  const res = await post(`${base}/api/contact`, { ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.equal(saved.length, before);
});

test('malformed JSON returns 400 and oversized body returns 413', async () => {
  const res1 = await post(`${base}/api/contact`, '{"name": ');
  assert.equal(res1.status, 400);
  const res2 = await post(`${base}/api/contact`, { ...valid, message: 'x'.repeat(20_000) });
  assert.equal(res2.status, 413);
});

test('returns 503 when the database is not connected', async () => {
  dbReady = false;
  const res = await post(`${base}/api/contact`, valid);
  dbReady = true;
  assert.equal(res.status, 503);
});

test('wrong method returns 405, unknown route returns 404', async () => {
  const res1 = await fetch(`${base}/api/contact`);
  assert.equal(res1.status, 405);
  const res2 = await fetch(`${base}/api/nope`);
  assert.equal(res2.status, 404);
});

test('CORS allows the configured origin only', async () => {
  const ok = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const blocked = await fetch(`${base}/api/health`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
});

test('rate limit returns 429 after the limit is reached', async () => {
  const limited = await start({ limiter: createContactLimiter({ max: 2, windowMinutes: 15 }) });
  const url = `http://127.0.0.1:${limited.address().port}/api/contact`;
  try {
    assert.equal((await post(url, valid)).status, 201);
    assert.equal((await post(url, valid)).status, 201);
    const third = await post(url, valid);
    assert.equal(third.status, 429);
    assert.equal((await third.json()).success, false);
  } finally {
    limited.close();
  }
});

const tick = () => new Promise((resolve) => setTimeout(resolve, 20));

test('a saved message triggers one alert; rejected messages trigger none', async () => {
  alerts.length = 0;
  assert.equal((await post(`${base}/api/contact`, valid)).status, 201);
  await tick();
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].subject, valid.subject);

  await post(`${base}/api/contact`, { ...valid, email: 'bad' });
  await post(`${base}/api/contact`, { ...valid, website: 'http://spam.example' });
  await tick();
  assert.equal(alerts.length, 1);
});

test('a failing alert does not break the visitor request', async () => {
  alertShouldFail = true;
  const res = await post(`${base}/api/contact`, valid);
  await tick();
  alertShouldFail = false;
  assert.equal(res.status, 201);
});

test('notifyNewMessage sends on the channels that are set up, and stays off without settings', async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: new URL(url), options });
    return { ok: true, status: 200 };
  };
  const none = { telegramToken: '', telegramChatId: '', phone: '', apiKey: '', fetchImpl };

  const off = await notifyNewMessage(valid, none);
  assert.deepEqual(off.sent, []);
  assert.equal(calls.length, 0);

  const tg = await notifyNewMessage(valid, { ...none, telegramToken: '123:ABC', telegramChatId: '987654' });
  assert.deepEqual(tg.sent, ['telegram']);
  assert.equal(calls[0].url.href, 'https://api.telegram.org/bot123:ABC/sendMessage');
  assert.equal(calls[0].options.method, 'POST');
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.chat_id, '987654');
  assert.equal(body.text, buildAlertText(valid));

  const wa = await notifyNewMessage(valid, { ...none, phone: '919876543210', apiKey: 'key123' });
  assert.deepEqual(wa.sent, ['whatsapp']);
  assert.equal(calls[1].url.hostname, 'api.callmebot.com');
  assert.equal(calls[1].url.searchParams.get('phone'), '919876543210');
  assert.equal(calls[1].url.searchParams.get('text'), buildAlertText(valid));

  assert.ok(buildAlertText({ ...valid, message: 'x'.repeat(2000) }).length < 800);
});

test('one failing channel does not stop the other', async () => {
  const fetchImpl = async (url) => ({ ok: !String(url).includes('callmebot'), status: 503 });
  const result = await notifyNewMessage(valid, {
    telegramToken: '123:ABC', telegramChatId: '987654', phone: '919876543210', apiKey: 'key123', fetchImpl,
  });
  assert.deepEqual(result.sent, ['telegram']);
});
