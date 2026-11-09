import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CandidateSkill, SkillMastery } from '../types';
import { getCandidateLevelInfo } from '../utils/candidateRanking';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Trophy,
  Zap,
  Award,
  Sparkles,
  Flame,
  Shield,
  ShieldCheck,
  Star,
  Swords,
  Coins,
  Layers,
  Code2,
  Server,
  Smartphone,
  Cloud,
  Database,
  Brain,
  Download,
  EyeOff,
  ChevronRight,
  Target,
  FileCode,
  Terminal,
  Compass,
  Cpu,
  Users,
  Lock,
  Activity
} from 'lucide-react';

const SKILL_CATALOG_SAMPLES = [
  // Linguagens
  { name: 'JavaScript', category: 'Linguagens' },
  { name: 'TypeScript', category: 'Linguagens' },
  { name: 'Python', category: 'Linguagens' },
  { name: 'Java', category: 'Linguagens' },
  { name: 'Go', category: 'Linguagens' },
  { name: 'Rust', category: 'Linguagens' },
  { name: 'C#', category: 'Linguagens' },
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'HTML/CSS', category: 'Frontend' },
  // Backend
  { name: 'Node.js', category: 'Backend/APIs' },
  { name: 'NestJS', category: 'Backend/APIs' },
  { name: 'Express', category: 'Backend/APIs' },
  { name: 'Spring Boot', category: 'Backend/APIs' },
  { name: 'FastAPI', category: 'Backend/APIs' },
  // Bancos
  { name: 'PostgreSQL', category: 'Bancos e Dados' },
  { name: 'MongoDB', category: 'Bancos e Dados' },
  { name: 'Redis', category: 'Bancos e Dados' },
  { name: 'SQL', category: 'Bancos e Dados' },
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps/Infra' },
  { name: 'Kubernetes', category: 'DevOps/Infra' },
  { name: 'Git', category: 'DevOps/Infra' }
];

