export const createContactController = (store, notifier) => ({
  async submit(req, res, next) {
    try {
      const { name, email, subject, message, website } = req.validated;

      // Honeypot filled in => bot. Answer politely, store nothing.
      if (website) {
        return res.status(200).json({ success: true, message: 'Message received.' });
      }

      if (!store.isReady()) {
        return res.status(503).json({
          success: false,
          message: 'The message service is temporarily unavailable. Please email me directly.',
        });
      }

      const saved = await store.save({ name, email, subject, message });

      // Alert the site owner. Not awaited: a slow or failed alert must never
      // delay or break the visitor's request (the message is already saved).
      if (notifier) {
        Promise.resolve()
          .then(() => notifier({ name, email, subject, message }))
          .catch((err) => console.error('[notify] alert not sent:', err.message));
      }

      return res.status(201).json({
        success: true,
        message: 'Message sent. I will get back to you soon.',
        id: saved.id,
      });
    } catch (err) {
      next(err);
    }
  },
});
