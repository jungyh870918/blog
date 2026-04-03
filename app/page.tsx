'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/posts';

export default function HomePage() {
  const [showArchive, setShowArchive] = useState(false);

  return (
    <div style={{
      margin: 0, padding: 0,
      minHeight: '100vh',
      backgroundColor: '#000', color: '#fff',
      fontFamily: "'VT323', monospace",
      overflow: showArchive ? 'auto' : 'hidden',
    }}>
      {/* 배경 GIF */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        backgroundImage: "url('/assets/parallax-bg.gif')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }} />

      {/* 다크 오버레이 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5,
        background: 'rgba(0,0,0,0.88)',
        opacity: showArchive ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* 네비게이션 */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
        position: 'fixed', width: '100%', boxSizing: 'border-box', top: 0, zIndex: 101,
      }}>
        <div style={{ display: 'flex', gap: '40px', fontSize: '1.6rem' }}>
          {[
            { label: 'HOME', href: '/', internal: true },
            { label: 'BLOG', onClick: () => setShowArchive(true) },
            { label: 'BOOKS', href: 'https://butter-black.vercel.app/', external: true },
            { label: 'STOCKS', href: 'https://stock-nine-blue.vercel.app/', external: true },
            { label: 'TEAM' },
          ].map((item) => {
            const style: React.CSSProperties = { textDecoration: 'none', color: 'white', cursor: item.onClick || item.href ? 'pointer' : 'default', transition: '0.3s' };
            if (item.internal) return (
              <Link key={item.label} href={item.href!} style={style}
                onMouseEnter={e => (e.currentTarget.style.color = '#d6517d')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>{item.label}</Link>
            );
            if (item.external) return (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={style}
                onMouseEnter={e => (e.currentTarget.style.color = '#d6517d')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>{item.label}</a>
            );
            if (item.onClick) return (
              <span key={item.label} onClick={item.onClick} style={style}
                onMouseEnter={e => (e.currentTarget.style.color = '#d6517d')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>{item.label}</span>
            );
            return <span key={item.label} style={style}>{item.label}</span>;
          })}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Image src="/assets/facebook_32x32.png" alt="FB" width={30} height={30}
            style={{ filter: 'drop-shadow(0 0 5px #d6517d)', cursor: 'pointer' }} />
          <Image src="/assets/twitter_32x32.png" alt="TW" width={30} height={30}
            style={{ filter: 'drop-shadow(0 0 5px #d6517d)', cursor: 'pointer' }} />
          <Image src="/assets/email_32x32.png" alt="MAIL" width={30} height={30}
            style={{ filter: 'drop-shadow(0 0 5px #d6517d)', cursor: 'pointer' }} />
        </div>
      </nav>

      {/* 히어로 */}
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        transition: 'all 0.8s ease', position: 'relative', zIndex: 10,
        opacity: showArchive ? 0 : 1,
        transform: showArchive ? 'translateY(-100px)' : 'translateY(0)',
        pointerEvents: showArchive ? 'none' : 'auto',
      }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(1.5rem, 5vw, 4rem)',
          textShadow: '6px 6px 0px #d6517d',
          marginBottom: '20px',
        }}>PROTOCOL:JUNGYH</h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 2rem)',
          maxWidth: '800px', marginBottom: '40px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
          padding: '0 20px',
        }}>
          SYSTEM 2026: DECODING HUMAN KNOWLEDGE...
        </p>
        <button
          onClick={() => setShowArchive(true)}
          style={{
            background: '#d6517d', color: 'white',
            padding: '25px 50px',
            fontFamily: "'Press Start 2P', cursive",
            border: 'none', boxShadow: '6px 6px 0px #000',
            fontSize: '1.2rem', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ff3860'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#d6517d'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          ENTER BLOG
        </button>
      </div>

      {/* 아카이브 */}
      {showArchive && (
        <div style={{
          position: 'absolute', top: '120px', left: '50%',
          transform: 'translateX(-50%)', width: '90%', maxWidth: '1200px',
          zIndex: 102, paddingBottom: '100px',
          animation: 'fadeIn 0.5s ease forwards',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

          <span
            onClick={() => setShowArchive(false)}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '0.9rem', color: 'white', cursor: 'pointer',
              marginBottom: '40px', display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d6517d')}
            onMouseLeave={e => (e.currentTarget.style.color = 'white')}
          >[ BACK TO MAIN ]</span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
          }}>
            {categories.map((cat) => (
              <section key={cat.id} style={{
                background: 'rgba(0,0,0,0.95)',
                border: '4px solid #000',
                boxShadow: '12px 12px 0px #d6517d',
                padding: '30px',
              }}>
                <span style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '1.5rem', color: '#d6517d',
                  marginBottom: '20px', display: 'block',
                  borderBottom: '2px solid #fff', paddingBottom: '10px',
                }}>{cat.label}</span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cat.comingSoon || cat.posts.length === 0 ? (
                    <li>
                      <span style={{ color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', opacity: 0.4 }}>
                        <span style={{ marginRight: '10px', color: '#d6517d' }}>&gt;</span>
                        DECODING...
                      </span>
                    </li>
                  ) : (
                    cat.posts.map((post) => (
                      <li key={post.slug} style={{ marginBottom: '15px' }}>
                        <Link
                          href={`/posts/${post.slug}`}
                          style={{ textDecoration: 'none', color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', transition: '0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#d6517d'; e.currentTarget.style.paddingLeft = '10px'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '0'; }}
                        >
                          <span style={{ marginRight: '10px', color: '#d6517d' }}>&gt;</span>
                          {post.title}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
