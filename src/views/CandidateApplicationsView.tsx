import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SelectionStage } from '../types';
import { 
  Check, 
  X, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Unlock, 
  AlertCircle,
  Award,
  Gift,
  Sparkles,
  Copy
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
    activePersona, 
    vacancies, 
    companies, 
    selectionProcesses, 
    acceptOpportunity, 
    rejectOpportunity, 
    createReferralLink,
    referrals,
    rewardBalance,
    rewardItems,
    rewardTransactions,
    redeemReward,
    simulateReferralConversion,
    commercialConfig
  } = useApp();
  
  const currentCandidateId = activePersona === 'candidato-marina' ? 'cand-marina' : 'cand-lucas';
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);
  const myTransactions = rewardTransactions.filter(t => t.candidateId === currentCandidateId);
  const myReferrals = referrals.filter(r => r.candidateId === currentCandidateId);

  const [referralLinkGenerated, setReferralLinkGenerated] = useState<string | null>(null);
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  const getStageIndex = (stage: SelectionStage) => {
    if (stage === 'recusado') return -1;
    const idx = STAGES_FLOW.findIndex(s => s.key === stage);
    return idx === -1 ? 0 : idx;
  };

  const handleIndicate = (vacancyId: string) => {
    const link = createReferralLink(currentCandidateId, vacancyId);
    if (link === 'LIMITE_ATINGIDO') {
      setReferralFeedback(`Limite de ${commercialConfig.maxReferralsPerVacancy} indicações atingido para esta vaga.`);
      return;
    }
    setReferralLinkGenerated(link);
    setReferralFeedback(null);
  };

  const handleRedeem = (rewardId: string, title: string) => {
    const ok = redeemReward(currentCandidateId, rewardId);
    if (ok) {
      setRedeemFeedback(`🎉 Voucher "${title}" resgatado! Código enviado para seu e-mail.`);
    } else {
      setRedeemFeedback('Saldo insuficiente de Estalecas Q.I. para este benefício.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DO PAINEL DE PROCESSOS E DOUBLE OPT-IN */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-bold text-base text-foreground">Meus Processos Seletivos & Double Opt-In</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Seus contatos permanecem privados até sua confirmação individual por vaga.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-base bg-brandOrange/10 border border-brandOrange/30 text-right shrink-0">
            <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Saldo Estalecas Q.I.</span>
            <strong className="text-lg font-heading font-bold text-brandOrange">{rewardBalance} 🪙</strong>
          </div>
        </div>

        {referralLinkGenerated && (
          <div className="mt-3 p-3 bg-secondary rounded-base border border-accent text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-primary block">🔗 Link Rastreável de Indicação:</strong>
              <span className="font-mono text-[11px] text-foreground break-all">{referralLinkGenerated}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  simulateReferralConversion(currentCandidateId, 'Desenvolvedor(a) Front-end Pleno');
                  setReferralLinkGenerated(null);
                }}
                className="px-3 py-1.5 bg-brandOrange text-white rounded-base text-[11px] font-bold hover:opacity-95 shadow-xs"
              >
                ⚡ Confirmar Contratação do Indicado (+{commercialConfig.referralBonusEstalecas} 🪙)
              </button>
              <button
                onClick={() => setReferralLinkGenerated(null)}
                className="px-2.5 py-1.5 bg-white border border-border rounded text-[11px] font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {referralFeedback && (
          <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-base text-xs">
            ⚠️ {referralFeedback}
          </div>
        )}
      </div>

      {/* LISTA DE PROCESSOS SELETIVOS */}
      <div className="space-y-4">
        {myProcesses.map((proc) => {
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

                    <button
                      onClick={() => handleIndicate(vac.id)}
                      className="px-3 py-2 bg-white hover:bg-background text-foreground border border-border text-xs font-semibold rounded-base flex items-center gap-1 transition-all"
                      title="Gerar link único de indicação para um colega"
                    >
                      <Share2 className="w-3.5 h-3.5 text-brandOrange" /> Indicar Colega (+{commercialConfig.referralBonusEstalecas} 🪙)
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
                  <div className="p-3 rounded-base bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4" /> Processo encerrado ou convite recusado. Seus dados permanecem protegidos.
                    </span>
                    <button
                      onClick={() => handleIndicate(vac.id)}
                      className="px-3 py-1 bg-white text-foreground border border-border rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3 text-brandOrange" /> Indicar Colega para esta Vaga
                    </button>
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
        })}
      </div>

      {/* MÓDULO GAMIFICADO: CARTEIRA ESTALECAS Q.I. & LOJA DE RECOMPENSAS */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brandOrange" />
              <h3 className="font-heading font-bold text-base text-foreground">
                Programa "Quem Indica" — Carteira de Estalecas Q.I.
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receba <strong>+{commercialConfig.referralBonusEstalecas} Estalecas Q.I.</strong> por indicado contratado e troque por certificações, cursos e ingressos.
            </p>
          </div>

          <button
            onClick={() => simulateReferralConversion(currentCandidateId, 'Engenheiro(a) de Dados Sênior')}
            className="px-3.5 py-2 rounded-base bg-brandOrange/15 hover:bg-brandOrange/25 text-brandOrange border border-brandOrange/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Creditar Bônus de Indicação (+{commercialConfig.referralBonusEstalecas} 🪙)
          </button>
        </div>

        {redeemFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-base text-xs font-semibold flex items-center justify-between">
            <span>{redeemFeedback}</span>
            <button onClick={() => setRedeemFeedback(null)} className="text-[11px] underline">Fechar</button>
          </div>
        )}

        {/* Catálogo de Recompensas */}
        <div className="space-y-2.5">
          <h4 className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-wider">
            Benefícios e Vouchers Parceiros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rewardItems.map((item) => {
              const canAfford = rewardBalance >= item.costEstalecas;
              return (
                <div key={item.id} className="p-4 rounded-base bg-background border border-border flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold bg-secondary text-primary px-2 py-0.5 rounded">
                        {item.category} • {item.partner}
                      </span>
                      <span className="text-xs font-heading font-bold text-brandOrange">
                        {item.costEstalecas} 🪙 Estalecas
                      </span>
                    </div>
                    <strong className="text-xs font-bold text-foreground block">{item.title}</strong>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-border">
                    <button
                      onClick={() => handleRedeem(item.id, item.title)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-base text-xs font-bold flex items-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-primary hover:bg-primary-dark text-white shadow-xs'
                          : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" /> {canAfford ? 'Resgatar Benefício' : 'Saldo Insuficiente'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extrato de Estalecas Q.I. */}
        <div className="space-y-2 pt-2">
          <h4 className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-wider">
            Extrato da Carteira
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border rounded-base">
              <thead className="bg-background text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-2.5">Data</th>
                  <th className="p-2.5">Histórico / Evento</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5 text-right">Estalecas Q.I.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-background/60">
                    <td className="p-2.5 text-muted-foreground whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-2.5 font-medium text-foreground">{tx.description}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tx.type === 'credito' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.type === 'credito' ? 'Crédito' : 'Resgate'}
                      </span>
                    </td>
                    <td className={`p-2.5 text-right font-bold ${
                      tx.type === 'credito' ? 'text-emerald-700' : 'text-destructive'
                    }`}>
                      {tx.type === 'credito' ? `+${tx.amount}` : `-${tx.amount}`} 🪙
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};