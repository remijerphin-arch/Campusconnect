'use client';

import { useEffect, useState } from 'react';

/**
 * Animated CSS page transition container providing smooth fade-in effects on route changes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <div className={visible ? 'page-transition page-transition-visible' : 'page-transition'}>{children}</div>;
}

