import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Gift, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Building2 
} from 'lucide-react';

export const CandidateRewardsView: React.FC = () => {
  const {
    currentCandidateId,
    vacancies,
    companies,
    createReferralLink,
    referrals,
    rewardBalance,
    rewardItems,
    rewardTransactions,
    redeemReward,
    simulateReferralConversion,
    commercialConfig
  } = useApp();

  const myTransactions = rewardTransactions.filter(t => t.candidateId === currentCandidateId);
  const myReferrals = referrals.filter(r => r.candidateId === currentCandidateId);

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');
  const [referralLinkGenerated, setReferralLinkGenerated] = useState<string | null>(null);
  const [referralVacancyTitle, setReferralVacancyTitle] = useState<string>('');
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [redeemFeedback, setRedeemFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGenerateReferral = (vacancyId: string, vacancyTitle: string) => {
    const link = createReferralLink(currentCandidateId, vacancyId);
    if (link === 'LIMITE_ATINGIDO') {
      setReferralFeedback(`Limite de ${commercialConfig.maxReferralsPerVacancy} indicações atingido para a vaga "${vacancyTitle}".`);
      setReferralLinkGenerated(null);
      return;
    }
    setReferralVacancyTitle(vacancyTitle);
    setReferralLinkGenerated(link);
    setReferralFeedback(null);
    setCopiedLink(false);
  };

  const handleCopyLink = (link: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRedeem = (rewardId: string, title: string) => {
    const ok = redeemReward(currentCandidateId, rewardId);
    if (ok) {
      setRedeemFeedback({
        type: 'success',
        message: `🎉 Voucher "${title}" resgatado com sucesso! O código foi enviado para seu e-mail.`
      });
    } else {
      setRedeemFeedback({
        type: 'error',
        message: 'Saldo insuficiente de Estalecas Q.I. para resgatar este benefício.'
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DE SALDO E REGRAS DO PROGRAMA QUEM INDICA */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brandOrange" />
              <h2 className="font-heading font-bold text-base sm:text-lg text-foreground">
                Estalecas Q.I. & Programa "Quem Indica"
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Indique profissionais da sua rede para vagas abertas através de links rastreáveis. A cada indicação contratada pela empresa, você recebe <strong>+{commercialConfig.referralBonusEstalecas} Estalecas Q.I.</strong> para trocar por certificações, cursos e eventos (sem interferir no score técnico de matchmaking).
            </p>
          </div>

          <div className="px-4 py-3 rounded-base bg-brandOrange/10 border border-brandOrange/30 text-left sm:text-right shrink-0">
            <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">
              Saldo Disponível
            </span>
            <strong className="text-2xl font-heading font-bold text-brandOrange">
              {rewardBalance} 🪙
            </strong>
            <span className="text-[10px] text-muted-foreground block">
              Estalecas Q.I.
            </span>
          </div>
        </div>
      </div>

      {/* MÓDULO 1: GERADOR DE LINKS RASTREÁVEIS DE INDICAÇÃO ("QUEM INDICA") */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" /> Indicar Colega para Vaga Aberta
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Limite de até {commercialConfig.maxReferralsPerVacancy} indicações por vaga para preservar a curadoria da comunidade.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const targetVac = vacancies.find(v => v.id === selectedVacancyId) || vacancies[0];
              simulateReferralConversion(currentCandidateId, targetVac?.title || 'Engenheiro(a) de Dados Sênior');
            }}
            className="px-3.5 py-2 rounded-base bg-brandOrange/15 hover:bg-brandOrange/25 text-brandOrange border border-brandOrange/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simular Contratação de Indicado (+{commercialConfig.referralBonusEstalecas} 🪙)
          </button>
        </div>

        {/* Seleção de Vaga para Gerar Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vacancies.map((vac) => {
            const comp = companies.find(c => c.id === vac.companyId);
            const usedCount = myReferrals.filter(r => r.vacancyId === vac.id).length;
            const remaining = Math.max(0, commercialConfig.maxReferralsPerVacancy - usedCount);

            return (
              <div
                key={vac.id}
                className="p-4 rounded-base bg-background border border-border flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold bg-secondary text-primary px-2 py-0.5 rounded">
                      {vac.area} • {vac.seniority}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {remaining} de {commercialConfig.maxReferralsPerVacancy} indicações restantes
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-foreground block">{vac.title}</strong>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {comp?.name} • R$ {vac.salaryMin.toLocaleString('pt-BR')} a R$ {vac.salaryMax.toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[11px] font-bold text-brandOrange">
                    Bônus: +{commercialConfig.referralBonusEstalecas} 🪙 na aprovação
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVacancyId(vac.id);
                      handleGenerateReferral(vac.id, vac.title);
                    }}
                    className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Gerar Link de Indicação
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerta de Link Gerado */}
        {referralLinkGenerated && (
          <div className="p-4 bg-secondary/70 rounded-base border border-accent text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <strong className="text-primary block">
                🔗 Link Rastreável Gerado para "{referralVacancyTitle}":
              </strong>
              <span className="font-mono text-[11px] text-foreground break-all block">
                {referralLinkGenerated}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyLink(referralLinkGenerated)}
                className="px-3 py-1.5 bg-white border border-border rounded-base text-[11px] font-bold text-foreground hover:bg-background flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copiado!' : 'Copiar Link'}
              </button>
              <button
                type="button"
                onClick={() => {
                  simulateReferralConversion(currentCandidateId, referralVacancyTitle || 'Vaga Indicada');
                  setReferralLinkGenerated(null);
                }}
                className="px-3 py-1.5 bg-brandOrange text-white rounded-base text-[11px] font-bold hover:opacity-95 shadow-xs"
              >
                ⚡ Confirmar Contratação (+{commercialConfig.referralBonusEstalecas} 🪙)
              </button>
            </div>
          </div>
        )}

        {referralFeedback && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-base text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{referralFeedback}</span>
          </div>
        )}

        {/* Lista de Indicações Realizadas */}
        {myReferrals.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-wider">
              Minhas Indicações Rastreáveis ({myReferrals.length})
            </h4>
            <div className="space-y-1.5">
              {myReferrals.map((ref) => {
                const vac = vacancies.find(v => v.id === ref.vacancyId);
                return (
                  <div
                    key={ref.id}
                    className="p-2.5 rounded-base bg-background border border-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <strong className="font-bold text-foreground">{vac?.title || ref.vacancyId}</strong>
                      <span className="block font-mono text-[10px] text-muted-foreground">{ref.link}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded self-start sm:self-auto ${
                      ref.status === 'aprovada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-secondary text-primary'
                    }`}>
                      {ref.status === 'aprovada' ? '✓ Indicado Contratado (+Bônus Creditado)' : '⏳ Aguardando Processo do Indicado'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MÓDULO 2: LOJA DE RECOMPENSAS & VOUCHERS PARCEIROS */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="border-b border-border pb-3">
          <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" /> Loja de Benefícios & Vouchers Parceiros
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Resgate suas Estalecas Q.I. por certificações oficiais, cursos de especialização, eventos e créditos de nuvem.
          </p>
        </div>

        {redeemFeedback && (
          <div className={`p-3 rounded-base text-xs font-semibold flex items-center justify-between border ${
            redeemFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}>
            <span className="flex items-center gap-1.5">
              {redeemFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {redeemFeedback.message}
            </span>
            <button onClick={() => setRedeemFeedback(null)} className="text-[11px] underline ml-2">Fechar</button>
          </div>
        )}

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

      {/* MÓDULO 3: EXTRATO DA CARTEIRA DE ESTALECAS Q.I. */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2">
          Extrato da Carteira de Estalecas Q.I.
        </h3>

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
              {myTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    Nenhuma movimentação registrada na carteira ainda.
                  </td>
                </tr>
              ) : (
                myTransactions.map((tx) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
