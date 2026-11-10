import { env } from '../config/env.js';

/*
  Phone alerts for new contact messages. Two channels, each one optional:

  1. Telegram (official, free)  -> set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
  2. WhatsApp via CallMeBot     -> set WHATSAPP_PHONE and WHATSAPP_APIKEY

  A channel is used only when both of its settings are filled in .env.
  The message is always saved in MongoDB first. If an alert fails, the visitor
  still sees "Message sent" and the message is still in the database.
*/
const MAX_BODY = 600;

export function buildAlertText({ name, email, subject, message }) {
  const body = message.length > MAX_BODY ? `${message.slice(0, MAX_BODY)}...` : message;
  return [
    'New portfolio message',
    `From: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    '',
    body,
  ].join('\n');
}

async function request(fetchImpl, url, options, timeoutMs, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`${label} alert failed with status ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

export async function sendTelegram(text, { token, chatId, fetchImpl = fetch, timeoutMs = 10_000 }) {
  await request(
    fetchImpl,
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    },
    timeoutMs,
    'Telegram',
  );
}

export async function sendWhatsApp(text, { phone, apiKey, fetchImpl = fetch, timeoutMs = 10_000 }) {
  const params = new URLSearchParams({ phone, text, apikey: apiKey });
  await request(fetchImpl, `https://api.callmebot.com/whatsapp.php?${params}`, {}, timeoutMs, 'WhatsApp');
}

// Sends the alert on every channel that is set up. Returns the channels that worked.
export async function notifyNewMessage(
  data,
  {
    telegramToken = env.telegramToken,
    telegramChatId = env.telegramChatId,
    phone = env.whatsappPhone,
    apiKey = env.whatsappApiKey,
    fetchImpl = fetch,
  } = {},
) {
  const text = buildAlertText(data);
  const jobs = [];
  if (telegramToken && telegramChatId) {
    jobs.push(['telegram', sendTelegram(text, { token: telegramToken, chatId: telegramChatId, fetchImpl })]);
  }
  if (phone && apiKey) {
    jobs.push(['whatsapp', sendWhatsApp(text, { phone, apiKey, fetchImpl })]);
  }

  const results = await Promise.allSettled(jobs.map(([, job]) => job));
  const sent = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') sent.push(jobs[i][0]);
    else console.error(`[notify] ${jobs[i][0]}: ${result.reason?.message || result.reason}`);
  });
  return { sent };
}
