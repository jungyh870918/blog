'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingBar() {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    const text = textRef.current;
    if (!bar || !text) return;

    const show = () => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      bar.classList.remove('lb-hidden');
      text.classList.remove('lb-hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1.3s cubic-bezier(0.4, 0, 0.2, 1)';
          bar.style.width = '85%';
        });
      });
    };

    const hide = (cb?: () => void) => {
      bar.style.transition = 'width 0.15s ease';
      bar.style.width = '100%';
      setTimeout(() => {
        bar.classList.add('lb-hidden');
        text.classList.add('lb-hidden');
        bar.style.width = '0%';
        bar.style.transition = 'none';
        cb?.();
      }, 200);
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const isExternal = anchor.target === '_blank' || href.startsWith('http');
      const isInternal = href.startsWith('/') || href.endsWith('.html');

      if (!isExternal && !isInternal) return;

      // 같은 경로 내부 링크 무시
      if (isInternal && !isExternal && href === window.location.pathname) return;

      e.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);

      show();

      timerRef.current = setTimeout(() => {
        hide(() => {
          setTimeout(() => {
            if (isExternal) {
              window.open(href, '_blank', 'noreferrer');
            } else {
              router.push(href);
            }
          }, 100);
        });
      }, 1500);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

  return (
    <>
      <style>{`
        .lb-bar {
          position: fixed;
          top: 0; left: 0;
          width: 0%;
          height: 3px;
          background: linear-gradient(to right, #9be6f2, #63c5da 45%, #a394c7 75%, #dd5a5a);
          box-shadow: 0 0 12px rgba(99,197,218,0.8), 0 0 28px rgba(163,148,199,0.5);
          z-index: 9999;
          pointer-events: none;
        }
        .lb-text {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Pixelify Sans', monospace;
          font-weight: 500;
          font-size: clamp(0.95rem, 2.6vw, 1.7rem);
          letter-spacing: 0.18em;
          color: var(--cel-snow, #f0f2f5);
          text-shadow: 0 0 24px rgba(99,197,218,0.75), 0 4px 20px rgba(10,5,20,0.9);
          z-index: 9998;
          pointer-events: none;
          white-space: nowrap;
          animation: lb-blink 1.4s ease-in-out infinite;
        }
        .lb-hidden {
          visibility: hidden !important;
        }
        @keyframes lb-blink {
          0%, 100% { opacity: 1;    transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.55; transform: translate(-50%, -50%) scale(0.97); }
        }
      `}</style>

      <div ref={barRef} className="lb-bar lb-hidden" />
      <div ref={textRef} className="lb-text lb-hidden">
        CLIMBING...
      </div>
    </>
  );
}
