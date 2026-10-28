import React, { useEffect, useState } from 'react';
import { RotateCcw, AlertTriangle, Send, History, CheckCircle, ShieldAlert } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { AssessmentReport, ReportVersion, Skill } from '../types';

interface ReplicaReviewPageProps {
  initialReportId?: string;
  initialSkillId?: string;
}

export const ReplicaReviewPage: React.FC<ReplicaReviewPageProps> = ({
  initialReportId,
  initialSkillId,
}) => {
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [activeReport, setActiveReport] = useState<AssessmentReport | null>(null);
  const [skillsCatalog, setSkillsCatalog] = useState<Skill[]>([]);

  // Form states
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [replicaText, setReplicaText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.listReports(),
      api.listSkills(),
    ]).then(([reps, sks]) => {
      setReports(reps);
      setSkillsCatalog(sks);
      if (reps.length > 0) {
        const targetId = initialReportId && reps.some((r) => r.id === initialReportId)
          ? initialReportId
          : reps[0].id;
        setSelectedReportId(targetId);
      }
      if (initialSkillId) {
        setSelectedSkillId(initialSkillId);
      }
    });
  }, [initialReportId, initialSkillId]);

  useEffect(() => {
    if (selectedReportId) {
      loadReport(selectedReportId);
    }
  }, [selectedReportId]);

  const loadReport = async (id: string) => {
    try {
      const rep = await api.getReport(id);
      setActiveReport(rep);
    } catch {
      // ignore
    }
  };

  const handleSubmitReplica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    if (replicaText.trim().length < 15) {
      setErrorMessage('Por favor forneça uma justificativa detalhada com fatos concretos (mínimo 15 caracteres).');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const review = await api.submitReplica(activeReport.id, {
        skill_id: selectedSkillId || undefined,
        replica_text: replicaText,
      });

      setStatusMessage(
        `Réplica registrada com sucesso! Foi gerada uma nova versão do relatório (v${activeReport.active_version_number + 1}), e a pendência foi encaminhada para revisão por recrutador humano.`
      );
      setReplicaText('');
      await loadReport(activeReport.id);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Direito de Réplica & Revisão Humana</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Garantia de contestabilidade, transparência e versionamento imutável de relatórios de competências.
        </p>
      </div>

      {statusMessage && (
        <div style={{ padding: '1rem', background: 'rgba(0, 232, 198, 0.1)', border: '1px solid #00E8C6', borderRadius: '10px', color: '#00E8C6', marginBottom: '1.5rem' }}>
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '10px', color: '#F87171', marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      <div className="grid-2">
        {/* Left Column: Replica Form */}
        <Card title="Submeter Contestação / Réplica Textual" subtitle="Candidato pode apontar evidências complementares ou divergências">
          <form onSubmit={handleSubmitReplica}>
            <div className="form-group">
              <label className="form-label">Selecione o Relatório do Candidato *</label>
              <select
                className="form-select"
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.candidate_name || r.candidate_id} (Versão Atual: v{r.active_version_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Competência Contestada (Opcional ou Geral)</label>
              <select
                className="form-select"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
              >
                <option value="">Contestação Geral do Relatório</option>
                {skillsCatalog.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Justificativa e Fatos Adicionais (Réplica) *</label>
              <textarea
                className="form-textarea"
                rows={6}
                required
                placeholder="Exemplo: Gostaria de esclarecer que na resposta técnica me concentrei no banco PostgreSQL, mas possuo 3 anos de experiência em MySQL e SQLite em ambiente de produção, tendo participado ativamente de migrations e tuning..."
                value={replicaText}
                onChange={(e) => setReplicaText(e.target.value)}
              />
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-muted)', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 600 }}>
                <ShieldAlert size={16} /> Princípio da Preservação Histórica:
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                A submissão desta réplica <strong>NUNCA sobrescreve</strong> o relatório original (Versão 1).
                Uma Versão 2 será criada mantendo todo o histórico auditável para o recrutador.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              <Send size={16} /> {submitting ? 'Enviando Réplica...' : 'Registrar Réplica & Gerar Nova Versão'}
            </button>
          </form>
        </Card>

        {/* Right Column: Versions History & Reviews */}
        <Card title="Histórico de Versões do Relatório" subtitle="Rastreabilidade completa de revisões e contestações">
          {activeReport && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {activeReport.versions?.map((ver) => (
                <div
                  key={ver.id}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    border: ver.version_number === activeReport.active_version_number
                      ? '1px solid var(--accent-cyan)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <History size={16} color="var(--accent-cyan)" />
                      <strong>Versão {ver.version_number}</strong>
                      {ver.version_number === activeReport.active_version_number && (
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Ativa</span>
                      )}
                    </div>
                    <Badge status={ver.status} label={ver.status} />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {ver.summary || 'Relatório preliminar de competências.'}
                  </p>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Criado em: {new Date(ver.created_at).toLocaleString('pt-BR')} • {ver.assessments?.length || 0} competências analisadas
                  </div>

                  {ver.reviews && ver.reviews.length > 0 && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                        Réplica Registrada:
                      </span>
                      {ver.reviews.map((rev) => (
                        <div key={rev.id} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                          "{rev.replica_text}"
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem', fontStyle: 'normal' }}>
                            Status: {rev.status} • {rev.resolution_notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
