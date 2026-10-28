import React, { useEffect, useState } from 'react';
import {
  Target, Award, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, ShieldCheck, Zap, GitCompare, RefreshCw
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import { Job, JobMatchingRanking, CandidateMatchingResult } from '../types';

interface MatchingRankingPageProps {
  initialJobId?: string;
  onNavigateToComparison: (jobId: string, candidateIds: string[]) => void;
  onNavigateToReport: (reportId: string) => void;
}

export const MatchingRankingPage: React.FC<MatchingRankingPageProps> = ({
  initialJobId,
  onNavigateToComparison,
  onNavigateToReport,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [rankingData, setRankingData] = useState<JobMatchingRanking | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    api.listJobs().then((jbs) => {
      setJobs(jbs);
      if (jbs.length > 0) {
        const targetId = initialJobId && jbs.some((j) => j.id === initialJobId)
          ? initialJobId
          : jbs[0].id;
        setSelectedJobId(targetId);
      }
    });
  }, [initialJobId]);

  useEffect(() => {
    if (selectedJobId) {
      loadRanking(selectedJobId);
    }
  }, [selectedJobId]);

  const loadRanking = async (jobId: string) => {
    setLoading(true);
    try {
      const data = await api.getJobRanking(jobId);
      setRankingData(data);
      if (data.ranking.length > 0) {
        setExpandedCandidateId(data.ranking[0].candidate_id);
      }
    } catch {
      // If no pre-computed ranking, run it
      try {
        const runData = await api.runJobMatching(jobId);
        setRankingData(runData);
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatching = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      const runData = await api.runJobMatching(selectedJobId);
      setRankingData(runData);
    } catch (err: any) {
      alert(`Erro no matching: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (candidateId: string) => {
    setSelectedCandidateIds((prev) => {
      if (prev.includes(candidateId)) return prev.filter((id) => id !== candidateId);
      if (prev.length >= 4) {
        alert('Você pode comparar no máximo 4 candidatos simultaneamente.');
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header and Job Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Q.I. Matchmaker Engine</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ranking ordenado de candidatos por compatibilidade ponderada e evidências comprovadas.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vaga:</label>
          <select
            className="form-select"
            style={{ width: '280px' }}
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company_name || 'Empresa'}) - {j.seniority}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleRunMatching} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Recalcular
          </button>
        </div>
      </div>

      {/* Matching Heuristic Formula Banner */}
      {rankingData && (
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              Fórmula de Ponderação Explicável:
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              MATCH = (0.50 × HARD) + (0.25 × SOFT) + (0.15 × EXP) + (0.10 × COND)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Candidatos Avaliados: <strong>{rankingData.total_candidates_evaluated}</strong>
            </span>

            {selectedCandidateIds.length >= 2 && (
              <button
                className="btn btn-primary"
                onClick={() => onNavigateToComparison(selectedJobId, selectedCandidateIds)}
              >
                <GitCompare size={16} /> Comparar {selectedCandidateIds.length} Candidatos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Candidates Ranking Cards */}
      {rankingData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rankingData.ranking.map((res, index) => {
            const isExpanded = expandedCandidateId === res.candidate_id;
            const isSelectedForCompare = selectedCandidateIds.includes(res.candidate_id);

            return (
              <Card key={res.candidate_id}>
                {/* Ranking Header Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: index === 0 ? 'rgba(0, 232, 198, 0.15)' : 'var(--bg-surface)',
                        border: index === 0 ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        color: index === 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      }}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>{res.candidate_name}</h3>
                        <Badge status="HARD" label={res.candidate_seniority} />
                        {res.is_objectively_incompatible && (
                          <span className="badge badge-divergencia">Incompatibilidade Objetiva</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {res.candidate_experience_years} anos de experiência comprovada
                      </div>
                    </div>
                  </div>

                  {/* Scores & Coverage Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cobertura de Avaliação:</div>
                      <Badge
                        status={res.evaluation_coverage >= 70 ? 'EVIDENCIADA' : 'PARCIALMENTE_EVIDENCIADA'}
                        label={`${res.evaluation_coverage.toFixed(0)}% Avaliado`}
                      />
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Final:</div>
                      <span
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          color: res.overall_score >= 80 ? 'var(--accent-cyan)' : res.overall_score >= 60 ? 'var(--accent-blue)' : 'var(--accent-amber)',
                        }}
                      >
                        {res.overall_score.toFixed(1)}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className={`btn ${isSelectedForCompare ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => handleToggleCompare(res.candidate_id)}
                      >
                        <GitCompare size={14} /> {isSelectedForCompare ? 'Selecionado' : 'Comparar'}
                      </button>

                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => setExpandedCandidateId(isExpanded ? null : res.candidate_id)}
                      >
                        {isExpanded ? 'Recolher' : 'Ver Detalhes'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    {/* Dimension Breakdown Progress Bars */}
                    <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Hard Skills (50%):</div>
                        <ProgressBar value={res.hard_skills_score} height={6} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Soft Skills (25%):</div>
                        <ProgressBar value={res.soft_skills_score} height={6} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Experiência (15%):</div>
                        <ProgressBar value={res.experience_score} height={6} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Condições Objetivas (10%):</div>
                        <ProgressBar value={res.conditions_score} height={6} />
                      </div>
                    </div>

                    {/* Incompatibilities alert */}
                    {res.is_objectively_incompatible && res.incompatibility_reasons.length > 0 && (
                      <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '10px', color: '#F87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                        <strong>Restrições Objetivas Incompatíveis:</strong>
                        <ul style={{ marginLeft: '1.25rem', marginTop: '0.35rem' }}>
                          {res.incompatibility_reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Requirements Breakdown Pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {/* Fully Matched */}
                      {res.matched_skills.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399' }}>
                            ✓ Requisitos Plenamente Atendidos:
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                            {res.matched_skills.map((s) => (
                              <span key={s.skill_id} className="badge badge-evidenciada" style={{ fontSize: '0.75rem' }}>
                                {s.skill_name} (Evidenciado Nível {s.candidate_estimated_level || s.candidate_declared_level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Partially Matched */}
                      {res.partial_skills.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8' }}>
                            ~ Atendimento Parcial:
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                            {res.partial_skills.map((s) => (
                              <span key={s.skill_id} className="badge badge-parcial" style={{ fontSize: '0.75rem' }}>
                                {s.skill_name} ({s.gap_notes || 'nível ligeiramente abaixo'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pending Evaluation (Crucial for Scenario E) */}
                      {res.pending_skills.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24' }}>
                            ⏳ Avaliações Pendentes (Necessitam Entrevista Direcionada):
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                            {res.pending_skills.map((s) => (
                              <span key={s.skill_id} className="badge badge-insuficiente" style={{ fontSize: '0.75rem' }}>
                                {s.skill_name} ({s.gap_notes})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Textual Justification Box */}
                    <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', borderRadius: '10px', borderLeft: '3px solid var(--accent-cyan)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                        Justificativa Técnica Explicável (Sem Decisão Automatizada):
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {res.textual_justification}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
