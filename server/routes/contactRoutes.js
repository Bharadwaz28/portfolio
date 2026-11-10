import { Router } from 'express';
import { createContactController } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/contactSchema.js';

export function createContactRouter({ store, limiter, notifier }) {
  const router = Router();
  const controller = createContactController(store, notifier);

  // POST /api/contact
  router.post('/', limiter, validate(contactSchema), controller.submit);

  router.all('/', (req, res) => {
    res.set('Allow', 'POST').status(405).json({ success: false, message: 'Use POST for this endpoint.' });
  });

  return router;
}
