'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/posts';
import ParallaxBg from '@/components/ParallaxBg';

type View = 'hero' | 'hub' | 'blog';

const NAV_LINKS = [
  { label: 'BOOKS', href: 'https://butter-black.vercel.app/' },
  { label: 'STOCKS', href: 'https://stock-nine-blue.vercel.app/' },
  { label: 'VOCAB', href: 'https://streaming-production-40fd.up.railway.app/' },
  { label: 'DBA', href: 'https://jungyh870918.github.io/dba/' },
];

// 폰트
const F_TITLE = "'Orbitron', sans-serif";
const F_UI    = "'Rajdhani', sans-serif";
const F_MONO  = "'VT323', monospace";

const TICKER_ITEMS = [
  'jungyh870918@gmail.com',
  'NODE', 'NEST', 'NEXT', 'ANGULAR', 'VUE', 'THREE.JS',
  'KUBERNETES', 'TERRAFORM', 'NGINX',
  'AWS', 'AZURE', 'ORACLE', 'MONGODB',
];

export default function HomePage() {
  const [view, setView] = useState<View>('hero');
  const overlayActive = view !== 'hero';

  // BGM
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.35);
  const [bgmReady, setBgmReady] = useState(false); // 파일 존재 여부

  useEffect(() => {
    const audio = new Audio('/assets/bgm.wav');
    audio.loop = true;
    audio.volume = bgmVolume;
    // canplaythrough 이벤트로 파일 존재 확인
    audio.addEventListener('canplaythrough', () => setBgmReady(true), { once: true });
    audio.addEventListener('error', () => setBgmReady(false), { once: true });
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startBgm = () => {
    if (!audioRef.current || !bgmReady) return;
    audioRef.current.play().catch(() => {});
    setBgmPlaying(true);
  };

  const toggleBgm = () => {
    if (!audioRef.current) return;
    if (bgmPlaying) {
      audioRef.current.pause();
      setBgmPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setBgmPlaying(true);
    }
  };

  const handleVolume = (v: number) => {
    setBgmVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // 전광판용: 2번 복제해서 끊김 없이 순환
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div style={{
      margin: 0, padding: 0, minHeight: '100vh',
      backgroundColor: '#000', color: '#fff',
      fontFamily: F_MONO,
      overflow: view === 'blog' ? 'auto' : 'hidden',
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cursor-blink {
          0%, 49%  { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes typing {
          from { width: 0; }
          to   { width: 100%; }
        }
        .title-cursor {
          display: inline-block;
          width: clamp(14px, 2vw, 28px);
          height: 0.9em;
          background: #ff3860;
          margin-left: 10px;
          vertical-align: middle;
          box-shadow:
            0 0 8px  #ff3860,
            0 0 20px #ff3860,
            0 0 45px rgba(255,56,96,0.9),
            0 0 80px rgba(255,56,96,0.5);
          animation: cursor-blink 0.85s step-end infinite;
          flex-shrink: 0;
          border-radius: 2px;
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .hub-btn {
          background: rgba(0,0,0,0.9);
          color: #fff;
          border: 3px solid #d6517d;
          box-shadow: 6px 6px 0px #d6517d;
          padding: 22px 32px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          cursor: pointer;
          text-align: left;
          letter-spacing: 3px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
          width: 100%;
          box-sizing: border-box;
        }
        .hub-btn:hover, .hub-btn:active {
          background: #d6517d;
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px #000;
        }
        .hub-btn-muted {
          background: rgba(0,0,0,0.5);
          color: #555;
          border: 3px solid #333;
          box-shadow: none;
          padding: 22px 32px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          letter-spacing: 3px;
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .post-link {
          text-decoration: none;
          color: #fff;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          display: flex;
          align-items: center;
          transition: color 0.15s, padding-left 0.15s;
          padding: 4px 0;
        }
        .post-link:hover { color: #d6517d; padding-left: 10px; }
        .back-btn {
          background: transparent;
          border: 2px solid #d6517d;
          color: #d6517d;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: clamp(0.8rem, 1.2vw, 1rem);
          letter-spacing: 2px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .back-btn:hover { background: #d6517d; color: #fff; }
        .to-main-btn {
          background: transparent;
          border: none;
          color: #888;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          cursor: pointer;
          letter-spacing: 3px;
          transition: color 0.15s;
        }
        .to-main-btn:hover { color: #d6517d; }

        /* 전광판 */
        .ticker-wrap {
          overflow: hidden;
          white-space: nowrap;
          flex: 1;
          mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent);
        }
        .ticker-inner {
          display: inline-flex;
          gap: 0;
          animation: ticker 28s linear infinite;
        }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(0.7rem, 1.1vw, 0.85rem);
          font-weight: 600;
          padding: 0 clamp(14px, 2.5vw, 28px);
          color: #fff;
          letter-spacing: 2px;
        }
        .ticker-item.email {
          color: #d6517d;
          text-shadow: 0 0 8px #d6517d;
        }
        .ticker-sep {
          color: #d6517d;
          opacity: 0.5;
          font-size: clamp(0.45rem, 0.9vw, 0.6rem);
          align-self: center;
          font-family: 'Rajdhani', sans-serif;
        }

        /* BGM 컨트롤 */
        .bgm-bar {
          position: fixed;
          bottom: 20px; right: 20px;
          z-index: 300;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(214,81,125,0.35);
          border-radius: 4px;
          padding: 7px 14px;
          transition: opacity 0.3s;
        }
        .bgm-bar:hover { border-color: #d6517d; }
        .bgm-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #d6517d;
          font-size: 1rem;
          padding: 0;
          line-height: 1;
          transition: color 0.15s, transform 0.15s;
        }
        .bgm-toggle:hover { color: #ff3860; transform: scale(1.15); }
        .bgm-track {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1px;
          white-space: nowrap;
        }
        input[type=range].bgm-slider {
          width: 68px;
          accent-color: #d6517d;
          cursor: pointer;
        }
      `}</style>

      {/* 패럴랙스 배경 */}
      <ParallaxBg />

      {/* 다크 오버레이 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5,
        background: 'rgba(0,0,0,0.88)',
        opacity: overlayActive ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* ── 전광판 NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center',
        height: 'clamp(36px, 5vh, 48px)',
        background: 'rgba(0,0,0,0.85)',
        borderBottom: '2px solid #d6517d',
        backdropFilter: 'blur(5px)',
        position: 'fixed', width: '100%', boxSizing: 'border-box', top: 0, zIndex: 101,
        gap: '12px',
        paddingRight: 'clamp(10px, 2vw, 20px)',
      }}>
        <div style={{
          background: '#d6517d',
          color: '#000', fontFamily: F_UI,
          fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)',
          padding: '0 clamp(8px, 1.5vw, 14px)',
          height: '100%', display: 'flex', alignItems: 'center',
          whiteSpace: 'nowrap', flexShrink: 0,
          letterSpacing: '1px',
        }}>SIGNAL</div>

        <div className="ticker-wrap">
          <div className="ticker-inner">
            {tickerContent.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span className={`ticker-item${item.includes('@') ? ' email' : ''}`}>
                  {item}
                </span>
                <span className="ticker-sep">◆</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'clamp(8px, 1.5vw, 14px)', flexShrink: 0 }}>
          <Image src="/assets/facebook_32x32.png" alt="FB"   width={22} height={22} style={{ filter: 'drop-shadow(0 0 4px #d6517d)', cursor: 'pointer' }} />
          <Image src="/assets/twitter_32x32.png"  alt="TW"   width={22} height={22} style={{ filter: 'drop-shadow(0 0 4px #d6517d)', cursor: 'pointer' }} />
          <Image src="/assets/email_32x32.png"    alt="MAIL" width={22} height={22} style={{ filter: 'drop-shadow(0 0 4px #d6517d)', cursor: 'pointer' }} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        position: 'relative', zIndex: 10,
        opacity: overlayActive ? 0 : 1,
        transform: overlayActive ? 'translateY(-60px)' : 'translateY(0)',
        pointerEvents: overlayActive ? 'none' : 'auto',
      }}>
        <h1 style={{
          fontFamily: F_TITLE,
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 5.5vw, 4.5rem)',
          textShadow: '0 0 30px rgba(214,81,125,0.6), 4px 4px 0px rgba(214,81,125,0.4)',
          letterSpacing: '0.05em',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span>&gt;&nbsp;JUNGYH</span>
          <span className="title-cursor" />
        </h1>
        <p style={{
          fontFamily: F_UI,
          fontWeight: 500,
          fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
          maxWidth: '700px', marginBottom: '48px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.75)',
          padding: '0 20px',
        }}>
          somewhere between the skyline and the syntax
        </p>
        <button
          onClick={() => { setView('hub'); startBgm(); }}
          style={{
            background: '#d6517d', color: 'white',
            padding: 'clamp(16px, 2.5vw, 25px) clamp(28px, 4vw, 50px)',
            fontFamily: F_UI,
            fontWeight: 700,
            letterSpacing: '0.2em',
            border: 'none', boxShadow: '6px 6px 0px rgba(0,0,0,0.6)',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ff3860'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#d6517d'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span>READ.ME</span>
          <span style={{ fontFamily: F_UI, fontWeight: 500, letterSpacing: '0.15em', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)', opacity: 0.75 }}>[ YOU FOUND IT ]</span>
        </button>
      </div>

      {/* ── BGM 컨트롤 (파일 로드됐을 때만 표시) ── */}
      {bgmReady && (
        <div className="bgm-bar">
          <button className="bgm-toggle" onClick={toggleBgm} title={bgmPlaying ? '일시정지' : '재생'}>
            {bgmPlaying ? '⏸' : '▶'}
          </button>
          <input
            type="range" className="bgm-slider"
            min={0} max={1} step={0.01}
            value={bgmVolume}
            onChange={e => handleVolume(Number(e.target.value))}
          />
          <span className="bgm-track">TOKYO — HIJAQ</span>
        </div>
      )}

      {/* ── HUB ── */}
      {view === 'hub' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: 'clamp(60px, 10vh, 100px) clamp(20px, 5vw, 40px) clamp(30px, 5vh, 60px)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <p style={{
            fontFamily: F_UI,
            fontWeight: 600,
            fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
            color: '#d6517d', letterSpacing: '6px',
            marginBottom: 'clamp(24px, 4vh, 48px)', opacity: 0.9,
          }}>// SELECT DESTINATION</p>

          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 'clamp(10px, 2vh, 18px)',
            width: '100%', maxWidth: 'clamp(300px, 50vw, 520px)',
          }}>
            <button className="hub-btn" onClick={() => setView('blog')}>
              <span style={{ color: '#d6517d' }}>&gt;</span>
              BLOG
              <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.6, marginLeft: 'auto' }}>ARCHIVE ›</span>
            </button>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} className="hub-btn" href={href} target="_blank" rel="noreferrer"
                style={{ borderColor: '#555', boxShadow: '6px 6px 0px #333' }}>
                <span style={{ color: '#888' }}>&gt;</span>
                {label}
                <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.5, marginLeft: 'auto' }}>↗ EXTERNAL</span>
              </a>
            ))}
            <div className="hub-btn-muted">
              <span>&gt;</span> TEAM
              <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', marginLeft: 'auto' }}>SOON</span>
            </div>
          </div>

          <button className="to-main-btn" style={{ marginTop: 'clamp(24px, 4vh, 48px)' }}
            onClick={() => setView('hero')}>
            ← BACK TO MAIN
          </button>
        </div>
      )}

      {/* ── BLOG ARCHIVE ── */}
      {view === 'blog' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          minHeight: '100vh',
          zIndex: 200,
          paddingTop: 'clamp(56px, 8vh, 80px)',
          paddingBottom: 'clamp(60px, 10vh, 100px)',
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'clamp(20px, 4vh, 40px)' }}>
              <button className="back-btn" onClick={() => setView('hub')}>← BACK</button>
              <span style={{
                fontFamily: F_UI,
                fontWeight: 600,
                letterSpacing: '3px',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                color: '#fff', opacity: 0.5,
              }}>BLOG / ARCHIVE</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px, 28vw, 280px), 1fr))',
              gap: 'clamp(16px, 3vw, 30px)',
            }}>
              {categories.map((cat) => (
                <section key={cat.id} style={{
                  background: 'rgba(0,0,0,0.95)',
                  border: '4px solid #000',
                  boxShadow: '10px 10px 0px #d6517d',
                  padding: 'clamp(16px, 3vw, 30px)',
                }}>
                  <span style={{
                    fontFamily: F_TITLE,
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    color: '#d6517d', marginBottom: '16px', display: 'block',
                    borderBottom: '2px solid #fff', paddingBottom: '10px',
                    letterSpacing: '0.1em',
                  }}>{cat.label}</span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cat.comingSoon || cat.posts.length === 0 ? (
                      <li>
                        <span style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.8rem)', display: 'flex', alignItems: 'center', opacity: 0.4 }}>
                          <span style={{ marginRight: '10px', color: '#d6517d' }}>&gt;</span>DECODING...
                        </span>
                      </li>
                    ) : (
                      cat.posts.map((post) => (
                        <li key={post.slug} style={{ marginBottom: '10px' }}>
                          <Link href={`/posts/${post.slug}`} className="post-link">
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
        </div>
      )}
    </div>
  );
}
