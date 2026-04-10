import type { Metadata } from 'next';
import './globals.css';
import LoadingBar from '@/components/LoadingBar';

export const metadata: Metadata = {
  title: 'DBA, Vibe Coder:JUNGYH',
  description: 'vibe coder by day, dba by night',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap"
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
