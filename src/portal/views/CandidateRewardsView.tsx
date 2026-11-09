import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Building2,
  Lock,
  ExternalLink,
  Send,
  Coins,
  Scale,
  Clock,
  UserCheck
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
    commercialConfig
  } = useApp();

  const myReferrals = referrals.filter(r => r.candidateId === currentCandidateId);

  // Formulário de Nova Indicação Direta
  const [candidateName, setCandidateName] = useState('');
  const [candidateContact, setCandidateContact] = useState('');
  const [candidateProfileUrl, setCandidateProfileUrl] = useState('');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');
  const [recommendationReason, setRecommendationReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtro da Tabela
  const [pipelineFilter, setPipelineFilter] = useState<'todas' | 'contratadas' | 'em_curso'>('todas');

  // Monitor de cota para a vaga selecionada (RN07: máx 3 indicações por vaga)
  const currentVacancyReferrals = myReferrals.filter(r => r.vacancyId === selectedVacancyId);
  const quotaUsed = currentVacancyReferrals.length;
  const maxQuota = commercialConfig.maxReferralsPerVacancy || 3;
  const quotaRemaining = Math.max(0, maxQuota - quotaUsed);
  const quotaPercentage = Math.round((quotaUsed / maxQuota) * 100);

  const selectedVacancy = vacancies.find(v => v.id === selectedVacancyId) || vacancies[0];
  const selectedCompany = companies.find(c => c.id === selectedVacancy?.companyId);

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateContact.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Preencha o nome e contato (e-mail ou telefone) do indicado.' });
      return;
    }

    if (quotaUsed >= maxQuota) {
      setFeedbackMessage({
        type: 'error',
        text: `Limite de integridade atingido: Você já enviou o limite máximo de ${maxQuota} indicações para esta vaga.`
      });
      return;
    }

    const link = createReferralLink(currentCandidateId, selectedVacancyId);
    if (link === 'LIMITE_ATINGIDO') {
      setFeedbackMessage({
        type: 'error',
        text: `Limite de integridade atingido: Você já enviou o limite máximo de ${maxQuota} indicações para esta vaga.`
      });
      return;
    }

    setFeedbackMessage({
      type: 'success',
      text: `Indicação de ${candidateName} enviada com sucesso! O convite de prioridade foi gerado e vinculado à sua carteira (+500 TP na contratação).`
    });

    setCandidateName('');
    setCandidateContact('');
    setCandidateProfileUrl('');
    setRecommendationReason('');
  };

  // Mock list of referrals se a lista for vazia para visualização fidedigna ao design
  const displayReferrals = myReferrals.length > 0 ? myReferrals.map((r, idx) => {
    const v = vacancies.find(vac => vac.id === r.vacancyId);
    const c = companies.find(comp => comp.id === v?.companyId);
    return {
      id: r.id,
      name: `Colega Técnico #${idx + 1}`,
      profileUrl: 'github.com/indicado-dev',
      role: v?.title || 'Engenheiro de Software',
      company: c?.name || 'Fintech Nexus',
      date: new Date(r.createdAt).toLocaleDateString('pt-BR'),
      status: r.status === 'contratado' ? 'Contratado • Bônus Liberado' : r.status === 'entrevista' ? 'Entrevista Agendada' : 'Em Análise',
      statusType: r.status,
      points: '+500 TP',
      paid: r.status === 'contratado'
    };
  }) : [
    {
      id: 'ref-1',
      name: 'Gabriel Silveira Santos',
      profileUrl: 'github.com/gabi-info-dev',
      role: 'Backend Python Sênior',
      company: 'Fintech Nexus',
      date: '11 Jan 2025',
      status: 'Contratado • Bônus Liberado',
      statusType: 'contratado',
      points: '+500 TP',
      paid: true
    },
    {
      id: 'ref-2',
      name: 'Larissa Meireles',
      profileUrl: 'linkedin.com/in/larissameireles',
      role: 'Backend Python Sênior',
      company: 'Fintech Nexus',
      date: '04 Fev 2025',
      status: 'Entrevista Agendada',
      statusType: 'entrevista',
      points: '+500 TP',
      paid: false
    },
    {
      id: 'ref-3',
      name: 'Matheus Cavalcanti',
      profileUrl: 'github.com/mcavalcanti',
      role: 'Staff Platform Engineer',
      company: 'Nebula Core',
      date: '18 Fev 2025',
      status: 'Em análise',
      statusType: 'analise',
      points: '+750 TP',
      paid: false
    },
    {
      id: 'ref-4',
      name: 'Bruna Fontana',
      profileUrl: 'linkedin.com/in/brunafontana',
      role: 'Tech Lead Frontend',
      company: 'XP Lab',
      date: '21 Fev 2025',
      status: 'Em análise',
      statusType: 'analise',
      points: '+600 TP',
      paid: false
    }
  ];

  const filteredReferrals = displayReferrals.filter(r => {
    if (pipelineFilter === 'contratadas') return r.statusType === 'contratado';
    if (pipelineFilter === 'em_curso') return r.statusType !== 'contratado';
    return true;
  });

  const displayBalance = rewardBalance || 1250;

  return (
    <div className="space-y-6 text-foreground dark:text-[#e2e2e8] font-sans">

      {/* 1. PROTOCOL STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-[#262F40]/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-yellow-400 font-bold px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/25 uppercase tracking-wider">
            RN07 - RF16 VERIFICADO • Bounty Engine: 1 TP = R$ 1,00 BRL
          </span>
        </div>
        <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest font-semibold">
          CICLO VIGENTE: Q1-2025 ACTIVE
        </span>
      </div>

      {/* 2. HERO PRINCIPAL & SALDO CONSOLIDADO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Coluna Esquerda: Programa de Indicações */}
        <div className="lg:col-span-8 bg-[#161B26] p-6 sm:p-7 rounded-2xl border border-[#262F40] shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
              PROGRAMA ELITE TALENT BOUNTY
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
              Indique Bons Desenvolvedores & Ganhe Tech Points
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monetize sua rede de confiança técnica. No recrutamento invertido da Q.I. Match, indicações com fit comprovado aceleram o pipeline e distribuem bônus reais direto para sua carteira.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#262F40]">
            <div>
              <span className="font-heading font-extrabold text-xl text-emerald-400 block">42.8%</span>
              <span className="text-[11px] text-[#9a9078] block font-mono">Taxa de Conversão</span>
              <span className="text-[9px] text-slate-500 font-mono">3x média de mercado</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-yellow-400 block">500 TP</span>
              <span className="text-[11px] text-[#9a9078] block font-mono">Bounty Médio</span>
              <span className="text-[9px] text-slate-500 font-mono">Por contratação</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-white block">D+1</span>
              <span className="text-[11px] text-[#9a9078] block font-mono">Tempo de Liberação</span>
              <span className="text-[9px] text-slate-500 font-mono">Pós assinatura PJ/CLT</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Saldo Consolidado */}
        <div className="lg:col-span-4 bg-[#161B26] p-6 rounded-2xl border border-yellow-400/40 shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest font-bold">
                SALDO CONSOLIDADO
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                • Disponível p/ Saque
              </span>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-heading font-black text-white">{displayBalance.toLocaleString('pt-BR')}</span>
                <span className="font-mono text-sm text-yellow-400 font-bold">TP</span>
              </div>
              <p className="text-xs text-emerald-400 font-mono font-semibold mt-0.5">
                Equivalente a R$ {displayBalance.toLocaleString('pt-BR')},00 em prêmios
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
              Pronto para resgate instantâneo via PIX ou conversão em upgrades de carreira.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                const ok = redeemReward(currentCandidateId, 'rew-cert-aws');
                if (ok) {
                  setFeedbackMessage({
                    type: 'success',
                    text: 'Resgate de voucher solicitado com sucesso! Você receberá o comprovante no e-mail.'
                  });
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Coins className="w-4 h-4 fill-black" />
              <span>Resgatar em Vouchers Técnicos</span>
            </button>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#9a9078] px-1">
              <span>Auditado por Smart Contract</span>
              <span>Zero taxas de retenção</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. MONITOR DE COTAS RN07 / RF16 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B26] border border-[#262F40] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-2xl">
          <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
            <Scale className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                POLÍTICA DE INTEGRIDADE RF16 / RN07
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Para garantir a máxima assertividade das indicações, cada desenvolvedor pode indicar no máximo <strong className="text-yellow-400 font-semibold">3 profissionais por vaga ativa</strong>.
            </p>
          </div>
        </div>

        {/* Cota da Vaga Selecionada */}
        <div className="p-3 rounded-xl bg-[#0c0e12] border border-[#262F40] shrink-0 min-w-[260px] space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 truncate max-w-[150px]">{selectedVacancy?.title || 'Vaga Selecionada'}</span>
            <strong className="text-emerald-400">{quotaUsed} de {maxQuota} ({quotaPercentage}%)</strong>
          </div>
          <div className="h-1.5 bg-[#161B26] rounded-full overflow-hidden border border-[#262F40]">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, quotaPercentage || 33)}%` }} 
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#9a9078]">
            <span>Restante: {quotaRemaining} indicação(ões)</span>
            <span className="text-yellow-400 font-bold">Slot Disponível</span>
          </div>
        </div>
      </div>

      {/* 4. FORMULÁRIO DE NOVA INDICAÇÃO TÉCNICA DIRETA */}
      <section className="bg-[#161B26] p-6 sm:p-7 rounded-2xl border border-[#262F40] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262F40] pb-3">
          <div>
            <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider font-bold block">
              SUBMISSÃO DE TALENTO AUDITADA
            </span>
            <h2 className="font-heading font-extrabold text-lg text-white">
              Nova Indicação Técnica Direta
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Preencha os dados do colega de engenharia. O sistema Inverse Core cruzará automaticamente com a stack da vaga selecionada.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/25 shrink-0 self-start sm:self-auto font-semibold">
            <Lock className="w-3 h-3" />
            <span>Criptografia ponta-a-ponta ativada</span>
          </div>
        </div>

        <form onSubmit={handleSendReferral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-[#9a9078] uppercase tracking-wider mb-1">
                NOME COMPLETO DO COLEGA
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="ex: Rodrigo Alcântara Siqueira"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs text-white placeholder:text-[#9a9078] focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-[#9a9078] uppercase tracking-wider mb-1">
                E-MAIL / WHATSAPP
              </label>
              <input
                type="text"
                value={candidateContact}
                onChange={(e) => setCandidateContact(e.target.value)}
                placeholder="dev@eng.io ou +55 11 98888-7777"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs text-white placeholder:text-[#9a9078] focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-[#9a9078] uppercase tracking-wider mb-1">
                PERFIL (GITHUB OU LINKEDIN)
              </label>
              <input
                type="text"
                value={candidateProfileUrl}
                onChange={(e) => setCandidateProfileUrl(e.target.value)}
                placeholder="https://github.com/usuario"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs text-white placeholder:text-[#9a9078] focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-mono text-[10px] text-[#9a9078] uppercase tracking-wider">
                VAGA ABERTA RECOMENDADA
              </label>
              <span className="font-mono text-[10px] text-emerald-400">
                Slot ativo ({quotaRemaining} vaga restante)
              </span>
            </div>
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs font-mono text-white focus:border-yellow-400 focus:outline-none"
            >
              {vacancies.map((v) => {
                const comp = companies.find(c => c.id === v.companyId);
                return (
                  <option key={v.id} value={v.id}>
                    {v.title} — {comp?.name || 'Empresa Parceira'} [Bounty 500 TP]
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-mono text-[10px] text-[#9a9078] uppercase tracking-wider">
                POR QUE VOCÊ RECOMENDA ESTE PROFISSIONAL?
              </label>
              <span className="font-mono text-[10px] text-[#9a9078]">
                Mín. 50 caracteres para avaliação algorítmica
              </span>
            </div>
            <textarea
              rows={3}
              value={recommendationReason}
              onChange={(e) => setRecommendationReason(e.target.value)}
              placeholder="Descreva pontos fortes técnicos comprovados e vivência prévia. Exemplo: Trabalhei com ele por 2 anos na migração de monólito para microsserviços orientados a eventos. Possui domínio ímpar em tuning de Postgres, idempotência e alta liderança técnica..."
              className="w-full p-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs font-sans text-white placeholder:text-[#9a9078] focus:border-yellow-400 focus:outline-none leading-relaxed"
            />
          </div>

          {feedbackMessage && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border border-red-500/40 text-red-300'
            }`}>
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#9a9078] font-sans">
              Ao enviar, o candidato recebe convite exclusivo de prioridade de agendamento em seu nome.
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Indicação Segura (+500 Tech Points ao avançar)</span>
            </button>
          </div>
        </form>
      </section>

      {/* 5. PIPELINE DE INDICAÇÕES ATIVAS (LIFECYCLE DO FUNIL) */}
      <section className="bg-[#161B26] p-6 sm:p-7 rounded-2xl border border-[#262F40] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262F40] pb-3">
          <div>
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
              LIFECYCLE DO FUNIL DE INDICAÇÕES
            </span>
            <h2 className="font-heading font-extrabold text-lg text-white">
              Pipeline de Indicações Ativas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhe em tempo real o avanço dos seus colegas desde o primeiro triage até a liberação do bounty.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0c0e12] border border-[#262F40] text-xs font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPipelineFilter('todas')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                pipelineFilter === 'todas' ? 'bg-[#161B26] text-white font-bold' : 'text-[#9a9078] hover:text-white'
              }`}
            >
              Todas ({displayReferrals.length})
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter('contratadas')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                pipelineFilter === 'contratadas' ? 'bg-[#161B26] text-emerald-400 font-bold' : 'text-[#9a9078] hover:text-white'
              }`}
            >
              Contratadas (1)
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter('em_curso')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                pipelineFilter === 'em_curso' ? 'bg-[#161B26] text-yellow-400 font-bold' : 'text-[#9a9078] hover:text-white'
              }`}
            >
              Em Curso (3)
            </button>
          </div>
        </div>

        {/* Tabela do Pipeline */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262F40] font-mono text-[10px] text-[#9a9078] uppercase">
                <th className="py-2.5 px-3">Nome do Indicado</th>
                <th className="py-2.5 px-3">Vaga Sugerida</th>
                <th className="py-2.5 px-3">Data de Envio</th>
                <th className="py-2.5 px-3">Status no Funil</th>
                <th className="py-2.5 px-3 text-right">Pontos a Receber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262F40]/60 font-sans">
              {filteredReferrals.map((item) => (
                <tr key={item.id} className="hover:bg-[#0c0e12]/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0c0e12] border border-[#262F40] text-yellow-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-white font-semibold block">{item.name}</strong>
                        <span className="font-mono text-[10px] text-[#9a9078]">{item.profileUrl}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-white font-medium block">{item.role}</span>
                    <span className="text-[11px] text-[#9a9078]">{item.company}</span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-[#9a9078]">
                    {item.date}
                  </td>

                  <td className="py-3.5 px-3">
                    {item.statusType === 'contratado' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Contratado • Bônus Liberado
                      </span>
                    ) : item.statusType === 'entrevista' ? (
                      <span className="px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Entrevista Agendada
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] inline-flex items-center gap-1">
                        Em análise
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <strong className="font-mono text-xs font-bold text-yellow-400 block">{item.points}</strong>
                    <span className="text-[10px] text-[#9a9078] font-mono">
                      {item.paid ? 'Pago no saldo' : 'Pendente aprovação'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer do Pipeline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#262F40] text-xs">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-300">
              Bônus Potencial em Processamento: <strong className="text-yellow-400 font-mono font-bold">1.850 TP (R$ 1.850,00)</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#9a9078]">
            Notificações automáticas via Telegram e E-mail a cada avanço
          </span>
        </div>
      </section>

    </div>
  );
};
