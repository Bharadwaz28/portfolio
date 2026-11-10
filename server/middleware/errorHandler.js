import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Body-parser errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body is not valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }
  // Mongoose validation (second line of defence after Zod)
  if (err.name === 'ValidationError' || err.name === 'StrictModeError') {
    return res.status(400).json({ success: false, message: 'Message data is not valid.' });
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  console.error(`[error] ${req.method} ${req.originalUrl}:`, env.isProduction ? err.message : err);

  res.status(status).json({
    success: false,
    message: status === 500 ? 'Something went wrong on the server. Please try again later.' : err.message,
    // Stack traces are only shown outside production.
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
}
