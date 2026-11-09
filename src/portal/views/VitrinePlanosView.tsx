import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Check,
  Building2,
  FileText,
  Clock,
  Sparkles,
  Zap,
  HelpCircle,
  Download,
  AlertCircle,
  PlusCircle,
  BadgeCheck
} from 'lucide-react';

interface VitrinePlanosViewProps {
  onNavigateToDev?: () => void;
  onNavigateToCompany?: () => void;
}

export const VitrinePlanosView: React.FC<VitrinePlanosViewProps> = ({
  onNavigateToCompany
}) => {
  const {
    companyCredits,
    companyInvoices,
    vacancies,
    currentCompany,
    buyCompanyCreditPackage
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const activeVacancies = vacancies.filter(v => v.status === 'aberta' || !v.status);
  const activeVacanciesCount = Math.min(companyCredits, activeVacancies.length || 2);
  const freeSlotsCount = Math.max(0, companyCredits - activeVacanciesCount);

  const handleBuyPackage = (slots: number, priceBrl: number, label: string) => {
    setSelectedPackage(slots);
    buyCompanyCreditPackage(slots, priceBrl, label);
    showToast(`Plano de ${slots} Slot(s) contratado com sucesso! Saldo atualizado para ${companyCredits + slots} slots.`);
    setTimeout(() => setSelectedPackage(null), 1000);
  };

  return (
    <div className="space-y-8 text-[#e2e2e8] font-sans pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#121722] border border-amber-400/50 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER DO PAINEL DE SLOTS */}
      <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono text-[11px] font-bold uppercase tracking-wider">
              Módulo Corporativo B2B
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Contrato Ativo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Gestão de Planos & Slots de Contratação
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Modelo de recrutamento invertido pré-pago por vagas simultâneas. Vagas ativas consomem slots; você paga pela vaga em aberto, nunca por currículo ou visualização.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#161B26] border border-[#262F40] text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Empresa Contratante</span>
            <span className="text-xs font-bold text-white block">
              {currentCompany?.name || 'Orion Tech Solutions'}
            </span>
          </div>
          {onNavigateToCompany && (
            <button
              type="button"
              onClick={onNavigateToCompany}
              className="px-4 py-2.5 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-xs font-bold text-slate-200 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#facc15]" />
              <span>Ver Funil de Vagas</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TELEMETRIA DE SLOTS EM TEMPO REAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111318] p-5 rounded-2xl border border-[#262F40] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Slots Contratados</span>
            <Layers className="w-4 h-4 text-[#facc15]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-white">{companyCredits}</span>
            <span className="text-xs text-slate-400">slots ativos</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 block">
            Capacidade total do contrato
          </span>
        </div>

        <div className="bg-[#111318] p-5 rounded-2xl border border-[#262F40] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Slots em Uso (Vagas Ativas)</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-emerald-400">{activeVacanciesCount}</span>
            <span className="text-xs text-slate-400">de {companyCredits} ocupados</span>
          </div>
          <div className="w-full bg-[#161B26] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (activeVacanciesCount / Math.max(1, companyCredits)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111318] p-5 rounded-2xl border border-[#262F40] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Slots Livres para Novas Vagas</span>
            <PlusCircle className="w-4 h-4 text-[#facc15]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-[#facc15]">{freeSlotsCount}</span>
            <span className="text-xs text-slate-400">vaga(s) imediata(s)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 block">
            {freeSlotsCount > 0 ? 'Pronto para publicar sem custo adicional' : 'Contrate um slot para abrir nova vaga'}
          </span>
        </div>

        <div className="bg-[#111318] p-5 rounded-2xl border border-[#262F40] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Garantia Técnica (RN04)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-black text-white">48h</span>
            <span className="text-xs text-emerald-400 font-bold">Reposição Grátis</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 block">
            Proteção contra no-show ou score &lt; 75%
          </span>
        </div>
      </div>

      {/* 3. CONTRATAÇÃO DE PACOTES DE SLOTS (REGRAS RN03 / RN04) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#facc15]" />
              <span>Contratação & Upgrade de Slots Pré-pagos</span>
            </h2>
            <p className="text-xs text-slate-400">
              Slots de vagas ativas com suporte a múltiplos perfis técnicos sem mensalidades abusivas ou taxas ocultas.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#facc15] bg-[#facc15]/10 px-3 py-1 rounded-full border border-[#facc15]/20 self-start sm:self-auto">
            Garantia de Reposição em 48h (RN04)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Plano 1 Slot */}
          <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl flex flex-col justify-between hover:border-slate-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-[#161B26] border border-[#262F40] text-slate-300 font-mono text-[10px] font-bold uppercase">
                  Contratação Pontual
                </span>
                <span className="text-xs font-mono text-slate-400">RN03</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Plano 1 Slot</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Ideal para contratações pontuais de squads em expansão.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-slate-400 font-mono">R$</span>
                <span className="text-3xl font-heading font-black text-white">450</span>
                <span className="text-xs text-slate-400">/ vaga avulsa</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-[#262F40]/60 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>1 vaga simultânea</strong> aberta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Triagem contínua por IA (Whisper + Qwen)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Corte mínimo inegociável de 75%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Laudos auditáveis com evidências de áudio</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleBuyPackage(1, 450, 'Recarga de 1 Slot Avulso')}
              className="w-full py-3 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Contratar 1 Slot</span>
              <ArrowRight className="w-4 h-4 text-[#facc15]" />
            </button>
          </div>

          {/* Card Plano 3 Slots - MAIS ESCOLHIDO */}
          <div className="bg-[#161B26] p-6 rounded-2xl border-2 border-[#facc15] shadow-2xl relative flex flex-col justify-between scale-[1.02] z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#facc15] text-black font-mono text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mais Escolhido • Economia de R$ 150</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono text-[10px] font-bold uppercase">
                  Melhor Custo-Benefício
                </span>
                <span className="text-xs font-mono text-[#facc15]">R$ 400 / vaga</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Plano 3 Slots Ativos</h3>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Para empresas com pipeline técnico ativo e múltiplas squads.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-slate-400 font-mono">R$</span>
                <span className="text-4xl font-heading font-black text-[#facc15]">1.200</span>
                <span className="text-xs text-slate-400">/ pacote trimestral</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-[#262F40]/80 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span><strong>3 vagas simultâneas</strong> ativas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span><strong>Garantia de reposição em até 48h</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span>Substituição automática sem custo adicional</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#facc15] shrink-0" />
                  <span>Emissão automática de NFS-e discriminada</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleBuyPackage(3, 1200, 'Pacote Corporativo 3 Slots')}
              className="w-full py-3.5 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.35)]"
            >
              <span>Contratar 3 Slots Ativos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card Plano 5 Slots */}
          <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl flex flex-col justify-between hover:border-slate-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-[#161B26] border border-[#262F40] text-slate-300 font-mono text-[10px] font-bold uppercase">
                  Escala Corporativa
                </span>
                <span className="text-xs font-mono text-emerald-400">Economia R$ 500</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Plano 5 Slots</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Para scale-ups e grandes centros de engenharia em expansão.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-slate-400 font-mono">R$</span>
                <span className="text-3xl font-heading font-black text-white">2.200</span>
                <span className="text-xs text-slate-400">/ pacote</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-[#262F40]/60 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>5 vagas simultâneas</strong> com rotação</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suporte prioritário para Staff & Tech Lead</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Auditoria e calibração fina de pesos da IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validação estática de repositório via AST</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleBuyPackage(5, 2200, 'Pacote Scale-up 5 Slots')}
              className="w-full py-3 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Contratar 5 Slots</span>
              <ArrowRight className="w-4 h-4 text-[#facc15]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ALOCAÇÃO ATUAL DE VAGAS NOS SLOTS */}
      <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262F40]/60 pb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#facc15]" />
              <span>Vagas Consumindo Slots Ativos</span>
            </h3>
            <p className="text-xs text-slate-400">
              Cada vaga aberta retém 1 slot. Ao fechar ou pausar uma vaga, o slot é liberado instantaneamente.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-300">
            {activeVacanciesCount} de {companyCredits} slots ocupados
          </span>
        </div>

        <div className="space-y-3">
          {activeVacancies.map((vac, idx) => (
            <div
              key={vac.id || idx}
              className="p-4 rounded-xl bg-[#161B26] border border-[#262F40] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center text-[#facc15] font-mono text-xs font-bold shrink-0 mt-0.5">
                  #{idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{vac.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      Slot Ativo
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{vac.seniority}</span>
                    <span>•</span>
                    <span>{vac.modality}</span>
                    <span>•</span>
                    <span className="font-mono text-[#facc15]">R$ {vac.salaryMin.toLocaleString('pt-BR')} - {vac.salaryMax.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] font-mono text-slate-400 bg-[#111318] px-2.5 py-1 rounded-lg border border-[#262F40]">
                  {vac.requiredSkills?.slice(0, 3).join(', ')}
                </span>
                {onNavigateToCompany && (
                  <button
                    type="button"
                    onClick={onNavigateToCompany}
                    className="px-3 py-1.5 rounded-lg bg-[#282a2e] hover:bg-[#37393e] text-xs font-bold text-white transition-all"
                  >
                    Ver Funil
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Slot Livre disponível */}
          {freeSlotsCount > 0 && (
            <div className="p-4 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shrink-0">
                  +1
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 block">
                    Slot Disponível para Nova Vaga
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Você possui {freeSlotsCount} slot(s) livre(s). Publique uma nova vaga no Painel Corporativo sem cobrança adicional.
                  </span>
                </div>
              </div>
              {onNavigateToCompany && (
                <button
                  type="button"
                  onClick={onNavigateToCompany}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all shrink-0"
                >
                  Abrir Nova Vaga
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. HISTÓRICO DE FATURAS & NFS-e EMITIDAS */}
      <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262F40]/60 pb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#facc15]" />
              <span>Histórico de Faturas & Notas Fiscais (NFS-e)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Registros fiscais de aquisição de slots corporativos em conformidade tributária municipal.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <BadgeCheck className="w-4 h-4" />
            Auditável
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262F40] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 pl-2">Data</th>
                <th className="pb-3">Descrição da Aquisição</th>
                <th className="pb-3">Slots Adicionados</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Documento Fiscal</th>
                <th className="pb-3 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262F40]/60 font-mono text-slate-300">
              {companyInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#161B26]/50 transition-colors">
                  <td className="py-3 pl-2 text-slate-400">
                    {new Date(inv.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 font-sans font-medium text-white">
                    {inv.description}
                  </td>
                  <td className="py-3 text-[#facc15] font-bold">
                    {inv.creditsAdded > 0 ? `+${inv.creditsAdded} slots` : '—'}
                  </td>
                  <td className="py-3 text-white font-bold">
                    R$ {inv.amountBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-slate-400 flex items-center gap-1.5">
                    <span>{inv.nfseNumber}</span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <Check className="w-3 h-3" />
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. GARANTIA ANTISPAM & CONFORMIDADE REGULATÓRIA */}
      <div className="p-5 rounded-2xl bg-[#161B26] border border-[#262F40] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#facc15] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Corte Mínimo Antispam (75%)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Nenhum candidato abaixo de 75% consome o tempo da sua equipe ou o slot da vaga.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Reposição em 48 Horas (RN04)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Caso um candidato aceite e ocorra no-show, seu slot é recomposto sem custo algum.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BadgeCheck className="w-5 h-5 text-[#facc15] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">LGPD Artigo 20 Audit Ready</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Todas as decisões e ponderações algorítmicas possuem laudos técnicos explicáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
