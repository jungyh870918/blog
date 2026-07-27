import type { Metadata } from 'next';
import GlossaryBrowser from '@/components/GlossaryBrowser';

export const metadata: Metadata = {
  title: '설비 객체 에디터 · 업계 용어집 | DBA, Vibe Coder:JUNGYH',
  description:
    '디지털 트윈 설비 객체 에디터 프로젝트에서 실제로 오가는 제조·3D·스트리밍·산업 표준·SW 아키텍처 용어 정리.',
};

export default function GlossaryPage() {
  return (
    <>
      {/* 용어집 전용 타이포그래피 (React가 <head>로 호이스팅) */}
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <GlossaryBrowser />
    </>
  );
}
