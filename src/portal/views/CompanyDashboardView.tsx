import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Seniority, WorkContractType, WorkModality } from '../types';
import {
  Building2,
  Zap,
  ArrowRight,
  ArrowLeft,
  Plus,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  Clock,
  ShieldCheck,
  Check
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
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);

  // Campos do formulário
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

  const pendingInvitesCount = selectionProcesses.filter(p => p.doubleOptInStatus === 'aguardando').length;
  const optInAcceptedCount = selectionProcesses.filter(p => p.doubleOptInStatus === 'aceito').length;

  const handleStep1Next = () => {
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
    setFormError('');
    setModalStep(2);
  };

  const handleStep2Next = () => {
    const mandatory = mandatorySkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    if (mandatory.length === 0) {
      setFormError('Informe pelo menos uma competência técnica obrigatória.');
      return;
    }
    setFormError('');
    setModalStep(3);
  };

  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = Number(salaryMin);
    const max = Number(salaryMax);

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
      setApiNotice(`✓ Vaga "${title.trim()}" publicada com sucesso e sincronizada com o motor de matching!`);
    } catch {
      setApiNotice(`✓ Vaga "${title.trim()}" cadastrada com sucesso!`);
    } finally {
      setIsSavingVacancy(false);
      setTitle('');
      setFormError('');
      setModalStep(1);
      setShowNewVacancyModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CABEÇALHO CORPORATIVO & AÇÃO PRINCIPAL */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-bold text-lg text-foreground">{currentCompany.name}</h1>
            <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
              CNPJ: {currentCompany.cnpj}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestão de vagas abertas com transparência salarial e recrutamento invertido.
          </p>
        </div>

        {/* AÇÃO PRINCIPAL EM DESTAQUE */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setModalStep(1);
              setShowNewVacancyModal(true);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> Criar Nova Vaga
          </button>
        </div>
      </div>

      {apiNotice && (
        <div className="p-3.5 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {apiNotice}
          </span>
          <button onClick={() => setApiNotice(null)} className="text-emerald-800 hover:underline text-xs">Fechar</button>
        </div>
      )}

      {/* 2. MÁXIMO 3 INDICADORES PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Indicador 1: Vagas Ativas */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-muted-foreground block">Vagas Ativas</span>
          <span className="text-2xl font-heading font-black text-primary block">
            {myCompanyVacancies.length}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {myCompanyVacancies.filter(v => v.isUrgentMatchExpress).length} com Match Express ativado
          </span>
        </div>

        {/* Indicador 2: Convites Aguardando Resposta */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-muted-foreground block">Convites Aguardando Resposta</span>
          <span className="text-2xl font-heading font-black text-brandOrange block">
            {pendingInvitesCount}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Candidatos avaliando compartilhamento de dados
          </span>
        </div>

        {/* Indicador 3: Compartilhamento Autorizado */}
        <div className="bg-white p-4 rounded-base border border-border shadow-xs text-center space-y-1">
          <span className="text-xs font-semibold text-muted-foreground block">Compartilhamento Autorizado</span>
          <span className="text-2xl font-heading font-black text-emerald-700 block">
            {optInAcceptedCount}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Contatos e currículos liberados para entrevista
          </span>
        </div>

      </div>

      {/* 3. LISTA DE VAGAS DA EMPRESA */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">Minhas Vagas & Shortlists</h3>
            <p className="text-xs text-muted-foreground">
              Acompanhe o funil de candidatos pré-qualificados por compatibilidade.
            </p>
          </div>
        </div>

        {myCompanyVacancies.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-background rounded-base border border-border">
            Nenhuma vaga cadastrada ainda. Clique em "Criar Nova Vaga" para começar.
          </div>
        ) : (
          <div className="space-y-3">
            {myCompanyVacancies.map((vac) => {
              const processesForVacancy = selectionProcesses.filter(p => p.vacancyId === vac.id);
              const acceptedForVacancy = processesForVacancy.filter(p => p.doubleOptInStatus === 'aceito').length;

              return (
                <div 
                  key={vac.id} 
                  className="p-4 rounded-base bg-background border border-border hover:border-primary transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-bold text-foreground">{vac.title}</strong>
                      {vac.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Match Express
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>{vac.seniority}</span>
                      <span>•</span>
                      <span>{vac.modality} ({vac.location})</span>
                      <span>•</span>
                      <strong className="text-primary">
                        R$ {vac.salaryMin.toLocaleString('pt-BR')} a R$ {vac.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {vac.mandatorySkills.slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-border text-foreground px-2 py-0.5 rounded font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-foreground font-bold block">
                        {processesForVacancy.length} talentos na shortlist
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        {acceptedForVacancy} com autorização concedida
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectVacancy(vac.id)}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1 transition-all shadow-xs"
                    >
                      Gerenciar Vaga <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. ÁREA FINANCEIRA: GESTÃO DE CRÉDITOS & NFS-e (SIMULAÇÃO ACADÊMICA) */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm text-foreground">
                Créditos de Desbloqueio & Simulação Fiscal (NFS-e)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Saldo atual: <strong className="text-primary">{companyCredits} crédito(s)</strong>. O 1º candidato do Match Express é sempre gratuito.
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
              +5 Créditos (R$ {commercialConfig.package5PriceBrl})
            </button>
          </div>
        </div>

        {/* NOTA DE ESCLARECIMENTO ACADÊMICO */}
        <div className="p-2.5 rounded-base bg-secondary/30 border border-border text-[11px] text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Aviso de Demonstração Acadêmica:</strong> As notas fiscais abaixo são emitidas de forma simulada para demonstração do fluxo B2B perante a banca avaliadora do TCC.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-base">
            <thead className="bg-background text-muted-foreground border-b border-border">
              <tr>
                <th className="p-2.5">Data</th>
                <th className="p-2.5">Descrição</th>
                <th className="p-2.5">Créditos</th>
                <th className="p-2.5">Valor</th>
                <th className="p-2.5">Documento Fiscal (Simulado)</th>
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
                      <span className="text-muted-foreground">0 (Cortesia)</span>
                    )}
                  </td>
                  <td className="p-2.5 font-semibold text-foreground">
                    {inv.amountBrl > 0 ? `R$ ${inv.amountBrl.toLocaleString('pt-BR')}` : 'Cortesia'}
                  </td>
                  <td className="p-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-background border border-border px-2 py-0.5 rounded text-primary">
                      <FileText className="w-3 h-3" /> {inv.nfseNumber} (Simulado)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO DE VAGA EM 3 ETAPAS PROGRESSIVAS (TELA E02) */}
      {showNewVacancyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-base border border-border max-w-lg w-full p-6 space-y-4 shadow-xl">
            
            {/* CABEÇALHO DO MODAL COM INDICADOR DE ETAPAS */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  Etapa {modalStep} de 3
                </span>
                <h3 className="font-heading font-bold text-base text-foreground">
                  {modalStep === 1 && 'Informações Básicas da Vaga'}
                  {modalStep === 2 && 'Requisitos e Competências'}
                  {modalStep === 3 && 'Revisão e Publicação'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVacancyModal(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ETAPA 1: INFORMAÇÕES BÁSICAS */}
            {modalStep === 1 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Título da Vaga *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Desenvolvedor(a) Full-Stack Pleno"
                    className="w-full h-9 px-3 bg-background border border-border rounded-base focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Modalidade *</label>
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
                      className="w-full h-9 px-3 bg-background border border-border rounded-base"
                    />
                  </div>
                </div>

                <div className="p-3 bg-secondary/40 border border-border rounded-base space-y-2">
                  <span className="font-bold text-primary block text-[11px]">
                    Faixa Salarial Transparente (Obrigatória):
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted-foreground mb-1">Mínimo (R$)</label>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full h-9 px-3 bg-white border border-border rounded-base font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1">Máximo (R$)</label>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full h-9 px-3 bg-white border border-border rounded-base font-bold"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-base text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleStep1Next}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center gap-1"
                  >
                    Avançar para Requisitos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2: REQUISITOS */}
            {modalStep === 2 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Senioridade Esperada *</label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value as Seniority)}
                    className="w-full h-9 px-2 bg-background border border-border rounded-base"
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Competências Técnicas Obrigatórias (separadas por vírgula) *
                  </label>
                  <input
                    type="text"
                    value={mandatorySkillsInput}
                    onChange={(e) => setMandatorySkillsInput(e.target.value)}
                    placeholder="Ex: React, TypeScript, Python"
                    className="w-full h-9 px-3 bg-background border border-border rounded-base"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Competências Comportamentais (Soft Skills)
                  </label>
                  <input
                    type="text"
                    value={softSkillsInput}
                    onChange={(e) => setSoftSkillsInput(e.target.value)}
                    placeholder="Ex: Comunicação, Trabalho em Equipe"
                    className="w-full h-9 px-3 bg-background border border-border rounded-base"
                  />
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-base text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="px-4 py-2 border border-border hover:bg-background rounded-base font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleStep2Next}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center gap-1"
                  >
                    Revisar Vaga <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3: REVISÃO & PUBLICAÇÃO */}
            {modalStep === 3 && (
              <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
                <div className="p-3 bg-background rounded-base border border-border space-y-2">
                  <div className="flex justify-between border-b border-border pb-1.5">
                    <span className="text-muted-foreground">Título:</span>
                    <strong className="text-foreground">{title}</strong>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1.5">
                    <span className="text-muted-foreground">Faixa Salarial:</span>
                    <strong className="text-primary">
                      R$ {Number(salaryMin).toLocaleString('pt-BR')} a R$ {Number(salaryMax).toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1.5">
                    <span className="text-muted-foreground">Senioridade & Modalidade:</span>
                    <span className="text-foreground font-medium">{seniority} • {modality}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Competências Avaliadas:</span>
                    <span className="text-foreground font-semibold">{mandatorySkillsInput}</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded-base bg-brandOrange/10 border border-brandOrange/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgentMatchExpress}
                    onChange={(e) => setIsUrgentMatchExpress(e.target.checked)}
                  />
                  <span className="font-bold text-foreground">
                    Ativar Match Express (1º candidato que aceitar é gratuito)
                  </span>
                </label>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(2)}
                    disabled={isSavingVacancy}
                    className="px-4 py-2 border border-border hover:bg-background rounded-base font-semibold flex items-center gap-1 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingVacancy}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {isSavingVacancy ? 'Publicando vaga...' : 'Confirmar e Publicar Vaga'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
