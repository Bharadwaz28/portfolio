import { resume } from '../data/portfolio.js';

// Downloads the resume if the PDF exists in /public. Returns true on success.
export async function downloadResume() {
  try {
    const res = await fetch(resume.path, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('pdf')) return false;
  } catch {
    return false;
  }
  const a = document.createElement('a');
  a.href = resume.path;
  a.download = resume.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}
