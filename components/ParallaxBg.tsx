'use client';

/* ────────────────────────────────────────────────────────────────
   CELESTE 컨셉 배경

   외부 에셋 없이 SVG data URI로 픽셀아트 실루엣을 생성한다.
   각 능선은 "정수 배수 사인파의 합" 이라 타일 가로폭에서 정확히
   한 주기가 끝난다 → 좌우로 무한 반복해도 이음매가 안 보인다.

   나중에 실제 PNG 팩(ansimuz Mountain Dusk 등)으로 갈아끼울 땐
   RIDGES 각 항목의 `image` 만 `url(/assets/layers/xxx.png)` 로 바꾸고
   `tilePx` 를 해당 PNG의 렌더 폭에 맞추면 된다.
   ──────────────────────────────────────────────────────────────── */

const TW = 320;   // 타일 가로 (SVG 단위)
const TH = 180;   // 타일 세로 (SVG 단위)
const STEP = 4;   // 계단 폭 — 클수록 굵은 픽셀아트 느낌

type Wave = [freq: number, amp: number, phase: number];

// ─── 유틸 ───────────────────────────────────────────────────────

/** 고정 시드 난수 — SSR/CSR 결과가 같아야 하므로 Math.random 금지 */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function svgUrl(inner: string, w: number, h: number) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function ridgeY(base: number, waves: Wave[], x: number) {
  let y = base;
  for (const [f, a, p] of waves) y += Math.sin((2 * Math.PI * f * x) / TW + p) * a;
  return y;
}

/** 능선을 계단(step) 폴리곤으로 — 픽셀아트 실루엣 */
function ridgeD(base: number, waves: Wave[]) {
  const pts: string[] = [];
  for (let x = 0; x < TW; x += STEP) {
    const qy = Math.round(ridgeY(base, waves, x) / STEP) * STEP;
    pts.push(`${x},${qy}`, `${x + STEP},${qy}`);
  }
  return `M0,${TH} L${pts.join(' ')} L${TW},${TH} Z`;
}

/** 능선 위에 침엽수 — 타일 양끝으로 복제해서 이음매 처리 */
function pinesD(base: number, waves: Wave[], count: number, seed: number) {
  const rnd = lcg(seed);
  let d = '';
  for (let i = 0; i < count; i++) {
    const cx = Math.round(((i + rnd() * 0.7) * TW) / count);
    const gy = Math.round(ridgeY(base, waves, cx) / STEP) * STEP + 2;
    const hh = 14 + Math.round(rnd() * 14);
    const hw = 3 + Math.round(rnd() * 3);
    for (const off of [-TW, 0, TW]) {
      const x = cx + off;
      d += `M${x},${gy - hh} L${x + hw},${gy} L${x - hw},${gy} Z`;
      d += `M${x},${gy - hh * 0.55} L${x + hw + 2},${gy} L${x - hw - 2},${gy} Z`;
    }
  }
  return d;
}

// ─── 능선 레이어 (뒤 → 앞) ──────────────────────────────────────
// tilePx: 화면에 그려질 타일 가로폭(px). 클수록 가까이 있는 것처럼 보인다.
// duration: 한 타일을 지나가는 시간(초). 짧을수록 빠르게 스크롤.

const RIDGES = [
  {
    key: 'far',
    base: 88,
    // 고주파 성분을 크게 잡아야 도시 스카이라인이 아니라 산맥으로 읽힌다
    waves: [[1, 7, 0.4], [3, 6, 1.9], [7, 3.5, 3.1], [13, 1.5, 0.6]] as Wave[],
    fill: '#43305f',
    rim: '#6b5490',
    tilePx: 900,
    duration: 280,
    z: 30,
    pines: 0,
  },
  {
    key: 'mid',
    base: 127,
    waves: [[1, 10, 2.2], [2, 8, 0.3], [5, 5, 4.4], [9, 2.5, 1.1]] as Wave[],
    fill: '#33224e',
    rim: '#55407c',
    tilePx: 1200,
    duration: 185,
    z: 40,
    pines: 0,
  },
  {
    key: 'near',
    base: 152,
    waves: [[1, 7, 4.1], [3, 6, 2.6], [6, 4, 1.2], [11, 2, 5.0]] as Wave[],
    fill: '#231738',
    rim: '#3e2c5e',
    tilePx: 1700,
    duration: 115,
    z: 50,
    pines: 9,
  },
  {
    key: 'front',
    base: 168,
    waves: [[2, 5, 1.1], [4, 4, 3.7], [8, 2.5, 0.8]] as Wave[],
    fill: '#150d24',
    rim: '#241738',
    tilePx: 2400,
    duration: 72,
    z: 70,
    pines: 13,
  },
];

