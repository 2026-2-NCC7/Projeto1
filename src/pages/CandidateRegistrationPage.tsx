import React, { useEffect, useState } from 'react';
import { UserPlus, Search, Check, Plus, Trash2, Shield, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { Skill, Candidate, CandidateDeclaredSkill } from '../types';

export const CandidateRegistrationPage: React.FC = () => {
  const [skillsCatalog, setSkillsCatalog] = useState<Skill[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [techArea, setTechArea] = useState('Engenharia de Software');
  const [seniority, setSeniority] = useState('Pleno');
  const [experienceYears, setExperienceYears] = useState(3.0);
  const [contractPref, setContractPref] = useState('INDIFERENTE');
  const [workModelPref, setWorkModelPref] = useState('REMOTO');
  const [salaryExpectation, setSalaryExpectation] = useState<number | ''>(12000);
  const [bio, setBio] = useState('');
  const [consentGranted, setConsentGranted] = useState(true);

  // Skills picker states
  const [selectedSkills, setSelectedSkills] = useState<{ [skillId: string]: number }>({
    'hard-python': 4,
    'hard-sql': 3,
    'soft-comunicacao': 4,
  });
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<'ALL' | 'HARD' | 'SOFT'>('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [skills, cands] = await Promise.all([
        api.listSkills(),
        api.listCandidates(),
      ]);
      setSkillsCatalog(skills);
      setCandidates(cands);
    } catch (err: any) {
      setErrorMessage(`Erro ao carregar dados: ${err.message}`);
    }
  };

  const handleToggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => {
      const copy = { ...prev };
      if (copy[skillId] !== undefined) {
        delete copy[skillId];
      } else {
        copy[skillId] = 3; // Default level: 3 (Intermediário)
      }
      return copy;
    });
  };

  const handleLevelChange = (skillId: string, level: number) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!consentGranted) {
      setErrorMessage('O consentimento para tratamento de dados sob a LGPD é obrigatório.');
      return;
    }

    setSubmitting(true);
    try {
      const declared_skills = Object.entries(selectedSkills).map(([skill_id, declared_level]) => ({
        skill_id,
        declared_level,
      }));

      const payload = {
        name,
        email,
        tech_area: techArea,
        declared_seniority: seniority,
        years_of_experience: Number(experienceYears),
        contract_preference: contractPref,
        work_model_preference: workModelPref,
        salary_expectation: salaryExpectation ? Number(salaryExpectation) : null,
        bio_summary: bio,
        declared_skills,
        consent: {
          purpose: 'Mapeamento de competências e matching de oportunidades',
          legal_basis: 'CONSENTIMENTO_LGPD',
          granted: true,
        },
      };

      await api.createCandidate(payload);
      setSuccessMessage('Candidato cadastrado com sucesso!');
      setName('');
      setEmail('');
      setBio('');
      await loadData();
      setActiveTab('list');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCatalog = skillsCatalog.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (s.area && s.area.toLowerCase().includes(catalogSearch.toLowerCase()));
    const matchesCat = catalogCategory === 'ALL' || s.category === catalogCategory;
    return matchesSearch && matchesCat;
  });

  const levelLabels: Record<number, string> = {
    1: '1 - Básico',
    2: '2 - Inicial / Intermediário',
    3: '3 - Intermediário',
    4: '4 - Avançado',
    5: '5 - Especialista',
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Cadastro de Candidato</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Autodeclaração de perfil, histórico profissional e competências técnicas e comportamentais.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('form')}
          >
            <UserPlus size={16} /> Novo Cadastro
          </button>
          <button
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('list')}
          >
            Candidatos Cadastrados ({candidates.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '10px', color: '#34D399', marginBottom: '1.5rem' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '10px', color: '#F87171', marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            {/* Column 1: Personal Info */}
            <Card title="Informações Pessoais & Profissionais">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Lucas Ferreira Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="lucas.silva@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Área Tecnológica *</label>
                  <select
                    className="form-select"
                    value={techArea}
                    onChange={(e) => setTechArea(e.target.value)}
                  >
                    <option value="Engenharia de Software">Engenharia de Software</option>
                    <option value="Engenharia de Dados">Engenharia de Dados</option>
                    <option value="Ciência de Dados & IA">Ciência de Dados & IA</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Senioridade Declarada *</label>
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
                  <label className="form-label">Tempo de Experiência (anos) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    className="form-input"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pretensão Salarial Mensal (R$)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="12000"
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Preferencia Contratação</label>
                  <select
                    className="form-select"
                    value={contractPref}
                    onChange={(e) => setContractPref(e.target.value)}
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
                    value={workModelPref}
                    onChange={(e) => setWorkModelPref(e.target.value)}
                  >
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="INDIFERENTE">Indiferente</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Resumo Profissional / Bio</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Breve descrição da sua trajetória, projetos principais e objetivos profissionais..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-muted)', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                  />
                  <span>
                    Concordo com o tratamento dos dados e áudios para fins de triagem técnica e correspondência de vagas,
                    conforme as diretrizes da LGPD (Lei Geral de Proteção de Dados).
                  </span>
                </label>
              </div>
            </Card>

            {/* Column 2: Skills Catalog Selection */}
            <Card
              title="Competências Autodeclaradas"
              subtitle="Selecione as hard e soft skills do catálogo e defina o nível autodeclarado (1 a 5)"
              badge={<Badge status="HARD" label={`${Object.keys(selectedSkills).length} Selecionadas`} />}
            >
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                    placeholder="Buscar competência (Python, SQL, React, etc.)..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                  />
                </div>
                <select
                  className="form-select"
                  style={{ width: '130px' }}
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value as any)}
                >
                  <option value="ALL">Todas</option>
                  <option value="HARD">Hard Skills</option>
                  <option value="SOFT">Soft Skills</option>
                </select>
              </div>

              {/* Skills List with Level Selectors */}
              <div style={{ maxHeight: '460px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '0.25rem' }}>
                {filteredCatalog.map((sk) => {
                  const isSelected = selectedSkills[sk.id] !== undefined;
                  const currentLevel = selectedSkills[sk.id] || 3;

                  return (
                    <div
                      key={sk.id}
                      style={{
                        padding: '0.75rem',
                        background: isSelected ? 'rgba(0, 232, 198, 0.05)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid rgba(0, 232, 198, 0.3)' : '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSkill(sk.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{sk.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                              {sk.area}
                            </span>
                          </div>
                        </div>
                        <Badge status={sk.category} label={sk.category} size="sm" />
                      </div>

                      {isSelected && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1.5rem', paddingTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Nível Autodeclarado:
                          </span>
                          <select
                            className="form-select"
                            style={{ width: '220px', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                            value={currentLevel}
                            onChange={(e) => handleLevelChange(sk.id, parseInt(e.target.value))}
                          >
                            <option value={1}>{levelLabels[1]}</option>
                            <option value={2}>{levelLabels[2]}</option>
                            <option value={3}>{levelLabels[3]}</option>
                            <option value={4}>{levelLabels[4]}</option>
                            <option value={5}>{levelLabels[5]}</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Finalizar Cadastro do Candidato'}
            </button>
          </div>
        </form>
      ) : (
        /* Candidates Table View */
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Área & Senioridade</th>
                <th>Experiência</th>
                <th>Preferências</th>
                <th>Competências Declaradas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => (
                <tr key={cand.id}>
                  <td>
                    <strong>{cand.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cand.email}</div>
                  </td>
                  <td>
                    {cand.tech_area}
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{cand.declared_seniority}</div>
                  </td>
                  <td>{cand.years_of_experience} anos</td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{cand.contract_preference} • {cand.work_model_preference}</span>
                    {cand.salary_expectation && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        R$ {cand.salary_expectation.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '300px' }}>
                      {cand.declared_skills.slice(0, 4).map((sk) => (
                        <span key={sk.skill_id} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          {sk.skill_id.replace('hard-', '').replace('soft-', '')} ({sk.declared_level})
                        </span>
                      ))}
                      {cand.declared_skills.length > 4 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          +{cand.declared_skills.length - 4} mais
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => alert(`ID do Candidato: ${cand.id}\nCadastrado em: ${cand.created_at}`)}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
