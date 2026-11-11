import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/umbra-landing.css';
import {
  COST_SPECIALTIES,
  DEEP_DIVE_DRAWERS,
  GOVERNANCE_FOLDERS,
  OPENING_SPEECH,
  PITCH_GUIDE_STEPS,
  PLATFORM_SCREENS,
  PROJECT_CREDITS,
  PlatformScreenSpec,
  TECH_ARCHITECTURE_NODES,
  TRUST_HEX_ITEMS,
} from '../data/qiMatchLandingData';
import { LandingHeroAndCore } from '../components/landing/LandingHeroAndCore';
import { ThreeBookStage } from '../components/landing/ThreeBookStage';
import { InteractiveHoneycomb } from '../components/landing/InteractiveHoneycomb';

interface LandingPageViewProps {
  onOpenPrototype: () => void;
}

const SECTION_IDS = [
  'sec-abertura',
  'sec-problema',
  'sec-solucao',
  'sec-mercado',
  'sec-demonstracao',
  'sec-tecnologia',
  'sec-viabilidade',
];

const formatCurrencyBrl = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenPrototype }) => {
  const [activeSection, setActiveSection] = useState<string>('sec-abertura');
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [zoomScreenIdx, setZoomScreenIdx] = useState<number | null>(null);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);

  // Section 06 state: Honeycomb + Folder Deck + Expandable Evaluator Hub
  const [selectedHexId, setSelectedHexId] = useState<string>(TRUST_HEX_ITEMS[0].id);
  const [activeFolderId, setActiveFolderId] = useState<string>(GOVERNANCE_FOLDERS[0].id);
  const [showTechEvaluator, setShowTechEvaluator] = useState<boolean>(false);
  const [activeTechNodeIdx, setActiveTechNodeIdx] = useState<number>(0);

  // Section 07 state: Effort & Cost Simulator (base = 1000h => R$ 103.600 direct, +15% => R$ 119.140)
  const [simHours, setSimHours] = useState<number>(1000);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
  }, []);

  // Track active section while scrolling
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keyboard navigation: ESC closes modals; Left/Right steps zoom screens or pitch sections
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        if (zoomScreenIdx !== null) setZoomScreenIdx(null);
        else if (activeDrawerId) setActiveDrawerId(null);
        else if (showPitchModal) setShowPitchModal(false);
        return;
      }

      if (zoomScreenIdx !== null) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setZoomScreenIdx((prev) => (prev === null ? 0 : (prev + 1) % PLATFORM_SCREENS.length));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setZoomScreenIdx((prev) =>
            prev === null ? 0 : (prev - 1 + PLATFORM_SCREENS.length) % PLATFORM_SCREENS.length
          );
        }
        return;
      }

      if (activeDrawerId || showPitchModal) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const idx = SECTION_IDS.indexOf(activeSection);
        const nextIdx =
          e.key === 'ArrowRight'
            ? Math.min(SECTION_IDS.length - 1, (idx >= 0 ? idx : 0) + 1)
            : Math.max(0, (idx >= 0 ? idx : 0) - 1);
        if (nextIdx !== idx) {
          e.preventDefault();
          scrollToSection(SECTION_IDS[nextIdx]);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSection, activeDrawerId, showPitchModal, zoomScreenIdx, scrollToSection]);

  const selectedHex = TRUST_HEX_ITEMS.find((h) => h.id === selectedHexId) || TRUST_HEX_ITEMS[0];
  const activeFolder = GOVERNANCE_FOLDERS.find((f) => f.id === activeFolderId) || GOVERNANCE_FOLDERS[0];
  const activeTechNode = TECH_ARCHITECTURE_NODES[activeTechNodeIdx] || TECH_ARCHITECTURE_NODES[0];
  const activeDrawer = activeDrawerId ? DEEP_DIVE_DRAWERS[activeDrawerId] : null;
  const zoomedScreen: PlatformScreenSpec | null =
    zoomScreenIdx !== null ? PLATFORM_SCREENS[zoomScreenIdx] : null;

  // Budget calculation proportional to 1,000h baseline (R$ 103.600,00 direct; +15% = R$ 119.140,00)
  const scaleFactor = simHours / 1000;
  const directCostBrl = Math.round(103600 * scaleFactor);
  const reserveCostBrl = Math.round(directCostBrl * 0.15);
  const totalCostBrl = directCostBrl + reserveCostBrl;
  const litBarsCount = Math.max(8, Math.min(50, Math.round((simHours / 1400) * 50)));

  return (
    <div className="qi-umbra">
      {/* MASTHEAD + SEÇÕES 01 A 04 */}
      <LandingHeroAndCore
        activeSection={activeSection}
        onScrollToSection={scrollToSection}
        onOpenDrawer={(id) => setActiveDrawerId(id)}
        onOpenPitchModal={() => setShowPitchModal(true)}
        onOpenPrototype={onOpenPrototype}
      />

      {/* =================================================================== */}
      {/* A EXPERIÊNCIA NA PLATAFORMA — O QUE O VISITANTE ENCONTRARÁ?         */}
      {/* =================================================================== */}
      <section id="sec-demonstracao" className="qi-band">
        <div className="qi-shell qi-shell--wide">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>A Experiência na Plataforma</span>
            </div>
            <h2 className="qi-d2">
              Da identificação de talentos ao interesse mútuo:{' '}
              <span style={{ color: 'var(--amber-hi)' }}>conheça a experiência Q.I. Match.</span>
            </h2>
            <p className="qi-lede">
              Explore as telas previstas para a plataforma e descubra como empresas poderão apresentar suas
              oportunidades, avaliar profissionais e estabelecer conexões com mais informações e transparência.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 4 }}>
              <button type="button" className="qi-btn qi-btn--brass" onClick={onOpenPrototype}>
                <span className="qi-roll">
                  <span>Testar protótipo interativo →</span>
                  <span aria-hidden="true">Experimentar fluxos ao vivo →</span>
                </span>
              </button>
            </div>
          </div>

          {/* Palco do Livro 3D com as 9 Telas Abertas Diretamente no Próprio Palco */}
          <ThreeBookStage
            onExploreScreens={() => {}}
            onSelectScreen={(idx) => setZoomScreenIdx(idx)}
          />
        </div>
      </section>

      {/* =================================================================== */}
      {/* TECNOLOGIA, PROTEÇÃO DE DADOS E FUNCIONAMENTO                       */}
      {/* =================================================================== */}
      <section id="sec-tecnologia" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Tecnologia, Ética e Governança</span>
            </div>
            <h2 className="qi-d2">
              Tecnologia para apoiar decisões.{' '}
              <span style={{ color: 'var(--slate)' }}>Transparência para gerar confiança.</span>
            </h2>
            <p className="qi-lede">
              A plataforma foi concebida para organizar informações, apoiar análises e facilitar o processo de
              recrutamento. A proposta contempla critérios explicáveis, proteção de dados pessoais e mecanismos de
              autorização para aproximar empresas e profissionais.
            </p>
          </div>

          {/* Colmeia Interativa de Princípios de Confiança (Autêntica Umbra) */}
          <InteractiveHoneycomb
            items={TRUST_HEX_ITEMS}
            selectedHexId={selectedHexId}
            onSelectHex={(id) => setSelectedHexId(id)}
          />

          <div className="qi-hive-detail">
            <strong style={{ color: 'var(--amber-hi)', fontSize: 15.5 }}>
              {selectedHex.shortTitle} — {selectedHex.subtitle}
            </strong>
            <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'var(--bone)', lineHeight: 1.6 }}>
              {selectedHex.detail}
            </p>
          </div>

          {/* Pastas Empilhadas: Governança, Escopo Realista, Metas e Riscos */}
          <div style={{ marginTop: 34 }}>
            <div className="qi-folder-tabs" role="tablist" aria-label=" Diretrizes de governança e escopo">
              {GOVERNANCE_FOLDERS.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  role="tab"
                  aria-selected={activeFolder.id === folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`qi-folder-tab ${activeFolder.id === folder.id ? 'is-on' : ''}`}
                >
                  {folder.tabLabel}
                </button>
              ))}
            </div>

            <div className="qi-surface qi-folder-body">
              <h3 className="qi-d3">{activeFolder.question}</h3>
              <p style={{ margin: '10px 0 18px', fontSize: 15, color: 'var(--slate)', lineHeight: 1.6 }}>
                {activeFolder.answer}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {activeFolder.highlights.map((hl, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid var(--hair)',
                      fontSize: 13.8,
                      color: '#e6e6ec',
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: 'var(--amber-hi)', fontWeight: 700, marginRight: 6 }}>•</span>
                    {hl}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Área Expansível Opcional para Avaliadores Técnicos / Acadêmicos */}
          <div style={{ marginTop: 26 }}>
            <div className="qi-surface" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                    Camada complementar para banca e avaliadores
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: 18, color: 'var(--bone)', fontWeight: 600 }}>
                    Arquitetura de software, isolamento de dados e serviços planejados no estudo
                  </h3>
                </div>
                <button
                  type="button"
                  className="qi-btn"
                  aria-expanded={showTechEvaluator}
                  onClick={() => setShowTechEvaluator((v) => !v)}
                >
                  {showTechEvaluator ? 'Recolher detalhes de arquitetura ▲' : 'Expandir arquitetura técnica ▼'}
                </button>
              </div>

              {showTechEvaluator && (
                <div className="qi-hub-layout">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TECH_ARCHITECTURE_NODES.map((node, idx) => {
                      const isOn = idx === activeTechNodeIdx;
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setActiveTechNodeIdx(idx)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 16px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            border: isOn ? '1px solid var(--amber-hi)' : '1px solid var(--hair)',
                            background: isOn ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                          }}
                        >
                          <div>
                            <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)' }}>
                              {node.title}
                            </strong>
                            <span style={{ fontSize: 12, color: 'var(--slate)' }}>{node.role}</span>
                          </div>
                          <span style={{ color: isOn ? 'var(--amber-hi)' : 'var(--slate)', fontWeight: 700 }}>→</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="qi-code-box">
                    <div
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--hair)',
                        background: '#0d0d12',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                      }}
                    >
                      <strong style={{ color: 'var(--amber-hi)' }}>{activeTechNode.codeTitle}</strong>
                      <span style={{ color: 'var(--slate)' }}>Especificação prevista no MVP</span>
                    </div>
                    <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', color: '#e6e6ee', lineHeight: 1.55 }}>
                      {activeTechNode.codeLines.join('\n')}
                    </pre>
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--hair)', background: '#050508' }}>
                      {activeTechNode.terminalLog.map((ln, i) => (
                        <div
                          key={i}
                          style={{
                            color: ln.startsWith('✓') ? '#6ee7b7' : 'var(--slate)',
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          {ln}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* INVESTIMENTO E VIABILIDADE DO PROJETO                               */}
      {/* =================================================================== */}
      <section id="sec-viabilidade" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Planejamento & Viabilidade</span>
            </div>
            <h2 className="qi-d2">
              Quanto é necessário para transformar a proposta{' '}
              <span style={{ color: 'var(--slate)' }}>em uma plataforma funcional?</span>
            </h2>
            <p className="qi-lede">
              O desenvolvimento foi dividido em atividades técnicas, com estimativas de horas, custos profissionais e
              uma reserva para imprevistos. O simulador permite visualizar como mudanças no esforço de desenvolvimento
              afetam o orçamento previsto.
            </p>
          </div>

          <div className="qi-surface" style={{ padding: 'clamp(22px, 3vw, 34px)' }}>
            {/* Controles do Simulador */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18, marginBottom: 22 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                  Simulador de esforço de desenvolvimento (horizonte: 5 meses)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  {[
                    { label: '800h (Enxuto)', value: 800 },
                    { label: '1.000h (Cenário-base)', value: 1000 },
                    { label: '1.200h (Expandido)', value: 1200 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSimHours(preset.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: simHours === preset.value ? '1px solid var(--amber-hi)' : '1px solid var(--hair-strong)',
                        background: simHours === preset.value ? 'rgba(201,162,39,0.18)' : 'rgba(255,255,255,0.03)',
                        color: simHours === preset.value ? 'var(--bone)' : 'var(--slate)',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                    <button
                      type="button"
                      className="qi-btn"
                      style={{ minHeight: 34, padding: '0 12px' }}
                      onClick={() => setSimHours((h) => Math.max(600, h - 50))}
                      aria-label="Reduzir 50 horas"
                    >
                      −50h
                    </button>
                    <strong style={{ minWidth: 66, textAlign: 'center', color: 'var(--bone)', fontSize: 14 }}>
                      {simHours}h
                    </strong>
                    <button
                      type="button"
                      className="qi-btn"
                      style={{ minHeight: 34, padding: '0 12px' }}
                      onClick={() => setSimHours((h) => Math.min(1500, h + 50))}
                      aria-label="Adicionar 50 horas"
                    >
                      +50h
                    </button>
                  </div>
                </div>
              </div>

              <span className="qi-status-pill qi-status-pill--mvp-demo">
                Parâmetros de Engenharia (1.000h)
              </span>
            </div>

            {/* Três Indicadores Principais do Orçamento */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--hair)' }}>
                <span style={{ fontSize: 12, color: 'var(--slate)', display: 'block' }}>
                  Custo direto estimado ({simHours}h)
                </span>
                <strong style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--bone)', display: 'block', marginTop: 4 }}>
                  {formatCurrencyBrl(directCostBrl)}
                </strong>
                <span style={{ fontSize: 11.5, color: 'var(--slate)' }}>6 especialidades técnicas somadas</span>
              </div>

              <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--hair)' }}>
                <span style={{ fontSize: 12, color: 'var(--slate)', display: 'block' }}>
                  Reserva para imprevistos (15%)
                </span>
                <strong style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--bone)', display: 'block', marginTop: 4 }}>
                  {formatCurrencyBrl(reserveCostBrl)}
                </strong>
                <span style={{ fontSize: 11.5, color: 'var(--slate)' }}>Margem preventiva de escopo e testes</span>
              </div>

              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: 14,
                  background: 'rgba(201,162,39,0.11)',
                  border: '1px solid rgba(201,162,39,0.48)',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--amber-hi)', fontWeight: 600, display: 'block' }}>
                  Investimento total estimado do MVP
                </span>
                <strong style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--amber-hi)', display: 'block', marginTop: 4 }}>
                  {formatCurrencyBrl(totalCostBrl)}
                </strong>
                <span style={{ fontSize: 11.5, color: '#e6e2d6' }}>
                  Infraestrutura inicial em nuvem: ~US$ 30/mês
                </span>
              </div>
            </div>

            {/* 50 Barras Iluminadas */}
            <div className="qi-calc-bars" aria-hidden="true">
              {Array.from({ length: 50 }).map((_, idx) => {
                const waveH = 48 + Math.round(Math.sin(idx * 0.35) * 18 + (idx % 5) * 5);
                return (
                  <i
                    key={idx}
                    className={idx < litBarsCount ? 'is-lit' : ''}
                    style={{ '--bh': `${waveH}%` } as React.CSSProperties}
                  />
                );
              })}
            </div>

            {/* Divisão por Atividades Técnicas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 12, marginTop: 22 }}>
              {COST_SPECIALTIES.map((sp) => {
                const scaledH = Math.round(sp.hours * scaleFactor);
                const scaledVal = scaledH * sp.rateBrl;
                const isSelected = selectedSpecId === sp.id;
                return (
                  <div
                    key={sp.id}
                    onClick={() => setSelectedSpecId(isSelected ? null : sp.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--amber-hi)' : '1px solid var(--hair)',
                      background: isSelected ? 'rgba(201,162,39,0.08)' : 'rgba(0,0,0,0.35)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 13.5, color: 'var(--bone)' }}>{sp.area}</strong>
                      <strong style={{ fontSize: 13.5, color: 'var(--amber-hi)', whiteSpace: 'nowrap' }}>
                        {formatCurrencyBrl(scaledVal)}
                      </strong>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 4 }}>
                      {scaledH}h estimadas · Referência {formatCurrencyBrl(sp.rateBrl)}/h
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#d0d0d8', lineHeight: 1.45 }}>
                      {sp.deliverables}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--slate)' }}>
                Custo de desenvolvimento do MVP orçado em 1.000 horas produtivas (R$ 103.600,00 diretos e R$ 119.140,00 com reserva de contingência de 15%), calibrado por faixas medianas de mercado de tecnologia.
              </p>
              <button
                type="button"
                className="qi-btn"
                onClick={() => setActiveDrawerId('drawer-orcamento-detalhado')}
              >
                <span className="qi-roll">
                  <span>Ver divisão por módulos (F01–F08) →</span>
                  <span aria-hidden="true">Abrir memória do orçamento →</span>
                </span>
              </button>
            </div>
          </div>

          {/* Fechamento & Convite para Demonstração */}
          <div
            className="qi-surface"
            style={{
              marginTop: 28,
              padding: '32px 28px',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 0%, rgba(201,162,39,0.16), rgba(12,12,15,0.95) 68%)',
            }}
          >
            <h3 className="qi-d3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)' }}>
              Quer experimentar na prática os fluxos demonstrados?
            </h3>
            <p style={{ margin: '10px auto 20px', fontSize: 15, color: 'var(--slate)', maxWidth: 620 }}>
              Acesse o protótipo em demonstração com contas de Profissional, Empresa e Governança, ou consulte o roteiro das 7 etapas de apresentação.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <button type="button" className="qi-btn qi-btn--brass" onClick={onOpenPrototype}>
                <span className="qi-roll">
                  <span>Abrir protótipo em demonstração</span>
                  <span aria-hidden="true">Testar perfis agora →</span>
                </span>
              </button>
              <button type="button" className="qi-btn" onClick={() => setShowPitchModal(true)}>
                <span className="qi-roll">
                  <span>Roteiro de Apresentação</span>
                  <span aria-hidden="true">7 etapas + fala inicial</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ CORPORATIVO DA STARTUP */}
      <footer style={{ borderTop: '1px solid var(--hair-strong)', paddingBlock: '52px 64px', background: '#030306' }}>
        <div className="qi-shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 36, alignItems: 'flex-start' }}>
            {/* Coluna 1: Startup & Proposta de Valor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="qi-brand-emblem">Q</span>
                <span className="qi-wordmark">Q.I. Match</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>
                O talento certo. A oportunidade certa. Uma conexão mais inteligente. Plataforma especializada em recrutamento tech com critérios explicáveis e Double Opt-In.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                <button type="button" className="qi-btn" style={{ minHeight: 32, padding: '0 12px', fontSize: 12 }} onClick={() => setShowPitchModal(true)}>
                  Roteiro de Apresentação
                </button>
                <button type="button" className="qi-btn qi-btn--brass" style={{ minHeight: 32, padding: '0 12px', fontSize: 12 }} onClick={onOpenPrototype}>
                  Testar Protótipo
                </button>
              </div>
            </div>

            {/* Coluna 2: 4 Co-fundadores */}
            <div>
              <span style={{ display: 'block', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-hi)', fontWeight: 700, marginBottom: 14 }}>
                Fundadores & Liderança
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PROJECT_CREDITS.founders.map((founder, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 13.5 }}>
                    <strong style={{ color: 'var(--bone)' }}>{founder.name}</strong>
                    <span style={{ color: 'var(--amber-hi)', fontSize: 12 }}>{founder.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Governança, Ética & Segurança */}
            <div>
              <span style={{ display: 'block', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--amber-hi)', fontWeight: 700, marginBottom: 14 }}>
                Governança & Conformidade
              </span>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)', lineHeight: 1.55 }}>
                Conformidade com a Lei Geral de Proteção de Dados (LGPD). Dados pessoais acessíveis apenas após autorização expressa em janela de 72h.
              </p>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--slate)' }}>
                São Paulo / SP · Brasil · CNAE 6203-1/00
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--slate)' }}>
            <span>© 2026 Q.I. Match Tecnologia & Recrutamento. Todos os direitos reservados.</span>
            <span>Versão 1.0.0 · Demonstração</span>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* MODAL DE ZOOM EM TELA CHEIA DAS 9 TELAS PREVISTAS                   */}
      {/* =================================================================== */}
      {zoomedScreen && zoomScreenIdx !== null && (
        <div
          className="qi-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomedScreen.number} — ${zoomedScreen.title}`}
          onClick={() => setZoomScreenIdx(null)}
        >
          <div className="qi-zoom-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--amber-hi)' }}>
                  {zoomedScreen.number} DE 09
                </span>
                <span className={`qi-status-pill qi-status-pill--${zoomedScreen.statusTone}`}>
                  {zoomedScreen.statusBadge}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="qi-btn"
                  style={{ minHeight: 36, padding: '0 14px' }}
                  onClick={() =>
                    setZoomScreenIdx((zoomScreenIdx - 1 + PLATFORM_SCREENS.length) % PLATFORM_SCREENS.length)
                  }
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className="qi-btn"
                  style={{ minHeight: 36, padding: '0 14px' }}
                  onClick={() => setZoomScreenIdx((zoomScreenIdx + 1) % PLATFORM_SCREENS.length)}
                >
                  Próxima →
                </button>
                <button
                  type="button"
                  className="qi-btn qi-btn--brass"
                  style={{ minHeight: 36, padding: '0 14px' }}
                  onClick={() => setZoomScreenIdx(null)}
                >
                  Fechar ✕
                </button>
              </div>
            </div>

            <h3 className="qi-d2" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.25rem)', marginBottom: 8 }}>
              {zoomedScreen.title}
            </h3>
            <p style={{ margin: '0 0 22px', fontSize: 16, color: '#e2e2ea' }}>{zoomedScreen.purpose}</p>

            {/* Tela Ampliada para Leitura Nítida em Projetor */}
            <div
              style={{
                padding: '22px 24px',
                borderRadius: 16,
                border: '1px solid rgba(201,162,39,0.42)',
                background: 'linear-gradient(180deg, #15161e 0%, #09090d 100%)',
                marginBottom: 22,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--hair)', marginBottom: 16 }}>
                <strong style={{ fontSize: 15, color: 'var(--bone)' }}>Q.I. Match · {zoomedScreen.actor}</strong>
                <span style={{ fontSize: 14, color: 'var(--amber-hi)', fontWeight: 600 }}>
                  {zoomedScreen.headerRight}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                {zoomedScreen.metrics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: m.accent ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.03)',
                      border: m.accent ? '1px solid rgba(201,162,39,0.5)' : '1px solid var(--hair)',
                    }}
                  >
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--slate)' }}>{m.label}</span>
                    <strong style={{ display: 'block', marginTop: 4, fontSize: 18, color: m.accent ? 'var(--amber-hi)' : 'var(--bone)' }}>
                      {m.value}
                    </strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {zoomedScreen.rows.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: r.highlight ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.03)',
                      border: r.highlight ? '1px solid rgba(201,162,39,0.34)' : '1px solid var(--hair)',
                      fontSize: 15,
                    }}
                  >
                    <span style={{ color: 'var(--bone)' }}>{r.left}</span>
                    <strong style={{ color: r.highlight ? 'var(--amber-hi)' : '#d4d4dc', whiteSpace: 'nowrap' }}>
                      {r.right}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicação para quem acessa sem apresentador */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--hair)' }}>
                <strong style={{ display: 'block', fontSize: 13, color: 'var(--amber-hi)', marginBottom: 6 }}>
                  O que esta tela apresenta
                </strong>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.55 }}>
                  {zoomedScreen.deepDive.whatVisitorSees}
                </p>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--hair)' }}>
                <strong style={{ display: 'block', fontSize: 13, color: 'var(--amber-hi)', marginBottom: 6 }}>
                  Papel dentro da jornada
                </strong>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.55 }}>
                  {zoomedScreen.deepDive.howItWorksInProject}
                </p>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--hair)' }}>
                <strong style={{ display: 'block', fontSize: 13, color: 'var(--amber-hi)', marginBottom: 6 }}>
                  Transparência e proteção de dados
                </strong>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--slate)', lineHeight: 1.55 }}>
                  {zoomedScreen.deepDive.privacyAndRules}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* GAVETA LATERAL DE APROFUNDAMENTO (NÍVEL 3 DE LEITURA)               */}
      {/* =================================================================== */}
      {activeDrawer && (
        <div
          className="qi-drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeDrawer.title}
          onClick={() => setActiveDrawerId(null)}
        >
          <div className="qi-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span className="qi-mark">{activeDrawer.badge}</span>
              <button
                type="button"
                className="qi-btn"
                style={{ minHeight: 36, padding: '0 14px' }}
                onClick={() => setActiveDrawerId(null)}
              >
                Fechar ✕
              </button>
            </div>

            <h3 className="qi-d3" style={{ fontSize: '1.5rem' }}>{activeDrawer.title}</h3>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--amber-hi)', fontWeight: 500 }}>
              {activeDrawer.subtitle}
            </p>

            {activeDrawer.paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: 0, fontSize: 14.5, color: '#dcdce4', lineHeight: 1.65 }}>
                {p}
              </p>
            ))}

            {activeDrawer.bullets && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeDrawer.bullets.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--hair)',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 13, color: 'var(--amber-hi)', marginBottom: 3 }}>
                      {b.label}
                    </strong>
                    <span style={{ fontSize: 13.5, color: 'var(--bone)', lineHeight: 1.5 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            )}

            {activeDrawer.disclaimer && (
              <p
                style={{
                  margin: 'auto 0 0',
                  paddingTop: 14,
                  borderTop: '1px solid var(--hair)',
                  fontSize: 12.5,
                  color: 'var(--slate)',
                }}
              >
                {activeDrawer.disclaimer}
              </p>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL DO ROTEIRO DE PITCH DA FEIRA & FALA SUGERIDA                  */}
      {/* =================================================================== */}
      {showPitchModal && (
        <div
          className="qi-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Roteiro de apresentação para a feira"
          onClick={() => setShowPitchModal(false)}
        >
          <div className="qi-zoom-modal" style={{ maxWidth: 920 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <span className="qi-mark">Guia de Apresentação · Roteiro em 7 Perguntas</span>
              <button
                type="button"
                className="qi-btn qi-btn--brass"
                style={{ minHeight: 36, padding: '0 14px' }}
                onClick={() => setShowPitchModal(false)}
              >
                Fechar ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
              {/* Coluna 1: Exemplo de Fala de Abertura */}
              <div
                style={{
                  padding: 22,
                  borderRadius: 14,
                  background: 'rgba(201,162,39,0.08)',
                  border: '1px solid rgba(201,162,39,0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber-hi)' }}>
                  Sugestão de fala para iniciar a apresentação
                </strong>
                {OPENING_SPEECH.map((para, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 14.5, color: 'var(--bone)', lineHeight: 1.6 }}>
                    “{para}”
                  </p>
                ))}
              </div>

              {/* Coluna 2: As 7 Etapas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber-hi)', marginBottom: 4 }}>
                  Pergunta central de cada seção (clique para ir até ela)
                </strong>
                {PITCH_GUIDE_STEPS.map((st) => (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => {
                      setShowPitchModal(false);
                      scrollToSection(st.sectionId);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--hair)',
                      background: 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--bone)' }}>{st.question}</strong>
                    <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>{st.goal}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
