import React, { useState } from 'react';
import '../styles/umbra-landing.css';
import {
  AI_PIPELINE_STAGES,
  BANCA_TECHNICAL_FAQS,
  C4_ARCHITECTURE_LAYERS,
  CLOUD_COST_BREAKDOWN_MVP,
  INFERENCE_SCALE_TIERS,
} from '../data/qiMatchTechBancaData';

interface TechnicalBancaViewProps {
  onBackToMarketLanding: () => void;
  onOpenPrototype: () => void;
}

export const TechnicalBancaView: React.FC<TechnicalBancaViewProps> = ({
  onBackToMarketLanding,
  onOpenPrototype,
}) => {
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(2); // Default: Camada 03 Workers IA
  const [activeStageIdx, setActiveStageIdx] = useState<number>(1); // Default: Faster-Whisper
  const [activeScaleIdx, setActiveScaleIdx] = useState<number>(0); // Default: 250 entrevistas (R$ 1,64)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [showRawDiagramModal, setShowRawDiagramModal] = useState<boolean>(false);

  const activeLayer = C4_ARCHITECTURE_LAYERS[activeLayerIdx] || C4_ARCHITECTURE_LAYERS[0];
  const activeStage = AI_PIPELINE_STAGES[activeStageIdx] || AI_PIPELINE_STAGES[0];
  const activeScale = INFERENCE_SCALE_TIERS[activeScaleIdx] || INFERENCE_SCALE_TIERS[0];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="qi-umbra" style={{ minHeight: '100vh' }}>
      {/* TOP MASTHEAD TÉCNICO */}
      <header className="qi-masthead is-scrolled">
        <div className="qi-shell qi-shell--wide">
          <div className="qi-mast-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                className="qi-brand-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="qi-brand-emblem">Q</span>
                <span className="qi-wordmark">Q.I. Match</span>
              </button>
            </div>

            <nav className="qi-nav-links" aria-label="Seções técnicas">
              {[
                { id: 'tech-arquitetura', label: 'Arquitetura & C4' },
                { id: 'tech-pipeline', label: 'Pipeline IA & Voz' },
                { id: 'tech-matching', label: 'Motor 50/30/20' },
                { id: 'tech-escala', label: 'Escala' },
                { id: 'tech-lgpd', label: 'LGPD & Double Opt-In' },
                { id: 'tech-faq', label: 'Respostas Técnicas' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className="qi-nav-link"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onBackToMarketLanding}
                className="qi-btn"
                style={{
                  border: '1px solid var(--amber-hi)',
                  color: 'var(--amber-hi)',
                  background: 'rgba(201, 162, 39, 0.1)',
                }}
              >
                ← Apresentação de Mercado
              </button>
              <button type="button" className="qi-btn qi-btn--brass" onClick={onOpenPrototype}>
                <span className="qi-roll">
                  <span>Testar Protótipo</span>
                  <span aria-hidden="true">Abrir MVP</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO DA BANCA TÉCNICA */}
      <section className="qi-band" style={{ paddingTop: 120, paddingBottom: 48, borderBottom: '1px solid var(--hair)' }}>
        <div className="qi-shell">
          <div className="qi-sect-head" style={{ marginBottom: 32 }}>
            <div className="qi-mark">
              <span>ENGENHARIA DE SOFTWARE · IA EXPLICÁVEL · PRIVACY BY DESIGN</span>
            </div>
            <h1 className="qi-d2" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>
              Fundamentação Técnica & Arquitetura{' '}
              <span style={{ color: 'var(--amber-hi)' }}>Q.I. Match</span>
            </h1>
            <p className="qi-lede">
              Arquitetura em 4 camadas, pipeline de transcrição sem viés biométrico, verificação determinística
              anti-alucinação e memória de cálculo de infraestrutura em nuvem.
            </p>
          </div>

          {/* 4 KPIs Técnicos do Vídeo */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 16,
            }}
          >
            <div className="qi-surface" style={{ padding: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate)' }}>
                Custo Unitário de Inferência
              </span>
              <strong style={{ display: 'block', fontSize: '1.8rem', color: 'var(--amber-hi)', margin: '6px 0 4px' }}>
                R$ 1,64 → R$ 0,63
              </strong>
              <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>
                Queda de 61,5% ao escalar de 250 para 2.000 entrevistas/mês com batching e INT8.
              </span>
            </div>

            <div className="qi-surface" style={{ padding: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate)' }}>
                Infraestrutura Cloud MVP
              </span>
              <strong style={{ display: 'block', fontSize: '1.8rem', color: '#6ee7b7', margin: '6px 0 4px' }}>
                R$ 409 /mês
              </strong>
              <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>
                Topologia enxuta com FastAPI containerizado, PostgreSQL + pgvector e fila pg-boss.
              </span>
            </div>

            <div className="qi-surface" style={{ padding: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate)' }}>
                Viés Acústico / Biométrico
              </span>
              <strong style={{ display: 'block', fontSize: '1.8rem', color: 'var(--bone)', margin: '6px 0 4px' }}>
                0% Peso
              </strong>
              <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>
                Áudio descartado pós-Faster-Whisper. Sotaque, timbre e imagem nunca entram no modelo.
              </span>
            </div>

            <div className="qi-surface" style={{ padding: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate)' }}>
                Orçamento de Engenharia (1.000h)
              </span>
              <strong style={{ display: 'block', fontSize: '1.8rem', color: 'var(--amber-hi)', margin: '6px 0 4px' }}>
                R$ 119.140,00
              </strong>
              <span style={{ fontSize: 12.5, color: 'var(--slate)' }}>
                R$ 103.600 diretos + 15% de contingência (R$ 15.540) em ciclo de 5 meses.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 1. ARQUITETURA DE SOFTWARE & DIAGRAMA DE FLUXO FIM A FIM            */}
      {/* =================================================================== */}
      <section id="tech-arquitetura" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Arquitetura de Sistema & Fluxo Operacional</span>
            </div>
            <h2 className="qi-d2">
              Fluxo Fim a Fim e Isolamento em{' '}
              <span style={{ color: 'var(--amber-hi)' }}>4 Camadas (Modelo C4)</span>
            </h2>
            <p className="qi-lede">
              A jornada técnica separa o processamento assíncrono pesado (voz e IA) da camada transacional rápida,
              garantindo baixa latência e proteção absoluta de identidade até o Double Opt-In.
            </p>
          </div>

          {/* Diagrama Visual Estruturado do Fluxo do Sistema */}
          <div className="qi-surface" style={{ padding: 26, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber-hi)', fontWeight: 700 }}>
                  Diagrama de Fluxo Arquitetural (Candidato ⇄ IA ⇄ Empresa)
                </span>
                <h3 className="qi-d3" style={{ marginTop: 4 }}>
                  Orquestração de Dados, Contestação LGPD e Desbloqueio Mútuo
                </h3>
              </div>
              <button
                type="button"
                className="qi-btn"
                onClick={() => setShowRawDiagramModal(true)}
                style={{ fontSize: 12 }}
              >
                🔍 Ver Diagrama Draw.io Original
              </button>
            </div>

            {/* Fluxo de Engenharia em Duas Trilhas Conectadas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Trilha A: Profissional */}
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--hair)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: 10 }}>
                  Trilha A · Ingestão do Candidato (Assíncrona)
                </div>
                <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#e4e4e9' }}>
                  <li>
                    <strong>Cadastro & Perfil Técnico:</strong> Definição de Hard/Soft skills, senioridade, pretensão salarial e CNPJ bloqueado (Modo Discreto).
                  </li>
                  <li>
                    <strong>Entrevista Assíncrona (Áudio/Texto):</strong> Gravação convertida via <code>Faster-Whisper</code>; áudio original descartado após transcrição.
                  </li>
                  <li>
                    <strong>Relatório IA + Contestação (Art. 20 LGPD):</strong> Candidato revisa sua síntese antes de ir ao banco; se discordar, contesta e recalcula na hora.
                  </li>
                  <li>
                    <strong>Persistência Segregada:</strong> Vetor semântico salvo em <code>public.candidate_vectors</code> e PII isolado em <code>vault.pii_identities</code>.
                  </li>
                </ol>
              </div>

              {/* Trilha B: Empresa & Motor de Match */}
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(226,185,59,0.3)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Trilha B · Match Express & Double Opt-In (Transacional)
                </div>
                <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#e4e4e9' }}>
                  <li>
                    <strong>Publicação de Vaga com Salário Aberto:</strong> Empresa define stack, avaliação comportamental, faixa salarial e flag de urgência.
                  </li>
                  <li>
                    <strong>Cálculo do Match Score (%):</strong> Busca HNSW no <code>pgvector</code> ponderando 50% Técnico + 30% Comportamental + 20% Financeiro.
                  </li>
                  <li>
                    <strong>Disparo Match Express & Double Opt-In:</strong> Convite enviado aos mais aderentes. Se recusar, encerra sem expor dados; se aceitar, gera token de desbloqueio.
                  </li>
                  <li>
                    <strong>Shortlist Desbloqueada (Até 5 Candidatos):</strong> Empresa recebe relatório auditável com citações e agenda entrevista final com o gestor.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Seletor das 4 Camadas C4 + Inspetor de Código */}
          <div className="qi-market-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {C4_ARCHITECTURE_LAYERS.map((layer, idx) => {
                const isSelected = idx === activeLayerIdx;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayerIdx(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '16px 20px',
                      borderRadius: 14,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--amber-hi)' : '1px solid var(--hair)',
                      background: isSelected ? 'rgba(201, 162, 39, 0.1)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {layer.layer}
                      </span>
                      <span style={{ fontSize: 12, color: isSelected ? 'var(--amber-hi)' : 'var(--slate)' }}>
                        {isSelected ? '● Ativo' : 'Inspecionar →'}
                      </span>
                    </div>
                    <strong style={{ display: 'block', fontSize: 16, color: 'var(--bone)', marginBottom: 4 }}>
                      {layer.title}
                    </strong>
                    <span style={{ fontSize: 12, color: 'var(--slate)', display: 'block' }}>{layer.tech}</span>
                  </button>
                );
              })}
            </div>

            {/* Painel de Especificação e Código da Camada Selecionada */}
            <div className="qi-surface" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase' }}>
                  {activeLayer.layer}
                </span>
                <h3 className="qi-d3" style={{ margin: '6px 0 8px' }}>{activeLayer.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--slate)', lineHeight: 1.6, marginBottom: 14 }}>
                  {activeLayer.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {activeLayer.metrics.map((m, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11.5,
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'rgba(110, 231, 183, 0.1)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(110, 231, 183, 0.25)',
                        fontWeight: 600,
                      }}
                    >
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--hair)', background: '#07070b' }}>
                <div style={{ padding: '8px 14px', background: '#101018', borderBottom: '1px solid var(--hair)', fontSize: 11.5, color: 'var(--amber-hi)', fontWeight: 600 }}>
                  Implementação de Referência · {activeLayer.tech.split('·')[0]}
                </div>
                <pre style={{ margin: 0, padding: 16, fontSize: 12, color: '#e4e4ef', overflowX: 'auto', lineHeight: 1.55 }}>
                  <code>{activeLayer.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. PIPELINE DE IA EXPLICÁVEL & DESCARTE BIOMÉTRICO                  */}
      {/* =================================================================== */}
      <section id="tech-pipeline" className="qi-band" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Processamento de Linguagem Natural & Ética</span>
            </div>
            <h2 className="qi-d2">
              Pipeline de Áudio e IA Explicável{' '}
              <span style={{ color: 'var(--slate)' }}>sem Viés Acústico</span>
            </h2>
            <p className="qi-lede">
              Como garantimos tecnicamente a promessa feita no vídeo: a IA analisa exclusivamente o conteúdo
              transcrito e as evidências técnicas, nunca sotaque, timbre de voz ou imagem.
            </p>
          </div>

          {/* Barra de 5 Estágios do Pipeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10, marginBottom: 22 }}>
            {AI_PIPELINE_STAGES.map((st, idx) => {
              const isOn = idx === activeStageIdx;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  style={{
                    textAlign: 'left',
                    padding: 16,
                    borderRadius: 12,
                    cursor: 'pointer',
                    border: isOn ? '1.5px solid var(--amber-hi)' : '1px solid var(--hair)',
                    background: isOn ? 'rgba(201,162,39,0.12)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', marginBottom: 4 }}>
                    ESTÁGIO {st.step} · {st.latency}
                  </div>
                  <strong style={{ fontSize: 13.5, color: 'var(--bone)', display: 'block', marginBottom: 4 }}>
                    {st.name}
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--slate)' }}>{st.engine}</span>
                </button>
              );
            })}
          </div>

          {/* Detalhe do Estágio Selecionado */}
          <div className="qi-surface" style={{ padding: 26 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase' }}>
                  Estágio {activeStage.step} · {activeStage.engine}
                </span>
                <h3 className="qi-d3" style={{ margin: '6px 0 10px' }}>{activeStage.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6, margin: 0 }}>
                  {activeStage.details}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.45)', border: '1px solid var(--hair)' }}>
                  <span style={{ fontSize: 11, color: 'var(--slate)', display: 'block' }}>Entrada (Input):</span>
                  <strong style={{ fontSize: 13, color: 'var(--bone)' }}>{activeStage.input}</strong>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.45)', border: '1px solid var(--hair)' }}>
                  <span style={{ fontSize: 11, color: 'var(--slate)', display: 'block' }}>Saída (Output):</span>
                  <strong style={{ fontSize: 13, color: 'var(--amber-hi)' }}>{activeStage.output}</strong>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(110, 231, 183, 0.08)', border: '1px solid rgba(110, 231, 183, 0.25)' }}>
                  <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block' }}>
                    Trava de Privacidade & Ética:
                  </span>
                  <span style={{ fontSize: 12.5, color: '#e4e4e9' }}>{activeStage.privacyRule}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. MOTOR DE MATCHING 50/30/20 & VERIFICADOR DE EVIDÊNCIAS           */}
      {/* =================================================================== */}
      <section id="tech-matching" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Algoritmo de Recomendação & Determinismo</span>
            </div>
            <h2 className="qi-d2">
              Função de Score Ponderado{' '}
              <span style={{ color: 'var(--amber-hi)' }}>(50% / 30% / 20%)</span>
            </h2>
            <p className="qi-lede">
              Superando o filtro cego por palavra-chave de ATS tradicionais (Gupy/Kenoby) através de similaridade
              semântica vetorial combinada com enquadramento financeiro explícito.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div className="qi-surface" style={{ padding: 24 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber-hi)' }}>PESO 50% · HARD SKILLS</span>
              <h3 className="qi-d3" style={{ margin: '6px 0 8px' }}>Similaridade Semântica Técnica</h3>
              <p style={{ fontSize: 13.5, color: 'var(--slate)', lineHeight: 1.55 }}>
                Vetorização de 768 dimensões via <code>Multilingual-E5</code>. Reconhece equivalência conceitual (ex.:
                experiência sólida em <em>FastAPI + AsyncIO</em> pontua positivamente para requisitos de microsserviços
                Python de alta concorrência, mesmo sem repetição literal de buzzwords).
              </p>
            </div>

            <div className="qi-surface" style={{ padding: 24 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber-hi)' }}>PESO 30% · SOFT SKILLS</span>
              <h3 className="qi-d3" style={{ margin: '6px 0 8px' }}>Evidências Comportamentais</h3>
              <p style={{ fontSize: 13.5, color: 'var(--slate)', lineHeight: 1.55 }}>
                Avalia resolução de conflitos, autonomia, comunicação assíncrona e liderança técnica a partir de
                relatos situacionais (método STAR), exigindo que o <code>EvidenceVerifier</code> aponte o trecho exato
                da entrevista.
              </p>
            </div>

            <div className="qi-surface" style={{ padding: 24 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber-hi)' }}>PESO 20% · ENQUADRAMENTO</span>
              <h3 className="qi-d3" style={{ margin: '6px 0 8px' }}>Alinhamento Salarial & Regime</h3>
              <p style={{ fontSize: 13.5, color: 'var(--slate)', lineHeight: 1.55 }}>
                Função degrau suave que cruza a pretensão salarial mínima do candidato com o orçamento da vaga,
                modalidade (Remoto/Híbrido) e disponibilidade para Match Express, evitando desistências no fim do
                processo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. ESCALA DE INFERÊNCIA (R$ 1,64 → R$ 0,63) & NUVEM (R$ 409/MÊS)    */}
      {/* =================================================================== */}
      <section id="tech-escala" className="qi-band" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>FinOps & Economia de Escala de Engenharia</span>
            </div>
            <h2 className="qi-d2">
              Memória de Cálculo: de{' '}
              <span style={{ color: 'var(--amber-hi)' }}>R$ 1,64 para R$ 0,63</span> por entrevista
            </h2>
            <p className="qi-lede">
              Demonstração matemática exata dos números apresentados no vídeo oficial: como a infraestrutura inicial de
              R$ 409/mês dilui seu custo fixo ao escalar de 250 para 2.000 entrevistas mensais.
            </p>
          </div>

          <div className="qi-market-grid">
            {/* Simulador Interativo de Escala de Entrevistas */}
            <div className="qi-surface" style={{ padding: 26 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase' }}>
                Simulador de Volume Mensal de Entrevistas Processadas
              </span>
              <h3 className="qi-d3" style={{ margin: '6px 0 14px' }}>
                Selecione o estágio de escala para inspecionar o custo unitário
              </h3>

              <div className="qi-binder-tabs" style={{ marginBottom: 18 }}>
                {INFERENCE_SCALE_TIERS.map((tier, idx) => (
                  <button
                    key={tier.interviewsPerMonth}
                    type="button"
                    onClick={() => setActiveScaleIdx(idx)}
                    className={`qi-binder-tab ${idx === activeScaleIdx ? 'is-active' : ''}`}
                  >
                    {tier.interviewsPerMonth} entrevistas/mês → {tier.unitCostBrl}
                  </button>
                ))}
              </div>

              <div style={{ padding: 20, borderRadius: 12, background: 'rgba(0,0,0,0.45)', border: '1px solid var(--hair)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  <strong style={{ fontSize: 15, color: 'var(--bone)' }}>{activeScale.label}</strong>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--slate)' }}>Custo Técnico / Entrevista: </span>
                    <strong style={{ fontSize: '1.9rem', color: 'var(--amber-hi)' }}>{activeScale.unitCostBrl}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: 11, color: 'var(--slate)', display: 'block' }}>Base Cloud Fixa</span>
                    <strong style={{ fontSize: 14, color: 'var(--bone)' }}>R$ {activeScale.cloudFixedBrl}/mês</strong>
                  </div>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: 11, color: 'var(--slate)', display: 'block' }}>Inferência Variável</span>
                    <strong style={{ fontSize: 14, color: 'var(--bone)' }}>R$ {activeScale.inferenceVariableBrl}/mês</strong>
                  </div>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(226,185,59,0.3)' }}>
                    <span style={{ fontSize: 11, color: 'var(--amber-hi)', display: 'block' }}>Custo Mensal Total</span>
                    <strong style={{ fontSize: 14, color: 'var(--amber-hi)' }}>R$ {activeScale.totalMonthlyBrl}/mês</strong>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activeScale.optimizations.map((opt, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#e4e4e9', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#6ee7b7', fontWeight: 700 }}>✓</span>
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Composição dos R$ 409/mês de Nuvem do MVP */}
            <div className="qi-surface" style={{ padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
                  Topologia Cloud Enxuta · R$ 409,00 / mês
                </span>
                <h3 className="qi-d3" style={{ margin: '6px 0 12px' }}>
                  Detalhamento da Infraestrutura Mensal do MVP
                </h3>
                <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 16 }}>
                  Arquitetura desenhada para evitar custos ociosos de nuvem usando PostgreSQL como motor unificado
                  relacional, vetorial (<code>pgvector</code>) e de filas (<code>pg-boss</code>).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {CLOUD_COST_BREAKDOWN_MVP.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--hair)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 12.5, color: '#e4e4e9' }}>{c.item}</span>
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: 13.5, color: 'var(--amber-hi)', display: 'block' }}>{c.costBrl}</strong>
                        <span style={{ fontSize: 10.5, color: 'var(--slate)' }}>{c.share} do total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(226,185,59,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--bone)' }}>Total Mensal Cloud MVP (250 entrevistas):</span>
                <strong style={{ fontSize: 16, color: 'var(--amber-hi)' }}>R$ 409,00 / mês</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. SEGURANÇA, LGPD (ART. 20) & SEGREGAÇÃO DE SCHEMAS                */}
      {/* =================================================================== */}
      <section id="tech-lgpd" className="qi-band">
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Segurança da Informação & Privacy by Design</span>
            </div>
            <h2 className="qi-d2">
              Isolamento Criptográfico de Dados{' '}
              <span style={{ color: 'var(--amber-hi)' }}>e Double Opt-In</span>
            </h2>
            <p className="qi-lede">
              Como o banco de dados impede tecnicamente vazamento de identidade antes do consentimento bilateral e
              assegura o direito de revisão de decisões automatizadas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <div className="qi-surface" style={{ padding: 24, borderLeft: '3px solid #6ee7b7' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
                Schema 01 · public.candidate_vectors (Aberto ao Match)
              </span>
              <h3 className="qi-d3" style={{ margin: '6px 0 10px' }}>Base Vetorial Anonimizada</h3>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#e4e4e9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Contém apenas <code>anon_uuid</code>, vetores de 768 dimensões, senioridade e pretensão salarial.</li>
                <li>Guarda o <code>blocked_cnpj_sha256</code> para ocultar automaticamente o candidato da empresa onde ele trabalha atualmente.</li>
                <li>Nenhuma query de shortlist corporativa tem permissão de <code>JOIN</code> direto com dados pessoais.</li>
              </ul>
            </div>

            <div className="qi-surface" style={{ padding: 24, borderLeft: '3px solid var(--amber-hi)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-hi)', textTransform: 'uppercase' }}>
                Schema 02 · vault.pii_identities (Cofre Restrito)
              </span>
              <h3 className="qi-d3" style={{ margin: '6px 0 10px' }}>Cofre de Identidade Pessoal (PII)</h3>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#e4e4e9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Armazena Nome Completo, E-mail, Telefone, LinkedIn e GitHub criptografados em repouso (AES-256).</li>
                <li>O desbloqueio exige token <code>HMAC-SHA256</code> assinado pela sessão autenticada do candidato (Double Opt-In).</li>
                <li>Gera registro imutável de auditoria com timestamp e finalidade específica para a vaga aceita.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. RESPOSTAS TÉCNICAS                                               */}
      {/* =================================================================== */}
      <section id="tech-faq" className="qi-band" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="qi-shell">
          <div className="qi-sect-head">
            <div className="qi-mark">
              <span>Perguntas Frequentes de Arquitetura</span>
            </div>
            <h2 className="qi-d2">
              Respostas Técnicas
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {BANCA_TECHNICAL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="qi-surface"
                  style={{
                    padding: '18px 22px',
                    border: isOpen ? '1px solid var(--amber-hi)' : '1px solid var(--hair)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(201,162,39,0.15)',
                          color: 'var(--amber-hi)',
                          marginRight: 8,
                        }}
                      >
                        {faq.category}
                      </span>
                      <strong style={{ fontSize: 15, color: 'var(--bone)' }}>{faq.question}</strong>
                    </div>
                    <span style={{ color: 'var(--amber-hi)', fontWeight: 700, fontSize: 18 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--hair)' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--amber-hi)', fontWeight: 600 }}>
                        Síntese Direta: {faq.shortAnswer}
                      </p>
                      <p style={{ margin: 0, fontSize: 13.5, color: '#d8d8e2', lineHeight: 1.65 }}>
                        {faq.technicalDeepDive}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rodapé de Retorno Rápido */}
          <div style={{ marginTop: 40, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="qi-btn" onClick={onBackToMarketLanding}>
              ← Voltar para Apresentação de Mercado
            </button>
          </div>
        </div>
      </section>

      {/* MODAL DO DIAGRAMA DRAW.IO ORIGINAL */}
      {showRawDiagramModal && (
        <div
          className="qi-modal-backdrop"
          onClick={() => setShowRawDiagramModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            className="qi-surface"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 1100, width: '100%', padding: 24, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="qi-d3">Diagrama de Fluxo Original do Repositório (docs/Diagram.drawio.png)</h3>
              <button type="button" className="qi-btn" onClick={() => setShowRawDiagramModal(false)}>
                Fechar ✕
              </button>
            </div>
            <div style={{ background: '#0c0c0f', padding: 16, borderRadius: 12, border: '1px solid var(--hair)', textAlign: 'center' }}>
              <img
                src="/diagram-arquitetura.png"
                alt="Diagrama de Fluxo Q.I. Match"
                style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
