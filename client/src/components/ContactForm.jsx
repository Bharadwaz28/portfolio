import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Loader2, Send } from 'lucide-react';
import { contactSchema, MESSAGE_MAX } from '../lib/contactSchema.js';
import { sendContact, warmUpApi } from '../lib/api.js';
import { useLog } from '../context/LogContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { profile } from '../data/portfolio.js';
import { cn } from '../lib/utils.js';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="label text-sub">
          &gt; {label}
        </label>
        {hint}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1 text-xs text-danger"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  const { log } = useLog();
  const { toast } = useToast();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');
  const [slow, setSlow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    setFocus,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema), mode: 'onTouched', defaultValues: EMPTY });

  const messageLength = (watch('message') || '').length;
  const sending = status === 'sending';

  // "Ask about this project" in the project view fills the subject for the visitor.
  useEffect(() => {
    const onPrefill = (event) => {
      setStatus((s) => (s === 'success' ? 'idle' : s));
      setTimeout(() => {
        setValue('subject', event.detail?.subject || '', { shouldValidate: true });
        setFocus('name', { shouldSelect: false });
      }, 700);
    };
    window.addEventListener('contact:prefill', onPrefill);
    return () => window.removeEventListener('contact:prefill', onPrefill);
  }, [setValue, setFocus]);

  const onSubmit = async (values) => {
    if (sending) return; // no double submits
    setStatus('sending');
    setServerError('');
    log('Contact form: sending message');
    const slowTimer = setTimeout(() => setSlow(true), 6000);

    try {
      await sendContact(values);
      setStatus('success');
      reset(EMPTY);
      log('Contact form: message sent', 'ok');
      toast('Message sent. Thank you!');
    } catch (err) {
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (field in EMPTY) setError(field, { type: 'server', message });
        });
      }
      setStatus('error');
      setServerError(err.message);
      log(`Contact form: ${err.message}`, 'error');
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  };

  const onInvalid = (fieldErrors) => {
    const count = Object.keys(fieldErrors).length;
    log(`Contact form: ${count} ${count === 1 ? 'field needs' : 'fields need'} attention`, 'warn');
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    disabled: sending,
    className: 'field',
    ...register(name),
  });

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded border border-accent/40 bg-accent/[0.04] p-6 text-center"
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent shadow-glow"
        >
          <Check className="h-6 w-6" aria-hidden="true" />
        </motion.span>
        <p className="mt-4 font-mono text-base text-ink">Message sent</p>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-sub">
          Thanks for reaching out. I will reply to your email as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn btn-ghost mt-5"
          data-log="Contact form: write another message"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onFocus={warmUpApi}
      noValidate
      aria-label="Contact form"
      aria-busy={sending}
      className="space-y-3.5"
    >
      <div className="grid gap-3.5 @[360px]:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name?.message}>
          <input type="text" autoComplete="name" placeholder="Your name" maxLength={80} {...fieldProps('name')} />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email?.message}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            {...fieldProps('email')}
          />
        </Field>
      </div>

      <Field id="contact-subject" label="Subject" error={errors.subject?.message}>
        <input type="text" placeholder="Internship opportunity" maxLength={120} {...fieldProps('subject')} />
      </Field>

      <Field
        id="contact-message"
        label="Message"
        error={errors.message?.message}
        hint={
          <span
            className={cn('font-mono text-[10px]', messageLength > MESSAGE_MAX ? 'text-danger' : 'text-muted')}
            aria-hidden="true"
          >
            {messageLength}/{MESSAGE_MAX}
          </span>
        }
      >
        <textarea rows={4} placeholder="Tell me about the role or project" {...fieldProps('message')} className="field resize-y" />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <AnimatePresence initial={false}>
        {status === 'error' && serverError ? (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 rounded border border-danger/40 bg-danger/[0.06] px-3 py-2.5 text-sm text-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
              <p>
                {serverError}{' '}
                <a
                  href={`mailto:${profile.email}`}
                  className="text-accent underline underline-offset-2"
                  data-log="Open email app (form fallback)"
                >
                  Email me instead
                </a>
                .
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button type="submit" disabled={sending} className="btn btn-primary w-full">
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {slow ? 'Waking the server' : 'Sending'}
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
      {sending && slow ? (
        <p className="text-center text-xs text-muted" role="status">
          The server sleeps when idle. The first message can take up to a minute.
        </p>
      ) : null}
    </form>
  );
}