// ─── 셀레스트 산 (중앙 고정 대형 봉우리) ────────────────────────
// 실루엣 능선을 먼저 정의하고, 만년설은 그 능선 위에서만 잘라낸다.
// (설선이 산 밖으로 삐져나오지 않게 하려면 좌/우 사면 좌표를 공유해야 함)
const PEAK = svgUrl(
  // 본체
  `<path d="M14,300 L64,246 L104,208 L142,152 L168,110 L186,70 L199,38 L206,20 L219,46 L234,80 L250,118 L272,158 L306,214 L346,266 L386,300 Z" fill="#291b45"/>` +
  // 오른쪽 그림자 면
  `<path d="M206,20 L219,46 L234,80 L250,118 L272,158 L306,214 L346,266 L386,300 L206,300 Z" fill="#1f1435"/>` +
  // 만년설 — 정상에서 y≈92까지, 아래쪽 가장자리는 들쭉날쭉하게
  `<path d="M206,20 L219,46 L234,80 L227,74 L220,90 L212,72 L205,92 L198,70 L191,84 L185,66 L190,56 L199,38 Z" fill="#9d8ec4"/>` +
  // 설선 오른쪽 음영
  `<path d="M206,20 L219,46 L234,80 L227,74 L220,90 L212,72 L206,86 Z" fill="#7f6ea8"/>`,
  400,
  300,
);

// ─── 별 / 눈 타일 ───────────────────────────────────────────────
function dotsTile(size: number, count: number, seed: number, color: string, big = 0.15) {
  const rnd = lcg(seed);
  let inner = '';
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rnd() * size);
    const y = Math.floor(rnd() * size);
    const r = rnd() < big ? 2 : 1;
    const o = (0.3 + rnd() * 0.7).toFixed(2);
    inner += `<rect x="${x}" y="${y}" width="${r}" height="${r}" fill="${color}" opacity="${o}"/>`;
  }
  return svgUrl(inner, size, size);
}

const STARS_A = dotsTile(400, 70, 20240101, '#ffffff', 0.12);
const STARS_B = dotsTile(300, 34, 77712, '#cfe6ff', 0.3);
const SNOW_A = dotsTile(260, 16, 5150, '#ffffff', 0.25);
const SNOW_B = dotsTile(180, 9, 9091, '#ffffff', 0.5);

// ────────────────────────────────────────────────────────────────

