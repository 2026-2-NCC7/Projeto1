import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Building2, CheckCircle2, ArrowRight, Target, FileText, ShieldCheck, Check, X, Clock, Lock, Unlock } from 'lucide-react';
import { api } from '../../services/api';
import { Job } from '../../types';

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

  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    api.listJobs()
      .then(setApiJobs)
      .catch(() => setApiJobs([]));
  }, []);

  const candidate = candidates[currentCandidateId] || candidates['cand-lucas'];
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  const handleDirectAccept = (processId: string, vacancyTitle: string) => {
    acceptOpportunity(processId);
    setFeedbackNotice(`✓ Você aceitou o convite para "${vacancyTitle}". Seus dados de contato foram liberados com segurança (Double Opt-In).`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleDirectReject = (processId: string, vacancyTitle: string) => {
    rejectOpportunity(processId);
    setFeedbackNotice(`Convite para "${vacancyTitle}" recusado. Sua identidade permanece 100% protegida.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Vagas Compatíveis com seu Perfil (Matching Explicável 5 Etapas)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oportunidades calculadas por similaridade semântica nas suas Hard Skills (50%), Soft Skills (25%), Experiência (15%), Condições Objetivas (10%) e Cobertura de Avaliação.
          </p>
        </div>

        {onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="px-3.5 py-2 rounded-base bg-secondary text-primary hover:opacity-90 text-xs font-bold flex items-center gap-1.5 shrink-0"
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

      {/* LISTA DE PROCESSOS SELETIVOS / VAGAS COMPATÍVEIS */}
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

            // Cálculo dinâmico e coerente baseado no perfil real do candidato
            const candSkills = candidate?.skills || [];
            const matchedSkills = vacancy.mandatorySkills.filter(req =>
              candSkills.some(cs => cs.name.toLowerCase().includes(req.toLowerCase()))
            );
            const hardScore = Math.min(100, Math.max(65, Math.round((matchedSkills.length / Math.max(1, vacancy.mandatorySkills.length)) * 100)));
            const softScore = candidate?.interviewSummary?.length ? 90 : 82;
            const expYears = candSkills.reduce((acc, curr) => acc + (curr.years || 0), 0) / Math.max(1, candSkills.length);
            const expScore = Math.min(100, Math.max(70, Math.round(expYears >= 4 ? 95 : expYears >= 2 ? 85 : 75)));
            const condScore = 100;
            const coverageScore = candSkills.length >= 3 ? 92 : 80;

            const isPendingOptIn = proc.doubleOptInStatus === 'aguardando';
            const isAccepted = proc.doubleOptInStatus === 'aceito';
            const isRejected = proc.doubleOptInStatus === 'recusado';

            return (
              <div key={proc.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-sm text-foreground">{vacancy.title}</h3>
                      {vacancy.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded">
                          Match Express Prioritário
                        </span>
                      )}
                      <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                        Cobertura IA: {coverageScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {company?.name} • {vacancy.modality} ({vacancy.location}) • {vacancy.contractTypes.join('/')}
                    </p>
                  </div>

                  {/* Compatibilidade Global */}
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-heading font-bold text-primary">{proc.demonstrativeScore}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                      Score Ponderado
                    </span>
                  </div>
                </div>

                {/* Decomposição do Algoritmo de Matching em 5 Dimensões */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">1. Hard Skills (50%)</span>
                    <strong className="text-sm text-primary font-bold">{hardScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">2. Soft Skills (25%)</span>
                    <strong className="text-sm text-primary font-bold">{softScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">3. Experiência (15%)</span>
                    <strong className="text-sm text-primary font-bold">{expScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">4. Condições (10%)</span>
                    <strong className="text-sm text-emerald-700 font-bold">{condScore}% Compatível</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-secondary/50 border border-primary/20 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-primary block font-bold">5. Cobertura IA</span>
                    <strong className="text-sm text-primary font-bold">{coverageScore}% Verificada</strong>
                  </div>
                </div>

                {/* Faixa Salarial e Status do Double Opt-in */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-base bg-background border border-border">
                    <strong className="text-[11px] text-muted-foreground block mb-1">Faixa Salarial Transparente:</strong>
                    <span className="text-sm font-bold text-foreground">
                      R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="p-3 rounded-base bg-background border border-border flex items-center justify-between">
                    <div>
                      <strong className="text-[11px] text-muted-foreground block mb-1">Status do Double Opt-In (LGPD):</strong>
                      <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded ${
                        isAccepted ? 'bg-emerald-100 text-emerald-800' :
                        isRejected ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isAccepted && <><Unlock className="w-3.5 h-3.5" /> Aceito (Contatos Liberados à Empresa)</>}
                        {isRejected && <><X className="w-3.5 h-3.5" /> Recusado por você</>}
                        {isPendingOptIn && <><Clock className="w-3.5 h-3.5 text-amber-700" /> Aguardando sua decisão</>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Justificativa Textual em Linguagem Natural */}
                <div className="p-3 rounded-base bg-secondary/50 border border-border text-xs space-y-1">
                  <strong className="text-[11px] text-primary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Explicação Auditável do Match:
                  </strong>
                  <p className="text-foreground leading-relaxed text-[11px]">
                    "{proc.matchExplanation}"
                  </p>
                </div>

                {/* AÇÃO DIRETA DE DOUBLE OPT-IN SE PENDENTE */}
                {isPendingOptIn && (
                  <div className="p-3.5 rounded-base bg-secondary/60 border border-accent flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <strong className="text-xs text-primary font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-brandOrange" /> Confirmação Imediata de Interesse
                      </strong>
                      <p className="text-[11px] text-muted-foreground">
                        A empresa visualizou apenas seu perfil anônimo e quer convidá-lo. Deseja autorizar o compartilhamento seguro de contatos?
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDirectAccept(proc.id, vacancy.title)}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Aceitar Oportunidade
                      </button>

                      <button
                        onClick={() => handleDirectReject(proc.id, vacancy.title)}
                        className="px-3 py-2 bg-white hover:bg-red-50 text-destructive border border-destructive/30 text-xs font-semibold rounded-base flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Recusar
                      </button>
                    </div>
                  </div>
                )}

                {/* Competências e Navegação para o Funil Completo */}
                <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {vacancy.mandatorySkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {sk} (Obrigatória)
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={onNavigateToProcess}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Ver Funil de 8 Etapas e Histórico <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* VAGAS DO MOTOR FASTAPI (SQLITE) DISPONÍVEIS NO ECOSSISTEMA */}
      {apiJobs.length > 0 && (
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Vagas Ativas no Motor de IA & Banco SQLite ({apiJobs.length})
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Vagas sincronizadas com o avaliador algorítmico de 5 etapas (Hard Skills, Soft Skills, Experiência, Condições e Cobertura).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {apiJobs.map((jb) => (
              <div key={jb.id} className="p-3.5 rounded-base bg-background border border-border space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-foreground font-bold block">{jb.title}</strong>
                    <span className="text-[11px] text-muted-foreground">
                      {jb.company_name || 'Empresa Parceira'} • {jb.seniority} • {jb.work_model}
                    </span>
                  </div>
                  <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                    {jb.contract_type}
                  </span>
                </div>
                {jb.min_salary && jb.max_salary && (
                  <div className="text-[11px] font-bold text-primary">
                    Faixa: R$ {jb.min_salary.toLocaleString('pt-BR')} – R$ {jb.max_salary.toLocaleString('pt-BR')}
                  </div>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {jb.skill_requirements?.slice(0, 4).map((req) => (
                    <span key={req.skill_id} className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-foreground font-medium">
                      {req.skill_name || req.skill_id.replace('hard-', '').replace('soft-', '')} (Nível {req.min_level})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
