const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const fallbackMessage = (status) => {
  if (status === 429) return 'Too many messages. Please wait a few minutes and try again.';
  if (status === 400) return 'Some fields are not valid. Please check them and try again.';
  if (status === 503) return 'The message service is temporarily unavailable. Please email me directly.';
  if (status === 404 || status === 405) return 'The message service is not connected yet. Please email me directly.';
  return 'Something went wrong while sending. Please try again.';
};

export async function sendContact(data, { timeoutMs = 75_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError'
        ? 'The server took too long to answer. Please try again.'
        : 'Could not reach the server. Check your connection and try again.',
    );
  } finally {
    clearTimeout(timer);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON answer (for example an HTML error page) */
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(body?.message || fallbackMessage(res.status), {
      status: res.status,
      fieldErrors: body?.errors || null,
    });
  }
  return body;
}

// Free hosting tiers sleep when idle. A quiet health ping wakes the API early.
let warmed = false;
export function warmUpApi() {
  if (warmed) return;
  warmed = true;
  fetch(`${API_BASE}/api/health`).catch(() => {});
}
