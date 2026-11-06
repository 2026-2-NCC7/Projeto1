import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Mic,
  Clock,
  CheckCircle2,
  Building2,
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface CandidateDashboardViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const CandidateDashboardView: React.FC<CandidateDashboardViewProps> = ({
  onNavigateToTab
}) => {
  const { currentCandidateId, candidates, vacancies, selectionProcesses, companies, interviews } = useApp();

  const candidate = candidates[currentCandidateId] || candidates['cand-lucas'];
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);
  const pendingInvites = myProcesses.filter(p => p.doubleOptInStatus === 'aguardando');
  const acceptedProcesses = myProcesses.filter(p => p.doubleOptInStatus === 'aceito');
  const interviewSession = interviews[currentCandidateId];
  const isInterviewDone = interviewSession?.status === 'concluida';

  // Determina a única ação primária prioritária conforme as regras de negócio
  let primaryActionTitle = 'Explorar Oportunidades';
  let primaryActionDesc = 'Seu perfil está qualificado. Veja as vagas alinhadas com suas competências.';
  let primaryActionTab = 'candidato-vagas';
  let primaryActionBtn = 'Ver Vagas Compatíveis';

  if (pendingInvites.length > 0) {
    const vacancy = vacancies.find(v => v.id === pendingInvites[0].vacancyId);
    primaryActionTitle = 'Você recebeu um novo convite de oportunidade';
    primaryActionDesc = `A empresa tem interesse no seu perfil para a vaga "${vacancy?.title || 'Oportunidade'}". Avalie o convite para autorizar o compartilhamento.`;
    primaryActionTab = 'candidato-vagas';
    primaryActionBtn = 'Analisar Convite';
  } else if (!isInterviewDone) {
    primaryActionTitle = 'Complete sua avaliação por IA para destacar seu perfil';
    primaryActionDesc = 'Responda à entrevista estruturada por voz ou texto para gerar seu relatório de competências verificado.';
    primaryActionTab = 'candidato-entrevista';
    primaryActionBtn = 'Iniciar Entrevista';
  }

  const firstName = candidate?.name ? candidate.name.split(' ')[0] : 'Profissional';

  return (
    <div className="space-y-6">
      
      {/* 1. SAUDAÇÃO CONTEXTUAL & AÇÃO PRINCIPAL */}
      <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-secondary px-2.5 py-0.5 rounded">
            Painel do Candidato
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-foreground mt-2">
            Olá, {firstName}!
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pendingInvites.length > 0
              ? 'Você tem ações pendentes que requerem sua atenção.'
              : 'Seu perfil está ativo e pronto para novas conexões.'}
          </p>
        </div>

        {/* CARD DA AÇÃO PRINCIPAL (DESTAQUE ÚNICO) */}
        <div className="p-4 rounded-base bg-secondary/50 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <strong className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brandOrange shrink-0" />
              {primaryActionTitle}
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {primaryActionDesc}
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab(primaryActionTab)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-2 shadow-xs transition-all shrink-0"
          >
            {primaryActionBtn} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MÁXIMO 3 INDICADORES REAIS E ESSENCIAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Indicador 1: Convites Pendentes */}
        <div
          onClick={() => onNavigateToTab('candidato-vagas')}
          className="bg-white p-4 rounded-base border border-border shadow-xs cursor-pointer hover:border-primary/50 transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Convites Pendentes</span>
            <Clock className="w-4 h-4 text-brandOrange" />
          </div>
          <span className="text-2xl font-heading font-black text-foreground block">
            {pendingInvites.length}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {pendingInvites.length === 1 ? '1 convite aguardando sua resposta' : `${pendingInvites.length} convites aguardando resposta`}
          </span>
        </div>

        {/* Indicador 2: Vagas Compatíveis */}
        <div
          onClick={() => onNavigateToTab('candidato-vagas')}
          className="bg-white p-4 rounded-base border border-border shadow-xs cursor-pointer hover:border-primary/50 transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Oportunidades Compatíveis</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-heading font-black text-primary block">
            {myProcesses.length}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {acceptedProcesses.length} com compartilhamento autorizado
          </span>
        </div>

        {/* Indicador 3: Situação da Avaliação */}
        <div
          onClick={() => onNavigateToTab(isInterviewDone ? 'candidato-relatorio' : 'candidato-entrevista')}
          className="bg-white p-4 rounded-base border border-border shadow-xs cursor-pointer hover:border-primary/50 transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Avaliação por IA</span>
            <Mic className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-heading font-black text-foreground block">
            {isInterviewDone ? 'Concluída' : 'Pendente'}
          </span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            {isInterviewDone ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Relatório disponível
              </span>
            ) : (
              <span>Clique para iniciar entrevista</span>
            )}
          </span>
        </div>

      </div>

      {/* 3. CONVITES PENDENTES EM DESTAQUE (SE HOUVER) */}
      {pendingInvites.length > 0 && (
        <div className="bg-white p-5 rounded-base border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-brandOrange" /> Convites que precisam da sua decisão
            </h3>
            <span className="text-xs text-muted-foreground">
              Sua identidade permanece protegida até seu aceite
            </span>
          </div>

          <div className="space-y-2">
            {pendingInvites.map(proc => {
              const vac = vacancies.find(v => v.id === proc.vacancyId);
              const comp = companies.find(c => c.id === vac?.companyId);
              if (!vac) return null;

              return (
                <div
                  key={proc.id}
                  className="p-3.5 bg-background rounded-base border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-foreground block">{vac.title}</strong>
                    <span className="text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground">{comp?.name}</span>
                      <span>•</span>
                      <span>{vac.modality}</span>
                      <span>•</span>
                      <strong className="text-primary">
                        R$ {vac.salaryMin.toLocaleString('pt-BR')} a R$ {vac.salaryMax.toLocaleString('pt-BR')}
                      </strong>
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateToTab('candidato-vagas')}
                    className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    Avaliar Convite
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. RESUMO DAS OPORTUNIDADES MAIS COMPATÍVEIS */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">
              Oportunidades em Destaque
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Vagas com maior índice de aderência técnica ao seu perfil.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('candidato-vagas')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todas as vagas ({myProcesses.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {myProcesses.slice(0, 4).map(proc => {
            const vac = vacancies.find(v => v.id === proc.vacancyId);
            const comp = companies.find(c => c.id === vac?.companyId);
            if (!vac) return null;

            return (
              <div
                key={proc.id}
                onClick={() => onNavigateToTab('candidato-vagas')}
                className="p-3.5 bg-background hover:bg-secondary/20 rounded-base border border-border cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-foreground font-bold block">{vac.title}</strong>
                    <span className="text-[11px] text-muted-foreground">
                      {comp?.name} • {vac.modality}
                    </span>
                  </div>
                  <span className="text-sm font-heading font-black text-primary">
                    {proc.demonstrativeScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px]">
                  <span className="font-semibold text-primary">
                    R$ {vac.salaryMin.toLocaleString('pt-BR')} – R$ {vac.salaryMax.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-muted-foreground">
                    {proc.doubleOptInStatus === 'aceito' ? '✓ Autorizado' : '⏳ Aguardando'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
