'use client';

import Image from 'next/image';

// ─── 스탯 데이터 ───────────────────────────────────────────────
// 셀레스트의 이동 능력을 스킬 그룹의 은유로 쓴다.
// 대시 = 추진력(핵심 도메인), 등반 = 버티는 힘(자동화), 점프 = 도약(데이터),
// 그랩 = 붙잡는 손(개발 기본기), 지구력 = 오래 가는 힘(운영)
const STAT_GROUPS = [
  {
    label: '대시 · 제조 도메인',
    sub: 'DASH',
    color: '#dd5a5a',
    glow: 'rgba(221,90,90,0.6)',
    tier: 'S',
    stats: [
      { name: 'MES (제조실행)',      val: 97 },
      { name: 'PLM (제품수명주기)',  val: 94 },
      { name: 'ERP (전사자원관리)',  val: 92 },
      { name: '생산 스케줄링',        val: 90 },
    ],
  },
  {
    label: '등반 · 다크팩토리',
    sub: 'CLIMB',
    color: '#f2b44c',
    glow: 'rgba(242,180,76,0.5)',
    tier: 'S',
    stats: [
      { name: '무인화 라인 설계',   val: 95 },
      { name: '설비 자동화 (PLC)',  val: 91 },
      { name: 'SCADA / HMI',        val: 89 },
      { name: 'OPC-UA / MQTT',      val: 87 },
    ],
  },
  {
    label: '점프 · 데이터 & 클라우드',
    sub: 'JUMP',
    color: '#63c5da',
    glow: 'rgba(99,197,218,0.5)',
    tier: 'A',
    stats: [
      { name: 'Oracle DB',        val: 89 },
      { name: '설비 데이터 파이프라인', val: 88 },
      { name: 'AWS (EC2/S3/RDS)', val: 87 },
      { name: 'MongoDB',          val: 84 },
    ],
  },
  {
    label: '그랩 · 개발 베이스',
    sub: 'GRAB',
    color: '#a394c7',
    glow: 'rgba(163,148,199,0.5)',
    tier: 'A',
    stats: [
      { name: 'Node.js / NestJS', val: 92 },
      { name: 'TypeScript',       val: 91 },
      { name: 'Next.js',          val: 88 },
      { name: 'Git',              val: 99 },
    ],
  },
  {
    label: '지구력 · 운영 & 배포',
    sub: 'STAMINA',
    color: '#7fd4a8',
    glow: 'rgba(127,212,168,0.45)',
    tier: 'B',
    stats: [
      { name: 'CI/CD',      val: 90 },
      { name: 'Terraform',  val: 88 },
      { name: 'Docker',     val: 86 },
      { name: '모니터링',    val: 84 },
    ],
  },
];

// ─── 좌측 패널 ────────────────────────────────────────────────
const IDENTITY = [
  { k: '클래스',   v: '스마트팩토리 엔지니어' },
  { k: '등반 루트', v: '다크팩토리' },
  { k: '파티',     v: '솔로 등반' },
];

// 셀레스트 챕터 클리어 화면의 기록판
const RECORDS = [
  { k: '딸기 수집', v: '118/175', pct: '' },
  { k: '도달 고도', v: '5,000',   pct: 'm'     },
  { k: '데스 카운트', v: '3,842', pct: ''      },
  { k: '골든 딸기', v: '2',       pct: ''      },
];