export const CandidateProfileView: React.FC = () => {
  const { 
    currentCandidateId, 
    candidates, 
    updateCandidateProfile, 
    addCandidateSkill, 
    removeCandidateSkill, 
    suggestNewSkill, 
    joinCommunity 
  } = useApp();
  
  const profile = candidates[currentCandidateId] || candidates['cand-lucas'];

  // Estados locais para adição de skill (somente anos de experiência)
  const [selectedSkillName, setSelectedSkillName] = useState(SKILL_CATALOG_SAMPLES[0].name);
  const [selectedMastery, setSelectedMastery] = useState<SkillMastery>('Intermediário');
  const [experienceYears, setExperienceYears] = useState(2);

  // Sugestão de nova habilidade
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Adesão à comunidade
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  // Confirmação de exclusão e feedback
  const [skillToDelete, setSkillToDelete] = useState<CandidateSkill | null>(null);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  if (!profile) {
    return <div className="p-6 text-xs text-slate-400 font-mono">Perfil não localizado para a persona ativa.</div>;
  }

  // =========================================================================
  // CÁLCULO DE MÉTRICAS RPG & FICHA TÉCNICA (UNIFICADO COM TODAS AS TELAS)
  // =========================================================================
  const levelInfo = getCandidateLevelInfo(profile);
  const currentXp = levelInfo.currentXp;
  const xpPercentage = levelInfo.xpPercentage;

  // Atributos de Engenharia (com Ícones Vetoriais Minimalistas Lucide)
  const stats = [
    { 
      label: 'Autonomia Técnica', 
      value: profile.seniority === 'Sênior' ? 95 : profile.seniority === 'Pleno' ? 82 : 68, 
      color: 'from-amber-400 to-amber-600', 
      icon: <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 
    },
    { 
      label: 'Resiliência & Padrões', 
      value: profile.seniority === 'Sênior' ? 92 : profile.seniority === 'Pleno' ? 78 : 64, 
      color: 'from-emerald-400 to-emerald-600', 
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 
    },
    { 
      label: 'Velocidade & CI/CD', 
      value: profile.skills.some(s => s.category.toLowerCase().includes('devops') || s.name.toLowerCase().includes('git')) ? 88 : 72, 
      color: 'from-sky-400 to-sky-600', 
      icon: <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" /> 
    },
    { 
      label: 'Resolução de Problemas', 
      value: 89, 
      color: 'from-purple-400 to-purple-600', 
      icon: <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" /> 
    },
    { 
      label: 'Colaboração & Squad', 
      value: profile.isCommunityMember ? 94 : 84, 
      color: 'from-pink-400 to-pink-600', 
      icon: <Users className="w-3.5 h-3.5 text-pink-400 shrink-0" /> 
    },
    { 
      label: 'Segurança & Clean Code', 
      value: 91, 
      color: 'from-teal-400 to-teal-600', 
      icon: <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" /> 
    },
  ];

  // Cálculo de completude do perfil
  const fields = [
    Boolean(profile.name),
    Boolean(profile.headline),
    Boolean(profile.about),
    Boolean(profile.city),
    profile.skills.length > 0,
    profile.experiences.length > 0,
    profile.education.length > 0,
    Boolean(profile.salaryMin && profile.salaryMax),
    profile.contractTypes.length > 0,
    profile.modalities.length > 0
  ];
  const filledCount = fields.filter(Boolean).length;
  const completenessPercent = Math.round((filledCount / fields.length) * 100);

  // Ícones Vetoriais Minimalistas por categoria de skill (Estilo Menu Lateral)
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('front')) return <Code2 className="w-4 h-4 text-sky-400 shrink-0" />;
    if (cat.includes('back') || cat.includes('api')) return <Server className="w-4 h-4 text-emerald-400 shrink-0" />;
    if (cat.includes('cloud') || cat.includes('devops')) return <Cloud className="w-4 h-4 text-amber-400 shrink-0" />;
    if (cat.includes('banco') || cat.includes('dado')) return <Database className="w-4 h-4 text-purple-400 shrink-0" />;
    if (cat.includes('ia') || cat.includes('ml')) return <Brain className="w-4 h-4 text-pink-400 shrink-0" />;
    if (cat.includes('mobile')) return <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />;
    if (cat.includes('lingua')) return <Terminal className="w-4 h-4 text-amber-400 shrink-0" />;
    return <Cpu className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const getMasteryColor = (mastery: SkillMastery) => {
    switch (mastery) {
      case 'Especialista': return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Avançado': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Intermediário': return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      default: return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  const getMasteryStars = (mastery: SkillMastery) => {
    switch (mastery) {
      case 'Especialista': return '★★★★';
      case 'Avançado': return '★★★☆';
      case 'Intermediário': return '★★☆☆';
      default: return '★☆☆☆';
    }
  };

  const handleAddSkill = () => {
    const catalogItem = SKILL_CATALOG_SAMPLES.find(s => s.name === selectedSkillName);
    const safeYears = Math.max(0, Number(experienceYears) || 0);

    const newSkill: CandidateSkill = {
      id: `sk-${Date.now()}`,
      name: selectedSkillName,
      category: catalogItem?.category || 'Geral',
      mastery: selectedMastery,
      years: safeYears,
      months: 0 // Captura exclusivamente anos conforme solicitado
    };
    addCandidateSkill(currentCandidateId, newSkill);
    setProfileNotice(`✓ Habilidade "${selectedSkillName}" incorporada ao grimório técnico (+50 XP).`);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const handleSuggestCustom = () => {
    if (!customSkillInput.trim()) return;
    suggestNewSkill(customSkillInput);
    const safeYears = Math.max(0, Number(experienceYears) || 0);
    const newSkill: CandidateSkill = {
      id: `sk-custom-${Date.now()}`,
      name: customSkillInput.trim(),
      category: 'Especialidade Sugerida',
      mastery: selectedMastery,
      years: safeYears,
      months: 0,
      isCustom: true,
      status: 'pendente_revisao'
    };
    addCandidateSkill(currentCandidateId, newSkill);
    setCustomSkillInput('');
    setShowCustomModal(false);
    setProfileNotice(`✓ Especialidade "${newSkill.name}" adicionada como runa pendente de curadoria.`);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const confirmDeleteSkill = () => {
    if (!skillToDelete) return;
    removeCandidateSkill(currentCandidateId, skillToDelete.id);
    setProfileNotice(`Habilidade "${skillToDelete.name}" removida da ficha técnica.`);
    setSkillToDelete(null);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const handleConfirmCommunity = () => {
    joinCommunity(currentCandidateId, {
      bio: true,
      location: true,
      skills: true,
      experiences: true,
      links: true
    });
    setShowCommunityModal(false);
    setProfileNotice('✓ Perfil na Comunidade Técnica ativado com sucesso! +100 XP desbloqueados.');
    setTimeout(() => setProfileNotice(null), 4000);
  };

  return (
    <div className="space-y-6 text-[#E2E8F0] pb-10 selection:bg-amber-400 selection:text-black">

      {/* =========================================================================
          1. HEADER RPG: FICHA TÉCNICA DO PERSONAGEM (CHARACTER SHEET HERO)
         ========================================================================= */}
      <div className="bg-[#101522] border border-[#222C3E] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Glow de fundo */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar e Identidade do Jogador/Dev */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              {/* Moldura Cibernética do Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full rounded-[14px] object-cover bg-[#0D111A]"
                />
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-amber-400 text-black font-extrabold text-[10px] rounded-md font-mono shadow-md">
                LVL {levelInfo.lvl}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-amber-400 text-black px-2.5 py-0.5 rounded-md shadow-sm">
                  {profile.seniority}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-md border border-emerald-400/25 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {profile.visibility}
                </span>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/25">
                  {levelInfo.tier}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.headline || `${levelInfo.title} • Q.I. Match`}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-0.5">
                <span>📍 {profile.city}/{profile.state}</span>
                <span>•</span>
                <span>Disponibilidade: <strong className="text-emerald-400">{profile.availability}</strong></span>
                <span>•</span>
                <span className="text-slate-400">Poder de Engenharia: <strong className="text-amber-400">{levelInfo.power}</strong></span>
              </div>
            </div>
          </div>

          {/* Medidores de Progresso (XP, Estalecas e Completude) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-[#0B0E17] border border-[#1E2638] p-3 rounded-xl shrink-0">
            {/* Saldo de Estalecas */}
            <div className="px-3 py-2 bg-amber-400/10 border border-amber-400/25 rounded-lg text-amber-400 font-mono text-xs font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 block font-normal">Recompensas</span>
                <span>250 Estalecas</span>
              </div>
            </div>

            {/* XP Tracker */}
            <div className="min-w-[130px] sm:min-w-[150px]">
              <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {currentXp} XP
                </span>
                <span className="text-slate-500">/ 1000 XP</span>
              </div>
              <div className="w-full h-2 bg-[#1B2230] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Completude: <strong className="text-slate-200">{completenessPercent}%</strong>
              </span>
            </div>
          </div>

        </div>

        {/* FEEDBACK NOTICE */}
        {profileNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{profileNotice}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. RADAR DE ATRIBUTOS TÉCNICOS (HEXÁGONO DE STATS RPG COM ÍCONES MINIMALISTAS)
         ========================================================================= */}
      <div className="bg-[#101522] border border-[#222C3E] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222C3E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Atributos de Engenharia & Poder Técnico
              </h2>
              <p className="text-xs text-slate-400">
                Métricas calibradas pelo motor de IA a partir do seu repositório de código e autoavaliação.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 self-start sm:self-auto">
            Classificação: {levelInfo.tier}
          </span>
        </div>

        {/* Grid de Barras de Atributos com Ícones Minimalistas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E2638] flex flex-col justify-between gap-2 hover:border-[#2D3A50] transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2 font-medium">
                  {stat.icon}
                  <span>{stat.label}</span>
                </span>
                <strong className="text-amber-400 font-bold">{stat.value} / 100</strong>
              </div>
              <div className="w-full h-2 bg-[#171E2C] rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. BANNER DE GUILDA & COMUNIDADE TÉCNICA
         ========================================================================= */}
      {!profile.joinedCommunity && (
        <div className="bg-gradient-to-r from-[#141A28] to-[#121E22] border border-amber-400/30 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <strong className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Desbloqueie a Guilda Técnica • Comunidade Q.I. Match
            </strong>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Conecte-se com outros desenvolvedores, compartilhe artigos técnicos, ganhe indicações e acumule Estalecas Q.I. para trocar por mentorias e certificações.
            </p>
          </div>
          <button
            onClick={() => setShowCommunityModal(true)}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl shadow-md shadow-amber-500/20 shrink-0 transition-all flex items-center gap-2"
          >
            <span>Ativar Perfil na Guilda</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          4. GRIMÓRIO DE HABILIDADES (SKILL TREE & INVENTÁRIO TÉCNICO MINIMALISTA)
         ========================================================================= */}
      <div className="bg-[#101522] border border-[#222C3E] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        
        {/* Cabeçalho da Seção de Skills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222C3E] pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Grimório de Habilidades Técnicas ({profile.skills.length} Ativas)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Runas de competência mapeadas no seu perfil. Cada tecnologia alimenta seu percentual de compatibilidade com as vagas.
            </p>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sugerir habilidade fora da lista</span>
          </button>
        </div>

        {/* FORJA DE HABILIDADES (ADICIONAR SKILL - APENAS ANOS) */}
        <div className="bg-[#0B0E17] p-4 sm:p-5 rounded-xl border border-[#1E2638] space-y-3">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
            Forjar Nova Habilidade no Perfil (+50 XP)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Seletor de Tecnologia (Sem Emojis, Texto Limpo) */}
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Tecnologia do Catálogo:</label>
              <select
                value={selectedSkillName}
                onChange={(e) => setSelectedSkillName(e.target.value)}
                className="w-full h-10 bg-[#121722] border border-[#232D3F] rounded-xl px-3 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              >
                {SKILL_CATALOG_SAMPLES.map(s => (
                  <option key={s.name} value={s.name}>{s.name} ({s.category})</option>
                ))}
              </select>
            </div>

            {/* Nível de Maestria */}
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Nível de Maestria:</label>
              <select
                value={selectedMastery}
                onChange={(e) => setSelectedMastery(e.target.value as SkillMastery)}
                className="w-full h-10 bg-[#121722] border border-[#232D3F] rounded-xl px-3 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              >
                <option value="Iniciante">Iniciante (★☆☆☆)</option>
                <option value="Intermediário">Intermediário (★★☆☆)</option>
                <option value="Avançado">Avançado (★★★☆)</option>
                <option value="Especialista">Especialista (★★★★)</option>
              </select>
            </div>

            {/* Tempo de Prática (EXCLUSIVAMENTE ANOS) */}
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Tempo de Prática Comprovada:</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full h-10 bg-[#121722] border border-[#232D3F] rounded-xl px-3 pr-14 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  placeholder="Ex: 2"
                />
                <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-500 pointer-events-none">
                  {experienceYears === 1 ? 'ano' : 'anos'}
                </span>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddSkill}
                className="w-full h-10 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 text-xs"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Incorporar ao Grimório</span>
              </button>
            </div>
          </div>
        </div>

        {/* VITRINE DE CARDS DE HABILIDADE (COM ÍCONES MINIMALISTAS E TEMPO EM ANOS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {profile.skills.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500 border border-dashed border-[#232D3F] rounded-xl font-mono text-xs">
              Nenhuma habilidade adicionada ao grimório ainda. Utilize o formulário acima para incorporar sua stack.
            </div>
          ) : (
            profile.skills.map((sk) => (
              <div
                key={sk.id}
                className="p-4 rounded-xl bg-[#0B0E17] border border-[#1E2638] flex flex-col justify-between gap-3 hover:border-amber-400/40 hover:bg-[#121724] transition-all group relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Ícone Minimalista Lucide correspondente à categoria */}
                    <div className="w-8 h-8 rounded-lg bg-[#161D2B] border border-[#232D3F] flex items-center justify-center shrink-0">
                      {getCategoryIcon(sk.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {sk.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {sk.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSkillToDelete(sk)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remover habilidade"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1A2230] text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getMasteryColor(sk.mastery)}`}>
                      {sk.mastery}
                    </span>
                    <span className="text-amber-400 text-xs">
                      {getMasteryStars(sk.mastery)}
                    </span>
                  </div>

                  {/* Exibição apenas de anos */}
                  <span className="text-slate-400 font-mono">
                    {sk.years} {sk.years === 1 ? 'ano' : 'anos'}
                  </span>
                </div>

                {sk.isCustom && (
                  <div className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-center">
                    {sk.status === 'aprovada' ? '✓ Runa Aprovada pela Curadoria' : '⏳ Em Auditoria Técnica'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* =========================================================================
          5. PACTO DA GUILDA & PREFERÊNCIAS DE CONTRATAÇÃO (LGPD DOUBLE OPT-IN)
         ========================================================================= */}
      <div className="bg-[#101522] border border-[#222C3E] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222C3E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-400/10 border border-sky-400/30 text-sky-400 flex items-center justify-center font-bold text-xs">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Pacto da Guilda & Condições Contratuais
              </h3>
              <p className="text-xs text-slate-400">
                Seus parâmetros de trabalho e pretensão financeira (100% blindados sob Double Opt-In).
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
            LGPD Art. 20 Blindado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E2638] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Faixa de Remuneração:
            </span>
            <strong className="text-amber-400 text-sm font-bold block">
              R$ {profile.salaryMin.toLocaleString('pt-BR')} a R$ {profile.salaryMax.toLocaleString('pt-BR')}
            </strong>
            <span className="text-[10px] text-emerald-400 block">✓ Faixa Competitiva</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E2638] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Modelos de Contrato:
            </span>
            <strong className="text-white text-xs font-bold block">
              {profile.contractTypes.join(', ')}
            </strong>
            <span className="text-[10px] text-slate-400 block">CLT ou Pessoa Jurídica</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E2638] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Modalidade Aceita:
            </span>
            <strong className="text-white text-xs font-bold block">
              {profile.modalities.join(', ')}
            </strong>
            <span className="text-[10px] text-slate-400 block">Preferência: {profile.locationPreference || 'Remoto'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E2638] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Modo Furtivo / Visibilidade:
            </span>
            <select
              value={profile.visibility}
              onChange={(e) => updateCandidateProfile(currentCandidateId, { visibility: e.target.value as any })}
              className="w-full h-8 bg-[#121722] border border-[#232D3F] rounded-lg px-2 text-xs font-bold text-amber-400 focus:outline-none"
            >
              <option value="Ativo">Ativo (Aberto a convites)</option>
              <option value="Discreto">Discreto (Oculto da empresa atual)</option>
              <option value="Pausado">Pausado (Fora de buscas)</option>
            </select>
          </div>
        </div>

        {/* Rodapé LGPD com Exportação */}
        <div className="pt-3 border-t border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Seus contatos pessoais ficam protegidos até seu aceite mútuo por vaga.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `ficha-tecnica-qimatch-${profile.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-xl bg-[#141A26] border border-[#232D3F] hover:border-amber-400 text-amber-400 text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Ficha Técnica (LGPD)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAIS: CONFIRMAÇÃO DE EXCLUSÃO, CUSTOM SKILL E COMUNIDADE
         ========================================================================= */}
      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO DE SKILL */}
      {skillToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] rounded-2xl border border-red-500/40 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400" /> 
              <span>Remover Runa de Habilidade</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Tem certeza que deseja remover <strong>{skillToDelete.name}</strong> da sua ficha técnica? Essa alteração recalculará sua compatibilidade imediata com as oportunidades da guilda.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSkillToDelete(null)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white hover:bg-[#1A2231] rounded-xl border border-[#232D3F] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteSkill}
                className="px-4 py-2 text-xs font-mono bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUGERIR HABILIDADE INEXISTENTE */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] rounded-2xl border border-amber-400/40 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Forjar Nova Runa de Tecnologia</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Caso sua tecnologia ou framework não conste no catálogo padrão, digite o nome abaixo. A habilidade será incorporada à sua ficha como <em>"pendente de curadoria"</em>.
            </p>
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Ex: Mojo, Qiskit, Solidity, WebAssembly..."
              className="w-full h-11 bg-[#0B0E17] border border-[#232D3F] rounded-xl px-3.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white hover:bg-[#1A2231] rounded-xl border border-[#232D3F]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSuggestCustom}
                className="px-5 py-2 text-xs font-mono bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl shadow-md"
              >
                Salvar na Minha Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADERIR À COMUNIDADE PESSOA FÍSICA */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] rounded-2xl border border-amber-400/40 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Aderir à Guilda Técnica Q.I. Match</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Ao ingressar na guilda, criaremos seu perfil técnico social aproveitando suas hard skills públicas, foto e headline.
            </p>
            <div className="p-3.5 bg-[#0B0E17] border border-[#1E2638] rounded-xl text-[11px] font-mono text-slate-400 space-y-1.5">
              <p className="text-emerald-400">✓ <strong>Blindado:</strong> Pretensão salarial e dados de recrutamento nunca são exibidos.</p>
              <p className="text-amber-300">✓ <strong>Público:</strong> Nome, foto, headline e runas técnicas autorizadas.</p>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCommunityModal(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white hover:bg-[#1A2231] rounded-xl border border-[#232D3F]"
              >
                Agora Não
              </button>
              <button
                type="button"
                onClick={handleConfirmCommunity}
                className="px-5 py-2 text-xs font-mono bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl shadow-md"
              >
                Confirmar Adesão (+100 XP)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
