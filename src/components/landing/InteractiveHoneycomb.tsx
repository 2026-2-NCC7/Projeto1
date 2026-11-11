import React, { useEffect, useRef } from 'react';
import { TrustHexItem } from '../../data/qiMatchLandingData';

interface InteractiveHoneycombProps {
  items: TrustHexItem[];
  selectedHexId: string;
  onSelectHex: (id: string) => void;
}

interface TilePhysics {
  el: HTMLElement;
  d: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  vs: number;
  bx: number;
  by: number;
  jx: number;
  jy: number;
  gx: number;
  gy: number;
  f: number[];
  ph: number[];
  isTile: boolean;
}

// Axial honeycomb coordinates matching the authentic Umbra comb layout
const AXIAL_COORDINATES = [
  { q: 0, r: 0, d: 1.0 },   // 01 Decisão humana (Center)
  { q: -1, r: 0, d: 1.15 }, // 02 Interesse mútuo (Left)
  { q: 0, r: -1, d: 0.9 },  // 03 Critérios abertos (Top)
  { q: 1, r: -1, d: 1.2 },  // 04 Zero biometria (Top Right)
  { q: 1, r: 0, d: 0.85 },  // 05 Salário visível (Right)
  { q: 0, r: 1, d: 1.1 },   // 06 Modo Discreto (Bottom)
  { q: -1, r: 1, d: 0.95 }, // 07 Retenção mínima (Bottom Left)
  { q: 2, r: -1, d: 1.3 },  // 08 Direito de revisão (Far Top Right)
];

// Blank and far decorative filler tiles to complete the organic comb
const FILLER_TILES = [
  { q: -2, r: 1, d: 1.4, isFar: false },
  { q: 2, r: 0, d: 0.7, isFar: false },
  { q: -1, r: 2, d: 1.2, isFar: false },
  { q: 1, r: 1, d: 0.8, isFar: false },
  { q: -3, r: 0, d: 1.8, isFar: true },
  { q: -3, r: 2, d: 2.0, isFar: true },
  { q: -2, r: -1, d: 1.6, isFar: true },
];

// Initial scatter offsets for scroll convergence
const SCATTER_OFFSETS = [
  { x: 0, y: 0, rot: 0 },
  { x: -140, y: -40, rot: -14 },
  { x: 20, y: -160, rot: 12 },
  { x: 150, y: -120, rot: -16 },
  { x: 180, y: 30, rot: 18 },
  { x: 0, y: 170, rot: -10 },
  { x: -160, y: 130, rot: 16 },
  { x: 220, y: -60, rot: 22 },
];

