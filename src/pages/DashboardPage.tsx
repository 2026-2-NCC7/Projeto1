import React, { useEffect, useState } from 'react';
import {
  Users, Briefcase, FileCheck, Brain, ArrowRight,
  ShieldCheck, AlertCircle, Cpu, Zap, Activity
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { Candidate, Job, AssessmentReport, HealthResponse, AuditEvent } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string, state?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.listCandidates().catch(() => []),
      api.listJobs().catch(() => []),
      api.listReports().catch(() => []),
      api.getHealth().catch(() => null),
      api.getAuditEvents(6).catch(() => []),
    ]).then(([cands, jbs, reps, hlth, aud]) => {
      setCandidates(cands);
      setJobs(jbs);
      setReports(reps);
      setHealth(hlth);
      setAuditEvents(aud);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-cyan">Motor de Inteligência Ativo</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Windows Local Execution (CPU)</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Q.I. Tech Matchmaker <span className="brand-badge">Engine</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '850px' }}>
          Mapeamento inteligente de competências profissionais a partir de entrevistas e autodeclaração,
          sustentado por evidências textuais rastreáveis e correspondência explicável com vagas de tecnologia.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Candidatos Cadastrados</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{candidates.length}</h2>
            </div>
            <Users size={32} color="var(--accent-cyan)" />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vagas de Tecnologia</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{jobs.length}</h2>
            </div>
            <Briefcase size={32} color="var(--accent-blue)" />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Relatórios Gerados</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{reports.length}</h2>
            </div>
            <FileCheck size={32} color="var(--accent-green)" />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modelos de IA Locais</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>3 / 3</h2>
            </div>
            <Brain size={32} color="var(--accent-violet)" />
          </div>
        </Card>
      </div>

      {/* Models Status and Scenarios Grid */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* ML Models Card */}
        <Card title="Status dos Modelos de Inteligência Local" subtitle="Execução 100% local sem APIs pagas">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {health?.models.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={16} color="var(--accent-cyan)" />
                    <strong>{m.name}</strong>
                  </div>
                  <Badge status={m.available ? 'ATIVO' : 'PRELIMINAR'} label={m.available ? 'Operacional' : 'Modo Contingência'} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Função: {m.role} ({m.target_engine})
                </p>
                {m.details && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {m.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Evaluation Test Scenarios Card */}
        <Card title="Cenários de Demonstração (TCC / MVP)" subtitle="Acesso rápido aos fluxos de teste A até G">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => onNavigate('reports')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Cenário A & C: Evidência e Nova Competência</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Lucas Silva: Python evidenciado via quote + Gestão de Conflitos sugerida.
                  </p>
                </div>
                <ArrowRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>

            <div
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => onNavigate('reports')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Cenário B & D: Não Avaliada e Evidência Fraca</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Beatriz Souza: SQL marcado como NAO_AVALIADA e Liderança com evidência insuficiente.
                  </p>
                </div>
                <ArrowRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>

            <div
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => onNavigate('replica')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Cenário F: Réplica e Versionamento (v1 e v2)</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Carlos Mendes: Contestação de AWS registrada, gerando Versão 2 sem destruir Versão 1.
                  </p>
                </div>
                <ArrowRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>

            <div
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => onNavigate('matching')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Cenário E: Matching e Cobertura de Avaliação</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Compatibilidade explicável com fórmula de pesos e identificação de requisitos pendentes.
                  </p>
                </div>
                <ArrowRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('candidates')}>
          <Users size={16} /> Cadastrar Novo Candidato
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('interview')}>
          <Activity size={16} /> Iniciar Entrevista de Triagem
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('matching')}>
          <Zap size={16} /> Executar Matching de Vaga
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('comparison')}>
          <ShieldCheck size={16} /> Comparar Candidatos
        </button>
      </div>
    </div>
  );
};
