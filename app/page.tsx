'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/posts';
import ParallaxBg from '@/components/ParallaxBg';
import ProfileCard from '@/components/ProfileCard';

type View = 'hero' | 'hub' | 'blog' | 'profile';

// type: 'log' = 정보/블로그, 'service' = 실제 서비스
// group: LOG 하위 메뉴 구분자 (LOG_GROUPS 참조)
const NAV_LINKS = [
  // SERVICE
  { label: 'VOYAGE',    href: 'https://voyageapp.org/',                             type: 'service', desc: 'CONVERSATION'      },
  { label: 'VOYAGE',    href: 'https://voyage.jungbase.com/',                       type: 'service', desc: 'GRAMMAR & READING' },
  { label: 'BOOKS',     href: 'https://butter.jungbase.com/',                       type: 'service', desc: 'READING LOG'       },
  { label: 'ARCADE',    href: 'https://arcade.jungbase.com/',                       type: 'service', desc: 'WEB GAMES'         },
  { label: 'SOVEREIGN', href: 'https://sovereign-production-eca9.up.railway.app/',  type: 'service', desc: 'SIDE PROJECT'      },
  // LOG / ENGINEERING
  { label: 'AGENTIC',   href: 'https://jungyh870918.github.io/agentic-code/',        type: 'log', group: 'eng',    desc: 'ORCH SPEC'      },
  { label: 'SMART FAC', href: 'https://pms-nine-blond.vercel.app/',                  type: 'log', group: 'eng',    desc: 'SMART FACTORY'  },
  // LOG / LEARNING (개인 공부)
  { label: 'SQLP',      href: 'https://jungyh870918.github.io/sqlp/',                type: 'log', group: 'learn',  desc: 'CERT ARCHIVE'   },
  { label: 'DBA',       href: 'https://jungyh870918.github.io/dba/',                 type: 'log', group: 'learn',  desc: 'DB STUDY'       },
  { label: 'STUDY',     href: 'https://jungyh870918.github.io/study/',               type: 'log', group: 'learn',  desc: 'INTERVIEW PREP' },
  { label: 'BLOG',      href: '#blog',                                               type: 'log', group: 'learn',  desc: 'POST ARCHIVE'   },
  // LOG / MARKET (주식)
  { label: 'STOCKS',    href: 'https://stock-nine-blue.vercel.app/',                 type: 'log', group: 'market', desc: 'MARKET TRACKER' },
  { label: 'ROBO',      href: 'https://jungyh870918.github.io/hyundai/',             type: 'log', group: 'market', desc: 'ROBOT SECTOR'   },
];

const LOG_GROUPS = [
  { id: 'eng',    label: 'ENGINEERING', desc: 'SPEC & PROJECT'  },
  { id: 'learn',  label: 'LEARNING',    desc: 'PERSONAL STUDY'  },
  { id: 'market', label: 'MARKET',      desc: 'STOCKS & SECTOR' },
];

const F_TITLE = "'Jost', sans-serif";
const F_UI    = "'Jost', sans-serif";
const F_MONO  = "'Pixelify Sans', monospace";

// Celeste 메뉴 특유의 "톡" 튀는 선택 모션
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const TICKER_ITEMS = [
  'jungyh870918@gmail.com',
  'NODE', 'NEST', 'NEXT', 'ANGULAR', 'VUE', 'THREE.JS',
  'KUBERNETES', 'TERRAFORM', 'NGINX',
  'AWS', 'AZURE', 'ORACLE', 'MONGODB',
];