// ─── StatBar ──────────────────────────────────────────────────
function StatBar({ name, val, color, glow }: { name: string; val: number; color: string; glow: string }) {
  return (
    <div style={{ marginBottom: '7px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: '3px',
      }}>
        <span style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 600,
          fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)',
          color: 'rgba(255,255,255,0.75)', letterSpacing: '1px',
        }}>{name}</span>
        <span style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 700,
          fontSize: 'clamp(0.6rem, 0.9vw, 0.7rem)',
          color,
        }}>{val}</span>
      </div>
      <div style={{
        height: '5px', background: 'rgba(255,255,255,0.08)',
        borderRadius: '6px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%', width: `${val}%`,
          background: `linear-gradient(to right, ${color}99, ${color})`,
          boxShadow: `0 0 6px ${glow}`,
          borderRadius: '6px',
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

// ─── TierBadge ────────────────────────────────────────────────
function TierBadge({ tier, color, glow }: { tier: string; color: string; glow: string }) {
  return (
    <span style={{
      fontFamily: "'Jost', sans-serif", fontWeight: 900,
      fontSize: '0.65rem',
      color,
      border: `1px solid ${color}`,
      boxShadow: `0 0 6px ${glow}, inset 0 0 6px ${glow}30`,
      padding: '1px 6px',
      borderRadius: '6px',
      letterSpacing: '1px',
      flexShrink: 0,
    }}>{tier}</span>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ProfileCard() {
  return (
    <div style={{
      fontFamily: "'Pixelify Sans', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(16px, 3vw, 32px)',
    }}>
      <style>{`
        .profile-card {
          background: linear-gradient(160deg, rgba(30,17,56,0.92) 0%, rgba(20,11,38,0.94) 60%, rgba(35,23,56,0.92) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99,197,218,0.22);
          box-shadow:
            0 18px 50px rgba(10,5,20,0.55),
            inset 0 1px 0 rgba(255,255,255,0.07);
          width: 100%;
          max-width: 680px;
          position: relative;
          overflow: hidden;
        }
        .profile-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #63c5da, #a394c7, #dd5a5a, transparent);
        }
        /* 눈발 — 카드 안쪽에도 살짝 */
        .scanline {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 80% at 50% 0%, rgba(99,197,218,0.07), transparent 60%);
          pointer-events: none;
          z-index: 1;
        }
        .stat-group {
          margin-bottom: 14px;
        }
        .group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .group-label {
          font-family: 'Jost', sans-serif;
          font-weight: 700;
          font-size: clamp(0.72rem, 1.1vw, 0.85rem);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="profile-card" style={{ borderRadius: '14px' }}>
        <div className="scanline" />

        {/* ── 상단 헤더 ── */}
        <div style={{
          background: 'rgba(221,90,90,0.08)',
          borderBottom: '1px solid rgba(221,90,90,0.2)',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <span style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 700,
            fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
            color: '#dd5a5a', letterSpacing: '3px',
          }}>CLIMBER RECORD</span>
          <span style={{
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
          }}>SUMMIT</span>
        </div>

        {/* ── 본문 ── */}
        <div style={{
          display: 'flex', gap: 'clamp(12px, 2vw, 24px)',
          padding: 'clamp(12px, 2vw, 20px)',
          position: 'relative', zIndex: 2,
          flexWrap: 'wrap',
        }}>
          {/* 왼쪽: 캐릭터 이미지 + 기본 정보 */}
          <div style={{ flexShrink: 0, width: 'clamp(130px, 25%, 180px)' }}>
            {/* 이미지 프레임 */}
            <div style={{
              border: '1px solid rgba(99,197,218,0.35)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(10,5,20,0.5)',
              background: '#1a0f2e',
              marginBottom: '10px',
              position: 'relative',
              aspectRatio: '1',
              overflow: 'hidden',
            }}>
              <Image
                src="/assets/profile.png"
                alt="JUNGYH"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top', imageRendering: 'pixelated' }}
              />
              {/* 이미지 위 오버레이 */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(20,11,38,0.85))',
              }} />
            </div>

            {/* 기본 정보 */}
            <div style={{
              background: 'rgba(20,11,38,0.5)', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '8px 10px',
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            }}>
              {IDENTITY.map(({ k, v }) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  gap: '4px', marginBottom: '4px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  paddingBottom: '4px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{k}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'right', fontSize: '0.9em', wordBreak: 'keep-all' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* 핵심 수치 */}
            <div style={{
              marginTop: '8px',
              background: 'rgba(242,180,76,0.07)',
              border: '1px solid rgba(242,180,76,0.22)',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            }}>
              {RECORDS.map(({ k, v, pct }) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  gap: '4px', marginBottom: '3px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{k}</span>
                  <span style={{ color: 'var(--cel-gold)', whiteSpace: 'nowrap' }}>{v} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85em' }}>{pct}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 스탯 그룹들 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {STAT_GROUPS.map((group) => (
              <div key={group.label} className="stat-group">
                <div className="group-header">
                  <TierBadge tier={group.tier} color={group.color} glow={group.glow} />
                  <span className="group-label" style={{ color: group.color, textShadow: `0 0 8px ${group.glow}` }}>
                    {group.label}
                  </span>
                  <span style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: 'clamp(0.55rem, 0.85vw, 0.66rem)',
                    color: 'rgba(240,242,245,0.28)',
                    letterSpacing: '2px', marginLeft: 'auto', flexShrink: 0,
                  }}>{group.sub}</span>
                </div>
                {group.stats.map(({ name, val }) => (
                  <StatBar key={name} name={name} val={val} color={group.color} glow={group.glow} />
                ))}
              </div>
            ))}

            {/* 하단 기본 패시브 */}
            <div style={{
              marginTop: '10px',
              padding: '7px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              display: 'flex', gap: '8px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 600,
                fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                color: 'rgba(255,255,255,0.3)', letterSpacing: '2px',
              }}>PASSIVE</span>
              {['스마트팩토리', 'OT/IT 통합', '설비 인터페이스', '공정 데이터'].map(tag => (
                <span key={tag} style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 600,
                  fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '5px',
                  padding: '1px 7px',
                  letterSpacing: '1px',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div style={{
          borderTop: '1px solid rgba(221,90,90,0.15)',
          padding: '6px 16px',
          display: 'flex', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(0.5rem, 0.8vw, 0.6rem)',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '2px',
          }}>JUNGYH.DEV</span>
          <span style={{
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
            color: 'rgba(221,90,90,0.4)', letterSpacing: '2px',
          }}>where human intent becomes machine execution</span>
        </div>
      </div>
    </div>
  );
}
