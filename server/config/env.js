import 'dotenv/config';

const toInt = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const nodeEnv = process.env.NODE_ENV || 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: toInt(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || '',
  // Comma-separated list of allowed frontend origins.
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
  rateLimitWindowMinutes: toInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 15),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 5),
  // Optional Telegram alert (official Bot API)
  telegramToken: (process.env.TELEGRAM_BOT_TOKEN || '').trim(),
  telegramChatId: (process.env.TELEGRAM_CHAT_ID || '').trim(),
  // Optional WhatsApp alert (CallMeBot). Digits only, with country code, e.g. 919876543210
  whatsappPhone: (process.env.WHATSAPP_PHONE || '').replace(/[^\d]/g, ''),
  whatsappApiKey: (process.env.WHATSAPP_APIKEY || '').trim(),
  // Render / Vercel sit behind one proxy hop. Needed for correct client IPs.
  trustProxy: toInt(process.env.TRUST_PROXY, nodeEnv === 'production' ? 1 : 0),
};
