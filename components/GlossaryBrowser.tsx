'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  GLOSSARY_CATS,
  GLOSSARY_CAT_ORDER,
  GLOSSARY_TERMS,
  type GlossaryCatId,
  type GlossaryTerm,
} from '@/lib/glossary';

type Filter = GlossaryCatId | 'all';

/** 검색어 첫 매치만 하이라이트 (원본 hl() 동작과 동일) */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/** rel 문자열의 <code>…</code> 인라인 마크업을 JSX로 변환 */
function inline(text: string) {
  return text.split(/<code>([\s\S]*?)<\/code>/g).map((chunk, i) =>
    i % 2 === 1 ? <code key={i}>{chunk}</code> : <span key={i}>{chunk}</span>
  );
}

/** "연관: A, B" → <b>연관</b> A, B */
function RelLine({ text }: { text: string }) {
  const m = text.match(/^([^:]+):([\s\S]*)$/);
  if (!m) return <div className="gl-rel">{inline(text)}</div>;
  return (
    <div className="gl-rel">
      <b>{m[1]}</b>
      {inline(m[2])}
    </div>
  );
}

function TermCard({ term, query }: { term: GlossaryTerm; query: string }) {
  return (
    <div className="gl-term" data-cat={term.cat}>
      <div className="gl-top">
        <h3><Highlight text={term.t} query={query} /></h3>
        <span className="gl-full"><Highlight text={term.full} query={query} /></span>
        <span className="gl-catlab">{GLOSSARY_CATS[term.cat].label}</span>
      </div>
      <p><Highlight text={term.d} query={query} /></p>
      {(term.rel ?? []).map((r, i) => <RelLine key={i} text={r} />)}
    </div>
  );
}

const CHIPS: { cat: Filter; label: string }[] = [
  { cat: 'all',    label: '전체' },
  { cat: 'mfg',    label: '제조 도메인' },
  { cat: 'dt',     label: '디지털 트윈·3D' },
  { cat: 'stream', label: '이벤트·스트리밍' },
  { cat: 'std',    label: '산업 표준' },
  { cat: 'sw',     label: 'SW 아키텍처' },
];

