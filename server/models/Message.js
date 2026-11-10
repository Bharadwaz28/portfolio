import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false, strict: 'throw' },
);

messageSchema.index({ createdAt: -1 });

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