export const InteractiveHoneycomb: React.FC<InteractiveHoneycombProps> = ({
  items,
  selectedHexId,
  onSelectHex,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragDistRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Linear Congruential Generator matching original Umbra code
    let seed = 7;
    const rnd = () => {
      seed = (16807 * seed) % 2147483647;
      return seed / 2147483647;
    };

    const tileElements = Array.from(stage.querySelectorAll<HTMLElement>('.hex'));
    const physicsList: TilePhysics[] = tileElements.map((el) => ({
      el,
      d: +(el.dataset.d || '1'),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      s: 1,
      vs: 0,
      bx: 0,
      by: 0,
      jx: 0,
      jy: 0,
      gx: 0,
      gy: 0,
      f: [0.5 + 0.5 * rnd(), 0.8 + 0.6 * rnd(), 0.45 + 0.5 * rnd(), 0.9 + 0.6 * rnd(), 0.3 + 0.3 * rnd()],
      ph: [0, 0, 0, 0, 0].map(() => 6.3 * rnd()),
      isTile: !el.classList.contains('hex--blank'),
    }));

    let isStageHovered = false;
    let hoverBlend = 0;
    let nudgedTile: TilePhysics | null = null;
    let draggedTile: TilePhysics | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let rafHandle = 0;
    let lastTime = 0;
    let touchTimer: ReturnType<typeof setTimeout> | null = null;

    const updateBasePos = (item: TilePhysics) => {
      const sRect = stage.getBoundingClientRect();
      const elRect = item.el.getBoundingClientRect();
      item.bx = elRect.left - sRect.left + elRect.width / 2 - item.x;
      item.by = elRect.top - sRect.top + elRect.height / 2 - item.y;
    };

    const updatePointerCoords = (e: PointerEvent | MouseEvent | Touch) => {
      const sRect = stage.getBoundingClientRect();
      pointerX = e.clientX - sRect.left;
      pointerY = e.clientY - sRect.top;
    };

    const applyNudge = (item: TilePhysics) => {
      const angle = rnd() * Math.PI * 2;
      const dist = 16 + 18 * rnd();
      item.jx = Math.cos(angle) * dist;
      item.jy = Math.sin(angle) * dist;
    };

    const loop = (timestamp: number) => {
      const dt = Math.min(0.05, (timestamp - (lastTime || timestamp)) / 1000) || 0.016;
      lastTime = timestamp;
      const timeSec = timestamp / 1000;

      hoverBlend += 0.06 * ((isStageHovered && hasFinePointer ? 1 : 0) - hoverBlend);
      const firstEl = physicsList[0]?.el;
      const tileWidth = firstEl ? firstEl.offsetWidth : 120;
      const influenceRadius = 1.9 * tileWidth;

      const activeItem = draggedTile || nudgedTile;
      if (activeItem) updateBasePos(activeItem);

      if (nudgedTile && !draggedTile && hasFinePointer) {
        if (Math.hypot(pointerX - (nudgedTile.bx + nudgedTile.x), pointerY - (nudgedTile.by + nudgedTile.y)) > 0.62 * tileWidth) {
          nudgedTile = null;
        }
      }

      let activeAnimation = hoverBlend > 0.002;

      for (const item of physicsList) {
        let targetX = hoverBlend * (6 + 4 * item.d) * (Math.sin(timeSec * item.f[0] + item.ph[0]) + 0.5 * Math.sin(timeSec * item.f[1] + item.ph[1]));
        let targetY = hoverBlend * (6 + 4 * item.d) * (Math.sin(timeSec * item.f[2] + item.ph[2]) + 0.5 * Math.sin(timeSec * item.f[3] + item.ph[3]));
        let targetScale = 1;
        let springK = 110;
        let damping = 13;

        if (item === draggedTile) {
          targetX = pointerX - item.bx - item.gx;
          targetY = pointerY - item.by - item.gy;
          targetScale = 1.1;
          springK = 260;
          damping = 22;
        } else if (item === nudgedTile) {
          targetX = item.jx + (hasFinePointer ? 0.22 * (pointerX - item.bx) : 0);
          targetY = item.jy + (hasFinePointer ? 0.22 * (pointerY - item.by) : 0);
          targetScale = 1.07;
        } else if (activeItem) {
          const dx = item.bx - (activeItem.bx + activeItem.x);
          const dy = item.by - (activeItem.by + activeItem.y);
          const dist = Math.hypot(dx, dy) || 1;
          const repelForce = (draggedTile ? 26 : 18) * Math.exp(-dist / influenceRadius);
          targetX += (dx / dist) * repelForce;
          targetY += (dy / dist) * repelForce;
        }

        item.vx += ((targetX - item.x) * springK - item.vx * damping) * dt;
        item.x += item.vx * dt;
        item.vy += ((targetY - item.y) * springK - item.vy * damping) * dt;
        item.y += item.vy * dt;
        item.vs += (140 * (targetScale - item.s) - 15 * item.vs) * dt;
        item.s += item.vs * dt;

        item.el.style.setProperty('--mx', item.x.toFixed(2) + 'px');
        item.el.style.setProperty('--my', item.y.toFixed(2) + 'px');
        item.el.style.setProperty('--s', item.s.toFixed(4));
        item.el.style.setProperty(
          '--rz',
          (
            2 * hoverBlend * Math.sin(timeSec * item.f[4] + item.ph[4]) +
            (item === nudgedTile ? 0.12 * item.jx : 0) +
            (item === draggedTile ? 0.006 * item.vx : 0)
          ).toFixed(3) + 'deg'
        );

        if (
          Math.abs(item.vx) + Math.abs(item.vy) + 40 * Math.abs(item.vs) > 0.02 ||
          Math.abs(item.x) + Math.abs(item.y) > 0.05
        ) {
          activeAnimation = true;
        }
      }

      rafHandle = activeAnimation || nudgedTile || draggedTile ? requestAnimationFrame(loop) : 0;
    };

    const wakeLoop = () => {
      if (!rafHandle) rafHandle = requestAnimationFrame(loop);
    };

    const refreshAllBases = () => physicsList.forEach(updateBasePos);

    // Scroll convergence handler
    const onScroll = () => {
      if (prefersReduced) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Progress from 0 (approaching) to 1 (centered in viewport)
      const raw = Math.min(1, Math.max(0, (vh * 0.95 - rect.top) / (vh * 0.55)));
      const inv = 1 - raw;

      physicsList.forEach((item, idx) => {
        if (!item.isTile) return;
        const sc = SCATTER_OFFSETS[idx] || { x: 0, y: 0, rot: 0 };
        item.el.style.setProperty('--ax', `${(sc.x * inv).toFixed(1)}px`);
        item.el.style.setProperty('--ay', `${(sc.y * inv).toFixed(1)}px`);
        item.el.style.setProperty('--ar', `${(sc.rot * inv).toFixed(1)}deg`);
        item.el.style.setProperty('--as', `${(0.85 + 0.15 * raw).toFixed(3)}`);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Stage pointer events
    const onStagePointerEnter = (e: PointerEvent) => {
      updatePointerCoords(e);
      isStageHovered = true;
      wakeLoop();
    };

    const onStagePointerMove = (e: PointerEvent) => {
      updatePointerCoords(e);
      if (!isStageHovered) {
        isStageHovered = true;
        wakeLoop();
      }
    };

    const onStagePointerLeave = () => {
      if (!draggedTile) {
        isStageHovered = false;
        nudgedTile = null;
        wakeLoop();
      }
    };

    stage.addEventListener('pointerenter', onStagePointerEnter);
    stage.addEventListener('pointermove', onStagePointerMove);
    stage.addEventListener('pointerleave', onStagePointerLeave);

    // Tile listeners
    physicsList.forEach((item) => {
      if (!item.isTile) return;

      const el = item.el;

      const onTilePointerEnter = (e: PointerEvent) => {
        if (hasFinePointer && !draggedTile && nudgedTile !== item) {
          updatePointerCoords(e);
          refreshAllBases();
          applyNudge(item);
          nudgedTile = item;
          isStageHovered = true;
          wakeLoop();
        }
      };

      const onTilePointerDown = (e: PointerEvent) => {
        updatePointerCoords(e);
        refreshAllBases();
        dragDistRef.current = 0;

        if (e.pointerType === 'touch') {
          applyNudge(item);
          nudgedTile = item;
          wakeLoop();
          if (touchTimer) clearTimeout(touchTimer);
          touchTimer = setTimeout(() => {
            if (nudgedTile === item) {
              nudgedTile = null;
              wakeLoop();
            }
          }, 900);
          return;
        }

        e.preventDefault();
        draggedTile = item;
        item.gx = pointerX - (item.bx + item.x);
        item.gy = pointerY - (item.by + item.y);
        el.setPointerCapture(e.pointerId);
        container.classList.add('is-grabbing');
        wakeLoop();
      };

      const onTilePointerMove = (e: PointerEvent) => {
        if (draggedTile === item) {
          dragDistRef.current += Math.hypot(e.movementX || 0, e.movementY || 0);
          updatePointerCoords(e);
        }
      };

      const onTilePointerUp = () => {
        if (draggedTile === item) {
          draggedTile = null;
          nudgedTile = null;
          container.classList.remove('is-grabbing');
          wakeLoop();
        }
      };

      el.addEventListener('pointerenter', onTilePointerEnter);
      el.addEventListener('pointerdown', onTilePointerDown);
      el.addEventListener('pointermove', onTilePointerMove);
      el.addEventListener('pointerup', onTilePointerUp);
      el.addEventListener('pointercancel', onTilePointerUp);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('pointerenter', onStagePointerEnter);
      stage.removeEventListener('pointermove', onStagePointerMove);
      stage.removeEventListener('pointerleave', onStagePointerLeave);
      if (touchTimer) clearTimeout(touchTimer);
      if (rafHandle) cancelAnimationFrame(rafHandle);
    };
  }, []);

  return (
    <div ref={containerRef} className="hive" id="hive">
      <div ref={stageRef} className="hive__stage">
        {/* Animated Fog Orbs */}
        <div className="hive__fog" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        {/* Sun Corona */}
        <div className="hive__sun" aria-hidden="true">
          <i className="hive__corona" />
        </div>

        {/* Ambient Big Watermark "8" */}
        <div className="hive__big" aria-hidden="true">
          8
        </div>

        {/* Honeycomb Comb */}
        <ul className="hive__comb" aria-label="Princípios de Confiança e Governança">
          {items.map((item, idx) => {
            const coord = AXIAL_COORDINATES[idx] || { q: 0, r: 0, d: 1.0 };
            const isActive = selectedHexId === item.id;
            return (
              <li
                key={item.id}
                className={`hex ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    '--q': coord.q,
                    '--r': coord.r,
                  } as React.CSSProperties
                }
                data-d={coord.d}
                role="button"
                tabIndex={0}
                onClick={() => {
                  // Only select if not dragging significantly
                  if (dragDistRef.current < 6) {
                    onSelectHex(item.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectHex(item.id);
                  }
                }}
              >
                <div className="hex__in">
                  <span
                    style={{
                      fontSize: 'max(10.5px, calc(var(--hw) * 0.082))',
                      color: isActive ? 'var(--amber-hi)' : 'var(--amber)',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <strong
                    style={{
                      fontSize: 'max(12px, calc(var(--hw) * 0.098))',
                      color: 'var(--bone)',
                      fontWeight: 600,
                      lineHeight: 1.15,
                    }}
                  >
                    {item.shortTitle}
                  </strong>
                  <span
                    style={{
                      fontSize: 'max(9.5px, calc(var(--hw) * 0.072))',
                      color: 'var(--slate)',
                      lineHeight: 1.2,
                      opacity: 0.88,
                      maxWidth: '85%',
                    }}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </li>
            );
          })}

          {/* Blank and Far Decorative Filler Tiles */}
          {FILLER_TILES.map((blank, i) => (
            <li
              key={`blank-${i}`}
              className={`hex hex--blank ${blank.isFar ? 'hex--far' : ''}`}
              style={
                {
                  '--q': blank.q,
                  '--r': blank.r,
                } as React.CSSProperties
              }
              data-d={blank.d}
              aria-hidden="true"
            />
          ))}
        </ul>
      </div>

      {/* Interactive Hint */}
      <p className="hive__hint">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-3.9-1.9L4.6 15a1.6 1.6 0 0 1 2.3-2.2L9 14.5" />
        </svg>
        <span className="hint-hover">
          Aponte para deslocar um bloco ou arraste-o para fora da colmeia · Clique para ver detalhes
        </span>
        <span className="hint-touch">Toque em qualquer bloco para ver detalhes</span>
      </p>
    </div>
  );
};
