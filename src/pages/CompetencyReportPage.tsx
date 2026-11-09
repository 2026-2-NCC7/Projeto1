import React, { useEffect, useState } from 'react';
import {
  FileText, CheckCircle, AlertTriangle, MessageSquare, Quote,
  RotateCcw, Sparkles, Shield, User, ChevronDown, RefreshCw
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { AssessmentReport, ReportVersion, CompetencyAssessment } from '../types';

interface CompetencyReportPageProps {
  initialReportId?: string;
  onNavigateToReplica: (reportId: string, skillId?: string) => void;
}

export const CompetencyReportPage: React.FC<CompetencyReportPageProps> = ({
  initialReportId,
  onNavigateToReplica,
}) => {
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [activeReport, setActiveReport] = useState<AssessmentReport | null>(null);
  const [activeVersion, setActiveVersion] = useState<ReportVersion | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HARD' | 'SOFT'>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (selectedReportId) {
      loadReportDetails(selectedReportId);
    }
  }, [selectedReportId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.listReports();
      setReports(data);
      if (data && data.length > 0) {
        // Se houver um initialReportId e ele existir na lista, usa ele;
        // caso contrário, prioriza o relatório do cenário de injeção de prompt auditada (Rafael Costa) ou o primeiro
        const foundInitial = initialReportId ? data.find((r) => r.id === initialReportId) : null;
        const rafaelReport = data.find((r) => r.candidate_name?.includes('Rafael') || r.id === 'a18889cb-9d48-4505-8327-a993a66ca8ab');
        const targetId = foundInitial?.id || rafaelReport?.id || data[0].id;
        setSelectedReportId(targetId);
      }
    } catch (err) {
      console.error('[CompetencyReportPage] Erro ao carregar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReportDetails = async (id: string) => {
    try {
      const rep = await api.getReport(id);
      setActiveReport(rep);
      setActiveVersion(rep.active_version || rep.versions?.[0] || null);
    } catch (err) {
      console.error('[CompetencyReportPage] Erro ao carregar detalhes:', err);
    }
  };

  const handleAuthorize = async () => {
    if (!activeReport) return;
    try {
      const res = await api.consolidateReport(activeReport.id);
      setActionNotice(res.message);
      await loadReportDetails(activeReport.id);
    } catch (err: any) {
      alert(`Erro ao autorizar relatório: ${err.message}`);
    }
  };

  const handleSelectVersion = async (versionNumber: number) => {
    if (!activeReport) return;
    try {
      const v = await api.getReportVersions(activeReport.id);
      const found = v.find((ver) => ver.version_number === versionNumber);
      if (found) setActiveVersion(found);
    } catch (err) {
      console.error('[CompetencyReportPage] Erro ao selecionar versão:', err);
    }
  };

  const assessments = activeVersion?.assessments || [];
  const filteredAssessments = assessments.filter((a) => {
    if (filterCategory === 'ALL') return true;
    return a.skill_category === filterCategory || (a.skill_id.startsWith('hard') && filterCategory === 'HARD') || (a.skill_id.startsWith('soft') && filterCategory === 'SOFT');
  });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header & Report Picker */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Relatório Consolidado de Competências</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Comparação detalhada entre competências autodeclaradas e evidências textuais da entrevista.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Candidato:</label>
          <select
            className="form-select"
            style={{ width: '260px' }}
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
          >
            {reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.candidate_name || `Candidato ${r.candidate_id.slice(0, 8)}`} (v{r.active_version_number})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionNotice && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '10px', color: '#34D399', marginBottom: '1.5rem' }}>
          {actionNotice}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
            Carregando laudo técnico consolidado e evidências de áudio...
          </p>
        </div>
      )}

      {/* Empty State com Recarga e Resiliência */}
      {!loading && (!activeReport || !activeVersion) && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)', margin: '2rem 0' }}>
          <AlertTriangle size={36} style={{ color: 'var(--accent-amber)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Nenhum laudo encontrado no servidor</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            O laudo de competências está temporariamente inacessível. Clique abaixo para carregar os relatórios de auditoria técnica pré-computados.
          </p>
          <button
            type="button"
            onClick={loadReports}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={14} /> Carregar Laudos Demonstrativos
          </button>
        </div>
      )}

      {/* Exibição Completa do Relatório */}
      {!loading && activeReport && activeVersion && (
        <>
          {/* Metadata & Version Switcher Bar */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Candidato Avaliado:</span>
                <h3 style={{ fontSize: '1.2rem' }}>{activeReport.candidate_name}</h3>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Oficial:</span>
                <div>
                  <Badge status={activeReport.status} label={activeReport.status} />
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Versão em Exibição:</span>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {activeReport.versions?.map((v) => (
                    <button
                      key={v.version_number}
                      className={`btn ${activeVersion.version_number === v.version_number ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleSelectVersion(v.version_number)}
                    >
                      v{v.version_number} {v.version_number === 1 ? '(Preliminar)' : '(Revisado)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigateToReplica(activeReport.id)}
              >
                <RotateCcw size={16} /> Direito de Réplica / Contestação
              </button>
              {activeReport.status !== 'CONSOLIDADO' && (
                <button className="btn btn-primary" onClick={handleAuthorize}>
                  <CheckCircle size={16} /> Homologar Versão Autorizada
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              className={`btn ${filterCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setFilterCategory('ALL')}
            >
              Todas as Competências ({assessments.length})
            </button>
            <button
              className={`btn ${filterCategory === 'HARD' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setFilterCategory('HARD')}
            >
              Hard Skills
            </button>
            <button
              className={`btn ${filterCategory === 'SOFT' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setFilterCategory('SOFT')}
            >
              Soft Skills
            </button>
          </div>

          {/* Declared vs Evidenced Competency Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAssessments.map((comp) => (
              <Card key={comp.id}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>{comp.skill_name || comp.skill_id}</h3>
                      <Badge status={comp.evidence_status} />
                      {comp.is_suggested && (
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          <Sparkles size={12} /> Sugerida na Entrevista
                        </span>
                      )}
                      {comp.requires_review && (
                        <span className="badge badge-divergencia" style={{ fontSize: '0.7rem' }}>
                          <AlertTriangle size={12} /> Requer Revisão
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>
                        Autodeclaração: <strong>{comp.declared ? `Nível ${comp.declared_level || 'N/A'} / 5` : 'Não declarada'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Proficiência Evidenciada: <strong>{comp.estimated_level ? `Nível ${comp.estimated_level} / 5` : 'Não estimada (insuficiente)'}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => onNavigateToReplica(activeReport.id, comp.skill_id)}
                  >
                    Contestar Competência
                  </button>
                </div>

                {/* Explanation */}
                <p style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {comp.explanation}
                </p>

                {/* Verbatim Quotes Cards (Audited from Transcripts) */}
                {comp.evidences && comp.evidences.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      Evidências Literais Verificadas no Áudio/Transcrição:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                      {comp.evidences.map((ev, i) => (
                        <div key={i} className="quote-box">
                          <Quote size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-cyan)' }} />
                          "{ev.exact_quote}"
                          {ev.explanation && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'normal' }}>
                              → {ev.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