export default function GlossaryBrowser() {
  const [activeCat, setActiveCat] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  // 입력값은 그대로 두고(공백 입력 가능) 검색에만 trim 적용
  const q = query.trim();

  const { byCat, shown } = useMemo(() => {
    const needle = q.toLowerCase();
    const grouped: Partial<Record<GlossaryCatId, GlossaryTerm[]>> = {};
    let count = 0;
    for (const tm of GLOSSARY_TERMS) {
      if (activeCat !== 'all' && tm.cat !== activeCat) continue;
      const hay = `${tm.t} ${tm.full} ${tm.d} ${(tm.rel ?? []).join(' ')}`.toLowerCase();
      if (needle && !hay.includes(needle)) continue;
      (grouped[tm.cat] ??= []).push(tm);
      count++;
    }
    return { byCat: grouped, shown: count };
  }, [activeCat, q]);

  const countLabel =
    `${shown}개 용어` +
    (activeCat !== 'all' ? ` · ${GLOSSARY_CATS[activeCat].label}` : '') +
    (q ? ` · "${q}"` : '');

  return (
    <div className="gl-root">
      <style>{`
        .gl-root{
          --ink:#0E1418; --panel:#161E24; --panel-2:#1D272E; --line:#2C3941;
          --text:#DCE4E8; --muted:#8A9BA5; --amber:#F2A33C; --signal:#4FD1A5;
          --alert:#E4614C; --info:#5EA9E0; --violet:#A98CE0; --rose:#E08CB0;
          background:var(--ink); color:var(--text); min-height:100vh;
          font-family:"IBM Plex Sans KR",system-ui,sans-serif; font-weight:300;
          line-height:1.7; -webkit-font-smoothing:antialiased;
        }
        .gl-root *{box-sizing:border-box; margin:0; padding:0}
        .gl-wrap{max-width:1180px; margin:0 auto; padding:0 40px}

        /* header */
        .gl-header{padding:64px 0 40px; border-bottom:1px solid var(--line)}
        .gl-back{
          display:inline-block; margin-bottom:26px;
          font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.14em;
          color:var(--muted); text-decoration:none; transition:color .18s;
        }
        .gl-back:hover{color:var(--amber)}
        .gl-eyebrow{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.2em; color:var(--amber); text-transform:uppercase; margin-bottom:20px}
        .gl-root h1{font-size:clamp(32px,4.4vw,50px); font-weight:700; line-height:1.16; letter-spacing:-.02em; color:#fff; margin-bottom:22px}
        .gl-root h1 em{font-style:normal; color:var(--amber)}
        .gl-lede{font-size:16.5px; color:var(--muted); max-width:66ch; line-height:1.72}

        /* controls */
        .gl-controls{position:sticky; top:0; z-index:20; background:rgba(14,20,24,.94); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); padding:16px 0}
        .gl-controls .gl-wrap{display:flex; gap:14px; align-items:center; flex-wrap:wrap}
        .gl-search{flex:1; min-width:220px; position:relative}
        .gl-search input{width:100%; background:var(--panel); border:1px solid var(--line); border-radius:5px; padding:11px 14px 11px 38px; color:var(--text); font-family:"IBM Plex Sans KR",system-ui,sans-serif; font-size:14px; outline:none; transition:border-color .18s}
        .gl-search input:focus{border-color:var(--amber)}
        .gl-search input::placeholder{color:var(--muted)}
        .gl-search .gl-ic{position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:14px; pointer-events:none}

        .gl-chips{display:flex; gap:6px; flex-wrap:wrap}
        .gl-chip{appearance:none; background:var(--panel); border:1px solid var(--line); border-radius:20px; padding:8px 14px; font-family:"IBM Plex Sans KR",system-ui,sans-serif; font-size:12.5px; color:var(--muted); cursor:pointer; transition:all .16s; white-space:nowrap; display:flex; align-items:center; gap:7px}
        .gl-chip:hover{color:var(--text); border-color:var(--muted)}
        .gl-chip .gl-d{width:7px; height:7px; border-radius:50%; background:var(--line)}
        .gl-chip.active{color:var(--ink); font-weight:500}
        .gl-chip.active[data-cat="all"]{background:var(--text); border-color:var(--text)}
        .gl-chip.active[data-cat="mfg"]{background:var(--signal); border-color:var(--signal)}
        .gl-chip.active[data-cat="dt"]{background:var(--info); border-color:var(--info)}
        .gl-chip.active[data-cat="stream"]{background:var(--amber); border-color:var(--amber)}
        .gl-chip.active[data-cat="std"]{background:var(--violet); border-color:var(--violet)}
        .gl-chip.active[data-cat="sw"]{background:var(--rose); border-color:var(--rose)}
        .gl-chip[data-cat="mfg"] .gl-d{background:var(--signal)}
        .gl-chip[data-cat="dt"] .gl-d{background:var(--info)}
        .gl-chip[data-cat="stream"] .gl-d{background:var(--amber)}
        .gl-chip[data-cat="std"] .gl-d{background:var(--violet)}
        .gl-chip[data-cat="sw"] .gl-d{background:var(--rose)}
        .gl-chip.active .gl-d{display:none}
        .gl-chip:focus-visible{outline:2px solid var(--amber); outline-offset:2px}

        /* count */
        .gl-count{padding:22px 0 6px; font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase}

        /* grid */
        .gl-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:14px; padding:14px 0 100px}
        .gl-term{background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:20px 22px; border-left:3px solid var(--line)}
        .gl-term[data-cat="mfg"]{border-left-color:var(--signal)}
        .gl-term[data-cat="dt"]{border-left-color:var(--info)}
        .gl-term[data-cat="stream"]{border-left-color:var(--amber)}
        .gl-term[data-cat="std"]{border-left-color:var(--violet)}
        .gl-term[data-cat="sw"]{border-left-color:var(--rose)}
        .gl-top{display:flex; align-items:baseline; gap:10px; margin-bottom:4px; flex-wrap:wrap}
        .gl-term h3{font-size:17px; font-weight:600; color:#fff; letter-spacing:-.01em}
        .gl-full{font-family:"IBM Plex Mono",monospace; font-size:11px; color:var(--muted); letter-spacing:.02em}
        .gl-catlab{margin-left:auto; font-family:"IBM Plex Mono",monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; padding:2px 7px; border-radius:2px; border:1px solid var(--line); color:var(--muted); white-space:nowrap}
        .gl-term p{font-size:14px; color:var(--text); line-height:1.66; margin-top:8px}
        .gl-rel{margin-top:11px; font-size:12px; color:var(--muted)}
        .gl-rel b{color:var(--amber); font-weight:500; font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; display:block; margin-bottom:3px}
        .gl-rel code{font-family:"IBM Plex Mono",monospace; font-size:11.5px; color:var(--signal); background:var(--panel-2); border:1px solid var(--line); border-radius:3px; padding:1px 6px; margin-right:4px}
        .gl-term mark{background:rgba(242,163,60,.25); color:#fff; border-radius:2px; padding:0 2px}

        .gl-empty{grid-column:1/-1; text-align:center; color:var(--muted); padding:60px 0; font-size:15px}

        .gl-cathead{grid-column:1/-1; display:flex; align-items:center; gap:14px; margin:22px 0 2px; padding-top:12px}
        .gl-cathead:first-child{margin-top:0; padding-top:0}
        .gl-cathead .gl-bar{width:26px; height:2px; border-radius:2px}
        .gl-cathead[data-cat="mfg"] .gl-bar{background:var(--signal)}
        .gl-cathead[data-cat="dt"] .gl-bar{background:var(--info)}
        .gl-cathead[data-cat="stream"] .gl-bar{background:var(--amber)}
        .gl-cathead[data-cat="std"] .gl-bar{background:var(--violet)}
        .gl-cathead[data-cat="sw"] .gl-bar{background:var(--rose)}
        .gl-cathead h2{font-size:14px; font-family:"IBM Plex Mono",monospace; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#fff}
        .gl-cathead span{font-size:12px; color:var(--muted); font-weight:300; font-family:"IBM Plex Sans KR",system-ui,sans-serif}

        .gl-footer{border-top:1px solid var(--line); padding:40px 0; color:var(--line); font-size:12px; line-height:1.7}

        @media(max-width:820px){
          .gl-wrap{padding:0 18px}
          .gl-grid{grid-template-columns:1fr}
          .gl-header{padding:40px 0 32px}
          .gl-catlab{margin-left:0}
        }
      `}</style>

      <header className="gl-header">
        <div className="gl-wrap">
          <Link href="/" className="gl-back">← BACK TO HUB</Link>
          <div className="gl-eyebrow">Digital Twin · Object Editor · Glossary</div>
          <h1>개발자가 알아야 할<br /><em>업계 용어집</em></h1>
          <p className="gl-lede">
            이 프로젝트에서 실제로 오가는 전문 용어를 개발자 관점에서 정리했다.
            제조 도메인, 디지털 트윈·3D, 이벤트/스트리밍, 산업 표준, 소프트웨어 아키텍처 다섯 갈래.
            아래에서 카테고리로 거르거나 검색해서 찾을 수 있다.
          </p>
        </div>
      </header>

      <div className="gl-controls">
        <div className="gl-wrap">
          <div className="gl-search">
            <span className="gl-ic">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="용어 검색 — 예: Kafka, MES, AAS, 다운타임…"
              autoComplete="off"
              aria-label="용어 검색"
            />
          </div>
          <div className="gl-chips">
            {CHIPS.map(({ cat, label }) => (
              <button
                key={cat}
                className={`gl-chip${activeCat === cat ? ' active' : ''}`}
                data-cat={cat}
                onClick={() => setActiveCat(cat)}
                aria-pressed={activeCat === cat}
              >
                <span className="gl-d" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="gl-wrap">
        <div className="gl-count">{countLabel}</div>
        <div className="gl-grid">
          {shown === 0 ? (
            <div className="gl-empty">검색 결과가 없습니다. 다른 키워드로 시도해 보세요.</div>
          ) : (
            GLOSSARY_CAT_ORDER.map((cat) => {
              const items = byCat[cat];
              if (!items) return null;
              return (
                <div key={cat} style={{ display: 'contents' }}>
                  {activeCat === 'all' && (
                    <div className="gl-cathead" data-cat={cat}>
                      <span className="gl-bar" />
                      <h2>{GLOSSARY_CATS[cat].label}</h2>
                      <span>{GLOSSARY_CATS[cat].desc}</span>
                    </div>
                  )}
                  {items.map((tm) => <TermCard key={tm.t} term={tm} query={q} />)}
                </div>
              );
            })
          )}
        </div>
      </div>

      <footer className="gl-footer">
        <div className="gl-wrap">
          설비 객체 에디터 프로젝트 용어집 · 제조 도메인부터 SW 아키텍처까지.
          OPC-UA / MQTT / Modbus 등 프로토콜 정의는 공개 자료로 확인함.
          프로젝트 내부 용어(DataFlow, Data Space 등)는 앞선 문서 기준.
        </div>
      </footer>
    </div>
  );
}
