'use client';

import Image from 'next/image';

// ─── 스탯 데이터 ───────────────────────────────────────────────
const STAT_GROUPS = [
  {
    label: '에이전틱 오케스트레이션',
    color: '#ff3860',
    glow: 'rgba(255,56,96,0.6)',
    tier: 'S',
    stats: [
      { name: 'Claude API', val: 98 },
      { name: 'GitHub Actions', val: 95 },
      { name: 'Agent Pipeline', val: 97 },
      { name: 'MCP / Tool Use', val: 93 },
    ],
  },
  {
    label: '배포 플랫폼',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.5)',
    tier: 'A',
    stats: [
      { name: 'Terraform', val: 88 },
      { name: 'AWS',       val: 91 },
      { name: 'Railway',   val: 85 },
      { name: 'Vercel',    val: 90 },
    ],
  },
  {
    label: '클라우드 & DB',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)',
    tier: 'A',
    stats: [
      { name: 'AWS (EC2/S3/RDS)', val: 87 },
      { name: 'Oracle DB',        val: 89 },
      { name: 'MongoDB',          val: 84 },
    ],
  },
  {
    label: '개발 베이스',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.4)',
    tier: 'B',
    stats: [
      { name: 'Node.js',  val: 95 },
      { name: 'Git',      val: 99 },
      { name: 'TypeScript', val: 91 },
    ],
  },
  {
    label: '프레임워크',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.4)',
    tier: 'B',
    stats: [
      { name: 'NestJS',  val: 90 },
      { name: 'Next.js', val: 88 },
      { name: 'React',   val: 87 },
      { name: 'Redux',   val: 80 },
    ],
  },
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
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
          fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)',
          color: 'rgba(255,255,255,0.75)', letterSpacing: '1px',
        }}>{name}</span>
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
          fontSize: 'clamp(0.6rem, 0.9vw, 0.7rem)',
          color,
        }}>{val}</span>
      </div>
      <div style={{
        height: '5px', background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%', width: `${val}%`,
          background: `linear-gradient(to right, ${color}99, ${color})`,
          boxShadow: `0 0 6px ${glow}`,
          borderRadius: '2px',
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
      fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
      fontSize: '0.65rem',
      color,
      border: `1px solid ${color}`,
      boxShadow: `0 0 6px ${glow}, inset 0 0 6px ${glow}30`,
      padding: '1px 6px',
      borderRadius: '2px',
      letterSpacing: '1px',
      flexShrink: 0,
    }}>{tier}</span>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ProfileCard() {
  return (
    <div style={{
      fontFamily: "'VT323', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(16px, 3vw, 32px)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600;700&family=VT323&display=swap');

        .profile-card {
          background: linear-gradient(160deg, #0d0d18 0%, #0a0a14 60%, #100a1a 100%);
          border: 1px solid rgba(255,56,96,0.3);
          box-shadow:
            0 0 0 1px rgba(255,56,96,0.1),
            0 0 40px rgba(255,56,96,0.08),
            inset 0 0 60px rgba(0,0,0,0.6);
          border-radius: '4px';
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
          background: linear-gradient(to right, transparent, #ff3860, #c084fc, transparent);
        }
        .scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          );
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
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: clamp(0.72rem, 1.1vw, 0.85rem);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="profile-card" style={{ borderRadius: '4px' }}>
        <div className="scanline" />

        {/* ── 상단 헤더 ── */}
        <div style={{
          background: 'rgba(255,56,96,0.08)',
          borderBottom: '1px solid rgba(255,56,96,0.2)',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
            fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
            color: '#ff3860', letterSpacing: '3px',
          }}>// DEVELOPER PROFILE</span>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
          }}>LV.MAX</span>
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
              border: '2px solid rgba(255,56,96,0.5)',
              boxShadow: '0 0 20px rgba(255,56,96,0.2), inset 0 0 10px rgba(0,0,0,0.5)',
              background: '#0a0a14',
              marginBottom: '10px',
              position: 'relative',
              aspectRatio: '1',
              overflow: 'hidden',
            }}>
              <Image
                src="/assets/profile.png"
                alt="JUNGYH"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
              {/* 이미지 위 오버레이 */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,20,0.8))',
              }} />
            </div>

            {/* 기본 정보 */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '8px 10px',
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            }}>
              {[
                { k: '클래스',   v: '에이전트 아키텍트' },
                { k: '서버',     v: 'Node.js' },
                { k: '길드',     v: '길드 없음' },
              ].map(({ k, v }) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  gap: '4px', marginBottom: '4px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  paddingBottom: '4px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{k}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'right', fontSize: '0.9em' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* 핵심 수치 */}
            <div style={{
              marginTop: '8px',
              background: 'rgba(255,56,96,0.06)',
              border: '1px solid rgba(255,56,96,0.2)',
              padding: '8px 10px',
              fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            }}>
              {[
                { k: '여유 포인트', v: '∞',    pct: '' },
                { k: '열매 성장',  v: '12/115', pct: '(70%)' },
                { k: '열매 감소',  v: '0/115',  pct: '(100%)' },
              ].map(({ k, v, pct }) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  gap: '4px', marginBottom: '3px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                  <span style={{ color: '#ff3860' }}>{v} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85em' }}>{pct}</span></span>
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
              display: 'flex', gap: '8px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                color: 'rgba(255,255,255,0.3)', letterSpacing: '2px',
              }}>PASSIVE</span>
              {['Git', 'TypeScript', 'REST API', 'CI/CD'].map(tag => (
                <span key={tag} style={{
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                  fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '1px 7px',
                  letterSpacing: '1px',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div style={{
          borderTop: '1px solid rgba(255,56,96,0.15)',
          padding: '6px 16px',
          display: 'flex', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(0.5rem, 0.8vw, 0.6rem)',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '2px',
          }}>JUNGYH.DEV</span>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
            color: 'rgba(255,56,96,0.4)', letterSpacing: '2px',
          }}>where human intent becomes machine execution</span>
        </div>
      </div>
    </div>
  );
}
