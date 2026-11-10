import { z } from 'zod';
import { sanitizeText } from '../utils/sanitize.js';

const line = (label, min, max) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} must be text` })
    .max(max * 4, `${label} is too long`)
    .transform((v) => sanitizeText(v))
    .pipe(
      z
        .string()
        .min(min, `${label} must be at least ${min} characters`)
        .max(max, `${label} must be at most ${max} characters`),
    );

export const contactSchema = z.object({
  name: line('Name', 2, 80),
  email: z
    .string({ required_error: 'Email is required', invalid_type_error: 'Email must be text' })
    .max(254, 'Email is too long')
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.string().email('Enter a valid email address')),
  subject: line('Subject', 3, 120),
  message: z
    .string({ required_error: 'Message is required', invalid_type_error: 'Message must be text' })
    .max(8000, 'Message is too long')
    .transform((v) => sanitizeText(v, { multiline: true }))
    .pipe(
      z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be at most 2000 characters'),
    ),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional().default(''),
});
