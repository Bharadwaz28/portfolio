import { useEffect, useMemo, useState } from 'react';

// Live clock for a given time zone, e.g. "14:28:11".
export default function Clock({ timeZone, className }) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone,
      }),
    [timeZone],
  );
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className={className} dateTime={now.toISOString()} suppressHydrationWarning>
      {formatter.format(now)}
    </time>
  );
}
