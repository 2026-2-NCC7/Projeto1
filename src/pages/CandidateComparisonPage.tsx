import React, { useEffect, useState } from 'react';
import { GitCompare, Check, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import { Job, Candidate, CandidateComparisonResponse } from '../types';

interface CandidateComparisonPageProps {
  initialJobId?: string;
  initialCandidateIds?: string[];
  onBackToMatching: (jobId: string) => void;
}

export const CandidateComparisonPage: React.FC<CandidateComparisonPageProps> = ({
  initialJobId,
  initialCandidateIds = [],
  onBackToMatching,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<CandidateComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.listJobs(),
      api.listCandidates(),
    ]).then(([jbs, cands]) => {
      setJobs(jbs);
      setCandidates(cands);

      const targetJobId = initialJobId && jbs.some((j) => j.id === initialJobId)
        ? initialJobId
        : (jbs[0]?.id || '');
      setSelectedJobId(targetJobId);

      if (initialCandidateIds && initialCandidateIds.length >= 2) {
        setSelectedCandidateIds(initialCandidateIds);
      } else if (cands.length >= 2) {
        setSelectedCandidateIds([cands[0].id, cands[1].id]);
      }
    });
  }, [initialJobId, initialCandidateIds]);

  useEffect(() => {
    if (selectedJobId && selectedCandidateIds.length >= 2) {
      loadComparison(selectedJobId, selectedCandidateIds);
    }
  }, [selectedJobId, selectedCandidateIds]);

  const loadComparison = async (jobId: string, candidateIds: string[]) => {
    setLoading(true);
    try {
      const data = await api.compareCandidates(jobId, candidateIds);
      setComparisonData(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidateIds((prev) => {
      if (prev.includes(candidateId)) {
        if (prev.length <= 2) {
          alert('A comparação necessita de pelo menos 2 candidatos.');
          return prev;
        }
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 4) {
        alert('Máximo de 4 candidatos por comparação.');
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}
            onClick={() => onBackToMatching(selectedJobId)}
          >
            <ArrowLeft size={14} /> Voltar ao Ranking
          </button>
          <h1 style={{ fontSize: '2rem' }}>Comparação de Candidatos Lado a Lado</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Avaliação comparativa de candidatos segundo as exatas mesmas rubricas, pesos e requisitos da vaga.
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
                {j.title} ({j.company_name || 'Empresa'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Selector Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
          Selecione candidatos (2 a 4):
        </span>
        {candidates.map((cand) => {
          const isSelected = selectedCandidateIds.includes(cand.id);
          return (
            <button
              key={cand.id}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => handleToggleCandidate(cand.id)}
            >
              {isSelected ? '✓ ' : '+ '} {cand.name}
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      {comparisonData && comparisonData.candidates.length >= 2 && (
        <div className="table-responsive">
          <table className="table" style={{ background: 'var(--bg-card)' }}>
            <thead>
              <tr>
                <th style={{ width: '260px' }}>Critérios da Vaga</th>
                {comparisonData.candidates.map((item) => (
                  <th key={item.candidate.candidate_id} style={{ minWidth: '240px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.candidate.candidate_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                      {item.candidate.candidate_seniority} • {item.candidate.candidate_experience_years} anos exp.
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall Match Row */}
              <tr style={{ background: 'rgba(0, 232, 198, 0.05)' }}>
                <td>
                  <strong>Compatibilidade Geral (Match)</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fórmula Ponderada Explicável</div>
                </td>
                {comparisonData.candidates.map((item) => (
                  <td key={item.candidate.candidate_id}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {item.candidate.overall_score.toFixed(1)}%
                    </div>
                    <ProgressBar value={item.candidate.overall_score} showPercent={false} height={6} />
                  </td>
                ))}
              </tr>

              {/* Evaluation Coverage Row */}
              <tr>
                <td>
                  <strong>Cobertura de Evidências</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>% Requisitos Avaliados na Entrevista</div>
                </td>
                {comparisonData.candidates.map((item) => (
                  <td key={item.candidate.candidate_id}>
                    <Badge
                      status={item.candidate.evaluation_coverage >= 70 ? 'EVIDENCIADA' : 'PARCIALMENTE_EVIDENCIADA'}
                      label={`${item.candidate.evaluation_coverage.toFixed(0)}% da Vaga Avaliada`}
                    />
                  </td>
                ))}
              </tr>

              {/* Dimension Scores Row */}
              <tr>
                <td>
                  <strong>Hard Skills / Soft Skills</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pontuação por dimensão</div>
                </td>
                {comparisonData.candidates.map((item) => (
                  <td key={item.candidate.candidate_id} style={{ fontSize: '0.85rem' }}>
                    <div>Hard Skills: <strong>{item.candidate.hard_skills_score.toFixed(0)}%</strong></div>
                    <div>Soft Skills: <strong>{item.candidate.soft_skills_score.toFixed(0)}%</strong></div>
                  </td>
                ))}
              </tr>

              {/* Objective Incompatibilities Row */}
              <tr>
                <td>
                  <strong>Condições Objetivas</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regime, contratação, salário</div>
                </td>
                {comparisonData.candidates.map((item) => (
                  <td key={item.candidate.candidate_id}>
                    {item.candidate.is_objectively_incompatible ? (
                      <span className="badge badge-divergencia" title={item.candidate.incompatibility_reasons.join('; ')}>
                        Incompatível
                      </span>
                    ) : (
                      <span className="badge badge-evidenciada">Compatível (100%)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Section Header for Skills */}
              <tr style={{ background: 'var(--bg-muted)' }}>
                <td colSpan={comparisonData.candidates.length + 1} style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Matriz de Competências Requeridas
                </td>
              </tr>

              {/* Each Required Skill Comparison Row */}
              {comparisonData.required_skills.map((req) => (
                <tr key={req.skill_id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.skill_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {req.is_mandatory ? '★ Obrigatória' : 'Desejável'} • Min. Nível {req.min_level} • Peso {req.weight}x
                    </div>
                  </td>

                  {comparisonData.candidates.map((item) => {
                    const detail = item.competency_matrix[req.skill_id];
                    if (!detail) {
                      return <td key={item.candidate.candidate_id}>—</td>;
                    }

                    return (
                      <td key={item.candidate.candidate_id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                          <Badge status={detail.alignment_status} label={detail.alignment_status} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                            {detail.score_contribution.toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Status: <strong>{detail.candidate_evidence_status.replace(/_/g, ' ')}</strong>
                        </div>
                        {detail.gap_notes && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                            {detail.gap_notes}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
