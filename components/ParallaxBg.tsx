'use client';

// 레이어 순서 (뒤 → 앞), 스크롤 속도 배율
// speed: 낮을수록 느리게 움직임 (원근감)
// duration: 한 바퀴 도는 시간(초) — 느린 레이어일수록 길게
const LAYERS = [
  { src: '/assets/layers/sky.png',         speed: 0,    duration: 0,   opacity: 1,    zIndex: 1  }, // 고정
  { src: '/assets/layers/buildings-1.png', speed: 0.3,  duration: 120, opacity: 1,    zIndex: 2  }, // 가장 멀리
  { src: '/assets/layers/buildings-2.png', speed: 0.5,  duration: 80,  opacity: 1,    zIndex: 3  },
  { src: '/assets/layers/shade-2.png',     speed: 0.5,  duration: 80,  opacity: 0.6,  zIndex: 4  },
  { src: '/assets/layers/buildings-3.png', speed: 0.75, duration: 55,  opacity: 1,    zIndex: 5  },
  { src: '/assets/layers/shade-3.png',     speed: 0.75, duration: 55,  opacity: 0.5,  zIndex: 6  },
  { src: '/assets/layers/buildings-4.png', speed: 1,    duration: 40,  opacity: 1,    zIndex: 7  }, // 가장 가까이
  { src: '/assets/layers/lights.png',      speed: 0.5,  duration: 80,  opacity: 1,    zIndex: 8  }, // 조명 반짝임용
];

export default function ParallaxBg() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 0, overflow: 'hidden',
      backgroundColor: '#1a0a1e', // sky 하단 보정색
    }}>
      <style>{`
        ${LAYERS.filter(l => l.duration > 0).map((l, i) => `
          @keyframes parallax-${i} {
            from { background-position-x: 0px; }
            to   { background-position-x: -250px; }
          }
        `).join('')}

        /* 조명 깜빡임 */
        @keyframes lights-blink {
          0%, 100% { opacity: 0.9; }
          30%       { opacity: 0.4; }
          60%       { opacity: 1;   }
          80%       { opacity: 0.6; }
        }
      `}</style>

      {LAYERS.map((layer, i) => {
        const isStatic = layer.duration === 0;
        const isLights = layer.src.includes('lights');

        return (
          <div
            key={layer.src}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: layer.zIndex,
              opacity: layer.opacity,

              backgroundImage: `url(${layer.src})`,
              // 픽셀아트 선명하게 + 가로 타일링
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              imageRendering: 'pixelated',
              backgroundPosition: 'bottom center',

              // 애니메이션
              animation: isStatic
                ? undefined
                : isLights
                  ? `parallax-${i} ${layer.duration}s linear infinite, lights-blink 4s ease-in-out infinite`
                  : `parallax-${i} ${layer.duration}s linear infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
