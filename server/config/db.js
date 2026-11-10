import mongoose from 'mongoose';
import dns from 'node:dns';

// Some home / college networks cannot look up MongoDB Atlas addresses
// ("querySrv ECONNREFUSED"). Public DNS servers fix that on a local computer.
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

// Fail fast instead of queueing queries while the database is unreachable.
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is not set');

  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'));
  mongoose.connection.on('reconnected', () => console.log('[db] reconnected'));
  mongoose.connection.on('error', (err) => console.error('[db] error:', err.message));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  console.log(`[db] connected to "${mongoose.connection.name}"`);
}

export const isDbReady = () => mongoose.connection.readyState === 1;

export async function disconnectDB() {
  await mongoose.disconnect();
}
