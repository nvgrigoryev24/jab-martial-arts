import { useEffect } from 'react';

export default function HoverScrollGuard() {
  useEffect(() => {
    let isScrolling = false;
    let raf = 0;
    const root = document.documentElement;

    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        root.setAttribute('data-scrolling', 'true');
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Дождемся кадров после завершения прокрутки
        clearTimeout((onScroll as any)._t);
        (onScroll as any)._t = setTimeout(() => {
          isScrolling = false;
          root.removeAttribute('data-scrolling');
        }, 120);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      cancelAnimationFrame(raf);
      root.removeAttribute('data-scrolling');
    };
  }, []);

  return null;
}

