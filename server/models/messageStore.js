import { isDbReady } from '../config/db.js';
import { Message } from './Message.js';

// Thin wrapper around the Mongoose model so the app can be tested without a database.
export const mongoMessageStore = {
  isReady: () => isDbReady(),
  async save({ name, email, subject, message }) {
    const doc = await Message.create({ name, email, subject, message });
    return { id: doc._id.toString(), createdAt: doc.createdAt };
  },
};
