import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../lib/utils.js';

// Returns go(id): scrolls to a section, first returning to the home page if needed.
export function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (id) => {
      if (pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(id), 120);
      } else {
        scrollToSection(id);
      }
    },
    [navigate, pathname],
  );
}
