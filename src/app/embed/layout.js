'use client';
import { useEffect } from 'react';

export default function EmbedLayout({ children }) {
  useEffect(() => {
    document.querySelector('.navbar')?.style.setProperty('display', 'none');
    document.querySelector('.footer')?.style.setProperty('display', 'none');
    document.body.style.background = 'transparent';
    return () => {
      document.querySelector('.navbar')?.style.removeProperty('display');
      document.querySelector('.footer')?.style.removeProperty('display');
      document.body.style.removeProperty('background');
    };
  }, []);

  return <>{children}</>;
}
