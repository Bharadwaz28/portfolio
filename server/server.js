import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';

async function start() {
  try {
    await connectDB(env.mongoUri);
  } catch (err) {
    console.error(`[db] could not connect: ${err.message}`);
    if (env.isProduction) process.exit(1);
    console.warn('[db] running without a database - /api/contact will answer 503 until MONGODB_URI works.');
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
    console.log(`[server] allowed origins: ${env.clientOrigins.join(', ')}`);
    console.log(`[server] Telegram alerts: ${env.telegramToken && env.telegramChatId ? 'on' : 'off'}`);
    console.log(`[server] WhatsApp alerts: ${env.whatsappPhone && env.whatsappApiKey ? 'on' : 'off'}`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