export default function ParallaxBg() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        // 셀레스트 밤하늘 — 심야 보라 → 황혼 보라 → 지평선 온기
        background:
          'linear-gradient(to bottom, #140b26 0%, #1e1138 32%, #331e52 58%, #55356d 80%, #7a4d70 100%)',
      }}
    >
      <style>{`
        ${RIDGES.map(r => `
          @keyframes cel-pan-${r.key} {
            from { background-position-x: 0px; }
            to   { background-position-x: -${r.tilePx}px; }
          }
        `).join('')}

        @keyframes cel-stars-a { from { background-position: 0 0; }    to { background-position: -400px 0; } }
        @keyframes cel-stars-b { from { background-position: 0 0; }    to { background-position: -300px 0; } }
        @keyframes cel-twinkle { 0%, 100% { opacity: 0.85; } 50% { opacity: 0.45; } }

        @keyframes cel-snow-a  { from { background-position: 0 0; }    to { background-position: -260px 260px; } }
        @keyframes cel-snow-b  { from { background-position: 0 0; }    to { background-position:  180px 180px; } }

        @keyframes cel-aurora {
          0%, 100% { transform: translateX(-3%) scaleY(1);    opacity: 0.5; }
          50%      { transform: translateX(3%)  scaleY(1.18); opacity: 0.8; }
        }
        @keyframes cel-moonglow {
          0%, 100% { opacity: 0.75; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* 오로라 */}
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          left: 0,
          width: '100%',
          height: '65%',
          zIndex: 10,
          filter: 'blur(46px)',
          mixBlendMode: 'screen',
          background:
            'radial-gradient(60% 42% at 22% 34%, rgba(99,197,218,0.30), transparent 70%),' +
            'radial-gradient(52% 38% at 62% 20%, rgba(163,148,199,0.28), transparent 72%),' +
            'radial-gradient(46% 34% at 84% 44%, rgba(221,90,90,0.16), transparent 74%)',
          animation: 'cel-aurora 26s ease-in-out infinite',
        }}
      />

      {/* 별 — 두 겹, 서로 다른 속도 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          backgroundImage: STARS_A,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          imageRendering: 'pixelated',
          animation: 'cel-stars-a 400s linear infinite, cel-twinkle 7s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          height: '70%',
          zIndex: 15,
          backgroundImage: STARS_B,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          imageRendering: 'pixelated',
          animation: 'cel-stars-b 240s linear infinite, cel-twinkle 4.5s ease-in-out infinite',
        }}
      />

      {/* 달 */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(48px, 12vh, 130px)',
          right: 'clamp(60px, 14vw, 220px)',
          width: 'clamp(46px, 6vw, 78px)',
          height: 'clamp(46px, 6vw, 78px)',
          zIndex: 20,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 32%, #fdf6e3, #e6d9bd 62%, #c9b894)',
          boxShadow:
            '0 0 30px rgba(253,246,227,0.55), 0 0 90px rgba(253,246,227,0.28), 0 0 180px rgba(163,148,199,0.25)',
          animation: 'cel-moonglow 9s ease-in-out infinite',
        }}
      />

      {/* 셀레스트 산 — 배경 중앙 고정 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 'clamp(560px, 78vw, 1250px)',
          height: 'clamp(360px, 72vh, 820px)',
          zIndex: 25,
          backgroundImage: PEAK,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: 'contain',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 0 60px rgba(122,77,112,0.45))',
        }}
      />

      {/* 능선 레이어 */}
      {RIDGES.map(r => {
        const tileH = Math.round((r.tilePx * TH) / TW);
        const inner =
          `<path d="${ridgeD(r.base, r.waves)}" fill="${r.rim}"/>` +
          `<path d="${ridgeD(r.base + 3, r.waves)}" fill="${r.fill}"/>` +
          (r.pines ? `<path d="${pinesD(r.base + 3, r.waves, r.pines, 4242 + r.pines)}" fill="${r.fill}"/>` : '');

        return (
          <div
            key={r.key}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: r.z,
              backgroundImage: svgUrl(inner, TW, TH),
              backgroundRepeat: 'repeat-x',
              backgroundSize: `${r.tilePx}px ${tileH}px`,
              backgroundPosition: 'bottom left',
              imageRendering: 'pixelated',
              animation: `cel-pan-${r.key} ${r.duration}s linear infinite`,
            }}
          />
        );
      })}

      {/* 능선 사이 안개 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '42%',
          zIndex: 60,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(122,77,112,0.30) 0%, rgba(85,53,109,0.16) 45%, transparent 100%)',
        }}
      />

      {/* 눈 — 두 겹 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 80,
          pointerEvents: 'none',
          backgroundImage: SNOW_A,
          backgroundRepeat: 'repeat',
          backgroundSize: '260px 260px',
          imageRendering: 'pixelated',
          opacity: 0.55,
          animation: 'cel-snow-a 18s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 81,
          pointerEvents: 'none',
          backgroundImage: SNOW_B,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          imageRendering: 'pixelated',
          opacity: 0.75,
          animation: 'cel-snow-b 9s linear infinite',
        }}
      />

      {/* 하단 비네트 — 텍스트 가독성 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 90,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(15,8,26,0.55) 100%)',
        }}
      />
    </div>
  );
}
