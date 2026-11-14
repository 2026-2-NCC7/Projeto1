import React, { useEffect, useRef, useState } from 'react';
import {
  COMMERCIAL_PLANS,
  MARKET_SCENARIOS,
  PERSONA_VOLUMES,
  PITCH_GUIDE_STEPS,
  PROBLEM_CARDS,
  PersonaVolume,
  SCORING_LENS_NODES,
  SOLUTION_PILLARS,
  VALUE_PROPOSITIONS,
} from '../../data/qiMatchLandingData';

interface LandingHeroAndCoreProps {
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  onOpenDrawer: (drawerId: string) => void;
  onOpenPitchModal: () => void;
  onOpenPrototype: () => void;
  onOpenTechnicalBanca?: () => void;
}

function renderIsometricDiagram(index: number) {
  if (index === 0) {
    return (
      <svg className="qi-iso-svg" viewBox="0 0 360 190" aria-hidden="true">
        <path className="qi-iso-dash" d="M40 132 L180 56 L320 132 L180 182 Z" />
        <g className="qi-iso-lift" style={{ animationDelay: '0ms' }}>
          <path className="qi-iso-t" d="M110 78 L166 108 L110 138 L54 108 Z" />
          <path className="qi-iso-l" d="M54 108 L110 138 L110 154 L54 124 Z" />
          <path className="qi-iso-r" d="M166 108 L166 124 L110 154 L110 138 Z" />
        </g>
        <g className="qi-iso-lift" style={{ animationDelay: '320ms' }}>
          <path className="qi-iso-t qi-iso-t--brass" d="M236 62 L298 96 L236 130 L174 96 Z" />
          <path className="qi-iso-l" d="M174 96 L236 130 L236 150 L174 116 Z" />
          <path className="qi-iso-r" d="M298 96 L298 116 L236 150 L236 130 Z" />
        </g>
        <path className="qi-iso-wire" d="M136 108 C168 92, 186 92, 206 96" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg className="qi-iso-svg" viewBox="0 0 360 190" aria-hidden="true">
        {[0, 1, 2].map((col) => {
          const cx = 82 + col * 98;
          const isBrass = col === 1;
          return (
            <g key={col} className="qi-iso-lift" style={{ animationDelay: `${col * 260}ms` }}>
              <path
                className={isBrass ? 'qi-iso-t qi-iso-t--brass' : 'qi-iso-t'}
                d={`M${cx} 74 L${cx + 42} 98 L${cx} 122 L${cx - 42} 98 Z`}
              />
              <path className="qi-iso-l" d={`M${cx - 42} 98 L${cx} 122 L${cx} 154 L${cx - 42} 130 Z`} />
              <path className="qi-iso-r" d={`M${cx + 42} 98 L${cx + 42} 130 L${cx} 154 L${cx} 122 Z`} />
              <path className="qi-iso-wire" d={`M180 28 L${cx} 74`} />
            </g>
          );
        })}
        <circle cx="180" cy="28" r="6" fill="#DCB434" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg className="qi-iso-svg" viewBox="0 0 340 190" aria-hidden="true">
        <g className="qi-iso-breathe">
          <ellipse cx="170" cy="96" rx="108" ry="56" fill="rgba(201,162,39,0.08)" stroke="rgba(220,180,52,0.38)" strokeDasharray="3 5" />
          <ellipse cx="170" cy="96" rx="64" ry="33" fill="rgba(201,162,39,0.12)" stroke="rgba(255,255,255,0.28)" />
        </g>
        <path className="qi-iso-t qi-iso-t--brass" d="M170 68 L218 95 L170 122 L122 95 Z" />
        <path className="qi-iso-l" d="M122 95 L170 122 L170 136 L122 109 Z" />
        <path className="qi-iso-r" d="M218 95 L218 109 L170 136 L170 122 Z" />
      </svg>
    );
  }
  return (
    <svg className="qi-iso-svg" viewBox="0 0 420 190" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((sheet) => {
        const ox = 86 + sheet * 46;
        const oy = 32 + sheet * 12;
        const isHi = sheet === 2 || sheet === 3;
        return (
          <g key={sheet} className="qi-iso-wave" style={{ animationDelay: `${sheet * 140}ms` }}>
            <path
              className={isHi ? 'qi-iso-t qi-iso-t--brass' : 'qi-iso-t'}
              d={`M${ox + 64} ${oy} L${ox + 68} ${oy + 3} L${ox} ${oy + 42} L${ox - 4} ${oy + 39} Z`}
            />
            <path
              className="qi-iso-r"
              d={`M${ox + 68} ${oy + 3} L${ox + 68} ${oy + 76} L${ox} ${oy + 115} L${ox} ${oy + 42} Z`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export const LandingHeroAndCore: React.FC<LandingHeroAndCoreProps> = ({
  activeSection,
  onScrollToSection,
  onOpenDrawer,
  onOpenPitchModal,
  onOpenPrototype,
  onOpenTechnicalBanca,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const arcWrapRef = useRef<HTMLDivElement | null>(null);
  const arcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const terrainRef = useRef<HTMLDivElement | null>(null);

  // Section 03 Solution & Value Proposition state
  const lensStageRef = useRef<HTMLDivElement | null>(null);
  const [lensSize, setLensSize] = useState({ w: 680, h: 370 });
  const [lensPos, setLensPos] = useState({ x: 240, y: 185 });
  const [activeNodeIdx, setActiveNodeIdx] = useState(1);
  const [activeAudienceTab, setActiveAudienceTab] = useState<'empresas' | 'profissionais'>('empresas');

  // Section 04 Commercial Binder, Market Gauge & Persona Reader state
  const [activePlanId, setActivePlanId] = useState(COMMERCIAL_PLANS[0].id);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('som10');
  const [showScenarioDetails, setShowScenarioDetails] = useState<boolean>(false);
  const [openPersona, setOpenPersona] = useState<PersonaVolume | null>(null);

  // Scroll listener for masthead
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero 2D Pixel-Arc Brass Glow + 5-Layer Ridged Terrain Parallax
  useEffect(() => {
    const wrap = arcWrapRef.current;
    const canvas = arcCanvasRef.current;
    const terrainEl = terrainRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let arcRaf = 0;
    let arcSeen = true;
    let phase = 0;

    let arcCleanup = () => {};
    if (wrap && canvas) {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        let w = 1;
        let h = 1;
        const pixelSize = 9;

        const resizeArc = () => {
          const rect = wrap.getBoundingClientRect();
          w = Math.max(1, rect.width);
          h = Math.max(1, rect.height);
          const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const renderArc = () => {
          ctx.fillStyle = '#030308';
          ctx.fillRect(0, 0, w, h);
          const cols = Math.ceil(w / pixelSize);
          const rows = Math.ceil(h / pixelSize);
          const arcCenter = h * 0.4;
          const arcDrop = h * 0.88;
          const thickness = h * 0.34;

          for (let cx = 0; cx < cols; cx++) {
            const sx = cx * pixelSize;
            const nx = (sx / w) * 2 - 1;
            const curveY = arcCenter + Math.pow(Math.abs(nx), 1.8) * arcDrop;
            const edgeFade = Math.max(0, 1 - Math.pow(Math.abs(nx), 2.5));
            if (edgeFade <= 0.02) continue;

            for (let ry = 0; ry < rows; ry++) {
              const sy = ry * pixelSize;
              let f = Math.max(0, 1 - Math.abs(sy - curveY) / thickness);
              if (f <= 0.01) continue;
              f = Math.max(
                0,
                Math.min(1, f + 0.09 * Math.sin(4 * nx - 1.4 * phase) + 0.09 * Math.cos(0.012 * sy + phase))
              );
              f *= edgeFade;
              if (f <= 0.02) continue;

              const f3 = f * f * f;
              const f15 = Math.pow(f, 1.5);
              const r = Math.floor(34 * f + 110 * f3);
              const g = Math.floor(210 * f15 + 42 * f3);
              const b = Math.floor(74 * f + 48 * f3);
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              ctx.globalAlpha = f;
              ctx.fillRect(sx, sy, pixelSize - 1, pixelSize - 1);
            }
          }
          ctx.globalAlpha = 1;
          phase += 0.018;
        };

        const loop = () => {
          renderArc();
          arcRaf = arcSeen && !reduced ? requestAnimationFrame(loop) : 0;
        };

        const ro = new ResizeObserver(() => {
          resizeArc();
          renderArc();
        });
        ro.observe(wrap);

        const io = new IntersectionObserver(([entry]) => {
          arcSeen = entry.isIntersecting;
          if (arcSeen && !arcRaf && !reduced) {
            arcRaf = requestAnimationFrame(loop);
          } else if (!arcSeen && arcRaf) {
            cancelAnimationFrame(arcRaf);
            arcRaf = 0;
          }
        });
        io.observe(wrap);

        resizeArc();
        renderArc();
        if (!reduced) arcRaf = requestAnimationFrame(loop);

        arcCleanup = () => {
          if (arcRaf) cancelAnimationFrame(arcRaf);
          ro.disconnect();
          io.disconnect();
        };
      }
    }

    // 5-Layer Ridged Mountain Terrain + Pointer Parallax
    let terrainCleanup = () => {};
    if (terrainEl) {
      const hash1 = (n: number) => {
        const v = 43758.5453 * Math.sin(127.1 * n);
        return v - Math.floor(v);
      };
      const smoothNoise = (x: number) => {
        const i = Math.floor(x);
        const f = x - i;
        const u = f * f * (3 - 2 * f);
        return hash1(i) * (1 - u) + hash1(i + 1) * u;
      };
      const ridged = (x: number) => {
        let sum = 0;
        let amp = 0.5;
        let freq = 1;
        let norm = 0;
        for (let k = 0; k < 5; k++) {
          sum += smoothNoise(x * freq + 17.3 * k) * amp;
          norm += amp;
          amp *= 0.54;
          freq *= 2.07;
        }
        return Math.pow(1 - Math.abs((2 * sum) / norm - 1), 1.18);
      };

      type LayerItem = { el: HTMLCanvasElement; depth: number; x: number; y: number; tx: number; ty: number };
      let layers: LayerItem[] = [];

      const buildTerrain = () => {
        const w = terrainEl.clientWidth;
        const h = terrainEl.clientHeight;
        if (!w || !h) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const totalRows = w < 700 ? 40 : 65;
        const stepX = w < 700 ? 4 : 3;
        const bleed = Math.round(0.1 * w) + 40;
        terrainEl.innerHTML = '';
        layers = [];
        const rowsPerLayer = Math.ceil(totalRows / 5);

        for (let l = 0; l < 5; l++) {
          const c = document.createElement('canvas');
          c.width = Math.round(w * dpr);
          c.height = Math.round(h * dpr);
          const ctx = c.getContext('2d');
          if (!ctx) continue;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          for (let r = 0; r < rowsPerLayer; r++) {
            const idx = l * rowsPerLayer + r;
            if (idx >= totalRows) break;
            const m = idx / (totalRows - 1);
            const baseY = h * (0.58 + 0.34 * m);
            const ampY = h * (0.28 + 0.06 * m);

            ctx.beginPath();
            for (let px = -bleed; px <= w + bleed; px += stepX) {
              const u = px / w;
              const valley = Math.min(1, Math.pow(Math.abs(u - 0.5) / 0.3, 1.35));
              const py = baseY + h * 0.14 * (1 - valley) - ridged(u * 5.1 + m * 0.5 + 4.7) * valley * ampY;
              if (px === -bleed) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.lineTo(w + bleed, h + 24);
            ctx.lineTo(-bleed, h + 24);
            ctx.closePath();
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.strokeStyle = `rgba(235, 214, 155, ${(0.045 + 0.19 * m).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          terrainEl.appendChild(c);
          layers.push({ el: c, depth: (l + 0.6) / 5, x: 0, y: 0, tx: 0, ty: 0 });
        }
      };

      buildTerrain();
      const ro = new ResizeObserver(buildTerrain);
      ro.observe(terrainEl);

      let px = 0;
      let py = 0;
      let pRaf = 0;

      const stepParallax = () => {
        let moving = false;
        for (const layer of layers) {
          layer.tx = px * 20 * layer.depth;
          layer.ty = py * 9 * layer.depth;
          layer.x += 0.08 * (layer.tx - layer.x);
          layer.y += 0.08 * (layer.ty - layer.y);
          if (Math.abs(layer.tx - layer.x) > 0.05 || Math.abs(layer.ty - layer.y) > 0.05) {
            moving = true;
          }
          layer.el.style.transform = `translate3d(${layer.x.toFixed(2)}px, ${layer.y.toFixed(2)}px, 0)`;
        }
        pRaf = moving ? requestAnimationFrame(stepParallax) : 0;
      };

      const onMove = (ev: PointerEvent) => {
        if (reduced) return;
        const rect = terrainEl.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        px = Math.max(-1, Math.min(1, 2 * ((ev.clientX - rect.left) / rect.width - 0.5)));
        py = Math.max(-1, Math.min(1, 2 * ((ev.clientY - rect.top) / rect.height - 0.5)));
        if (!pRaf) pRaf = requestAnimationFrame(stepParallax);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      terrainCleanup = () => {
        if (pRaf) cancelAnimationFrame(pRaf);
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
      };
    }

    return () => {
      arcCleanup();
      terrainCleanup();
    };
  }, []);

  // Lens Graph ResizeObserver
  useEffect(() => {
    const el = lensStageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 680;
      const h = el.clientHeight || 370;
      setLensSize({ w, h });
      const active = SCORING_LENS_NODES[activeNodeIdx] || SCORING_LENS_NODES[1];
      setLensPos({ x: active.x * w, y: active.y * h });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeNodeIdx]);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--lx', `${(e.clientX - rect.left).toFixed(1)}px`);
    el.style.setProperty('--ly', `${(e.clientY - rect.top).toFixed(1)}px`);
    el.style.setProperty('--lamp-o', '1');
    el.style.setProperty('--bx', `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty('--by', `${(e.clientY - rect.top).toFixed(0)}px`);
    el.style.setProperty('--brand-o', '1');
  };

  const handleHeroPointerLeave = () => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty('--lamp-o', '0');
    el.style.setProperty('--brand-o', '0');
  };

  const handleLensMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = lensStageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(76, Math.min(rect.width - 76, e.clientX - rect.left));
    const y = Math.max(76, Math.min(rect.height - 76, e.clientY - rect.top));
    setLensPos({ x, y });

    // Highlight nearest node if within 82px
    let bestIdx = -1;
    let bestDist = 82;
    SCORING_LENS_NODES.forEach((n, idx) => {
      const dist = Math.hypot(n.x * rect.width - (e.clientX - rect.left), n.y * rect.height - (e.clientY - rect.top));
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    if (bestIdx >= 0 && bestIdx !== activeNodeIdx) {
      setActiveNodeIdx(bestIdx);
    }
  };

  const activeNode = SCORING_LENS_NODES[activeNodeIdx] || SCORING_LENS_NODES[1];
  const activePlan = COMMERCIAL_PLANS.find((p) => p.id === activePlanId) || COMMERCIAL_PLANS[0];
  const activeScenario = MARKET_SCENARIOS.find((s) => s.id === activeScenarioId) || MARKET_SCENARIOS[3];
  const tamScenario = MARKET_SCENARIOS.find((s) => s.id === 'tam') || MARKET_SCENARIOS[0];
  const samScenario = MARKET_SCENARIOS.find((s) => s.id === 'sam') || MARKET_SCENARIOS[1];
  const somScenarios = MARKET_SCENARIOS.filter((s) => s.id.startsWith('som'));
  const isSomActive = activeScenarioId.startsWith('som');
  const currentSomScenario = MARKET_SCENARIOS.find((s) => s.id === (isSomActive ? activeScenarioId : 'som10')) || somScenarios[1];

  const renderGraphInner = (isZoomClone: boolean) => {
    const hub = SCORING_LENS_NODES[0];
    const hx = hub.x * lensSize.w;
    const hy = hub.y * lensSize.h;

    return (
      <div className="qi-lens-map" style={{ width: lensSize.w, height: lensSize.h }}>
        <svg className="qi-lens-wires" viewBox={`0 0 ${lensSize.w} ${lensSize.h}`} aria-hidden="true">
          {SCORING_LENS_NODES.slice(1).map((node, idx) => {
            const realIdx = idx + 1;
            const nx = node.x * lensSize.w;
            const ny = node.y * lensSize.h;
            const mx = (hx + nx) / 2;
            const d = `M ${hx.toFixed(1)} ${hy.toFixed(1)} C ${mx.toFixed(1)} ${hy.toFixed(1)}, ${mx.toFixed(1)} ${ny.toFixed(1)}, ${nx.toFixed(1)} ${ny.toFixed(1)}`;
            const isOn = activeNodeIdx === realIdx;
            return (
              <path
                key={node.id}
                d={d}
                fill="none"
                stroke={isOn ? '#DCB434' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isOn ? 2 : 1.1}
                strokeDasharray={node.id === 'ethics' ? '4 4' : undefined}
              />
            );
          })}
        </svg>

        {SCORING_LENS_NODES.map((node, idx) => (
          <button
            key={node.id}
            type="button"
            tabIndex={isZoomClone ? -1 : 0}
            className={`qi-lens-node ${activeNodeIdx === idx ? 'is-on' : ''}`}
            style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
            onClick={() => {
              setActiveNodeIdx(idx);
              setLensPos({ x: node.x * lensSize.w, y: node.y * lensSize.h });
            }}
          >
            <b>{node.weight}</b>
            <span>{node.title}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* TOP MASTHEAD */}
      <header className={`qi-masthead ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="qi-shell qi-shell--wide">
          <div className="qi-mast-inner">
            <button
              type="button"
              className="qi-brand-btn"
              onClick={() => onScrollToSection('sec-abertura')}
              aria-label="Voltar ao topo da Q.I. Match"
            >
              <span className="qi-brand-emblem">Q</span>
              <span className="qi-wordmark">Q.I. Match</span>
            </button>

            <nav className="qi-nav-links" aria-label="Seções da apresentação">
              {[
                { id: 'sec-abertura', label: 'O que é' },
                { id: 'sec-problema', label: 'Problema' },
                { id: 'sec-solucao', label: 'Solução' },
                { id: 'sec-mercado', label: 'Mercado' },
                { id: 'sec-demonstracao', label: 'Plataforma' },
                { id: 'sec-tecnologia', label: 'Confiança' },
                { id: 'sec-viabilidade', label: 'Investimento' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onScrollToSection(item.id)}
                  className={`qi-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {onOpenTechnicalBanca && (
                <button
                  type="button"
                  onClick={onOpenTechnicalBanca}
                  className="qi-btn"
                  style={{
                    border: '1px solid var(--amber-hi)',
                    color: 'var(--amber-hi)',
                    background: 'rgba(201, 162, 39, 0.1)',
                    fontWeight: 600,
                  }}
                  title="Abrir tela exclusiva de Arquitetura e Defesa Técnica"
                >
                  ⚡ Banca Técnica
                </button>
              )}
              <button type="button" className="qi-btn qi-btn--brass" onClick={onOpenPrototype}>
                <span className="qi-roll">
                  <span>Testar Protótipo</span>
                  <span aria-hidden="true">Abrir Demonstração</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* ABERTURA — O QUE É A Q.I. MATCH?                                    */}
      {/* =================================================================== */}
      <section
        id="sec-abertura"
        ref={heroRef}
        className="qi-hero"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
      >
        <div className="qi-hero-lamp" aria-hidden="true" />

        <div className="qi-beams" aria-hidden="true">
          <b style={{ '--x': '16%', '--r': '-18deg' } as React.CSSProperties} />
          <b style={{ '--x': '33%', '--r': '-12deg' } as React.CSSProperties} />
          <b style={{ '--x': '50%', '--r': '0deg' } as React.CSSProperties} />
          <b style={{ '--x': '67%', '--r': '12deg' } as React.CSSProperties} />
          <b style={{ '--x': '84%', '--r': '18deg' } as React.CSSProperties} />
        </div>

        <div className="qi-hero-brand" aria-hidden="true">
          <span className="qi-hero-brand__ghost">Q.I. MATCH</span>
          <span className="qi-hero-brand__lit">Q.I. MATCH</span>
        </div>

        <div className="qi-hero-glow" ref={arcWrapRef} aria-hidden="true">
          <canvas ref={arcCanvasRef} />
        </div>

        <div className="qi-hero-terrain" ref={terrainRef} aria-hidden="true" />

        <div className="qi-shell">
          <div className="qi-hero-copy">
            <div className="qi-mark">
              <span>Recrutamento Especializado em Tecnologia</span>
            </div>

            <h1 className="qi-d1">
              O talento certo. A oportunidade certa.{' '}
              <span style={{ color: 'var(--amber-hi)' }}>Uma conexão mais inteligente.</span>
            </h1>

            <p className="qi-lede">
              A <strong style={{ color: 'var(--bone)' }}>Q.I. Match</strong> é uma plataforma de recrutamento
              especializada em profissionais de tecnologia. Nossa proposta é ajudar empresas a encontrar pessoas com as
              competências necessárias para suas vagas, considerando conhecimentos técnicos, habilidades
              comportamentais e interesse real na oportunidade.
            </p>

            <div className="qi-support-pill">
              Mais do que analisar currículos, buscamos aproximar empresas e profissionais com maior compatibilidade.
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--slate)', margin: '14px 0 0' }}>
              Use as setas{' '}
              <kbd style={{ padding: '2px 6px', border: '1px solid var(--hair-strong)', borderRadius: 4, color: 'var(--bone)' }}>←</kbd>{' '}
              <kbd style={{ padding: '2px 6px', border: '1px solid var(--hair-strong)', borderRadius: 4, color: 'var(--bone)' }}>→</kbd>{' '}
              do teclado para navegar diretamente entre as etapas da apresentação.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* O PROBLEMA — POR QUE A Q.I. MATCH É NECESSÁRIA?                     */}
      {/* =================================================================== */}
      <section id="sec-problema" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>O Desafio do Mercado</span>
            </div>
            <h2 className="qi-d2">
              Encontrar profissionais de tecnologia é um desafio.{' '}
              <span style={{ color: 'var(--slate)' }}>Identificar os mais adequados é outro.</span>
            </h2>
            <p className="qi-lede">
              Empresas podem receber diversos currículos e ainda enfrentar dificuldades para identificar quem realmente
              possui os conhecimentos, a experiência e o perfil necessários para uma contratação. Ao mesmo tempo,
              profissionais qualificados recebem propostas que nem sempre correspondem às suas expectativas.
            </p>
            <p style={{ color: 'var(--bone)', fontWeight: 500, fontSize: '1.08rem', margin: 0 }}>
              O desafio não é apenas encontrar candidatos. É identificar compatibilidade entre pessoas e oportunidades.
            </p>
          </div>

          <div className="qi-plot">
            <div className="qi-brackets" aria-hidden="true">
              <i /><i /><i /><i />
            </div>

            <div className="qi-bento">
              {PROBLEM_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onOpenDrawer(card.drawerId)}
                  className={`qi-surface qi-bcard qi-bcard--${card.layout}`}
                >
                  <div className="qi-bcard__vis">{renderIsometricDiagram(idx)}</div>
                  <div className="qi-bcard__body">
                    <div className="qi-bcard__metric-row">
                      <span className="qi-bcard__metric">{card.metric}</span>
                      <span className="qi-bcard__tag">{card.label}</span>
                    </div>
                    <h3 className="qi-d3" style={{ fontSize: '1.25rem' }}>{card.title}</h3>
                    <p style={{ margin: 0, fontSize: 14.5, color: 'var(--slate)', lineHeight: 1.55 }}>
                      {card.summary}
                    </p>
                    <span style={{ fontSize: 12.5, color: 'var(--amber-hi)', fontWeight: 600, marginTop: 4 }}>
                      Consultar fontes e metodologia →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* NOSSA SOLUÇÃO — COMO FUNCIONA?                                      */}
      {/* =================================================================== */}
      <section id="sec-solucao" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Nossa Solução</span>
            </div>
            <h2 className="qi-d2">
              A tecnologia ajuda a identificar compatibilidades.{' '}
              <span style={{ color: 'var(--slate)' }}>As pessoas continuam no centro da decisão.</span>
            </h2>
            <p className="qi-lede">
              A Q.I. Match propõe reunir informações sobre as vagas e os profissionais, avaliar critérios relevantes e
              apresentar conexões com maior potencial de compatibilidade.
            </p>
          </div>

          {/* Três elementos orientadores */}
          <div className="qi-pillars-grid">
            {SOLUTION_PILLARS.map((pillar) => (
              <article key={pillar.id} className="qi-surface qi-pillar-card">
                <span className="qi-pillar-num">ELEMENTO {pillar.step}</span>
                <h3 className="qi-d3">{pillar.title}</h3>
                <p style={{ margin: 0, color: 'var(--bone)', fontWeight: 500, fontSize: '1.05rem' }}>
                  {pillar.shortText}
                </p>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--slate)' }}>{pillar.detail}</p>
              </article>
            ))}
          </div>

          {/* Canvas de Proposta de Valor: Dores × Ganhos × Analgésicos */}
          <div style={{ marginTop: 42, marginBottom: 42 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11.5, letterSpacing: '0.12em', color: 'var(--amber-hi)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Canvas de Proposta de Valor
                </span>
                <h3 className="qi-d3" style={{ marginTop: 4, marginBottom: 0 }}>
                  Dores do mercado versus analgésicos da Q.I. Match
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 999, border: '1px solid var(--hair)' }}>
                <button
                  type="button"
                  onClick={() => setActiveAudienceTab('empresas')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeAudienceTab === 'empresas' ? 'var(--amber-hi)' : 'transparent',
                    color: activeAudienceTab === 'empresas' ? '#0b0b0f' : 'var(--slate)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Para Empresas Contratantes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAudienceTab('profissionais')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeAudienceTab === 'profissionais' ? 'var(--amber-hi)' : 'transparent',
                    color: activeAudienceTab === 'profissionais' ? '#0b0b0f' : 'var(--slate)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Para Profissionais de Tecnologia
                </button>
              </div>
            </div>

            {(() => {
              const currentProp = VALUE_PROPOSITIONS.find((v) => v.audience === activeAudienceTab) || VALUE_PROPOSITIONS[0];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18 }}>
                    {/* Dores */}
                    <div
                      className="qi-surface"
                      style={{
                        padding: 24,
                        borderLeft: '3px solid #e05252',
                        background: 'linear-gradient(180deg, rgba(224, 82, 82, 0.05) 0%, rgba(14, 14, 18, 0.7) 100%)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ color: '#e05252', fontSize: 16 }}>✕</span>
                        <strong style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f08080' }}>
                          Dores do Cliente
                        </strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {currentProp.dores.map((dor, i) => (
                          <div key={i}>
                            <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)', marginBottom: 3 }}>
                              {dor.title}
                            </strong>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)', lineHeight: 1.5 }}>
                              {dor.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ganhos */}
                    <div
                      className="qi-surface"
                      style={{
                        padding: 24,
                        borderLeft: '3px solid var(--amber-hi)',
                        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.06) 0%, rgba(14, 14, 18, 0.7) 100%)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ color: 'var(--amber-hi)', fontSize: 16 }}>★</span>
                        <strong style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amber-hi)' }}>
                          Ganhos Desejados
                        </strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {currentProp.ganhos.map((ganho, i) => (
                          <div key={i}>
                            <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)', marginBottom: 3 }}>
                              {ganho.title}
                            </strong>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)', lineHeight: 1.5 }}>
                              {ganho.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analgésicos Q.I. Match */}
                    <div
                      className="qi-surface"
                      style={{
                        padding: 24,
                        borderLeft: '3px solid #57c785',
                        background: 'linear-gradient(180deg, rgba(87, 199, 133, 0.06) 0%, rgba(14, 14, 18, 0.7) 100%)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ color: '#57c785', fontSize: 16 }}>✓</span>
                        <strong style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57c785' }}>
                          Analgésicos Q.I. Match
                        </strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {currentProp.analgesicos.map((an, i) => (
                          <div key={i}>
                            <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)', marginBottom: 3 }}>
                              {an.title}
                            </strong>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)', lineHeight: 1.5 }}>
                              {an.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flagship Feature Banner */}
                  <div
                    style={{
                      padding: '16px 22px',
                      borderRadius: 14,
                      background: 'rgba(201, 162, 39, 0.08)',
                      border: '1px solid rgba(201, 162, 39, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--amber-hi)', color: '#000', fontWeight: 700 }}>
                          {currentProp.flagshipFeature.highlight}
                        </span>
                        <strong style={{ fontSize: 14, color: 'var(--bone)' }}>
                          {currentProp.flagshipFeature.name}
                        </strong>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--slate)' }}>
                        {currentProp.flagshipFeature.detail}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="qi-btn"
                      onClick={() => onScrollToSection('sec-demonstracao')}
                    >
                      <span className="qi-roll">
                        <span>Ver funcionamento na plataforma →</span>
                        <span aria-hidden="true">Explorar telas do produto →</span>
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Lupa interativa sobre os critérios de compatibilidade */}
          <div className="qi-lens-wrap">
            <div
              ref={lensStageRef}
              className="qi-lens-stage"
              onPointerMove={handleLensMove}
              aria-label="Diagrama interativo dos critérios de compatibilidade"
            >
              <div style={{ position: 'absolute', top: 14, left: 18, zIndex: 4, fontSize: 12, color: 'var(--slate)' }}>
                Mova o cursor ou clique nos critérios para inspecionar os pesos da avaliação
              </div>

              {renderGraphInner(false)}

              <div
                className="qi-lens-glass"
                style={{ transform: `translate3d(${lensPos.x.toFixed(1)}px, ${lensPos.y.toFixed(1)}px, 0)` }}
                aria-hidden="true"
              >
                <div
                  className="qi-lens-zoom"
                  style={{
                    width: lensSize.w,
                    height: lensSize.h,
                    transform: `translate3d(${(74 - 1.65 * lensPos.x).toFixed(1)}px, ${(74 - 1.65 * lensPos.y).toFixed(1)}px, 0) scale(1.65)`,
                  }}
                >
                  {renderGraphInner(true)}
                </div>
              </div>
            </div>

            <div className="qi-surface" style={{ padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="qi-status-pill qi-status-pill--mvp-demo" style={{ alignSelf: 'flex-start' }}>
                  Pesos customizáveis por oportunidade
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--amber-hi)', lineHeight: 1 }}>
                    {activeNode.weight}
                  </span>
                  <h3 className="qi-d3" style={{ fontSize: '1.3rem' }}>{activeNode.title}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--bone)', fontSize: 14.5, fontWeight: 500 }}>
                  {activeNode.caption}
                </p>
                <p style={{ margin: 0, color: 'var(--slate)', fontSize: 14.5, lineHeight: 1.55 }}>
                  {activeNode.detail}
                </p>
              </div>

              <div style={{ paddingTop: 14, borderTop: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.45 }}>
                  Critérios balanceados entre competências técnicas, habilidades comportamentais e senioridade/remuneração, calibráveis de acordo com as necessidades de cada contratação.
                </p>
                <button
                  type="button"
                  className="qi-btn"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => onOpenDrawer('drawer-solucao-pesos')}
                >
                  <span className="qi-roll">
                    <span>Entender o modelo de pontuação →</span>
                    <span aria-hidden="true">Abrir aprofundamento dos critérios →</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* MERCADO E MODELO DE NEGÓCIO — QUEM UTILIZA E QUEM PAGA?             */}
      {/* =================================================================== */}
      <section id="sec-mercado" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>MODELO ANTECIPADO TRANSPARENTE • ZERO TAXA OCULTA</span>
            </div>
            <h2 className="qi-d2">
              Planos Transparentes e Pré-pagos{' '}
              <span style={{ color: 'var(--slate)' }}>para Empresas</span>
            </h2>
            <p className="qi-lede">
              Contrate slots de vagas ativas com suporte a múltiplos perfis técnicos sem mensalidade abusiva.
              Pague pelo slot em aberto, substitua ou pause conforme sua demanda de engenharia.
            </p>
          </div>

          <div className="qi-market-grid">
            {/* Fichário de Planos Propostos */}
            <div className="qi-surface" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber-hi)', fontWeight: 600 }}>
                    Planos Comerciais por Slots
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--slate)' }}>
                    Clique nas abas para comparar modalidades
                  </span>
                </div>

                <div className="qi-binder-tabs" role="tablist" aria-label="Modalidades comerciais propostas">
                  {COMMERCIAL_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      role="tab"
                      aria-selected={activePlan.id === plan.id}
                      className={`qi-binder-tab ${activePlan.id === plan.id ? 'is-active' : ''}`}
                      onClick={() => setActivePlanId(plan.id)}
                    >
                      {plan.code} · {plan.tabLabel}
                    </button>
                  ))}
                </div>

                <div style={{
                  padding: '22px 24px',
                  borderRadius: 14,
                  background: activePlan.isFeatured ? 'rgba(201, 162, 39, 0.08)' : 'rgba(0,0,0,0.42)',
                  border: activePlan.isFeatured ? '1.5px solid var(--amber-hi)' : '1px solid var(--hair)',
                  boxShadow: activePlan.isFeatured ? '0 0 24px rgba(226, 185, 59, 0.16)' : 'none',
                }}>
                  {/* Badges superiores do card */}
                  {(activePlan.badge || activePlan.highlightTag) && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                      {activePlan.badge && (
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: activePlan.isFeatured ? 'var(--amber-hi)' : 'rgba(255,255,255,0.1)',
                          color: activePlan.isFeatured ? '#000' : 'var(--amber-hi)',
                          border: activePlan.isFeatured ? 'none' : '1px solid rgba(226,185,59,0.3)',
                        }}>
                          {activePlan.badge}
                        </span>
                      )}
                      {activePlan.highlightTag && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(226, 185, 59, 0.18)',
                          color: 'var(--amber-hi)',
                          border: '1px solid rgba(226, 185, 59, 0.4)',
                        }}>
                          {activePlan.highlightTag}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <h3 className="qi-d3">{activePlan.title}</h3>
                    <div>
                      <strong style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--amber-hi)' }}>
                        {activePlan.price}
                      </strong>{' '}
                      <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>{activePlan.period}</span>
                    </div>
                  </div>

                  {activePlan.subPrice && (
                    <p style={{ margin: '4px 0 10px', fontSize: 12, color: 'var(--amber-hi)', fontWeight: 600 }}>
                      {activePlan.subPrice}
                    </p>
                  )}

                  <p style={{ margin: '10px 0 8px', fontSize: 13.5, color: 'var(--bone)' }}>
                    <strong>Público indicado:</strong> {activePlan.targetAudience}
                  </p>
                  <p style={{ margin: '0 0 14px', fontSize: 14.5, color: 'var(--slate)', lineHeight: 1.55 }}>
                    {activePlan.summary}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activePlan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: '#e4e4e9' }}>
                        <span style={{ color: 'var(--amber-hi)', fontWeight: 700 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Botão de Ação alinhado ao vídeo */}
                  <button
                    type="button"
                    onClick={onOpenPrototype}
                    className="qi-btn qi-btn--brass"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: activePlan.isFeatured ? 'var(--amber-hi)' : undefined,
                      color: activePlan.isFeatured ? '#000' : undefined,
                      fontWeight: 700,
                    }}
                  >
                    <span className="qi-roll">{activePlan.ctaText || 'Ativar Plano'}</span>
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--slate)' }}>{activePlan.note}</p>
            </div>

            {/* Funil Executivo de Mercado TAM / SAM / SOM */}
            <div className="qi-surface qi-market-funnel-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="qi-status-pill qi-status-pill--mvp-demo">
                    Dimensionamento de Mercado
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--slate)' }}>
                    Funil TAM · SAM · SOM
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDrawer('drawer-mercado-metodologia')}
                  style={{ background: 'none', border: 0, color: 'var(--amber-hi)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>Ver memória de cálculo</span>
                  <span>→</span>
                </button>
              </div>

              {/* Camadas do Funil */}
              <div className="qi-funnel-layers" role="region" aria-label="Funil de Mercado">
                {/* Camada 1: TAM */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (activeScenarioId === 'tam') {
                      setShowScenarioDetails((prev) => !prev);
                    } else {
                      setActiveScenarioId('tam');
                      setShowScenarioDetails(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveScenarioId('tam');
                      setShowScenarioDetails(true);
                    }
                  }}
                  className={`qi-funnel-tier ${activeScenarioId === 'tam' ? 'is-active' : ''}`}
                >
                  <div className="qi-funnel-tier-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="qi-funnel-tag qi-funnel-tag--tam">TAM</span>
                      <div>
                        <strong className="qi-funnel-title">Mercado Total Nacional</strong>
                        <span className="qi-funnel-sub">Brasil · CNAE 6203-1/00 (Sebrae / Receita)</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong className="qi-funnel-val">{tamScenario.annualValue}</strong>
                      <span className="qi-funnel-sub">{tamScenario.companiesCount}</span>
                    </div>
                  </div>
                  <div className="qi-funnel-bar-track">
                    <div className="qi-funnel-bar-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #8E6D16, #C9A227)' }} />
                  </div>
                </div>

                {/* Camada 2: SAM */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (activeScenarioId === 'sam') {
                      setShowScenarioDetails((prev) => !prev);
                    } else {
                      setActiveScenarioId('sam');
                      setShowScenarioDetails(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveScenarioId('sam');
                      setShowScenarioDetails(true);
                    }
                  }}
                  className={`qi-funnel-tier ${activeScenarioId === 'sam' ? 'is-active' : ''}`}
                >
                  <div className="qi-funnel-tier-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="qi-funnel-tag qi-funnel-tag--sam">SAM</span>
                      <div>
                        <strong className="qi-funnel-title">Mercado Regional Endereçável</strong>
                        <span className="qi-funnel-sub">São Paulo Capital · Polo de Tecnologia</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong className="qi-funnel-val">{samScenario.annualValue}</strong>
                      <span className="qi-funnel-sub">{samScenario.companiesCount}</span>
                    </div>
                  </div>
                  <div className="qi-funnel-bar-track">
                    <div className="qi-funnel-bar-fill" style={{ width: '52%', background: 'linear-gradient(90deg, #A88620, #DCB434)' }} />
                  </div>
                </div>

                {/* Camada 3: SOM com Seletor de Cenários */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (isSomActive) {
                      setShowScenarioDetails((prev) => !prev);
                    } else {
                      setActiveScenarioId('som10');
                      setShowScenarioDetails(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveScenarioId('som10');
                      setShowScenarioDetails(true);
                    }
                  }}
                  className={`qi-funnel-tier ${isSomActive ? 'is-active' : ''}`}
                >
                  <div className="qi-funnel-tier-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="qi-funnel-tag qi-funnel-tag--som">SOM</span>
                      <div>
                        <strong className="qi-funnel-title">Metas de Validação Comercial</strong>
                        <span className="qi-funnel-sub">Projeção no 1º ciclo anual (SP)</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong className="qi-funnel-val" style={{ color: 'var(--amber-hi)' }}>
                        {currentSomScenario.annualValue}
                      </strong>
                      <span className="qi-funnel-sub" style={{ color: 'var(--bone)', fontWeight: 500 }}>
                        {currentSomScenario.companiesCount}
                      </span>
                    </div>
                  </div>

                  {/* Seletor rápido de cenários SOM */}
                  <div className="qi-som-pills" onClick={(e) => e.stopPropagation()}>
                    {somScenarios.map((sc) => {
                      const isSelected = activeScenarioId === sc.id;
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => {
                            setActiveScenarioId(sc.id);
                            setShowScenarioDetails(true);
                          }}
                          className={`qi-som-pill ${isSelected ? 'is-selected' : ''}`}
                        >
                          {sc.shortLabel.replace('Cenário ', '')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="qi-funnel-bar-track">
                    <div
                      className="qi-funnel-bar-fill"
                      style={{
                        width: activeScenarioId === 'som05' ? '18%' : activeScenarioId === 'som20' ? '46%' : '30%',
                        background: 'linear-gradient(90deg, #DCB434, #FFE599)',
                        boxShadow: '0 0 10px rgba(220,180,52,0.5)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Rodapé: visualização simples e limpa, detalhes sob demanda */}
              <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowScenarioDetails((prev) => !prev)}
                    className="qi-funnel-detail-btn"
                  >
                    <span style={{ fontSize: 13, color: 'var(--amber-hi)' }}>
                      {showScenarioDetails ? '▾' : '▸'}
                    </span>
                    <span style={{ fontSize: 12, color: showScenarioDetails ? 'var(--bone)' : 'var(--slate)', fontWeight: 500 }}>
                      {showScenarioDetails ? 'Ocultar premissas e justificativa' : `Ver detalhes: ${activeScenario.shortLabel}`}
                    </span>
                  </button>

                  <span style={{ fontSize: 11, color: 'var(--slate)', opacity: 0.75 }}>
                    {showScenarioDetails ? 'Base oficial Receita Federal' : 'Clique para expandir premissas'}
                  </span>
                </div>

                {showScenarioDetails && (
                  <div className="qi-funnel-detail-pane">
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 13, color: 'var(--bone)' }}>{activeScenario.title}</strong>
                      <span style={{ fontSize: 11.5, color: 'var(--amber-hi)', fontWeight: 600 }}>{activeScenario.annualValue}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.5 }}>
                      {activeScenario.description}
                    </p>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 11, color: 'var(--slate)', opacity: 0.85 }}>
                      <span>✓ Ref: R$ 5.400/ano por empresa (R$ 450/mês · 1 Slot)</span>
                      <span>✓ CNAE 6203-1/00 oficial</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3 Volumes de Personas que abrem em Livro de 2 Páginas */}
          <div style={{ marginTop: 42 }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h3 className="qi-d3">Para quem a plataforma foi desenhada</h3>
              <p style={{ margin: '6px auto 0', fontSize: 14.5, color: 'var(--slate)' }}>
                Conheça os três perfis estratégicos da plataforma: Empresas em Expansão, Liderança Técnica / RH e Profissionais de Tecnologia.
              </p>
            </div>

            <div className="qi-volumes-grid">
              {PERSONA_VOLUMES.map((vol) => (
                <article key={vol.id} className="qi-surface qi-vol-card">
                  <div
                    className="qi-vol-book"
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenPersona(vol)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpenPersona(vol);
                      }
                    }}
                    aria-label={`Abrir caderno da persona ${vol.name}`}
                  >
                    <div className="qi-vol-book__spine" />
                    <div className="qi-vol-book__pages" />
                    <div className="qi-vol-book__cover">
                      <span style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                        {vol.volumeNumber}
                      </span>
                      <div>
                        <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)', lineHeight: 1.25 }}>
                          {vol.name}
                        </strong>
                        <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: 'var(--slate)' }}>
                          {vol.role}
                        </span>
                      </div>
                      <span style={{ fontSize: 10.5, color: 'var(--amber-hi)' }}>Abrir leitura →</span>
                    </div>
                  </div>

                  <div>
                    <strong style={{ display: 'block', color: 'var(--bone)', fontSize: 16 }}>{vol.name}</strong>
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--amber-hi)', marginBottom: 6 }}>
                      {vol.role} · {vol.age}
                    </span>
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--slate)' }}>{vol.coverSubtitle}</p>
                  </div>

                  <button type="button" className="qi-btn" onClick={() => setOpenPersona(vol)}>
                    <span className="qi-roll">
                      <span>Abrir perfil detalhado</span>
                      <span aria-hidden="true">Ler página dupla + canais →</span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE LEITURA EM PÁGINA DUPLA DAS PERSONAS */}
      {openPersona && (
        <div
          className="qi-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Perfil de ${openPersona.name}`}
          onClick={() => setOpenPersona(null)}
        >
          <div className="qi-reader-spread" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 980 }}>
            {/* Página 01: Dores e Desafios */}
            <div style={{ padding: '30px 28px', borderRight: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 11.5, letterSpacing: '0.14em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                {openPersona.volumeNumber} · PÁGINA 01
              </span>
              <h3 className="qi-d3">{openPersona.name}</h3>
              <span style={{ fontSize: 13.5, color: 'var(--slate)' }}>
                {openPersona.role} · {openPersona.age}
              </span>
              {openPersona.companyProfile && (
                <div style={{ fontSize: 12.5, color: 'var(--amber-hi)', padding: '6px 10px', background: 'rgba(201,162,39,0.08)', borderRadius: 6, border: '1px solid rgba(201,162,39,0.2)' }}>
                  {openPersona.companyProfile}
                </div>
              )}
              <hr style={{ border: 0, borderTop: '1px solid var(--hair)', width: '100%' }} />
              <strong style={{ color: 'var(--bone)', fontSize: 15 }}>{openPersona.leftPageTitle}</strong>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>
                {openPersona.leftPageChallenge}
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: '#dcdce2' }}>
                {openPersona.leftPagePoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Página 02: Solução Q.I. Match & Canais em 5 Fases */}
            <div style={{ padding: '30px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11.5, letterSpacing: '0.14em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                    PROPOSTA Q.I. MATCH · PÁGINA 02
                  </span>
                  <button
                    type="button"
                    className="qi-btn"
                    style={{ minHeight: 34, padding: '0 14px' }}
                    onClick={() => setOpenPersona(null)}
                  >
                    Fechar ✕
                  </button>
                </div>
                <strong style={{ color: 'var(--bone)', fontSize: 16 }}>{openPersona.rightPageTitle}</strong>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>
                  {openPersona.rightPageHowQiHelps}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {openPersona.rightPagePoints.map((pt, i) => (
                    <li
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(201,162,39,0.08)',
                        border: '1px solid rgba(201,162,39,0.24)',
                        fontSize: 13,
                        color: 'var(--bone)',
                      }}
                    >
                      <span style={{ color: 'var(--amber-hi)', fontWeight: 700, marginRight: 8 }}>✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Canais de Relacionamento (Jornada em 5 Fases) */}
                {openPersona.channels && openPersona.channels.length > 0 && (
                  <div style={{ marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--hair)' }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--amber-hi)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 8 }}>
                      Canais de Relacionamento (Jornada em 5 Fases)
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {openPersona.channels.map((ch, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--hair)',
                            fontSize: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                            <strong style={{ color: 'var(--bone)' }}>{ch.phase}</strong>
                            <span style={{ color: 'var(--amber-hi)', fontSize: 11 }}>{ch.channel}</span>
                          </div>
                          <span style={{ color: 'var(--slate)', fontSize: 11.5 }}>{ch.goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--hair)' }}>
                <span style={{ fontSize: 12, color: 'var(--slate)' }}>Perfil estratégico da plataforma Q.I. Match</span>
                <button
                  type="button"
                  className="qi-btn"
                  onClick={() => {
                    const idx = PERSONA_VOLUMES.findIndex((p) => p.id === openPersona.id);
                    setOpenPersona(PERSONA_VOLUMES[(idx + 1) % PERSONA_VOLUMES.length]);
                  }}
                >
                  Próximo perfil →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
