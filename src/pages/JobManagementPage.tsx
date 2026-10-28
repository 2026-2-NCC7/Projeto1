import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Search, Building2, Target, Check, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { Job, Company, Skill } from '../types';

interface JobManagementPageProps {
  onNavigateToMatching: (jobId: string) => void;
}

export const JobManagementPage: React.FC<JobManagementPageProps> = ({ onNavigateToMatching }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [skillsCatalog, setSkillsCatalog] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // New Job Form State
  const [companyId, setCompanyId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techVertical, setTechVertical] = useState('Data Engineering');
  const [seniority, setSeniority] = useState('Pleno');
  const [contractType, setContractType] = useState('CLT');
  const [workModel, setWorkModel] = useState('REMOTO');
  const [minSalary, setMinSalary] = useState<number | ''>(11000);
  const [maxSalary, setMaxSalary] = useState<number | ''>(15000);
  const [minExpYears, setMinExpYears] = useState(2.5);

  // Skill Requirements Builder State
  const [selectedReqs, setSelectedReqs] = useState<{
    skill_id: string;
    is_mandatory: boolean;
    min_level: number;
    weight: number;
  }[]>([
    { skill_id: 'hard-python', is_mandatory: true, min_level: 3, weight: 2.0 },
    { skill_id: 'hard-sql', is_mandatory: true, min_level: 3, weight: 2.0 },
    { skill_id: 'soft-resolucao-problemas', is_mandatory: false, min_level: 3, weight: 1.0 },
  ]);

  const [catalogSearch, setCatalogSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jbs, comps, sks] = await Promise.all([
        api.listJobs(),
        api.listCompanies(),
        api.listSkills(),
      ]);
      setJobs(jbs);
      setCompanies(comps);
      setSkillsCatalog(sks);
      if (comps.length > 0) setCompanyId(comps[0].id);
    } catch {
      // ignore
    }
  };

  const handleAddRequirement = (skillId: string) => {
    if (selectedReqs.some((r) => r.skill_id === skillId)) return;
    setSelectedReqs((prev) => [
      ...prev,
      { skill_id: skillId, is_mandatory: true, min_level: 3, weight: 1.5 },
    ]);
  };

  const handleRemoveRequirement = (skillId: string) => {
    setSelectedReqs((prev) => prev.filter((r) => r.skill_id !== skillId));
  };

  const handleUpdateReqField = (skillId: string, field: string, val: any) => {
    setSelectedReqs((prev) =>
      prev.map((r) => (r.skill_id === skillId ? { ...r, [field]: val } : r))
    );
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setErrorMessage('Selecione uma empresa contratante.');
      return;
    }
    if (selectedReqs.length === 0) {
      setErrorMessage('Adicione ao menos uma competência necessária para a vaga.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const payload = {
        company_id: companyId,
        title,
        description,
        tech_vertical: techVertical,
        seniority,
        contract_type: contractType,
        work_model: workModel,
        min_salary: minSalary ? Number(minSalary) : null,
        max_salary: maxSalary ? Number(maxSalary) : null,
        min_experience_years: Number(minExpYears),
        skills: selectedReqs,
      };

      const newJob = await api.createJob(payload);
      setStatusMessage(`Vaga '${newJob.title}' cadastrada com sucesso!`);
      setTitle('');
      setDescription('');
      await loadData();
      setActiveTab('list');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Gestão de Vagas & Critérios</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cadastro de requisitos técnicos, competências obrigatórias e critérios objetivos de contratação.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('list')}
          >
            Vagas Abertas ({jobs.length})
          </button>
          <button
            className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('create')}
          >
            <Plus size={16} /> Cadastrar Nova Vaga
          </button>
        </div>
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

      {activeTab === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {jobs.map((job) => (
            <Card key={job.id}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{job.title}</h3>
                    <Badge status="HARD" label={job.tech_vertical} />
                    <span className="badge badge-cyan">{job.seniority}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>
                      <Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {job.company_name || 'Empresa'}
                    </span>
                    <span>•</span>
                    <span>{job.contract_type}</span>
                    <span>•</span>
                    <span>{job.work_model}</span>
                    <span>•</span>
                    <span>Min. {job.min_experience_years} anos de exp.</span>
                    {job.max_salary && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>
                          Até R$ {job.max_salary.toLocaleString('pt-BR')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => onNavigateToMatching(job.id)}
                >
                  <Target size={16} /> Executar Matching & Ranking
                </button>
              </div>

              <p style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {job.description}
              </p>

              {/* Required Skills Badges */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Requisitos de Competência:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                  {job.skill_requirements?.map((req) => (
                    <span
                      key={req.id || req.skill_id}
                      className={req.is_mandatory ? 'badge badge-cyan' : 'badge badge-parcial'}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {req.is_mandatory ? '★ Obrigatória: ' : 'Desejável: '}
                      {req.skill_name || req.skill_id.replace('hard-', '').replace('soft-', '')} (Nível {req.min_level}, Peso {req.weight}x)
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Create Job Form */
        <form onSubmit={handleCreateJob}>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <Card title="Dados Gerais da Oportunidade">
              <div className="form-group">
                <label className="form-label">Empresa Contratante *</label>
                <select
                  className="form-select"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.industry || 'Tech'})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Título do Cargo *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Engenheiro(a) de Dados Pleno"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Vertical Tecnológica *</label>
                  <select
                    className="form-select"
                    value={techVertical}
                    onChange={(e) => setTechVertical(e.target.value)}
                  >
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="IA & Machine Learning">IA & Machine Learning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Senioridade Requerida *</label>
                  <select
                    className="form-select"
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Modalidade de Contratação</label>
                  <select
                    className="form-select"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="INDIFERENTE">Indiferente</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Regime de Trabalho</label>
                  <select
                    className="form-select"
                    value={workModel}
                    onChange={(e) => setWorkModel(e.target.value)}
                  >
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="INDIFERENTE">Indiferente</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Experiência Mínima (anos) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={minExpYears}
                    onChange={(e) => setMinExpYears(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Salário Máximo Oferecido (R$)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="14000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição das Atividades da Vaga *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Descreva as responsabilidades, principais tecnologias e desafios da posição..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </Card>

            {/* Requirements Picker */}
            <Card title="Competências Exigidas (Catálogo)" subtitle="Defina obrigatoriedade, nível mínimo (1-5) e peso (1.0 - 3.0)">
              {/* Selected requirements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {selectedReqs.map((req) => {
                  const skillMeta = skillsCatalog.find((s) => s.id === req.skill_id);
                  return (
                    <div
                      key={req.skill_id}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-surface)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{skillMeta?.name || req.skill_id}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            {skillMeta?.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(req.skill_id)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.8rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={req.is_mandatory}
                            onChange={(e) => handleUpdateReqField(req.skill_id, 'is_mandatory', e.target.checked)}
                          />
                          <span>Obrigatória (Eliminatória)</span>
                        </label>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>Nível Mínimo:</span>
                          <select
                            className="form-select"
                            style={{ width: '90px', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                            value={req.min_level}
                            onChange={(e) => handleUpdateReqField(req.skill_id, 'min_level', parseInt(e.target.value))}
                          >
                            <option value={1}>1 (Básico)</option>
                            <option value={2}>2 (Inicial)</option>
                            <option value={3}>3 (Interm.)</option>
                            <option value={4}>4 (Avanç.)</option>
                            <option value={5}>5 (Espec.)</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>Peso:</span>
                          <select
                            className="form-select"
                            style={{ width: '85px', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                            value={req.weight}
                            onChange={(e) => handleUpdateReqField(req.skill_id, 'weight', parseFloat(e.target.value))}
                          >
                            <option value={1.0}>1.0x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2.0}>2.0x</option>
                            <option value={2.5}>2.5x</option>
                            <option value={3.0}>3.0x</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add from catalog selector */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Adicionar competência à vaga:
                </span>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {skillsCatalog
                    .filter((sk) => !selectedReqs.some((r) => r.skill_id === sk.id))
                    .map((sk) => (
                      <button
                        key={sk.id}
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => handleAddRequirement(sk.id)}
                      >
                        <Plus size={12} /> {sk.name}
                      </button>
                    ))}
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Cadastrando Vaga...' : 'Salvar Vaga e Requisitos'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
