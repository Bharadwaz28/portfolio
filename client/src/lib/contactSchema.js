import { z } from 'zod';

// Same limits as server/validators/contactSchema.js
export const MESSAGE_MAX = 2000;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your name (at least 2 characters)')
    .max(80, 'Name must be 80 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address')
    .max(254, 'Email is too long')
    .email('Enter a valid email address, like name@example.com'),
  subject: z
    .string()
    .trim()
    .min(3, 'Enter a subject (at least 3 characters)')
    .max(120, 'Subject must be 120 characters or fewer'),
  message: z
    .string()
    .trim()
    .min(10, 'Write a message (at least 10 characters)')
    .max(MESSAGE_MAX, `Message must be ${MESSAGE_MAX} characters or fewer`),
  website: z.string().optional(),
});
