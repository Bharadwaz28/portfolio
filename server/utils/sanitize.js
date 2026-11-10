// Removes control characters (keeps \n and \t when multiline is true).
const CONTROL_SINGLE = /[\u0000-\u001F\u007F]/g;
const CONTROL_MULTI = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;

export function sanitizeText(value, { multiline = false } = {}) {
  let text = String(value ?? '').normalize('NFKC');
  text = text.replace(HTML_TAGS, '');
  text = text.replace(/[<>]/g, '');

  if (multiline) {
    text = text.replace(/\r\n?/g, '\n').replace(CONTROL_MULTI, '');
    text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  } else {
    text = text.replace(CONTROL_SINGLE, ' ').replace(/\s+/g, ' ');
  }
  return text.trim();
}
