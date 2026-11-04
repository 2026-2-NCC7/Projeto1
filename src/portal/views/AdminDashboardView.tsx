import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ListChecks, 
  Activity, 
  Check, 
  X, 
  DollarSign, 
  Sliders, 
  Flag, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    candidates, 
    vacancies, 
    selectionProcesses, 
    auditLogs, 
    customSkillsPending, 
    communityProfiles, 
    companyInvoices,
    commercialConfig,
    moderationReports,
    approveCustomSkill, 
    rejectCustomSkill,
    updateCommercialConfig,
    resolveModerationReport
  } = useApp();

  const [singlePrice, setSinglePrice] = useState(String(commercialConfig.singleUnlockPriceBrl));
  const [pkgPrice, setPkgPrice] = useState(String(commercialConfig.package5PriceBrl));
  const [topN, setTopN] = useState(String(commercialConfig.matchExpressTopN));
  const [referralBonus, setReferralBonus] = useState(String(commercialConfig.referralBonusEstalecas));
  const [maxRef, setMaxRef] = useState(String(commercialConfig.maxReferralsPerVacancy));
  const [savedConfigBanner, setSavedConfigBanner] = useState(false);

  const totalRevenueBrl = companyInvoices.reduce((acc, inv) => acc + inv.amountBrl, 0);
  const pendingReports = moderationReports.filter(r => r.status === 'pendente');

  const handleSaveCommercial = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommercialConfig({
      singleUnlockPriceBrl: Number(singlePrice) || 290,
      package5PriceBrl: Number(pkgPrice) || 1190,
      matchExpressTopN: Number(topN) || 5,
      referralBonusEstalecas: Number(referralBonus) || 100,
      maxReferralsPerVacancy: Number(maxRef) || 3
    });
    setSavedConfigBanner(true);
    setTimeout(() => setSavedConfigBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DO BACKOFFICE */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-base text-foreground">
              Backoffice Q.I. Tech — Governança, Precificação & LGPD
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestão de parâmetros comerciais, curadoria de habilidades, moderação e auditoria LGPD.
          </p>
        </div>
        <span className="text-[11px] bg-gray-900 text-white font-bold px-3 py-1 rounded self-start sm:self-auto">
          Acesso Corporativo: Admin
        </span>
      </div>

      {/* MÉTRICAS CONSOLIDADAS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div className="bg-white p-4 rounded-base border border-border shadow-xs">
          <span className="text-2xl font-heading font-bold text-primary">{Object.keys(candidates).length}</span>
          <span className="block text-xs font-semibold text-foreground mt-0.5">Talentos Qualificados</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-border shadow-xs">
          <span className="text-2xl font-heading font-bold text-primary">{Object.keys(communityProfiles).length}</span>
          <span className="block text-xs font-semibold text-foreground mt-0.5">Membros Comunidade</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-border shadow-xs">
          <span className="text-2xl font-heading font-bold text-primary">{vacancies.length}</span>
          <span className="block text-xs font-semibold text-foreground mt-0.5">Vagas Ativas</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-border shadow-xs">
          <span className="text-2xl font-heading font-bold text-brandOrange">{selectionProcesses.length}</span>
          <span className="block text-xs font-semibold text-foreground mt-0.5">Matches no Funil</span>
        </div>

        <div className="bg-white p-4 rounded-base border border-emerald-300 bg-emerald-50/40 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xl font-heading font-bold text-emerald-700">
            R$ {totalRevenueBrl.toLocaleString('pt-BR')}
          </span>
          <span className="block text-xs font-bold text-emerald-900 mt-0.5">Receita B2B (NFS-e)</span>
        </div>
      </div>

      {/* PARÂMETROS COMERCIAIS CONFIGURÁVEIS */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Precificação & Parâmetros Comerciais
            </h3>
          </div>
          {savedConfigBanner && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Parâmetros atualizados!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCommercial} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end text-xs">
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Desbloqueio Avulso (R$)</label>
            <input
              type="number"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
              className="w-full h-9 px-2.5 bg-background border border-border rounded-base font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Pacote 5 Créditos (R$)</label>
            <input
              type="number"
              value={pkgPrice}
              onChange={(e) => setPkgPrice(e.target.value)}
              className="w-full h-9 px-2.5 bg-background border border-border rounded-base font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Fila Match Express (Top N)</label>
            <input
              type="number"
              value={topN}
              onChange={(e) => setTopN(e.target.value)}
              className="w-full h-9 px-2.5 bg-background border border-border rounded-base font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Bônus Indicação (🪙)</label>
            <input
              type="number"
              value={referralBonus}
              onChange={(e) => setReferralBonus(e.target.value)}
              className="w-full h-9 px-2.5 bg-background border border-border rounded-base font-bold text-foreground"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Cota Indicações/Vaga</label>
            <input
              type="number"
              value={maxRef}
              onChange={(e) => setMaxRef(e.target.value)}
              className="w-full h-9 px-2.5 bg-background border border-border rounded-base font-bold text-foreground"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-9 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center justify-center gap-1 shadow-xs transition-all"
            >
              <DollarSign className="w-3.5 h-3.5" /> Salvar Regras
            </button>
          </div>
        </form>
      </div>

      {/* GRADE DUPLA: CURADORIA DE HABILIDADES + MODERAÇÃO DA COMUNIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HABILIDADES PENDENTES DE REVISÃO */}
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-brandOrange" /> Curadoria de Habilidades do Catálogo
          </h3>

          <div className="space-y-2 pt-1">
            {customSkillsPending.length === 0 ? (
              <div className="p-3 bg-background border border-border rounded-base text-xs text-muted-foreground">
                ✓ Nenhuma sugestão pendente no momento.
              </div>
            ) : (
              customSkillsPending.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/70 border border-amber-300 text-amber-950 px-3.5 py-2.5 rounded-base text-xs"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span>⏳</span>
                    <strong>{sk}</strong>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveCustomSkill(sk)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-base flex items-center gap-1 transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprovar
                    </button>
                    <button
                      onClick={() => rejectCustomSkill(sk)}
                      className="px-3 py-1 bg-white hover:bg-destructive/10 text-destructive border border-destructive/30 font-bold rounded-base flex items-center gap-1 transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> Rejeitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODERAÇÃO DA COMUNIDADE E ANTI-SPAM */}
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" /> Moderação da Comunidade
          </h3>

          <div className="space-y-2 pt-1">
            {pendingReports.length === 0 ? (
              <div className="p-3 bg-background border border-border rounded-base text-xs text-muted-foreground">
                ✓ Nenhuma denúncia pendente na comunidade.
              </div>
            ) : (
              pendingReports.map((rep) => (
                <div key={rep.id} className="p-3 rounded-base bg-background border border-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-destructive font-bold">{rep.reason}</strong>
                    <span className="text-[10px] text-muted-foreground">Reportado por {rep.reporterName}</span>
                  </div>
                  <p className="text-[11px] text-foreground italic bg-white p-2 rounded border border-border">
                    "{rep.postSnippet}" — <span className="font-semibold not-italic">{rep.authorName}</span>
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => resolveModerationReport(rep.id, false)}
                      className="px-2.5 py-1 bg-white border border-border rounded text-[11px] font-semibold hover:bg-secondary"
                    >
                      Manter e Arquivar
                    </button>
                    <button
                      onClick={() => resolveModerationReport(rep.id, true)}
                      className="px-2.5 py-1 bg-destructive text-white rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remover Conteúdo
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* LOG DE AUDITORIA LGPD */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Trilha de Auditoria, Acesso e Consentimento (LGPD)
        </h3>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs border border-border rounded-base">
            <thead className="bg-background text-muted-foreground border-b border-border sticky top-0">
              <tr>
                <th className="p-2.5">Data/Hora</th>
                <th className="p-2.5">Evento Crítico</th>
                <th className="p-2.5">Ator</th>
                <th className="p-2.5">Detalhes da Operação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-background/60">
                  <td className="p-2.5 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-2.5 font-bold text-primary font-mono text-[11px]">{log.action}</td>
                  <td className="p-2.5 font-medium text-foreground">{log.actor}</td>
                  <td className="p-2.5 text-muted-foreground">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};