import { useCallback, useState } from 'react';
import { useLog } from '../context/LogContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { downloadResume } from '../lib/resume.js';

export function useResumeDownload() {
  const { log } = useLog();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const download = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const ok = await downloadResume();
    setBusy(false);
    if (ok) {
      log('CV download started', 'ok');
      toast('CV download started');
    } else {
      log('CV is not uploaded yet', 'warn');
      toast('The CV is not uploaded yet. Please check back soon.', { type: 'warn' });
    }
  }, [busy, log, toast]);

  return { download, busy };
}
