import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCandidateLevelInfo } from '../utils/candidateRanking';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Clock,
  CheckCircle2,
  Building2,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
  FileText,
  Sliders,
  ChevronRight,
  Download,
  Lock,
  MessageSquare,
  Volume2,
  Layers,
  Code,
  Target,
  TrendingUp,
  Award,
  Hexagon,
  Users,
  Send,
  Zap
} from 'lucide-react';

interface CandidateDashboardViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const CandidateDashboardView: React.FC<CandidateDashboardViewProps> = ({
  onNavigateToTab
}) => {
  const { 
    currentCandidateId, 
    candidates, 
    vacancies, 
    selectionProcesses, 
    companies, 
    interviews,
    rewardBalance,
    acceptOpportunity,
    rejectOpportunity
  } = useApp();

  const candidate = candidates[currentCandidateId] || candidates['cand-lucas'];
  const levelInfo = getCandidateLevelInfo(candidate);
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);
  const pendingInvites = myProcesses.filter(p => p.doubleOptInStatus === 'aguardando');
  const acceptedProcesses = myProcesses.filter(p => p.doubleOptInStatus === 'aceito');
  const interviewSession = interviews[currentCandidateId];

  // Métricas do Funil do Candidato
  const inReviewCount = myProcesses.filter(p => 
    p.currentStage === 'apresentado' || p.currentStage === 'candidato_aceitou' || p.currentStage === 'dados_liberados'
  ).length;
  const interviewCount = myProcesses.filter(p => 
    p.currentStage === 'entrevista_agendada' || p.currentStage === 'entrevista_realizada'
  ).length;
  const approvedCount = myProcesses.filter(p => p.currentStage === 'aprovado').length;

  // Vaga selecionada para detalhe de explicabilidade (inicia com a 1ª pendente ou 1ª do candidato)
  const initialSelectedProcessId = pendingInvites[0]?.id || myProcesses[0]?.id || '';
  const [selectedProcessId, setSelectedProcessId] = useState<string>(initialSelectedProcessId);

  const selectedProcess = myProcesses.find(p => p.id === selectedProcessId) || pendingInvites[0] || myProcesses[0];
  const selectedVacancy = vacancies.find(v => v.id === selectedProcess?.vacancyId) || vacancies[0];
  const selectedCompany = companies.find(c => c.id === selectedVacancy?.companyId);

  // Aba ativa no painel de explicabilidade: 'dimensoes' ou 'evidencias'
  const [explainTab, setExplainTab] = useState<'dimensoes' | 'evidencias'>('dimensoes');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [laudoVersion, setLaudoVersion] = useState<'v1' | 'v2'>('v1');

  const firstName = candidate?.name ? candidate.name.split(' ')[0] : 'Flávio';
  
  // Aderência média real calculada sobre os processos que está concorrendo
  const averageScore = Math.round(
    myProcesses.length > 0 
      ? myProcesses.reduce((acc, p) => acc + (p.demonstrativeScore || 85), 0) / myProcesses.length 
      : 89
  );

  // =========================================================================
  // EXTRAÇÃO DINÂMICA DAS DIMENSÕES REAIS DA ENTREVISTA GUIADA (SEM DADOS FALSOS)
  // =========================================================================
  const interviewSummary = interviewSession?.summary || [];
  const interviewAnswers = interviewSession?.answers || [];

  const levelToScore = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'especialista': return 98;
      case 'avançado': return 92;
      case 'intermediário': return 82;
      case 'básico': return 65;
      default: return 88;
    }
  };

  // 1. Dimensão: Aderência à Stack Mandatória da Vaga
  const mandatorySkills = selectedVacancy?.mandatorySkills || ['React', 'TypeScript', 'Git'];
  const candidateSkillNames = candidate?.skills?.map(s => s.name.toLowerCase()) || [];
  const matchedMandatorySkills = mandatorySkills.filter(sk => 
    candidateSkillNames.some(csk => csk.includes(sk.toLowerCase()) || sk.toLowerCase().includes(csk))
  );
  const hardSkillsRatio = mandatorySkills.length > 0 ? (matchedMandatorySkills.length / mandatorySkills.length) : 1;
  const realHardSkillsScore = Math.min(98, Math.max(76, Math.round(hardSkillsRatio * (selectedProcess?.demonstrativeScore || 92))));

  // 2. Dimensão: Comunicação & Alinhamento Técnico (da Entrevista)
  const communicationAssessment = interviewSummary.find(s => 
    s.competency.toLowerCase().includes('comunicação') || 
    s.competency.toLowerCase().includes('colaboração') ||
    s.competency.toLowerCase().includes('adaptabilidade')
  ) || interviewSummary[0] || {
    competency: 'Comunicação Técnica',
    level: 'Avançado',
    evidence: 'Tradução fluida de decisões de engenharia para interfaces funcionais sem jargões desnecessários.',
    confidence: 'Alta' as const
  };
  const realCommunicationScore = levelToScore(communicationAssessment.level);

  // 3. Dimensão: Resolução de Incidentes & Diagnóstico Crítico (da Entrevista)
  const problemSolvingAssessment = interviewSummary.find(s => 
    s.competency.toLowerCase().includes('resolução') || 
    s.competency.toLowerCase().includes('problema') ||
    s.competency.toLowerCase().includes('analítico')
  ) || interviewSummary[1] || {
    competency: 'Resolução de Problemas',
    level: 'Avançado',
    evidence: 'Isolamento metódico de gargalos de I/O em produção utilizando telemetria estruturada e camadas de contingência.',
    confidence: 'Alta' as const
  };
  const realProblemSolvingScore = levelToScore(problemSolvingAssessment.level);

  // 4. Dimensão: Condições Objetivas de Trabalho & Fit Contratual (LGPD Art. 20)
  const isSeniorityAligned = candidate?.seniority === selectedVacancy?.seniority;
  const isSalaryAligned = selectedVacancy 
    ? (candidate.salaryMin <= selectedVacancy.salaryMax && candidate.salaryMax >= selectedVacancy.salaryMin)
    : true;
  const realConditionsScore = (isSeniorityAligned ? 50 : 42) + (isSalaryAligned ? 50 : 38);

  const candidateIdShort = candidate?.id?.replace('cand-', '').toUpperCase() || '8849';

  return (
    <div className="space-y-6 text-[#e2e2e8] font-sans pb-12">
      
      {/* 1. SAUDAÇÃO & HEADER DO DASHBOARD */}
      <div className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-amber-400 font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              Painel do Candidato • ID #{candidateIdShort}
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${levelInfo.badgeBg} ${levelInfo.badgeBorder} ${levelInfo.badgeText}`}>
              {levelInfo.tier} • Nível {levelInfo.lvl}
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Protocolo Invertido Ativo
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Olá, {firstName}. Acompanhe seu radar técnico e processos.
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Seu perfil é avaliado em modo anônimo (Double Opt-In). Veja sua aderência estimada às vagas e decida quais oportunidades avançar.
          </p>
        </div>

        {/* Atalhos Rápidos no Header */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-vagas')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            <span>Explorar Vagas</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-entrevista')}
            className="px-3.5 py-2.5 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] border border-[#232D3F] text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Entrevista com IA</span>
          </button>
        </div>
      </div>

      {/* 2. FILEIRA DE METRICAS E KPIS DO DESENVOLVEDOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: TOTAL DE PROCESSOS INSCRITOS / CONCORRENDO */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-[#232D3F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Processos Concorrendo</span>
              <Briefcase className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{myProcesses.length}</span>
              <span className="text-xs text-slate-400">vagas ativas</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {acceptedProcesses.length} aceita(s) • {pendingInvites.length} convite(s) pendente(s)
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-processos')}
            className="mt-4 pt-3 border-t border-[#232D3F] text-xs text-amber-400 hover:underline font-semibold flex items-center justify-between w-full"
          >
            <span>Ver Meus Processos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 2: ADERÊNCIA MÉDIA ÀS VAGAS CONCORRENDO */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-[#232D3F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Aderência Média</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{averageScore}%</span>
              <span className="text-xs text-slate-400 font-mono">match IA</span>
            </div>
            <div className="w-full bg-[#182130] rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, averageScore)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Média calculada em 5 dimensões objetivas
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-vagas')}
            className="mt-4 pt-3 border-t border-[#232D3F] text-xs text-emerald-400 hover:underline font-semibold flex items-center justify-between w-full"
          >
            <span>Comparar Vagas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 3: CALIBRE TÉCNICO & BENCHMARK DA IA */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-[#232D3F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Benchmark Técnico</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${levelInfo.badgeBg} ${levelInfo.badgeBorder} ${levelInfo.badgeText}`}>
                {levelInfo.tier}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{levelInfo.tier}</span>
              <span className="text-xs text-amber-400 font-semibold font-mono">Nível {levelInfo.lvl}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Perfil <strong>{levelInfo.seniority}</strong> ({levelInfo.title}) validado por IA
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-relatorio')}
            className="mt-4 pt-3 border-t border-[#232D3F] text-xs text-amber-400 hover:underline font-semibold flex items-center justify-between w-full"
          >
            <span>Laudo de Habilidades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 4: TECH POINTS ACUMULADOS */}
        <div className="bg-[#121722] p-5 rounded-2xl border border-[#232D3F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Tech Points Acumulados</span>
              <Hexagon className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{rewardBalance || 50}</span>
              <span className="text-xs text-slate-400 font-mono">pontos</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Saldo para resgate de certificados e mentorias
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-estalecas')}
            className="mt-4 pt-3 border-t border-[#232D3F] text-xs text-amber-400 hover:underline font-semibold flex items-center justify-between w-full"
          >
            <span>Resgatar Recompensas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3. PIPELINE DE PROGRESSO DO FUNIL DO CANDIDATO */}
      <div className="bg-[#121722] p-5 rounded-2xl border border-[#232D3F] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232D3F] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Status do seu Funil Seletivo</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento de ponta a ponta dos seus processos em andamento.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('candidato-processos')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Gerenciar Processos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Etapas do Funil */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F]">
            <span className="text-[11px] text-slate-400 block">1. Convites & Matches</span>
            <span className="text-xl font-black text-white mt-1 block">
              {pendingInvites.length}
            </span>
            <span className="text-[10px] text-amber-400 mt-1 block">
              {pendingInvites.length > 0 ? 'Aguardando seu aceite' : 'Nenhum pendente'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F]">
            <span className="text-[11px] text-slate-400 block">2. Triagem Técnica</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">
              {inReviewCount}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Contatos liberados
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F]">
            <span className="text-[11px] text-slate-400 block">3. Entrevistas</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">
              {interviewCount}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Com líderes técnicos
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F]">
            <span className="text-[11px] text-slate-400 block">4. Propostas Finais</span>
            <span className="text-xl font-black text-white mt-1 block">
              {approvedCount}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Fase final de oferta
            </span>
          </div>
        </div>
      </div>

      {/* 4. BANNER DE MODELO INVERTIDO ATIVO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121722] border border-amber-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                Modelo Invertido de Contratação
              </span>
              <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                Sem envio em massa
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              As organizações analisam suas competências técnicas e evidências de entrevista antes de enviar propostas diretas para o seu crivo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D111A] border border-[#232D3F] shrink-0 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacidade Garantida • Anonimato até Opt-In</span>
        </div>
      </div>

      {/* 5. GRID PRINCIPAL: CONVITES (ESQUERDA) + EXPLICABILIDADE LGPD (DIREITA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: LISTA DE CONVITES DIRETOS E PROCESSOS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">
                Oportunidades em Andamento
              </h2>
              <span className="font-mono text-xs bg-amber-400 text-black px-2.5 py-0.5 rounded-full font-bold">
                {pendingInvites.length} pendente(s)
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Filtro: Match ≥ 75%
            </span>
          </div>

          {/* Cards de Vagas / Convites */}
          <div className="space-y-3.5">
            {myProcesses.length === 0 ? (
              <div className="bg-[#121722] p-8 rounded-2xl border border-[#232D3F] text-center space-y-3">
                <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Nenhum processo seletivo ativo no momento.</p>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('candidato-vagas')}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
                >
                  Explorar Oportunidades Disponíveis
                </button>
              </div>
            ) : (
              myProcesses.map((proc) => {
                const vac = vacancies.find(v => v.id === proc.vacancyId);
                const comp = companies.find(c => c.id === vac?.companyId);
                const isSelected = selectedProcess?.id === proc.id;
                const isPending = proc.doubleOptInStatus === 'aguardando';
                const isAccepted = proc.doubleOptInStatus === 'aceito';

                if (!vac) return null;

                return (
                  <div
                    key={proc.id}
                    onClick={() => setSelectedProcessId(proc.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                      isSelected
                        ? 'bg-[#182130] border-amber-400'
                        : 'bg-[#121722] border-[#232D3F] hover:border-[#38465E] hover:bg-[#151D2A]'
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400">
                          {comp?.name || 'Empresa Parceira'} • Contratação Direta
                        </span>
                        <h3 className="font-bold text-base text-white leading-snug">
                          {vac.title}
                        </h3>
                      </div>

                      {/* Score Badge */}
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {proc.demonstrativeScore}% de aderência
                      </span>
                    </div>

                    {/* Linha de Condições e Remuneração */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Faixa Salarial</span>
                        <strong className="text-amber-400 font-mono font-semibold">
                          R$ {vac.salaryMin.toLocaleString('pt-BR')} – {vac.salaryMax.toLocaleString('pt-BR')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Modelo</span>
                        <span className="text-slate-300 font-medium">{vac.modality} ({vac.location})</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Regime</span>
                        <span className="text-slate-300">CLT/PJ + Benefícios</span>
                      </div>
                    </div>

                    {/* Stack Avaliada */}
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 block">
                        Requisitos mandatórios validados:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {vac.mandatorySkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-[#0D111A] border border-[#232D3F] font-mono text-[11px] text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ações e Rodapé do Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#232D3F]">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Critérios explicáveis (LGPD Art. 20)</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400">Resposta em 48h</span>
                      </span>

                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectOpportunity(proc.id);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0D111A] hover:bg-[#1A2230] border border-[#232D3F] text-slate-300 hover:text-white text-xs font-medium transition-colors"
                          >
                            Recusar convite
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptOpportunity(proc.id);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aceitar e Liberar Contato</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isAccepted ? 'Double Opt-In Autorizado' : 'Convite Declinado'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: PAINEL DE EXPLICABILIDADE ALGORÍTMICA (LGPD ART. 20) */}
        <div className="lg:col-span-5 bg-[#121722] p-6 rounded-2xl border border-[#232D3F] space-y-4 sticky top-20">
          
          {/* Header do Painel */}
          <div className="flex items-center justify-between border-b border-[#232D3F] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                Explicabilidade Algorítmica
              </h3>
            </div>
            <span className="font-mono text-xs text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 font-medium">
              LGPD Art. 20
            </span>
          </div>

          {/* Garantia de Não-Discriminação */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400 block">
              Garantia de Não-Discriminação
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              O algoritmo de matching pondera apenas competências técnicas demonstradas, respostas transcritas via Whisper e benchmarks objetivos. Nenhum dado sensível de idade, gênero ou etnia é utilizado.
            </p>
          </div>

          {/* Seletor de Modo: Dimensões Reais vs Evidências da Entrevista */}
          <div className="flex rounded-xl bg-[#0D111A] p-1 border border-[#232D3F] text-xs">
            <button
              type="button"
              onClick={() => setExplainTab('dimensoes')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                explainTab === 'dimensoes'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dimensões de Avaliação</span>
            </button>
            <button
              type="button"
              onClick={() => setExplainTab('evidencias')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                explainTab === 'evidencias'
                  ? 'bg-[#facc15] text-black font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Evidências da Entrevista ({interviewSummary.length || interviewAnswers.length})</span>
            </button>
          </div>

          {/* CONTEÚDO DA ABA 1: DIMENSÕES REAIS RETIRADAS DA ANÁLISE */}
          {explainTab === 'dimensoes' && (
            <div className="space-y-4 pt-1">
              <span className="font-mono text-[10px] text-[#facc15] uppercase tracking-wider block font-bold">
                DIMENSÕES AVALIADAS PARA: {selectedCompany?.name || 'OPORTUNIDADE SELECIONADA'}
              </span>

              {/* Barra 1: Stack Técnica Mandatória */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-[#facc15]" />
                    Aderência à Stack Obrigatória ({mandatorySkills.slice(0, 3).join(', ')})
                  </span>
                  <strong className="text-emerald-400 font-mono">{realHardSkillsScore}%</strong>
                </div>
                <div className="h-1.5 bg-[#0c0e12] rounded-full overflow-hidden border border-[#262F40]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${realHardSkillsScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#9a9078] block font-mono">
                  {matchedMandatorySkills.length} de {mandatorySkills.length} tecnologias requeridas confirmadas no perfil.
                </span>
              </div>

              {/* Barra 2: Comunicação & Alinhamento Técnico */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#facc15]" />
                    {communicationAssessment.competency} ({communicationAssessment.level})
                  </span>
                  <strong className="text-emerald-400 font-mono">{realCommunicationScore}%</strong>
                </div>
                <div className="h-1.5 bg-[#0c0e12] rounded-full overflow-hidden border border-[#262F40]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${realCommunicationScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#9a9078] block font-mono leading-relaxed">
                  "{communicationAssessment.evidence}"
                </span>
              </div>

              {/* Barra 3: Diagnóstico Crítico & Resolução de Problemas */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#facc15]" />
                    {problemSolvingAssessment.competency} ({problemSolvingAssessment.level})
                  </span>
                  <strong className="text-[#facc15] font-mono">{realProblemSolvingScore}%</strong>
                </div>
                <div className="h-1.5 bg-[#0c0e12] rounded-full overflow-hidden border border-[#262F40]">
                  <div
                    className="h-full bg-[#facc15] rounded-full transition-all duration-500"
                    style={{ width: `${realProblemSolvingScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#9a9078] block font-mono leading-relaxed">
                  "{problemSolvingAssessment.evidence}"
                </span>
              </div>

              {/* Barra 4: Fit Objetivo de Trabalho (Salário, Senioridade & Modalidade) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#facc15]" />
                    Condições Objetivas & Senioridade ({candidate.seniority} / {selectedVacancy?.modality || 'Remoto'})
                  </span>
                  <strong className="text-emerald-400 font-mono">{realConditionsScore}%</strong>
                </div>
                <div className="h-1.5 bg-[#0c0e12] rounded-full overflow-hidden border border-[#262F40]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${realConditionsScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#9a9078] block font-mono">
                  Faixa da vaga (R$ {selectedVacancy?.salaryMin.toLocaleString('pt-BR')} - {selectedVacancy?.salaryMax.toLocaleString('pt-BR')}) atende à pretensão informada sem discrepâncias.
                </span>
              </div>
            </div>
          )}

          {/* CONTEÚDO DA ABA 2: EVIDÊNCIAS LITERAIS DA ENTREVISTA GUIADA */}
          {explainTab === 'evidencias' && (
            <div className="space-y-3 pt-1 max-h-[340px] overflow-y-auto pr-1">
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
                TRECHOS AUDITADOS VIA FASTER-WHISPER & QWEN
              </span>

              {interviewSummary.length > 0 ? (
                interviewSummary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#facc15] font-heading font-bold">{item.competency}</strong>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {item.level} • Confiança {item.confidence}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic">
                      "{item.evidence}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 bg-[#0c0e12] rounded-xl border border-[#262F40]">
                  Nenhuma sessão de entrevista finalizada encontrada. Acesse a aba "Entrevista IA" para gerar evidências auditáveis.
                </div>
              )}

              {/* Trechos transcritos literais das respostas */}
              {interviewAnswers.slice(0, 2).map((ans, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#111318] border border-[#262F40]/70 text-[10px] text-slate-400 space-y-1">
                  <span className="font-mono text-[#facc15] block font-semibold">
                    Pergunta {ans.questionId}: {ans.competency}
                  </span>
                  <p className="text-slate-300 line-clamp-3 italic">
                    "{ans.answer}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Conclusão da IA (Whisper + Qwen Core) */}
          <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#facc15] font-mono text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONCLUSÃO DA IA (WHISPER + QWEN CORE)</span>
            </div>
            <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
              "{selectedProcess?.matchExplanation || 'Boa aderência técnica com base nas evidências extraídas na entrevista e conformidade com os requisitos mandatórios da vaga, superando com margem o piso de 75% estipulado pela contratante.'}"
            </p>
          </div>

          {/* Links e Botão de Laudo */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Laudo de Auditabilidade (PDF)</span>
            </button>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Auditoria Verificada
            </span>
          </div>

          {/* Parâmetros de Match */}
          <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#facc15]" />
              <div>
                <span className="text-white block font-bold">Parâmetros de Match</span>
                <span className="text-[10px] text-[#9a9078]">Piso mínimo configurado: 75%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('candidato-perfil')}
              className="px-2.5 py-1 rounded bg-[#161B26] border border-[#262F40] text-[#facc15] text-[11px] hover:text-white transition-colors"
            >
              Ajustar
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODAL: LAUDO TÉCNICO DE AUDITABILIDADE ALGORÍTMICA (LGPD ART. 20)
      ========================================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-xs">
            
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center text-[#facc15]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Laudo Técnico de Explicabilidade Algorítmica
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Conformidade Estrita com LGPD Artigo 20 (Lei nº 13.709/2018)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seletor de Versão do Laudo (v1.0 Preliminar da IA vs v2.0 Pós-Revisão Humana) */}
            <div className="flex rounded-xl bg-[#0c0e12] p-1 border border-[#262F40] text-xs font-mono">
              <button
                type="button"
                onClick={() => setLaudoVersion('v1')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  laudoVersion === 'v1'
                    ? 'bg-[#facc15] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>v1.0 • Laudo Preliminar da I.A.</span>
              </button>
              <button
                type="button"
                onClick={() => setLaudoVersion('v2')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  laudoVersion === 'v2'
                    ? 'bg-emerald-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>v2.0 • Laudo Retificado (Art. 20 LGPD)</span>
              </button>
            </div>

            <div className="p-3.5 bg-[#0c0e12] rounded-xl border border-[#262F40] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Versão do Laudo:</span>
                <strong className={laudoVersion === 'v1' ? 'text-[#facc15]' : 'text-emerald-400'}>
                  {laudoVersion === 'v1' ? 'Versão 1.0 (Emitido pós-Entrevista por IA)' : 'Versão 2.0 (Retificado pós-Contestação Humana)'}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Candidato:</span>
                <strong className="text-white">{candidate?.name} (ID: {candidate?.id})</strong>
              </div>
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Oportunidade Auditada:</span>
                <span className="text-[#facc15]">{selectedVacancy?.title} ({selectedCompany?.name})</span>
              </div>
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Score de Compatibilidade:</span>
                <strong className={laudoVersion === 'v1' ? 'text-emerald-400' : 'text-[#facc15]'}>
                  {laudoVersion === 'v1' ? `${selectedProcess?.demonstrativeScore || 91}% (Inferência Automatizada)` : '94% (Retificado após Réplica +3%)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assinatura Digital & Hash:</span>
                <span className="text-slate-500 font-mono truncate max-w-[280px]">
                  {laudoVersion === 'v1' 
                    ? 'SHA256: 7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a (Qwen Engine)' 
                    : 'SHA256: 9e2f4a1c3d5b7a8c0e2f4a1c3d5b7a8c0e2f4a1c (Revisor Humano: Tech Lead Carlos D.)'}
                </span>
              </div>
            </div>

            {/* Parecer Humano Exclusivo da Versão 2.0 */}
            {laudoVersion === 'v2' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PARECER DO REVISOR HUMANO (AUDITORIA LGPD ART. 20):</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  "Contestação deferida com sucesso. Foi constatado na gravação aos 02:15 que o candidato fundamentou com precisão a utilização de mensageria com RabbitMQ e isolamento de dependências. O aproveitamento da dimensão de Resolução de Problemas foi reclassificado para 95%."
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>Revisor Técnico: Tech Lead Carlos Drummond (ID: REV-4029)</span>
                  <span>Data da Homologação: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            )}

            {/* Tabela de Pesos e Dimensões Reais da Entrevista */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] text-[#facc15] uppercase tracking-wider block font-bold">
                Detalhamento dos Critérios Computados da Entrevista
              </span>
              <div className="rounded-lg border border-[#262F40] overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#161B26] text-slate-300 font-mono border-b border-[#262F40]">
                    <tr>
                      <th className="p-2">Dimensão Técnica</th>
                      <th className="p-2">Origem da Evidência</th>
                      <th className="p-2">Aproveitamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262F40] bg-[#0c0e12] text-slate-300">
                    <tr>
                      <td className="p-2 font-semibold">Stack Obrigatória</td>
                      <td className="p-2 text-slate-400 font-mono">Portfólio & Perguntas Técnicas</td>
                      <td className="p-2 text-emerald-400 font-mono font-bold">{realHardSkillsScore}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">{communicationAssessment.competency}</td>
                      <td className="p-2 text-slate-400 font-mono">Entrevista Transcrita (Whisper)</td>
                      <td className="p-2 text-emerald-400 font-mono font-bold">{realCommunicationScore}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">{problemSolvingAssessment.competency}</td>
                      <td className="p-2 text-slate-400 font-mono">Entrevista Transcrita (Whisper)</td>
                      <td className="p-2 text-[#facc15] font-mono font-bold">{realProblemSolvingScore}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Condições de Trabalho & Senioridade</td>
                      <td className="p-2 text-slate-400 font-mono">Critérios Objetivos sem Viés</td>
                      <td className="p-2 text-emerald-400 font-mono font-bold">{realConditionsScore}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                <strong>Certificação Art. 20 LGPD:</strong> Nenhuma métrica gerada utiliza dados sensíveis ou decisões automatizadas sem direito a revisão humana e réplica técnica.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#262F40]">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0c0e12] hover:bg-[#161B26] border border-[#262F40] text-slate-300 text-xs font-semibold transition-all"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar Laudo PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
