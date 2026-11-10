import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { mongoMessageStore } from './models/messageStore.js';
import { createContactRouter } from './routes/contactRoutes.js';
import { createContactLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { notifyNewMessage } from './utils/notify.js';

export function createApp({
  store = mongoMessageStore,
  limiter = createContactLimiter(),
  notifier = notifyNewMessage,
  allowedOrigins = env.clientOrigins,
} = {}) {
  const app = express();

  app.set('trust proxy', env.trustProxy);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      // Requests without an Origin header (curl, health checks) are allowed;
      // browsers on other sites get no CORS headers and are blocked.
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        callback(null, allowedOrigins.includes(origin.replace(/\/$/, '')));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 86_400,
    }),
  );
  app.use(express.json({ limit: '10kb' }));

  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Bharadwaz portfolio API', health: '/api/health' });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'ok',
      database: store.isReady() ? 'connected' : 'disconnected',
      uptime: Math.round(process.uptime()),
    });
  });

  app.use('/api/contact', createContactRouter({ store, limiter, notifier }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