export default function HomePage() {
  const [view, setView] = useState<View>('hero');
  const overlayActive = view !== 'hero';

  // LOG 하위 메뉴 열림 상태 (기본: 모두 접힘)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (id: string) =>
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));

  // BGM
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.35);
  const [bgmReady, setBgmReady] = useState(false);

  useEffect(() => {
    const audio = new Audio('/assets/bgm.wav');
    audio.loop = true;
    audio.volume = bgmVolume;
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

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  // 허브 메뉴 바깥 클릭 시 hero로 복귀
  const handleHubBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setView('hero');
  };

  return (
    <div style={{
      margin: 0, padding: 0, minHeight: '100vh',
      backgroundColor: '#140b26', color: 'var(--cel-snow)',
      fontFamily: F_UI,
      // hub/hero: overflow hidden, blog: scroll
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
        @keyframes crystal-pulse {
          0%, 100% { opacity: 1;    transform: rotate(45deg) scale(1); }
          50%      { opacity: 0.72; transform: rotate(45deg) scale(0.88); }
        }
        @keyframes cta-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* 대시 크리스탈 — 45도로 세운 마름모 */
        .title-cursor {
          display: inline-block;
          width: clamp(13px, 1.7vw, 24px);
          height: clamp(13px, 1.7vw, 24px);
          background: linear-gradient(140deg, #9be6f2, #63c5da 55%, #3f9db3);
          margin-left: 18px;
          vertical-align: middle;
          transform: rotate(45deg);
          border-radius: 4px;
          box-shadow:
            0 0 12px rgba(99,197,218,0.9),
            0 0 34px rgba(99,197,218,0.55),
            0 0 70px rgba(99,197,218,0.3);
          animation: crystal-pulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* 히어로 CTA — 마들린 레드 알약 버튼 */
        .cta-btn {
          background: linear-gradient(150deg, #e87a7a, #dd5a5a 55%, #b94747);
          color: #fff5f5;
          padding: clamp(15px, 2.3vw, 22px) clamp(30px, 4vw, 54px);
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          letter-spacing: 0.2em;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px;
          box-shadow:
            0 10px 30px rgba(10,5,20,0.5),
            0 0 40px rgba(221,90,90,0.28),
            inset 0 1px 0 rgba(255,255,255,0.28);
          font-size: clamp(1rem, 2vw, 1.35rem);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          animation: cta-float 4.5s ease-in-out infinite;
          transition: transform 0.26s ${BOUNCE}, box-shadow 0.25s ease, filter 0.2s ease;
        }
        .cta-btn:hover, .cta-btn:focus-visible {
          transform: scale(1.06);
          filter: brightness(1.08);
          box-shadow:
            0 14px 40px rgba(10,5,20,0.55),
            0 0 60px rgba(221,90,90,0.45),
            inset 0 1px 0 rgba(255,255,255,0.35);
          outline: none;
        }
        .cta-btn:active { transform: scale(0.97); }

        /* 허브 스크롤 컨테이너 */
        .hub-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          max-height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(60px, 10vh, 100px) clamp(20px, 5vw, 40px) clamp(50px, 8vh, 80px);
          box-sizing: border-box;
        }

        /* ── Celeste 메뉴 버튼 ──
           원작 UI는 스프라이트가 아니라 "반투명 라운드 패널 + 흰 글씨 +
           선택 시 살짝 튀는 스케일" 이다. 하드 픽셀 그림자 대신
           부드러운 글로우와 bounce easing으로 그 느낌을 낸다. */
        .hub-btn {
          background: var(--cel-panel);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          color: var(--cel-snow);
          border: 1px solid rgba(240,242,245,0.14);
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(10,5,20,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
          padding: 18px 26px;
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: clamp(1.05rem, 1.7vw, 1.32rem);
          cursor: pointer;
          text-align: left;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          width: 100%;
          box-sizing: border-box;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition:
            transform 0.24s ${BOUNCE},
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        /* 선택 표시 — 왼쪽에서 자라나는 액센트 바 */
        .hub-btn::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 0;
          background: var(--cel-blue);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 12px var(--cel-blue);
          transition: height 0.24s ${BOUNCE};
        }
        .hub-btn:hover::before, .hub-btn:focus-visible::before { height: 60%; }
        .hub-btn:hover, .hub-btn:focus-visible {
          background: rgba(99,197,218,0.14);
          border-color: rgba(99,197,218,0.5);
          transform: translateX(8px) scale(1.015);
          box-shadow: 0 12px 32px rgba(10,5,20,0.5), 0 0 26px rgba(99,197,218,0.22);
          outline: none;
        }
        .hub-btn:active { transform: translateX(8px) scale(0.985); }

        /* PROFILE — 마들린 레드 */
        .hub-btn-accent {
          background: rgba(221,90,90,0.12);
          border-color: rgba(221,90,90,0.4);
        }
        .hub-btn-accent::before { background: var(--cel-red); box-shadow: 0 0 12px var(--cel-red); }
        .hub-btn-accent:hover, .hub-btn-accent:focus-visible {
          background: rgba(221,90,90,0.2);
          border-color: rgba(221,90,90,0.7);
          box-shadow: 0 12px 32px rgba(10,5,20,0.5), 0 0 26px rgba(221,90,90,0.25);
        }

        /* LOG 항목 — 한 단계 죽인 톤 */
        .hub-btn-dim {
          background: rgba(20,11,38,0.6);
          border-color: rgba(240,242,245,0.09);
          font-size: clamp(0.95rem, 1.5vw, 1.15rem);
          padding: 15px 22px;
        }

        /* LOG 하위 메뉴 헤더 */
        .sub-head {
          background: rgba(20,11,38,0.5);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          color: rgba(240,242,245,0.62);
          border: 1px solid rgba(240,242,245,0.08);
          border-radius: 10px;
          padding: 13px 20px;
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: clamp(0.88rem, 1.35vw, 1.05rem);
          letter-spacing: 2px;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .sub-head:hover { color: var(--cel-snow); border-color: rgba(99,197,218,0.35); }
        .sub-head.open {
          color: var(--cel-snow);
          border-color: rgba(99,197,218,0.45);
          background: rgba(99,197,218,0.08);
        }
        .sub-head-caret {
          color: var(--cel-blue);
          font-size: 0.8rem;
          transition: transform 0.24s ${BOUNCE};
          flex-shrink: 0;
        }
        .sub-head.open .sub-head-caret { transform: rotate(90deg); }

        /* LOG 하위 메뉴 항목 리스트 */
        .sub-list {
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.2vh, 12px);
          padding: clamp(6px, 1.2vh, 12px) 0 clamp(4px, 0.8vh, 8px) clamp(12px, 2vw, 22px);
          border-left: 2px solid rgba(99,197,218,0.35);
          margin-left: clamp(6px, 1vw, 10px);
          animation: fadeUp 0.25s ease;
        }

        .hub-btn-muted {
          background: rgba(20,11,38,0.4);
          color: rgba(240,242,245,0.28);
          border: 1px dashed rgba(240,242,245,0.12);
          border-radius: 12px;
          padding: 18px 26px;
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: clamp(1.05rem, 1.7vw, 1.32rem);
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .post-link {
          text-decoration: none;
          color: rgba(240,242,245,0.88);
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          font-size: clamp(0.95rem, 1.7vw, 1.15rem);
          display: flex;
          align-items: center;
          transition: color 0.2s, padding-left 0.24s ${BOUNCE};
          padding: 5px 0;
        }
        .post-link:hover { color: var(--cel-blue); padding-left: 10px; }
        .back-btn {
          background: rgba(20,11,38,0.55);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99,197,218,0.4);
          border-radius: 999px;
          color: var(--cel-blue);
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: clamp(0.78rem, 1.15vw, 0.95rem);
          letter-spacing: 2px;
          padding: 8px 18px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.24s ${BOUNCE}, box-shadow 0.2s;
          white-space: nowrap;
        }
        .back-btn:hover {
          background: rgba(99,197,218,0.18);
          color: var(--cel-snow);
          transform: translateX(-4px) scale(1.04);
          box-shadow: 0 0 20px rgba(99,197,218,0.25);
        }
        .to-main-btn {
          background: transparent;
          border: none;
          color: rgba(240,242,245,0.4);
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          cursor: pointer;
          letter-spacing: 3px;
          transition: color 0.2s, transform 0.24s ${BOUNCE};
          flex-shrink: 0;
        }
        .to-main-btn:hover { color: var(--cel-blue); transform: translateX(-5px); }

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
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.7rem, 1.1vw, 0.85rem);
          font-weight: 600;
          padding: 0 clamp(14px, 2.5vw, 28px);
          color: #fff;
          letter-spacing: 2px;
        }
        .ticker-item.email {
          color: var(--cel-gold);
          text-shadow: 0 0 10px rgba(242,180,76,0.6);
        }
        .ticker-sep {
          color: var(--cel-blue);
          opacity: 0.45;
          font-size: clamp(0.45rem, 0.9vw, 0.6rem);
          align-self: center;
          font-family: 'Jost', sans-serif;
        }

        /* BGM 컨트롤 */
        .bgm-bar {
          position: fixed;
          bottom: 20px; right: 20px;
          z-index: 300;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--cel-panel);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99,197,218,0.25);
          border-radius: 999px;
          padding: 7px 16px;
          box-shadow: 0 6px 20px rgba(10,5,20,0.45);
          transition: opacity 0.3s, border-color 0.2s;
        }
        .bgm-bar:hover { border-color: rgba(99,197,218,0.6); }
        .bgm-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--cel-blue);
          font-size: 1rem;
          padding: 0;
          line-height: 1;
          transition: color 0.2s, transform 0.24s ${BOUNCE};
        }
        .bgm-toggle:hover { color: var(--cel-snow); transform: scale(1.2); }
        .bgm-track {
          font-family: 'Jost', sans-serif;
          font-weight: 600;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1px;
          white-space: nowrap;
        }
        input[type=range].bgm-slider {
          width: 68px;
          accent-color: #63c5da;
          cursor: pointer;
        }
      `}</style>

      {/* 패럴랙스 배경 */}
      <ParallaxBg />

      {/* 다크 오버레이 — 0.45로 낮춰서 배경 살짝 보이게 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5,
        background: 'rgba(20,11,38,0.55)',
        opacity: overlayActive ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* ── 전광판 NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center',
        height: 'clamp(36px, 5vh, 48px)',
        background: 'rgba(20,11,38,0.78)',
        borderBottom: '1px solid rgba(99,197,218,0.25)',
        backdropFilter: 'blur(10px)',
        position: 'fixed', width: '100%', boxSizing: 'border-box', top: 0, zIndex: 101,
        gap: '12px',
        paddingRight: 'clamp(10px, 2vw, 20px)',
      }}>
        <div style={{
          background: 'linear-gradient(140deg, #9be6f2, #63c5da)',
          color: '#102b33', fontFamily: F_MONO, fontWeight: 600,
          fontSize: 'clamp(0.45rem, 0.85vw, 0.6rem)',
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
          <Image src="/assets/facebook_32x32.png" alt="FB"   width={22} height={22} style={{ filter: 'drop-shadow(0 0 6px rgba(99,197,218,0.7))', cursor: 'pointer' }} />
          <Image src="/assets/twitter_32x32.png"  alt="TW"   width={22} height={22} style={{ filter: 'drop-shadow(0 0 6px rgba(99,197,218,0.7))', cursor: 'pointer' }} />
          <Image src="/assets/email_32x32.png"    alt="MAIL" width={22} height={22} style={{ filter: 'drop-shadow(0 0 6px rgba(99,197,218,0.7))', cursor: 'pointer' }} />
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
          fontFamily: F_TITLE, fontWeight: 300,
          fontSize: 'clamp(2rem, 6vw, 4.8rem)',
          textShadow: '0 0 40px rgba(99,197,218,0.35), 0 6px 30px rgba(10,5,20,0.8)',
          letterSpacing: '0.14em', marginBottom: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span>JUNGYH</span>
          <span className="title-cursor" />
        </h1>
        <p style={{
          fontFamily: F_UI, fontWeight: 500,
          fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
          maxWidth: '700px', marginBottom: '52px',
          letterSpacing: '0.25em',
          color: 'rgba(240,242,245,0.72)',
          textShadow: '0 2px 16px rgba(10,5,20,0.8)',
          padding: '0 20px',
        }}>
          where human intent becomes machine execution
        </p>
        <button className="cta-btn" onClick={() => { setView('hub'); startBgm(); }}>
          <span>READ.ME</span>
          <span style={{ fontWeight: 400, letterSpacing: '0.15em', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)', opacity: 0.7 }}>[ YOU FOUND IT ]</span>
        </button>
      </div>

      {/* ── BGM 컨트롤 ── */}
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

      {/* ── HUB ──
          - position: fixed + inset:0 으로 전체 덮기
          - 바깥 클릭(backdrop) → hero 복귀
          - 내부는 .hub-scroll 로 스크롤 처리
      */}
      {view === 'hub' && (
        <>
          {/* 바깥 클릭 감지용 backdrop — 메뉴 카드 뒤를 완전히 덮음 */}
          <div
            onClick={() => setView('hero')}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              cursor: 'default',
            }}
          />
          {/* 실제 메뉴 컨텐츠 — backdrop 위에 띄움, 클릭 이벤트 전파 막기 */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', inset: 0, zIndex: 201,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none', // 빈 공간은 아래 backdrop으로 통과
              animation: 'fadeIn 0.4s ease forwards',
            }}
          >
          <div className="hub-scroll" style={{ pointerEvents: 'auto' }}>
            <p style={{
              fontFamily: F_UI, fontWeight: 600,
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              color: 'var(--cel-blue)', letterSpacing: '8px',
              marginBottom: 'clamp(20px, 3vh, 36px)', opacity: 0.85,
              textShadow: '0 0 20px rgba(99,197,218,0.4)',
              flexShrink: 0,
            }}>SELECT DESTINATION</p>

            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: 'clamp(6px, 1.2vh, 12px)',
              width: '100%', maxWidth: 'clamp(300px, 50vw, 520px)',
            }}>

              {/* ── PROFILE ── */}
              <button className="hub-btn hub-btn-accent" onClick={() => setView('profile')}
                style={{ marginBottom: 'clamp(4px, 1vh, 8px)' }}>
                <span style={{ color: 'var(--cel-red)', fontSize: '0.62em' }}>◆</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>PROFILE</span>
                  <span style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', opacity: 0.5, letterSpacing: '2px', fontWeight: 500 }}>SMART FACTORY ENGINEER</span>
                </span>
                <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.5, marginLeft: 'auto', flexShrink: 0 }}>›</span>
              </button>

              {/* ── SERVICES ── */}
              <div style={{
                fontFamily: F_UI, fontWeight: 700, letterSpacing: '4px',
                fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
                color: 'var(--cel-blue)', opacity: 0.65,
                paddingLeft: '6px', marginBottom: '2px',
              }}>SERVICE</div>

              {NAV_LINKS.filter(l => l.type === 'service').map(({ label, href, desc }, i) => (
                <a key={`svc-${i}`} className="hub-btn" href={href} target="_blank" rel="noreferrer">
                  <span style={{ color: 'var(--cel-blue)', fontSize: '0.62em' }}>◆</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>{label}</span>
                    {desc && <span style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', opacity: 0.45, letterSpacing: '2px', fontWeight: 500 }}>{desc}</span>}
                  </span>
                  <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.5, marginLeft: 'auto', flexShrink: 0 }}>↗</span>
                </a>
              ))}

              {/* ── LOGS ── */}
              <div style={{
                fontFamily: F_UI, fontWeight: 700, letterSpacing: '4px',
                fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
                color: 'rgba(240,242,245,0.45)', opacity: 0.8,
                paddingLeft: '6px', marginTop: 'clamp(6px, 1vh, 12px)', marginBottom: '2px',
              }}>LOG</div>

              {LOG_GROUPS.map((group) => {
                const items = NAV_LINKS.filter(l => l.type === 'log' && l.group === group.id);
                const open = !!openGroups[group.id];
                return (
                  <div key={group.id}>
                    <button
                      className={`sub-head${open ? ' open' : ''}`}
                      onClick={() => toggleGroup(group.id)}
                      aria-expanded={open}
                    >
                      <span className="sub-head-caret">▸</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span>{group.label}</span>
                        <span style={{ fontSize: 'clamp(0.5rem, 0.85vw, 0.62rem)', opacity: 0.4, letterSpacing: '2px', fontWeight: 500 }}>{group.desc}</span>
                      </span>
                      <span style={{ fontSize: 'clamp(0.5rem, 0.85vw, 0.62rem)', opacity: 0.35, marginLeft: 'auto', flexShrink: 0 }}>
                        {String(items.length).padStart(2, '0')}
                      </span>
                    </button>

                    {open && (
                      <div className="sub-list">
                        {items.map(({ label, href, desc }, i) => (
                          label === 'BLOG' ? (
                            <button key={`log-${group.id}-${i}`} className="hub-btn hub-btn-dim" onClick={() => setView('blog')}>
                              <span style={{ color: 'rgba(99,197,218,0.55)', fontSize: '0.62em' }}>◆</span>
                              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>{label}</span>
                                {desc && <span style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', opacity: 0.45, letterSpacing: '2px', fontWeight: 500 }}>{desc}</span>}
                              </span>
                              <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.5, marginLeft: 'auto', flexShrink: 0 }}>›</span>
                            </button>
                          ) : (
                            <a key={`log-${group.id}-${i}`} className="hub-btn hub-btn-dim" href={href} target="_blank" rel="noreferrer">
                              <span style={{ color: 'rgba(99,197,218,0.55)', fontSize: '0.62em' }}>◆</span>
                              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>{label}</span>
                                {desc && <span style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', opacity: 0.45, letterSpacing: '2px', fontWeight: 500 }}>{desc}</span>}
                              </span>
                              <span style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.55rem)', opacity: 0.5, marginLeft: 'auto', flexShrink: 0 }}>↗</span>
                            </a>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── COMING SOON ── */}
              <div className="hub-btn-muted" style={{ marginTop: 'clamp(4px, 0.8vh, 8px)' }}>
                <span style={{ fontSize: '0.62em' }}>◆</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>TEAM</span>
                  <span style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', letterSpacing: '2px', fontWeight: 500 }}>COMING SOON</span>
                </span>
              </div>
            </div>

            <button
              className="to-main-btn"
              style={{ marginTop: 'clamp(20px, 3vh, 40px)' }}
              onClick={() => setView('hero')}
            >
              ← BACK TO MAIN
            </button>
          </div>
          </div>
        </>
      )}

      {/* ── PROFILE ── */}
      {view === 'profile' && (
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
            maxWidth: '760px',
            margin: '0 auto',
            padding: 'clamp(16px, 3vw, 32px)',
          }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
              <button className="back-btn" onClick={() => setView('hub')}>← BACK</button>
              <span style={{
                fontFamily: F_UI, fontWeight: 600, letterSpacing: '3px',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                color: 'var(--cel-snow)', opacity: 0.45,
              }}>PROFILE / CLIMBER RECORD</span>
            </div>

            <ProfileCard />
          </div>
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
            padding: 'clamp(16px, 3vw, 32px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'clamp(20px, 4vh, 40px)' }}>
              <button className="back-btn" onClick={() => setView('hub')}>← BACK</button>
              <span style={{
                fontFamily: F_UI, fontWeight: 600, letterSpacing: '3px',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                color: 'var(--cel-snow)', opacity: 0.45,
              }}>BLOG / ARCHIVE</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px, 28vw, 280px), 1fr))',
              gap: 'clamp(16px, 3vw, 30px)',
            }}>
              {categories.map((cat) => (
                <section key={cat.id} style={{
                  background: 'var(--cel-panel)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(240,242,245,0.12)',
                  borderRadius: '14px',
                  boxShadow: '0 12px 34px rgba(10,5,20,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                  padding: 'clamp(16px, 3vw, 30px)',
                }}>
                  <span style={{
                    fontFamily: F_TITLE, fontWeight: 600,
                    fontSize: 'clamp(0.95rem, 1.9vw, 1.3rem)',
                    color: 'var(--cel-blue)', marginBottom: '16px', display: 'block',
                    borderBottom: '1px solid rgba(99,197,218,0.25)', paddingBottom: '10px',
                    letterSpacing: '0.12em',
                  }}>{cat.label}</span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cat.comingSoon || cat.posts.length === 0 ? (
                      <li>
                        <span style={{ fontFamily: F_MONO, color: 'var(--cel-snow)', fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)', display: 'flex', alignItems: 'center', opacity: 0.35 }}>
                          <span style={{ marginRight: '10px', color: 'var(--cel-blue)' }}>◆</span>DECODING...
                        </span>
                      </li>
                    ) : (
                      cat.posts.map((post) => (
                        <li key={post.slug} style={{ marginBottom: '10px' }}>
                          <Link href={post.href ?? `/posts/${post.slug}`} className="post-link" target="_blank" rel="noreferrer">
                            <span style={{ marginRight: '10px', color: 'var(--cel-blue)', fontSize: '0.7em' }}>◆</span>
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
