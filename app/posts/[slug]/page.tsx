import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { getPostBySlug, posts } from '@/lib/posts';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} | PROTOCOL:JUNGYH` };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* MathJax - Next.js Script 컴포넌트로 올바르게 로드 */}
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=es6"
        strategy="beforeInteractive"
      />
      <Script
        id="MathJax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="afterInteractive"
      />

      <div style={{
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        lineHeight: 1.7, color: '#334155',
        backgroundColor: '#fdfdfd', margin: 0, padding: '40px 20px',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto 20px auto' }}>
          <Link href="/" style={{
            textDecoration: 'none', color: '#3b82f6',
            fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px',
          }}>
            ← 메인 페이지로 돌아가기
          </Link>
        </div>

        <div style={{
          maxWidth: '900px', margin: '0 auto',
          background: 'white', padding: 'clamp(24px, 5vw, 50px)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: '#0f172a', textAlign: 'center',
            marginBottom: post!.subtitle ? '12px' : '50px',
            letterSpacing: '-1px',
            fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
          }}>
            {post!.title}
          </h1>

          {post!.subtitle && (
            <p style={{
              textAlign: 'center', color: '#64748b',
              fontSize: '1rem', marginBottom: '50px',
            }}>
              {post!.subtitle}
            </p>
          )}

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post!.content }}
          />

          <div style={{
            marginTop: '50px', textAlign: 'center',
            borderTop: '1px solid #e2e8f0', paddingTop: '20px',
            fontSize: '0.8rem', color: '#94a3b8',
          }}>
            본 문서는 OS의 기본 원리를 바탕으로 최신 개발 트렌드를 반영하여 재구성되었습니다.
          </div>
        </div>
      </div>
    </>
  );
}
