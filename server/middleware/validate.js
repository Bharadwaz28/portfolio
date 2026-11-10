// Validates req.body against a Zod schema and puts the clean data on req.validated.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] ?? 'form';
      if (!errors[field]) errors[field] = issue.message;
    }
    return res.status(400).json({
      success: false,
      message: 'Please fix the highlighted fields.',
      errors,
    });
  }

  req.validated = result.data;
  next();
};
