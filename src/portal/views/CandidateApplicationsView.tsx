import React from 'react';
import { useApp } from '../context/AppContext';
import { SelectionStage } from '../types';
import { 
  Check, 
  X, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Unlock, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const STAGES_FLOW: Array<{ key: SelectionStage; label: string }> = [
  { key: 'match_identificado', label: '1. Match identificado' },
  { key: 'convite_enviado', label: '2. Convite enviado' },
  { key: 'candidato_aceitou', label: '3. Candidato aceitou' },
  { key: 'dados_liberados', label: '4. Dados liberados' },
  { key: 'entrevista_agendada', label: '5. Entrevista agendada' },
  { key: 'entrevista_realizada', label: '6. Entrevista realizada' },
  { key: 'em_avaliacao', label: '7. Em avaliação' },
  { key: 'aprovado', label: '8. Aprovado' }
];

export const CandidateApplicationsView: React.FC = () => {
  const { 
    currentCandidateId, 
    vacancies, 
    companies, 
    selectionProcesses, 
    acceptOpportunity, 
    rejectOpportunity
  } = useApp();
  
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  const getStageIndex = (stage: SelectionStage) => {
    if (stage === 'recusado') return -1;
    const idx = STAGES_FLOW.findIndex(s => s.key === stage);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DO PAINEL DE PROCESSOS SELETIVOS E DOUBLE OPT-IN */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-foreground">Meus Processos Seletivos & Double Opt-In</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Seus contatos permanecem privados até sua confirmação individual por vaga.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] bg-secondary text-primary font-bold px-3 py-1 rounded self-start sm:self-auto shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" /> Proteção de Dados LGPD
        </span>
      </div>

      {/* LISTA DE PROCESSOS SELETIVOS */}
      <div className="space-y-4">
        {myProcesses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-base border border-border text-xs text-muted-foreground">
            Nenhum processo seletivo ativo no momento.
          </div>
        ) : (
          myProcesses.map((proc) => {
            const vac = vacancies.find(v => v.id === proc.vacancyId);
            const comp = companies.find(c => c.id === vac?.companyId);
            if (!vac) return null;

            const activeStageIdx = getStageIndex(proc.currentStage);
            const isWaitingOptIn = proc.doubleOptInStatus === 'aguardando';
            const isRejected = proc.currentStage === 'recusado';
            const isApproved = proc.currentStage === 'aprovado';

            return (
              <div key={proc.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-5">
                
                {/* Topo do Processo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-sm text-foreground">{vac.title}</h3>
                      <span className="text-[11px] font-bold text-primary bg-secondary px-2 py-0.5 rounded">
                        {proc.demonstrativeScore}% Match
                      </span>
                      {proc.unlockedFreeGrant && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded">
                          Match Express Prioritário
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {comp?.name} • {vac.modality} ({vac.location}) • Faixa Salarial: R$ {vac.salaryMin.toLocaleString('pt-BR')} a R$ {vac.salaryMax.toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {/* Status de Privacidade dos Dados */}
                  <div className="flex items-center gap-2">
                    {proc.accessGranted ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <Unlock className="w-3.5 h-3.5" /> Dados Liberados para a Empresa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-base bg-background border border-border text-muted-foreground text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5" /> Contatos Ocultos (Protegido pela LGPD)
                      </span>
                    )}
                  </div>
                </div>

                {/* AÇÃO DE DOUBLE OPT-IN (SE PENDENTE) */}
                {isWaitingOptIn && (
                  <div className="p-4 rounded-base bg-secondary/60 border border-accent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <strong className="text-xs text-primary font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brandOrange" /> Convite de Oportunidade — Confirmação de Double Opt-In
                      </strong>
                      <p className="text-xs text-foreground leading-relaxed">
                        A empresa visualizou apenas seu score de compatibilidade e síntese anônima. Deseja aceitar o convite e autorizar o compartilhamento do seu nome, e-mail, telefone, LinkedIn e GitHub?
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => acceptOpportunity(proc.id)}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Aceitar e Liberar Meus Dados
                      </button>

                      <button
                        onClick={() => rejectOpportunity(proc.id)}
                        className="px-3 py-2 bg-white hover:bg-destructive/10 text-destructive border border-destructive/30 text-xs font-semibold rounded-base flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Recusar
                      </button>
                    </div>
                  </div>
                )}

                {/* LINHA DO TEMPO DE ETAPAS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Linha do Tempo Sincronizada com a Empresa:
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Última atualização: {new Date(proc.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isRejected ? (
                    <div className="p-3 rounded-base bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Processo encerrado ou convite recusado. Seus dados pessoais permanecem protegidos.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
                      {STAGES_FLOW.map((st, idx) => {
                        const isDone = idx <= activeStageIdx;
                        const isCurrent = idx === activeStageIdx;

                        return (
                          <div 
                            key={st.key}
                            className={`p-2 rounded-base border text-[10px] flex flex-col justify-between transition-all ${
                              isCurrent 
                                ? 'bg-primary text-white border-primary font-bold shadow-xs' 
                                : isDone 
                                ? 'bg-secondary/70 text-primary border-accent font-semibold' 
                                : 'bg-background text-muted-foreground border-border opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[9px]">
                                {isDone ? '✓' : idx + 1}
                              </span>
                              {isCurrent && <span className="text-[8px] uppercase bg-white/20 px-1 rounded">Atual</span>}
                            </div>
                            <span className="leading-tight">{st.label.split('. ')[1]}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isApproved && (
                    <div className="mt-3 p-3 rounded-base bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Parabéns! A empresa aprovou sua contratação nesta oportunidade!
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};