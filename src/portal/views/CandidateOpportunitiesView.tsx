import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  FileText,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Check,
  X,
  Clock,
  Unlock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  Filter,
  Send,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  Info,
  Eye,
  XCircle,
  MapPin,
  Calendar,
  Layers,
  Award,
  ShieldCheck
} from 'lucide-react';
import { Vacancy } from '../types';

export interface EvaluatedVacancyItem {
  vacancy: Vacancy;
  company?: any;
  process?: any;
  matchedSkills: string[];
  missingSkills: string[];
  hardScore: number;
  softScore: number;
  expScore: number;
  score: number;
  isHighMatch: boolean;
}

interface CandidateOpportunitiesViewProps {
  onNavigateToProcess: () => void;
  onNavigateToReport?: () => void;
}

export const CandidateOpportunitiesView: React.FC<CandidateOpportunitiesViewProps> = ({
  onNavigateToProcess,
  onNavigateToReport
}) => {
  const {
    currentCandidateId,
    candidates,
    vacancies,
    selectionProcesses,
    companies,
    acceptOpportunity,
    rejectOpportunity,
    applyToVacancy
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'high_match' | 'other'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Estado do Modal de Alinhamento de Competências
  const [modalVacancy, setModalVacancy] = useState<{
    vacancy: Vacancy;
    hardScore: number;
    finalScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);

  // Estado do Modal de Detalhes da Vaga (Estilo plataformas convencionais como LinkedIn/Gupy)
  const [selectedDetailVacancy, setSelectedDetailVacancy] = useState<EvaluatedVacancyItem | null>(null);

  // Estado do Modal de Confirmação de Cancelamento / Recusa (evita cliques acidentais)
  const [confirmCancelModal, setConfirmCancelModal] = useState<{
    processId: string;
    vacancyTitle: string;
    companyName: string;
    isWithdrawal: boolean;
  } | null>(null);

  const candidate = candidates[currentCandidateId] || candidates['cand-lucas'];
  const candSkills = candidate?.skills || [];

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleDirectAccept = (processId: string, vacancyTitle: string) => {
    acceptOpportunity(processId);
    showToast(`✓ Você aceitou o convite para "${vacancyTitle}". Seus contatos foram liberados com segurança.`);
  };

  const handleDirectReject = (processId: string, vacancyTitle: string) => {
    rejectOpportunity(processId);
    showToast(`Convite para "${vacancyTitle}" recusado. Sua identidade permanece anônima.`);
  };

  const handleConfirmCancellation = () => {
    if (!confirmCancelModal) return;
    const { processId, vacancyTitle, isWithdrawal } = confirmCancelModal;
    rejectOpportunity(processId);
    showToast(
      isWithdrawal
        ? `✓ Candidatura para "${vacancyTitle}" cancelada com sucesso.`
        : `✓ Convite para "${vacancyTitle}" recusado. Sua identidade permanece anônima.`
    );
    setConfirmCancelModal(null);
    if (selectedDetailVacancy?.process?.id === processId) {
      setSelectedDetailVacancy(null);
    }
  };

  // Cálculo de afinidade e separação de skills para cada vaga
  const evaluatedVacancies = useMemo(() => {
    return vacancies.map((vac) => {
      const company = companies.find(c => c.id === vac.companyId);
      const proc = selectionProcesses.find(p => p.candidateId === currentCandidateId && p.vacancyId === vac.id);

      const matchedSkills = vac.mandatorySkills.filter(req =>
        candSkills.some(cs => cs.name.toLowerCase().includes(req.toLowerCase()))
      );
      const missingSkills = vac.mandatorySkills.filter(req =>
        !candSkills.some(cs => cs.name.toLowerCase().includes(req.toLowerCase()))
      );

      const hardScore = Math.min(100, Math.max(35, Math.round((matchedSkills.length / Math.max(1, vac.mandatorySkills.length)) * 100)));
      const softScore = candidate?.interviewSummary?.length ? 90 : 82;
      const expYears = candSkills.reduce((acc, curr) => acc + (curr.years || 0), 0) / Math.max(1, candSkills.length);
      const expScore = Math.min(100, Math.max(70, Math.round(expYears >= 4 ? 95 : expYears >= 2 ? 85 : 75)));
      
      const calculatedScore = proc?.demonstrativeScore || Math.round(hardScore * 0.4 + softScore * 0.3 + expScore * 0.3);
      const isHighMatch = calculatedScore >= 75;

      return {
        vacancy: vac,
        company,
        process: proc,
        matchedSkills,
        missingSkills,
        hardScore,
        softScore,
        expScore,
        score: calculatedScore,
        isHighMatch
      };
    });
  }, [vacancies, companies, selectionProcesses, currentCandidateId, candSkills, candidate]);

  // Filtros aplicados
  const filteredVacancies = evaluatedVacancies.filter(item => {
    const matchesSearch =
      item.vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vacancy.mandatorySkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'high_match') return item.isHighMatch;
    if (filterTab === 'other') return !item.isHighMatch;
    return true;
  });

  const highMatchCount = evaluatedVacancies.filter(i => i.isHighMatch).length;
  const otherCount = evaluatedVacancies.filter(i => !i.isHighMatch).length;

  const handleOpenApplication = (item: typeof evaluatedVacancies[0]) => {
    if (item.isHighMatch && item.missingSkills.length === 0) {
      // Alta afinidade sem gaps críticos: candidata direto
      applyToVacancy(currentCandidateId, item.vacancy.id);
      showToast(`✓ Candidatura enviada com sucesso para "${item.vacancy.title}"!`);
    } else {
      // Gaps de competências: abre o modal transparente conforme solicitação do usuário
      setModalVacancy({
        vacancy: item.vacancy,
        hardScore: item.hardScore,
        finalScore: item.score,
        matchedSkills: item.matchedSkills,
        missingSkills: item.missingSkills
      });
    }
  };

  const handleConfirmModalApplication = () => {
    if (!modalVacancy) return;
    applyToVacancy(currentCandidateId, modalVacancy.vacancy.id);
    showToast(`✓ Candidatura confirmada para "${modalVacancy.vacancy.title}". Sua manifestação de interesse foi enviada!`);
    setModalVacancy(null);
  };

  return (
    <div className="space-y-6 text-[#e2e2e8] font-sans pb-12">

      {/* CABEÇALHO */}
      <div className="bg-[#111318] p-5 rounded-2xl border border-[#262F40] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono text-[10px] font-bold uppercase tracking-wider">
              Recrutamento Invertido & Mercado Aberto
            </span>
          </div>
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#facc15]" />
            <span>Oportunidades & Vagas Disponíveis</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consulte vagas compatíveis com alta recomendação da IA ou explore outras oportunidades abertas no ecossistema e submeta sua candidatura.
          </p>
        </div>

        {onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="px-3.5 py-2.5 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 shrink-0 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-[#facc15]" />
            <span>Meu Relatório de Evidências</span>
          </button>
        )}
      </div>

      {/* TOAST FEEDBACK */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-[#161B26] border border-[#facc15]/50 text-slate-100 text-xs font-medium flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#facc15] shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* BARRA DE FILTROS & BUSCA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111318] p-3 rounded-2xl border border-[#262F40]">
        {/* Abas de Categoria */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterTab === 'all'
                ? 'bg-[#282a2e] text-[#facc15] border border-[#37393e] shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1c22]'
            }`}
          >
            Todas as Vagas ({evaluatedVacancies.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('high_match')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterTab === 'high_match'
                ? 'bg-[#282a2e] text-[#facc15] border border-[#37393e] shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1c22]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
            <span>Alta Aderência ({highMatchCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('other')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filterTab === 'other'
                ? 'bg-[#282a2e] text-[#facc15] border border-[#37393e] shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1c22]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Demais Vagas do Mercado ({otherCount})</span>
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cargo, tech ou empresa..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#161B26] border border-[#262F40] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#facc15]/60 transition-colors"
          />
        </div>
      </div>

      {/* LISTA DE VAGAS */}
      <div className="space-y-4">
        {filteredVacancies.length === 0 ? (
          <div className="p-8 text-center bg-[#111318] rounded-2xl border border-[#262F40] text-xs text-slate-400">
            Nenhuma oportunidade encontrada para os filtros selecionados.
          </div>
        ) : (
          filteredVacancies.map((item) => {
            const { vacancy, company, process, matchedSkills, missingSkills, hardScore, softScore, expScore, score, isHighMatch } = item;

            const isPendingOptIn = process?.doubleOptInStatus === 'aguardando';
            const isAccepted = process?.doubleOptInStatus === 'aceito';
            const isRejected = process?.doubleOptInStatus === 'recusado';
            const isExpanded = expandedMatchId === vacancy.id;

            return (
              <div
                key={vacancy.id}
                className={`bg-[#111318] p-5 rounded-2xl border transition-all ${
                  isHighMatch
                    ? 'border-[#262F40] hover:border-[#facc15]/50 shadow-lg'
                    : 'border-[#262F40]/70 hover:border-slate-500/50'
                }`}
              >
                {/* LINHA PRINCIPAL: TÍTULO, EMPRESA E SCORE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => setSelectedDetailVacancy(item)}
                        className="font-heading font-bold text-base text-white hover:text-[#facc15] cursor-pointer transition-colors"
                        title="Clique para ver detalhes completos da vaga"
                      >
                        {vacancy.title}
                      </h3>
                      {vacancy.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-[#facc15]/15 text-[#facc15] border border-[#facc15]/30 font-bold px-2 py-0.5 rounded-full font-mono">
                          Match Express
                        </span>
                      )}
                      {isHighMatch ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full font-mono">
                          Alta Afinidade
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          Gaps de Competência
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#facc15]" /> {company?.name || 'Empresa Parceira'}
                      </span>
                      <span>•</span>
                      <span>{vacancy.modality} ({vacancy.location})</span>
                      <span>•</span>
                      <span>{vacancy.contractTypes.join('/')}</span>
                      <span>•</span>
                      <strong className="text-[#facc15] font-mono">
                        R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </p>
                  </div>

                  {/* SCORE GLOBAL EM DESTAQUE */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262F40]">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-heading font-black leading-none ${
                        isHighMatch ? 'text-[#facc15]' : 'text-amber-400'
                      }`}>
                        {score}%
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold">
                      {isHighMatch ? 'Compatibilidade' : 'Afinidade Inicial'}
                    </span>
                  </div>
                </div>

                {/* MÉTRICAS EM LINHA & COMPETÊNCIAS */}
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs border-t border-[#262F40]/60 mt-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#161B26] border border-[#262F40] text-slate-300">
                    Hard Skills: <strong className="text-white font-mono">{hardScore}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#161B26] border border-[#262F40] text-slate-300">
                    Soft Skills: <strong className="text-white font-mono">{softScore}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#161B26] border border-[#262F40] text-slate-300">
                    Experiência: <strong className="text-white font-mono">{expScore}%</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpandedMatchId(isExpanded ? null : vacancy.id)}
                    className="ml-auto text-[11px] text-[#facc15] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isExpanded ? 'Ocultar Detalhes da IA' : 'Ver Análise de Competências'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* TAGS DE COMPETÊNCIAS (ATENDIDAS VS FALTANTES) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">Requisitos:</span>
                  {matchedSkills.map(sk => (
                    <span key={sk} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-mono">
                      <Check className="w-2.5 h-2.5 text-emerald-400" /> {sk}
                    </span>
                  ))}
                  {missingSkills.map(sk => (
                    <span key={sk} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] font-mono">
                      <AlertCircle className="w-2.5 h-2.5 text-amber-400" /> {sk} (gap)
                    </span>
                  ))}
                </div>

                {/* DETALHES EXPANDIDOS */}
                {isExpanded && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#161B26] border border-[#262F40] text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                      <strong className="text-[11px] text-[#facc15] font-bold">
                        Síntese Explicável do Algoritmo:
                      </strong>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {isHighMatch
                        ? `Forte correspondência com as competências comprovadas na entrevista. O candidato demonstrou domínio nos requisitos obrigatórios (${matchedSkills.join(', ')}) com excelente alinhamento ao calibre exigido.`
                        : `O candidato atende aos fundamentos técnicos gerais, contudo a vaga exige competências específicas adicionais não identificadas no perfil atual (${missingSkills.join(', ')}). A candidatura direta está liberada com avaliação de potencial de aprendizado.`}
                    </p>
                    <div className="pt-1 text-[11px] text-slate-400">
                      <strong>Sobre a Vaga:</strong> {vacancy.description}
                    </div>
                    {vacancy.conditions && (
                      <div className="text-[11px] text-slate-400">
                        <strong>Benefícios & Condições:</strong> {vacancy.conditions}
                      </div>
                    )}
                  </div>
                )}

                {/* BARRA DE AÇÃO & STATUS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#262F40] mt-3">
                  <div className="flex items-center gap-2">
                    {process ? (
                      <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg ${
                        isAccepted
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : isRejected
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isAccepted && <><Unlock className="w-3.5 h-3.5 text-emerald-400" /> Candidatura Ativa • Contatos Liberados</>}
                        {isRejected && <><X className="w-3.5 h-3.5 text-red-400" /> Recusado por você</>}
                        {isPendingOptIn && <><Clock className="w-3.5 h-3.5 text-amber-400" /> Convite Direto da Empresa Aguardando Aceite</>}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        {isHighMatch
                          ? 'Vaga altamente recomendada pelo motor de matchmaking.'
                          : 'Vaga aberta a candidaturas espontâneas.'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Botão Ver Detalhes da Vaga (SEMPRE VISÍVEL - Padrão plataformas convencionais como LinkedIn/Gupy) */}
                    <button
                      type="button"
                      onClick={() => setSelectedDetailVacancy(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#161B26] hover:bg-[#1E2638] border border-[#262F40] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      title="Ver todos os detalhes, requisitos e condições desta vaga"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#facc15]" />
                      <span>Ver Detalhes da Vaga</span>
                    </button>

                    {/* Se já existe convite pendente */}
                    {isPendingOptIn && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDirectAccept(process.id, vacancy.title)}
                          className="px-4 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Aceitar Convite
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelModal({
                            processId: process.id,
                            vacancyTitle: vacancy.title,
                            companyName: company?.name || 'Empresa Parceira',
                            isWithdrawal: false
                          })}
                          className="px-3 py-1.5 bg-[#161B26] hover:bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
                          title="Recusar convite da empresa"
                        >
                          <X className="w-3.5 h-3.5" /> Recusar Convite
                        </button>
                      </>
                    )}

                    {/* Se não há processo seletivo iniciado: botão Candidatar-se */}
                    {!process && (
                      <button
                        type="button"
                        onClick={() => handleOpenApplication(item)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          isHighMatch
                            ? 'bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold shadow-[0_0_15px_rgba(250,204,21,0.25)]'
                            : 'bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 hover:text-white'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Candidatar-se à Vaga</span>
                      </button>
                    )}

                    {/* Se já está inscrito */}
                    {isAccepted && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={onNavigateToProcess}
                          className="text-xs font-bold text-[#facc15] hover:underline flex items-center gap-1 px-2 py-1"
                        >
                          Ver no Funil Seletivo <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmCancelModal({
                            processId: process.id,
                            vacancyTitle: vacancy.title,
                            companyName: company?.name || 'Empresa Parceira',
                            isWithdrawal: true
                          })}
                          className="px-3 py-1.5 rounded-xl bg-[#161B26] hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Cancelar minha candidatura para evitar cliques acidentais"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar Candidatura</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL POP-UP DE ALINHAMENTO DE COMPETÊNCIAS (SOLICITADO PELO USUÁRIO)     */}
      {/* ========================================================================= */}
      {modalVacancy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border-2 border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            
            {/* Header do Modal */}
            <div className="flex items-start justify-between gap-3 border-b border-[#262F40] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-white">
                    Alinhamento de Competências com a Vaga
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Transparência Algorítmica • LGPD Artigo 20
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalVacancy(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vaga Selecionada */}
            <div className="p-3 rounded-xl bg-[#161B26] border border-[#262F40]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Oportunidade</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {modalVacancy.vacancy.title}
              </span>
              <span className="text-xs text-[#facc15] font-mono mt-0.5 block">
                {companies.find(c => c.id === modalVacancy.vacancy.companyId)?.name} • R$ {modalVacancy.vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {modalVacancy.vacancy.salaryMax.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* MENSAGEM DO AVISO CONFORME PEDIDO PELO USUÁRIO */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Perfil em Desenvolvimento para esta Posição</span>
              </div>
              <p>
                No momento, o seu perfil técnico não está 100% alinhado com todas as competências exigidas para esta vaga (alinhamento estimado em <strong>{modalVacancy.finalScore}%</strong>).
              </p>
              <p className="text-slate-300 font-medium">
                Porém, <strong>se você quiser seguir com a candidatura, não tem problema!</strong> Sua manifestação de interesse será enviada para a empresa com destaque para suas competências já consolidadas e sua motivação pelo desafio.
              </p>
            </div>

            {/* COMPARATIVO DE COMPETÊNCIAS */}
            <div className="space-y-2 text-xs">
              <span className="text-xs font-bold text-white block">
                Diagnóstico de Requisitos:
              </span>

              {/* Skills que o candidato tem */}
              {modalVacancy.matchedSkills.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    ✓ Competências que você já possui comprovadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {modalVacancy.matchedSkills.map(sk => (
                      <span key={sk} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills faltantes / gaps */}
              {modalVacancy.missingSkills.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-amber-400 font-medium block">
                    ⚠ Competências exigidas não encontradas no seu perfil:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {modalVacancy.missingSkills.map(sk => (
                      <span key={sk} className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 font-mono text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES DE DECISÃO */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#262F40]">
              <button
                type="button"
                onClick={() => setModalVacancy(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-xs font-semibold text-slate-300 transition-colors"
              >
                Voltar e Avaliar Outras Vagas
              </button>

              <button
                type="button"
                onClick={handleConfirmModalApplication}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-center gap-1.5"
              >
                <span>Seguir com a Candidatura Mesmo Assim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DETALHES DA VAGA (ESTILO PLATAFORMAS CONVENCIONAIS COMO LINKEDIN/GUPY) */}
      {/* ========================================================================= */}
      {selectedDetailVacancy && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0D111A] border border-[#232D3F] rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-scale-in">
            
            {/* Top Header */}
            <div className="bg-[#121722] p-5 sm:p-6 border-b border-[#232D3F] relative shrink-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {selectedDetailVacancy.vacancy.area}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] font-medium">
                    Nível: {selectedDetailVacancy.vacancy.seniority}
                  </span>
                  {selectedDetailVacancy.vacancy.isUrgentMatchExpress && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                      Match Express
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDetailVacancy(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2130] transition-colors"
                  title="Fechar detalhes"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div>
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                    {selectedDetailVacancy.vacancy.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-[#facc15]" />
                      {selectedDetailVacancy.company?.name || 'Empresa Parceira'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedDetailVacancy.vacancy.modality} ({selectedDetailVacancy.vacancy.location})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {selectedDetailVacancy.vacancy.contractTypes.join(' / ')}
                    </span>
                  </p>
                </div>

                {/* Score Badge */}
                <div className="bg-[#161B26] p-3 rounded-xl border border-[#232D3F] flex items-center gap-3 shrink-0 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Aderência IA
                    </span>
                    <span className={`text-xl font-heading font-black leading-none ${
                      selectedDetailVacancy.isHighMatch ? 'text-[#facc15]' : 'text-amber-400'
                    }`}>
                      {selectedDetailVacancy.score}%
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center text-[#facc15] font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Grid de Resumo Rápido (Estilo Gupy / LinkedIn) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#232D3F]/70 text-xs">
                <div className="bg-[#161B26]/80 p-2.5 rounded-xl border border-[#232D3F]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Faixa Salarial</span>
                  <span className="font-bold text-[#facc15] font-mono text-xs mt-0.5 block">
                    R$ {selectedDetailVacancy.vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {selectedDetailVacancy.vacancy.salaryMax.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="bg-[#161B26]/80 p-2.5 rounded-xl border border-[#232D3F]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Modalidade</span>
                  <span className="font-semibold text-white text-xs mt-0.5 block">
                    {selectedDetailVacancy.vacancy.modality}
                  </span>
                </div>
                <div className="bg-[#161B26]/80 p-2.5 rounded-xl border border-[#232D3F]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Regime</span>
                  <span className="font-semibold text-white text-xs mt-0.5 block">
                    {selectedDetailVacancy.vacancy.contractTypes.join(' ou ')}
                  </span>
                </div>
                <div className="bg-[#161B26]/80 p-2.5 rounded-xl border border-[#232D3F]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Hard Skills Score</span>
                  <span className="font-semibold text-emerald-400 font-mono text-xs mt-0.5 block">
                    {selectedDetailVacancy.hardScore}% atendido
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
              
              {/* Seção 1: Sobre a Vaga & Descrição */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#facc15]" />
                  <span>Sobre a Oportunidade & Escopo do Desafio</span>
                </h4>
                <div className="p-4 rounded-xl bg-[#121722] border border-[#232D3F] text-slate-300 leading-relaxed text-xs space-y-3">
                  <p className="whitespace-pre-line">
                    {selectedDetailVacancy.vacancy.description}
                  </p>
                  {selectedDetailVacancy.company?.about && (
                    <div className="pt-2 border-t border-[#232D3F]/60 text-slate-400 text-[11px]">
                      <strong className="text-slate-300">Sobre a organização:</strong> {selectedDetailVacancy.company.about}
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 2: Requisitos Obrigatórios (Hard Skills) */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#facc15]" />
                  <span>Requisitos Mandatórios (Hard Skills)</span>
                </h4>
                <div className="p-4 rounded-xl bg-[#121722] border border-[#232D3F] space-y-3">
                  <p className="text-slate-400 text-[11px]">
                    O algoritmo de inteligência artificial mapeou os requisitos obrigatórios com as competências comprovadas no seu perfil:
                  </p>

                  {/* Skills Atendidas */}
                  {selectedDetailVacancy.matchedSkills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Requisitos que você já atende ({selectedDetailVacancy.matchedSkills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetailVacancy.matchedSkills.map(sk => (
                          <span key={sk} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Faltantes */}
                  {selectedDetailVacancy.missingSkills.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#232D3F]/60">
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Competências adicionais exigidas pela vaga ({selectedDetailVacancy.missingSkills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetailVacancy.missingSkills.map(sk => (
                          <span key={sk} className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            {sk} (em desenvolvimento)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 3: Requisitos Desejáveis & Diferenciais */}
              {selectedDetailVacancy.vacancy.desirableSkills && selectedDetailVacancy.vacancy.desirableSkills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Diferenciais e Habilidades Desejáveis</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#121722] border border-[#232D3F]">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDetailVacancy.vacancy.desirableSkills.map(sk => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[11px]">
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Seção 4: Competências Comportamentais (Soft Skills) */}
              {selectedDetailVacancy.vacancy.softSkills && selectedDetailVacancy.vacancy.softSkills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Competências Comportamentais (Soft Skills)</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#121722] border border-[#232D3F]">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDetailVacancy.vacancy.softSkills.map(sk => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
                          • {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Seção 5: Benefícios e Condições de Trabalho */}
              {selectedDetailVacancy.vacancy.conditions && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#facc15]" />
                    <span>Benefícios, Cultura e Condições da Empresa</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-[#121722] border border-[#232D3F] text-slate-300 leading-relaxed text-xs">
                    {selectedDetailVacancy.vacancy.conditions}
                  </div>
                </div>
              )}

              {/* Seção 6: Transparência Algorítmica e IA Explicável */}
              <div className="p-4 rounded-xl bg-[#161B26] border border-[#facc15]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#facc15]">
                  <Sparkles className="w-4 h-4" />
                  <strong className="text-xs font-bold font-heading">
                    Explicabilidade do Algoritmo de Matching • LGPD Art. 20
                  </strong>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedDetailVacancy.isHighMatch
                    ? `Sua pontuação de ${selectedDetailVacancy.score}% reflete forte aderência com as evidências de código e respostas da sua entrevista técnica. Os requisitos prioritários (${selectedDetailVacancy.matchedSkills.join(', ')}) foram confirmados pelo modelo de IA.`
                    : `Sua pontuação de ${selectedDetailVacancy.score}% indica aderência conceitual satisfatória. Embora existam requisitos complementares não identificados no seu perfil atual, sua candidatura é incentivada caso queira expandir sua stack de atuação.`}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 font-mono">
                  Garantia Q.I. Match: Critérios demográficos (idade, gênero, etnia e endereço pessoal) são 100% excluídos do cálculo.
                </div>
              </div>

            </div>

            {/* Sticky Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#121722] border-t border-[#232D3F] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedDetailVacancy.process ? (
                  <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-xl ${
                    selectedDetailVacancy.process.doubleOptInStatus === 'aceito'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : selectedDetailVacancy.process.doubleOptInStatus === 'recusado'
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedDetailVacancy.process.doubleOptInStatus === 'aceito' && (
                      <><Unlock className="w-3.5 h-3.5 text-emerald-400" /> Candidatura Ativa</>
                    )}
                    {selectedDetailVacancy.process.doubleOptInStatus === 'recusado' && (
                      <><X className="w-3.5 h-3.5 text-red-400" /> Convite Recusado</>
                    )}
                    {selectedDetailVacancy.process.doubleOptInStatus === 'aguardando' && (
                      <><Clock className="w-3.5 h-3.5 text-amber-400" /> Convite Pendente de Aceite</>
                    )}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Candidatura livre no ecossistema
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDetailVacancy(null)}
                  className="px-4 py-2 rounded-xl bg-[#161B26] hover:bg-[#1E2638] border border-[#232D3F] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Fechar
                </button>

                {/* Se não há candidatura ainda */}
                {!selectedDetailVacancy.process && (
                  <button
                    type="button"
                    onClick={() => {
                      const item = selectedDetailVacancy;
                      setSelectedDetailVacancy(null);
                      handleOpenApplication(item);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Candidatar-se a esta Vaga</span>
                  </button>
                )}

                {/* Se já há candidatura ativa: opção de Ver Funil e CANCELAR CANDIDATURA com popup de confirmação */}
                {selectedDetailVacancy.process && selectedDetailVacancy.process.doubleOptInStatus === 'aceito' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const procId = selectedDetailVacancy.process.id;
                        const vTitle = selectedDetailVacancy.vacancy.title;
                        const cName = selectedDetailVacancy.company?.name || 'Empresa Parceira';
                        setSelectedDetailVacancy(null);
                        setConfirmCancelModal({
                          processId: procId,
                          vacancyTitle: vTitle,
                          companyName: cName,
                          isWithdrawal: true
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#161B26] hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancelar Candidatura</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDetailVacancy(null);
                        onNavigateToProcess();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>Ver no Funil Seletivo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* Se há convite pendente */}
                {selectedDetailVacancy.process && selectedDetailVacancy.process.doubleOptInStatus === 'aguardando' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const procId = selectedDetailVacancy.process.id;
                        const vTitle = selectedDetailVacancy.vacancy.title;
                        const cName = selectedDetailVacancy.company?.name || 'Empresa Parceira';
                        setSelectedDetailVacancy(null);
                        setConfirmCancelModal({
                          processId: procId,
                          vacancyTitle: vTitle,
                          companyName: cName,
                          isWithdrawal: false
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#161B26] hover:bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Recusar Convite</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const procId = selectedDetailVacancy.process.id;
                        const vTitle = selectedDetailVacancy.vacancy.title;
                        setSelectedDetailVacancy(null);
                        handleDirectAccept(procId, vTitle);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aceitar Convite</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP DE CONFIRMAÇÃO DE CANCELAMENTO / RECUSA (SOLICITADO PELO USUÁRIO)  */}
      {/* ========================================================================= */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            
            {/* Header com Ícone de Alerta */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-base text-white">
                  {confirmCancelModal.isWithdrawal
                    ? 'Confirmar Cancelamento de Candidatura'
                    : 'Confirmar Recusa de Convite'}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Proteção contra cliques acidentais
                </span>
              </div>
            </div>

            {/* Card com Detalhes da Vaga */}
            <div className="p-3.5 rounded-xl bg-[#161B26] border border-[#232D3F]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Oportunidade
              </span>
              <strong className="text-sm font-bold text-white block mt-0.5">
                {confirmCancelModal.vacancyTitle}
              </strong>
              <span className="text-xs text-[#facc15] font-semibold mt-0.5 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {confirmCancelModal.companyName}
              </span>
            </div>

            {/* Mensagem Explicativa */}
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-slate-200 leading-relaxed space-y-2">
              {confirmCancelModal.isWithdrawal ? (
                <>
                  <p>
                    Tem certeza de que deseja <strong>cancelar sua candidatura</strong> para esta vaga?
                  </p>
                  <p className="text-slate-300">
                    Ao confirmar, sua participação no processo seletivo será encerrada e a empresa será notificada do cancelamento. Para se candidatar novamente, será necessário submeter uma nova solicitação sujeita à disponibilidade.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Tem certeza de que deseja <strong>recusar este convite</strong> da empresa?
                  </p>
                  <p className="text-slate-300">
                    Ao recusar, seus dados pessoais continuarão 100% protegidos e anônimos. A empresa não terá acesso ao seu perfil nominal, em estrito cumprimento à LGPD.
                  </p>
                </>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#232D3F]">
              <button
                type="button"
                onClick={() => setConfirmCancelModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#232D3F] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Não, manter candidatura
              </button>

              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>
                  {confirmCancelModal.isWithdrawal
                    ? 'Sim, cancelar candidatura'
                    : 'Sim, recusar convite'}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
