import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Building2, CheckCircle2, ArrowRight, Target, FileText, Check, X, Clock, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

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
    rejectOpportunity
  } = useApp();

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const candidate = candidates[currentCandidateId] || candidates['cand-lucas'];
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  const handleDirectAccept = (processId: string, vacancyTitle: string) => {
    acceptOpportunity(processId);
    setFeedbackNotice(`✓ Você aceitou o convite para "${vacancyTitle}". Seus contatos foram liberados com segurança.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleDirectReject = (processId: string, vacancyTitle: string) => {
    rejectOpportunity(processId);
    setFeedbackNotice(`Convite para "${vacancyTitle}" recusado. Sua identidade permanece anônima.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  return (
    <div className="space-y-5">
      
      {/* CABEÇALHO LIMPO E AREJADO */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Vagas Compatíveis com seu Perfil
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oportunidades filtradas pelo algoritmo explicável em 5 dimensões (Hard Skills, Soft Skills, Experiência, Condições e Cobertura).
          </p>
        </div>

        {onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="px-3.5 py-2 rounded-base bg-secondary text-primary hover:opacity-90 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-opacity"
          >
            <FileText className="w-3.5 h-3.5" /> Meu Relatório de Evidências
          </button>
        )}
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* LISTA LIMPA DE VAGAS */}
      <div className="space-y-4">
        {myProcesses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-base border border-border text-xs text-muted-foreground">
            Nenhuma oportunidade compatível no momento.
          </div>
        ) : (
          myProcesses.map((proc) => {
            const vacancy = vacancies.find(v => v.id === proc.vacancyId);
            const company = companies.find(c => c.id === vacancy?.companyId);
            if (!vacancy) return null;

            const candSkills = candidate?.skills || [];
            const matchedSkills = vacancy.mandatorySkills.filter(req =>
              candSkills.some(cs => cs.name.toLowerCase().includes(req.toLowerCase()))
            );
            const hardScore = Math.min(100, Math.max(65, Math.round((matchedSkills.length / Math.max(1, vacancy.mandatorySkills.length)) * 100)));
            const softScore = candidate?.interviewSummary?.length ? 90 : 82;
            const expYears = candSkills.reduce((acc, curr) => acc + (curr.years || 0), 0) / Math.max(1, candSkills.length);
            const expScore = Math.min(100, Math.max(70, Math.round(expYears >= 4 ? 95 : expYears >= 2 ? 85 : 75)));

            const isPendingOptIn = proc.doubleOptInStatus === 'aguardando';
            const isAccepted = proc.doubleOptInStatus === 'aceito';
            const isRejected = proc.doubleOptInStatus === 'recusado';
            const isExpanded = expandedMatchId === proc.id;

            return (
              <div key={proc.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4 transition-all">
                
                {/* LINHA PRINCIPAL: TÍTULO, EMPRESA E SCORE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-base text-foreground">{vacancy.title}</h3>
                      {vacancy.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded">
                          Match Express
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-primary" /> {company?.name}
                      </span>
                      <span>•</span>
                      <span>{vacancy.modality} ({vacancy.location})</span>
                      <span>•</span>
                      <span>{vacancy.contractTypes.join('/')}</span>
                      <span>•</span>
                      <strong className="text-primary">
                        R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </p>
                  </div>

                  {/* SCORE GLOBAL EM DESTAQUE */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                    <span className="text-2xl font-heading font-black text-primary leading-none">
                      {proc.demonstrativeScore}%
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Compatibilidade
                    </span>
                  </div>
                </div>

                {/* MÉTRICAS EM LINHA (CLEAN & MINIMALISTA) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-medium">
                    Hard Skills: <strong className="text-primary">{hardScore}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-medium">
                    Soft Skills: <strong className="text-primary">{softScore}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-medium">
                    Experiência: <strong className="text-primary">{expScore}%</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-background border border-border text-emerald-700 font-semibold">
                    ✓ Condições Atendidas
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setExpandedMatchId(isExpanded ? null : proc.id)}
                    className="ml-auto text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-brandOrange" />
                    {isExpanded ? 'Ocultar Justificativa da IA' : 'Ver Justificativa da IA'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* JUSTIFICATIVA EXPANDÍVEL (SOB DEMANDA) */}
                {isExpanded && (
                  <div className="p-3.5 rounded-base bg-secondary/30 border border-border text-xs space-y-1.5 transition-all">
                    <strong className="text-[11px] text-primary font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Análise Semântica do Motor de IA:
                    </strong>
                    <p className="text-foreground leading-relaxed text-[11px]">
                      "{proc.matchExplanation}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vacancy.mandatorySkills.map((sk) => (
                        <span key={sk} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded text-foreground font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* BARRA DE AÇÃO & STATUS DO DOUBLE OPT-IN */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded ${
                      isAccepted ? 'bg-emerald-100 text-emerald-800' :
                      isRejected ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isAccepted && <><Unlock className="w-3.5 h-3.5" /> Aceito • Contatos Liberados</>}
                      {isRejected && <><X className="w-3.5 h-3.5" /> Recusado por você</>}
                      {isPendingOptIn && <><Clock className="w-3.5 h-3.5 text-amber-700" /> Convite Aguardando seu Aceite</>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPendingOptIn && (
                      <>
                        <button
                          onClick={() => handleDirectAccept(proc.id, vacancy.title)}
                          className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Aceitar Convite
                        </button>
                        <button
                          onClick={() => handleDirectReject(proc.id, vacancy.title)}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 text-destructive border border-destructive/30 text-xs font-semibold rounded-base flex items-center gap-1 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Recusar
                        </button>
                      </>
                    )}

                    <button
                      onClick={onNavigateToProcess}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 px-2 py-1"
                    >
                      Ver Funil Seletivo <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
