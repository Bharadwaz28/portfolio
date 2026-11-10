import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export function createContactLimiter({
  windowMinutes = env.rateLimitWindowMinutes,
  max = env.rateLimitMax,
} = {}) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: `Too many messages from this device. Try again in ${windowMinutes} minutes.`,
      });
    },
  });
}
