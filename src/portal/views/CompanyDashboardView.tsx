import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Seniority, WorkContractType, WorkModality } from '../types';
import {
  Building2,
  Zap,
  ArrowRight,
  Plus,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  GitCompare
} from 'lucide-react';
import { api } from '../../services/api';
import { Job, Company as ApiCompany } from '../../types';

interface CompanyDashboardViewProps {
  onSelectVacancy: (vacancyId: string) => void;
  onOpenMatchingIa?: (jobId?: string) => void;
  onOpenComparison?: (jobId?: string) => void;
}

export const CompanyDashboardView: React.FC<CompanyDashboardViewProps> = ({
  onSelectVacancy,
  onOpenMatchingIa,
  onOpenComparison
}) => {
  const {
    currentCompany,
    currentUser,
    vacancies,
    selectionProcesses,
    companyCredits,
    companyInvoices,
    commercialConfig,
    createVacancy,
    buyCompanyCreditPackage
  } = useApp();

  const [showNewVacancyModal, setShowNewVacancyModal] = useState(false);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Full-Stack / Cloud');
  const [seniority, setSeniority] = useState<Seniority>('Pleno');
  const [modality, setModality] = useState<WorkModality>('Remoto');
  const [location, setLocation] = useState('São Paulo/SP (ou Remoto)');
  const [salaryMin, setSalaryMin] = useState<string>('10000');
  const [salaryMax, setSalaryMax] = useState<string>('14000');
  const [mandatorySkillsInput, setMandatorySkillsInput] = useState('React, TypeScript, Python, AWS');
  const [softSkillsInput, setSoftSkillsInput] = useState('Comunicação, Resolução de problemas, Adaptabilidade');
  const [description, setDescription] = useState('Atuação em squad ágil construindo microsserviços e interfaces escaláveis.');
  const [isUrgentMatchExpress, setIsUrgentMatchExpress] = useState(true);
  const [formError, setFormError] = useState('');
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [isSavingVacancy, setIsSavingVacancy] = useState(false);

  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [apiCompanies, setApiCompanies] = useState<ApiCompany[]>([]);

  useEffect(() => {
    Promise.all([
      api.listJobs().catch(() => []),
      api.listCompanies().catch(() => [])
    ]).then(([jbs, comps]) => {
      setApiJobs(jbs);
      setApiCompanies(comps);
    });
  }, []);

  const myCompanyVacancies = vacancies.filter(v => v.companyId === currentCompany.id);
  const isNewCompanyWithoutVacancies = myCompanyVacancies.length === 0;

  const approvedCount = selectionProcesses.filter(p => p.currentStage === 'aprovado').length;
  const activeProcessesCount = selectionProcesses.filter(p => p.currentStage !== 'recusado' && p.currentStage !== 'aprovado').length;
  const optInAcceptedCount = selectionProcesses.filter(p => p.doubleOptInStatus === 'aceito').length;

  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Informe o título da vaga.');
      return;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!min || !max || min <= 0 || max < min) {
      setFormError('Transparência Salarial Obrigatória: informe uma faixa salarial mínima e máxima válida.');
      return;
    }

    const mandatory = mandatorySkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const softs = softSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    setIsSavingVacancy(true);
    setFormError('');

    createVacancy({
      title: title.trim(),
      area,
      seniority,
      mandatorySkills: mandatory.length ? mandatory : ['React', 'TypeScript'],
      desirableSkills: ['Docker', 'CI/CD'],
      softSkills: softs.length ? softs : ['Comunicação'],
      contractTypes: ['CLT', 'PJ'] as WorkContractType[],
      modality,
      location,
      salaryMin: min,
      salaryMax: max,
      description,
      conditions: 'Plano de Saúde, Bônus Anual, Auxílio Home Office.',
      isUrgentMatchExpress
    });

    // Mapeamento dinâmico e coerente de competências para o Motor de IA (SQLite)
    const dynamicBackendSkills = [
      ...(mandatory.length ? mandatory : ['React', 'TypeScript']).map((sk) => ({
        skill_id: `hard-${sk.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        is_mandatory: true,
        min_level: seniority === 'Sênior' ? 4 : seniority === 'Pleno' ? 3 : 2,
        weight: 2.0
      })),
      ...(softs.length ? softs : ['Comunicação']).map((sk) => ({
        skill_id: `soft-${sk.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        is_mandatory: false,
        min_level: 3,
        weight: 1.0
      }))
    ];

    try {
      let targetCompId = apiCompanies[0]?.id;
      if (!targetCompId) {
        const createdComp = await api.createCompany({
          name: currentCompany.name,
          industry: 'Tecnologia',
          description: currentCompany.about
        });
        targetCompId = createdComp.id;
      }
      await api.createJob({
        company_id: targetCompId,
        title: title.trim(),
        description,
        tech_vertical: area,
        seniority,
        contract_type: 'CLT',
        work_model: modality.toUpperCase() === 'REMOTO' ? 'REMOTO' : 'HIBRIDO',
        min_salary: min,
        max_salary: max,
        min_experience_years: seniority === 'Sênior' ? 5.0 : seniority === 'Pleno' ? 3.0 : 1.0,
        skills: dynamicBackendSkills
      });
      const updatedJobs = await api.listJobs();
      setApiJobs(updatedJobs);
      setApiNotice(`Vaga "${title.trim()}" publicada e sincronizada com o Motor de Matching IA (SQLite)!`);
    } catch {
      setApiNotice(`Vaga "${title.trim()}" publicada com sucesso!`);
    } finally {
      setIsSavingVacancy(false);
      setTitle('');
      setFormError('');
      setShowNewVacancyModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO CORPORATIVO */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-lg text-foreground">{currentCompany.name}</h2>
              <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                CNPJ: {currentCompany.cnpj}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Conta Corporativa B2B Ativa
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentUser?.email ? `${currentUser.email} • ` : ''}Gestão de vagas, Shortlist com Double Opt-In, Motor de Matching 5 Etapas e Faturamento NFS-e
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenMatchingIa && (
              <button
                onClick={() => onOpenMatchingIa()}
                className="px-3.5 py-2 bg-secondary text-primary hover:opacity-90 text-xs font-bold rounded-base flex items-center gap-1.5 border border-primary/20"
              >
                <Target className="w-4 h-4" /> Ranking IA (5 Etapas)
              </button>
            )}
            {onOpenComparison && (
              <button
                onClick={() => onOpenComparison()}
                className="px-3.5 py-2 bg-secondary text-primary hover:opacity-90 text-xs font-bold rounded-base flex items-center gap-1.5 border border-primary/20"
              >
                <GitCompare className="w-4 h-4" /> Comparar Lado a Lado
              </button>
            )}
            <button
              onClick={() => setShowNewVacancyModal(true)}
              className="px-4 py-2 bg-brandOrange hover:opacity-95 text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" /> Publicar Nova Vaga
            </button>
          </div>
        </div>
      </div>

      {apiNotice && (
        <div className="p-3.5 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {apiNotice}
          </span>
          <button onClick={() => setApiNotice(null)} className="text-emerald-800 hover:underline">Fechar</button>
        </div>
      )}

      {/* CTA DE PÓS-CADASTRO PARA PUBLICAR A PRIMEIRA VAGA */}
      {isNewCompanyWithoutVacancies && (
        <div className="bg-brandNavy text-white p-5 rounded-base border border-brandOrange/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brandOrange bg-white/10 px-2.5 py-0.5 rounded">
              <Zap className="w-3.5 h-3.5" /> Conta Corporativa Criada com Sucesso
            </span>
            <h3 className="font-heading font-bold text-base text-white">
              Comece agora: publique sua primeira vaga na Q.I. Tech
            </h3>
            <p className="text-xs text-brandNavySub max-w-2xl leading-relaxed">
              Publique sua primeira vaga com transparência salarial e ative o <strong>Match Express</strong> para receber a shortlist automática e desbloquear o <strong>1º candidato confirmado gratuitamente</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewVacancyModal(true)}
            className="px-4 py-2.5 bg-brandOrange hover:opacity-95 text-white text-xs font-bold rounded-base flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Publicar Minha Primeira Vaga
          </button>
        </div>
      )}

      {/* MÉTRICAS DE RECRUTAMENTO & CRÉDITOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center">
          <span className="text-2xl font-heading font-bold text-primary">{vacancies.length + apiJobs.length}</span>
          <span className="block text-xs font-semibold text-foreground mt-1">Vagas no Ecossistema</span>
          <span className="text-[10px] text-muted-foreground">
            {vacancies.filter(v => v.isUrgentMatchExpress).length} em Match Express + {apiJobs.length} no Motor IA
          </span>
        </div>

        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center">
          <span className="text-2xl font-heading font-bold text-brandOrange">{optInAcceptedCount}</span>
          <span className="block text-xs font-semibold text-foreground mt-1">Double Opt-In Aceitos</span>
          <span className="text-[10px] text-muted-foreground">{activeProcessesCount} processos em andamento</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center">
          <span className="text-2xl font-heading font-bold text-emerald-700">{approvedCount}</span>
          <span className="block text-xs font-semibold text-foreground mt-1">Contratações Aprovadas</span>
          <span className="text-[10px] text-muted-foreground">Em tempo real</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-primary/30 bg-secondary/20 shadow-xs text-center">
          <span className="text-2xl font-heading font-bold text-primary">{companyCredits}</span>
          <span className="block text-xs font-bold text-foreground mt-1">Créditos de Desbloqueio</span>
          <span className="text-[10px] text-primary font-medium">1º Match Express sempre grátis</span>
        </div>
      </div>

      {/* VAGAS ATIVAS E SHORTLISTS (COM ATALHO PARA MOTOR IA) */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">Minhas Vagas, Shortlists & Motor de Matching IA</h3>
            <p className="text-xs text-muted-foreground">
              Gerencie o funil de 8 etapas com Double Opt-In ou execute a avaliação algorítmica de 5 etapas com cobertura de evidências.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {vacancies.map((vac) => {
            const processesForVacancy = selectionProcesses.filter(p => p.vacancyId === vac.id);
            const acceptedForVacancy = processesForVacancy.filter(p => p.doubleOptInStatus === 'aceito').length;

            return (
              <div 
                key={vac.id} 
                className="p-4 rounded-base bg-background border border-border hover:border-primary transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm font-bold text-foreground">{vac.title}</strong>
                    {vac.isUrgentMatchExpress ? (
                      <span className="text-[10px] bg-brandOrange/20 text-brandOrange font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Match Express (Top {commercialConfig.matchExpressTopN})
                      </span>
                    ) : (
                      <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                        Vaga Padrão
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {vac.seniority} • {vac.modality} ({vac.location}) • <strong>R$ {vac.salaryMin.toLocaleString('pt-BR')} a R$ {vac.salaryMax.toLocaleString('pt-BR')}</strong>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {vac.mandatorySkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-border text-foreground px-2 py-0.5 rounded font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div className="text-right mr-1">
                    <span className="text-xs text-foreground font-bold block">
                      {processesForVacancy.length} candidato(s)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      {acceptedForVacancy} com Double Opt-In
                    </span>
                  </div>

                  {onOpenMatchingIa && (
                    <button
                      onClick={() => onOpenMatchingIa()}
                      className="px-3 py-2 bg-secondary text-primary hover:opacity-90 text-xs font-bold rounded-base flex items-center gap-1 border border-primary/20"
                    >
                      <Target className="w-3.5 h-3.5" /> Ranking IA
                    </button>
                  )}

                  <button
                    onClick={() => onSelectVacancy(vac.id)}
                    className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1 transition-all shadow-xs"
                  >
                    Shortlist & Opt-In <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MÓDULO COMERCIAL & FINANCEIRO: PACOTES DE CRÉDITOS E EMISSÃO DE NFS-e */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Créditos de Desbloqueio & Faturamento (NFS-e)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              O 1º candidato aceito no Match Express é gratuito. Desbloqueie perfis adicionais sob demanda.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => buyCompanyCreditPackage(1, commercialConfig.singleUnlockPriceBrl, 'Crédito Avulso de Desbloqueio')}
              className="px-3 py-1.5 rounded-base border border-primary text-primary hover:bg-secondary text-xs font-bold transition-all"
            >
              +1 Crédito (R$ {commercialConfig.singleUnlockPriceBrl})
            </button>
            <button
              onClick={() => buyCompanyCreditPackage(5, commercialConfig.package5PriceBrl, 'Pacote Scale-Up (5 Desbloqueios)')}
              className="px-3.5 py-1.5 rounded-base bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-xs"
            >
              Comprar Pacote +5 Créditos (R$ {commercialConfig.package5PriceBrl})
            </button>
          </div>
        </div>

        {/* Histórico de Transações e NFS-e */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-base">
            <thead className="bg-background text-muted-foreground border-b border-border">
              <tr>
                <th className="p-2.5">Data</th>
                <th className="p-2.5">Descrição Comercial</th>
                <th className="p-2.5">Créditos</th>
                <th className="p-2.5">Valor</th>
                <th className="p-2.5">Documento Fiscal (NFS-e Nacional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companyInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-background/60">
                  <td className="p-2.5 text-muted-foreground whitespace-nowrap">
                    {new Date(inv.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-2.5 font-medium text-foreground">{inv.description}</td>
                  <td className="p-2.5 font-bold">
                    {inv.creditsAdded > 0 ? (
                      <span className="text-emerald-700">+{inv.creditsAdded}</span>
                    ) : inv.creditsAdded < 0 ? (
                      <span className="text-brandOrange">{inv.creditsAdded}</span>
                    ) : (
                      <span className="text-muted-foreground">Cortesia (0)</span>
                    )}
                  </td>
                  <td className="p-2.5 font-semibold text-foreground">
                    {inv.amountBrl > 0 ? `R$ ${inv.amountBrl.toLocaleString('pt-BR')}` : 'Grátis / Saldo'}
                  </td>
                  <td className="p-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-background border border-border px-2 py-0.5 rounded text-primary">
                      <FileText className="w-3 h-3" /> {inv.nfseNumber}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NOVA VAGA COM VALIDAÇÃO RN01 */}
      {showNewVacancyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-base border border-border max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-brandOrange" /> Publicar Nova Vaga & Acionar Match Engine
              </h3>
              <button onClick={() => setShowNewVacancyModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Título da Vaga *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Engenheiro(a) Full-Stack Sênior"
                    className="w-full h-9 px-3 bg-background border border-border rounded-base"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Vertical Técnica</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-9 px-3 bg-background border border-border rounded-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Senioridade</label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value as Seniority)}
                    className="w-full h-9 px-2 bg-background border border-border rounded-base"
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Modalidade</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as WorkModality)}
                    className="w-full h-9 px-2 bg-background border border-border rounded-base"
                  >
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Localização</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-9 px-2 bg-background border border-border rounded-base"
                  />
                </div>
              </div>

              <div className="p-3 bg-secondary/40 border border-border rounded-base space-y-2">
                <span className="font-bold text-primary block text-[11px]">
                  Faixa Salarial Transparente Obrigatória:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Salário Mínimo (R$) *</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-border rounded-base font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Salário Máximo (R$) *</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-border rounded-base font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Hard Skills Obrigatórias (separadas por vírgula)</label>
                <input
                  type="text"
                  value={mandatorySkillsInput}
                  onChange={(e) => setMandatorySkillsInput(e.target.value)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-base"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Soft Skills Avaliadas por IA (separadas por vírgula)</label>
                <input
                  type="text"
                  value={softSkillsInput}
                  onChange={(e) => setSoftSkillsInput(e.target.value)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-base"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-base bg-brandOrange/10 border border-brandOrange/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgentMatchExpress}
                  onChange={(e) => setIsUrgentMatchExpress(e.target.checked)}
                />
                <span className="font-bold text-foreground">
                  Ativar Match Express Urgente (Fila Top {commercialConfig.matchExpressTopN} com 1º candidato gratuito no Double Opt-In)
                </span>
              </label>

              {formError && (
                <div className="p-2.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-base flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewVacancyModal(false)}
                  disabled={isSavingVacancy}
                  className="px-4 py-2 rounded-base border border-border text-muted-foreground hover:bg-background disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingVacancy}
                  className="px-4 py-2 rounded-base bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
                >
                  {isSavingVacancy ? (
                    <>Publicando vaga...</>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Publicar e Sincronizar com Motor IA
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
