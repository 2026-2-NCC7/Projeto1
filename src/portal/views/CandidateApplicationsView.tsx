import React, { useState } from 'react';
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
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Building2
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
  
  const [confirmCancelModal, setConfirmCancelModal] = useState<{
    processId: string;
    vacancyTitle: string;
    companyName: string;
    isWithdrawal: boolean;
  } | null>(null);

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 5000);
  };

  const handleConfirmAction = () => {
    if (!confirmCancelModal) return;
    const { processId, vacancyTitle, isWithdrawal } = confirmCancelModal;
    rejectOpportunity(processId);
    showToast(
      isWithdrawal
        ? `✓ Candidatura para "${vacancyTitle}" cancelada com sucesso.`
        : `✓ Convite para "${vacancyTitle}" recusado. Seus contatos permanecem anônimos.`
    );
    setConfirmCancelModal(null);
  };

  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  const getStageIndex = (stage: SelectionStage) => {
    if (stage === 'recusado') return -1;
    const idx = STAGES_FLOW.findIndex(s => s.key === stage);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DO PAINEL DE PROCESSOS SELETIVOS E DOUBLE OPT-IN */}
      <div className="bg-card p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <div className="p-8 text-center bg-card rounded-base border border-border text-xs text-muted-foreground">
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
              <div key={proc.id} className="bg-card p-5 rounded-base border border-border shadow-xs space-y-5">
                
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                          <Unlock className="w-3.5 h-3.5" /> Dados Liberados para a Empresa
                        </span>
                        {!isRejected && !isApproved && (
                          <button
                            type="button"
                            onClick={() => setConfirmCancelModal({
                              processId: proc.id,
                              vacancyTitle: vac.title,
                              companyName: comp?.name || 'Empresa',
                              isWithdrawal: true
                            })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-base bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive text-xs font-semibold transition-colors"
                            title="Cancelar candidatura a esta vaga"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancelar Candidatura
                          </button>
                        )}
                      </div>
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
                        onClick={() => setConfirmCancelModal({
                          processId: proc.id,
                          vacancyTitle: vac.title,
                          companyName: comp?.name || 'Empresa',
                          isWithdrawal: false
                        })}
                        className="px-3 py-2 bg-card hover:bg-destructive/10 text-destructive border border-destructive/30 text-xs font-semibold rounded-base flex items-center gap-1 transition-all"
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

      {/* TOAST FEEDBACK */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-card border border-primary/50 text-foreground text-xs font-medium flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* POP-UP DE CONFIRMAÇÃO DE CANCELAMENTO / RECUSA */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border-2 border-destructive/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-base text-foreground">
                  {confirmCancelModal.isWithdrawal
                    ? 'Confirmar Cancelamento de Candidatura'
                    : 'Confirmar Recusa de Convite'}
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Proteção contra cliques acidentais
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-background border border-border">
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                Oportunidade
              </span>
              <strong className="text-sm font-bold text-foreground block mt-0.5">
                {confirmCancelModal.vacancyTitle}
              </strong>
              <span className="text-xs text-primary font-semibold mt-0.5 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {confirmCancelModal.companyName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-xs text-foreground leading-relaxed space-y-2">
              {confirmCancelModal.isWithdrawal ? (
                <>
                  <p>
                    Tem certeza de que deseja <strong>cancelar sua candidatura</strong> para esta vaga?
                  </p>
                  <p className="text-muted-foreground">
                    Ao confirmar, sua participação no processo seletivo será encerrada e a empresa será notificada do cancelamento. Para se candidatar novamente, será necessário submeter uma nova solicitação sujeita à disponibilidade.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Tem certeza de que deseja <strong>recusar este convite</strong> da empresa?
                  </p>
                  <p className="text-muted-foreground">
                    Ao recusar, seus dados pessoais continuarão 100% protegidos e anônimos. A empresa não terá acesso ao seu perfil nominal, em estrito cumprimento à LGPD.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setConfirmCancelModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-background hover:bg-muted border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Não, manter candidatura
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
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