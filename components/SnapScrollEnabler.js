'use client';
import { useEffect } from 'react';

/**
 * Enables full-page scroll snap on the current page.
 * Adds `snap-scroll` class to <html> on mount, removes on unmount so
 * other routes (menu, checkout) scroll normally.
 */
export default function SnapScrollEnabler() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('snap-scroll');
    return () => html.classList.remove('snap-scroll');
  }, []);
  return null;
}
