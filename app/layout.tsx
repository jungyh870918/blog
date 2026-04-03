import type { Metadata } from 'next';
import './globals.css';
import LoadingBar from '@/components/LoadingBar';

export const metadata: Metadata = {
  title: 'PROTOCOL:JUNGYH | Modern Dev Log',
  description: 'SYSTEM 2026: DECODING HUMAN KNOWLEDGE...',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LoadingBar />
        {children}
      </body>
    </html>
  );
}
