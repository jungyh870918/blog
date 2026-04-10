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
  return { title: `${post.title} | DBA, Vibe Coder:JUNGYH` };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=es6"
        strategy="beforeInteractive"
      />
      <Script
        id="MathJax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-white">
        {/* --- 상단 히어로 헤더 --- */}
        <header className="relative py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
          {/* 배경 패턴 장식 */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6">
            <nav className="mb-8 flex items-center gap-2">
              <Link href="/" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                ← BACK TO HUB
              </Link>
              <span className="text-slate-300">/</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
                {post.category || 'System'}
              </span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                {post.subtitle}
              </p>
            )}

            <div className="mt-10 flex items-center gap-4 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-500 font-bold text-xs">
                  DY
                </div>
                <span className="text-slate-600">Daniel Jung</span>
              </div>
              <span>•</span>
              <span>April 2024</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400" /> Stable Release
              </span>
            </div>
          </div>
        </header>

        {/* --- 본문 내용 --- */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <article 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* --- 하단 푸터 --- */}
          <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 mb-8">
              본 문서는 OS의 핵심 원리와 실무 아키텍처를 바탕으로 작성되었습니다.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200"
            >
              다른 프로토콜 탐색하기
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
