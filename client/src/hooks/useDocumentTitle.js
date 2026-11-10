import { useEffect } from 'react';

const BASE = 'G Bharadwaz Naga Venkata Ramana | Full Stack Developer & ML Enthusiast';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Bharadwaz NVR` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
