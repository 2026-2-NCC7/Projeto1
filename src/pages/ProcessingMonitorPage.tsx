import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Cpu, HardDrive, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import { HealthResponse, AuditEvent } from '../types';

export const ProcessingMonitorPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 8000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [hlth, events] = await Promise.all([
        api.getHealth(),
        api.getAuditEvents(25),
      ]);
      setHealth(hlth);
      setAuditEvents(events);
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  const pipelineStages = [
    {
      title: '1. Ingestão & Transcrição de Áudio',
      engine: 'faster-whisper (small / int8)',
      description: 'Segmentação temporal de áudio em pt-BR, decodificação VAD e preservação de raw_transcript.',
      status: 'Operacional',
      device: 'CPU (int8 quantizado)',
    },
    {
      title: '2. Extração Inteligente & Citações',
      engine: 'Qwen3:4b (via Ollama local)',
      description: 'Análise contextual de respostas, identificação fática de competências e citação verbatim.',
      status: health?.models.find((m) => m.name.includes('Qwen'))?.available ? 'Ollama Ativo' : 'Contingência Determinística',
      device: 'CPU / Localhost:11434',
    },
    {
      title: '3. Representação Semântica & Normalização',
      engine: 'intfloat/multilingual-e5-small',
      description: 'Vetorização densa (384d) com prefixos query: e passage:, busca por similaridade cosseno.',
      status: 'Operacional',
      device: 'CPU (Sentence Transformers)',
    },
    {
      title: '4. Verificação Programática de Evidências',
      engine: 'EvidenceVerifier (Backend Python)',
      description: 'Auditoria algorítmica rigorosa garantindo que toda citação literal exista no texto original.',
      status: 'Auditoria Ativa',
      device: 'Regras Determinísticas',
    },
    {
      title: '5. Consolidação & Controle de Versões',
      engine: 'ProfileConsolidator (SQLAlchemy)',
      description: 'Geração de relatório preliminar v1, preservação de histórico e isolamento para réplicas v2/v3.',
      status: 'Versionado',
      device: 'SQLite / PostgreSQL',
    },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Monitor de Processamento & Auditoria</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Acompanhamento em tempo real das etapas do pipeline de IA, latência e trilha de eventos LGPD.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={loadData} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Atualizar Monitor
        </button>
      </div>

      {/* Pipeline Architecture Cards */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Arquitetura do Pipeline de Extração</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {pipelineStages.map((stage, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(0, 232, 198, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                {idx + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{stage.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stage.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Motor: <strong>{stage.engine}</strong></span>
                  <span>•</span>
                  <span>Ambiente: <strong>{stage.device}</strong></span>
                </div>
              </div>
            </div>

            <div>
              <Badge status="EVIDENCIADA" label={stage.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Audit Trail Stream Table */}
      <Card
        title="Trilha de Auditoria & Registro de Eventos (LGPD)"
        subtitle="Registro imutável de eventos do sistema, versionamento e chamadas aos modelos"
      >
        <div className="table-responsive" style={{ marginTop: '1rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Tipo de Evento</th>
                <th>Entidade</th>
                <th>Versão / Motor</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                      {ev.event_type}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{ev.entity_name}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {ev.model_version || 'N/A'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '350px' }}>
                    {ev.payload ? JSON.stringify(ev.payload).slice(0, 80) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
