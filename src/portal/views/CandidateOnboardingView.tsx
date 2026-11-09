import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Seniority, WorkModality, Availability } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Code2, 
  Server, 
  Smartphone, 
  Cloud, 
  Database, 
  Brain, 
  ShieldAlert, 
  CheckSquare, 
  Network, 
  HardDrive, 
  Cpu, 
  Github, 
  Lock,
  RefreshCw,
  Trophy,
  Zap,
  Award,
  Flame,
  Gamepad2,
  Swords,
  Coins,
  Shield,
  Layers,
  ChevronRight,
  EyeOff,
  Sliders,
  Star
} from 'lucide-react';

interface TechnicalVertical {
  id: string;
  title: string;
  skills: string;
  icon: React.ReactNode;
  category: 'core' | 'infra' | 'data' | 'specialist';
  xp: number;
}

const TECHNICAL_VERTICALS: TechnicalVertical[] = [
  { id: 'frontend', title: 'Frontend Web & UX', skills: 'React, Next.js, Vue, Tailwind CSS', icon: <Code2 className="w-5 h-5" />, category: 'core', xp: 50 },
  { id: 'backend', title: 'Backend & APIs Distribuídas', skills: 'Go, Node.js, Python, Java, Rust', icon: <Server className="w-5 h-5" />, category: 'core', xp: 50 },
  { id: 'mobile', title: 'Mobile Apps (iOS & Android)', skills: 'Flutter, Swift, Kotlin, React Native', icon: <Smartphone className="w-5 h-5" />, category: 'core', xp: 50 },
  { id: 'devops', title: 'DevOps & Infraestrutura Cloud', skills: 'Kubernetes, Terraform, AWS, CI/CD', icon: <Cloud className="w-5 h-5" />, category: 'infra', xp: 60 },
  { id: 'data', title: 'Engenharia de Dados & Analytics', skills: 'Spark, Kafka, Airflow, Snowflake', icon: <Database className="w-5 h-5" />, category: 'data', xp: 60 },
  { id: 'ml_ai', title: 'Inteligência Artificial & LLMs', skills: 'PyTorch, LangChain, RAG, Embeddings', icon: <Brain className="w-5 h-5" />, category: 'data', xp: 75 },
  { id: 'cyber', title: 'Segurança & DevSecOps', skills: 'AppSec, OWASP, Pentest, IAM, Zero-Trust', icon: <ShieldAlert className="w-5 h-5" />, category: 'specialist', xp: 60 },
  { id: 'qa', title: 'Qualidade & Automação de Testes', skills: 'Cypress, Playwright, K6, Chaos Eng.', icon: <CheckSquare className="w-5 h-5" />, category: 'specialist', xp: 50 },
  { id: 'arch', title: 'Arquitetura de Sistemas & DDD', skills: 'Microsserviços, Event-Driven, Clean Arch', icon: <Network className="w-5 h-5" />, category: 'specialist', xp: 70 },
  { id: 'dba', title: 'Banco de Dados & Otimização', skills: 'PostgreSQL, MongoDB, Redis, Tuning', icon: <HardDrive className="w-5 h-5" />, category: 'infra', xp: 55 },
  { id: 'iot', title: 'Sistemas Embarcados & IoT', skills: 'C/C++, FreeRTOS, Firmware, ESP32', icon: <Cpu className="w-5 h-5" />, category: 'specialist', xp: 65 },
];

export const CandidateOnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, completeProfessionalOnboarding } = useApp();

  // Fase atual do fluxo gamificado (1: Classe/Senioridade, 2: Árvore de Talentos, 3: Grimório de Código, 4: Termos da Guilda, 5: Level Up)
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Estados do formulário
  const [seniority, setSeniority] = useState<Seniority>((currentUser?.seniority as Seniority) || 'Sênior');
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([
    'frontend', 'backend', 'devops', 'arch'
  ]);
  const [githubUrl, setGithubUrl] = useState('https://github.com/flavio-dev/distributed-crawler');
  const [isValidatingRepo, setIsValidatingRepo] = useState(false);
  const [repoValidated, setRepoValidated] = useState(true);
  const [scanStep, setScanStep] = useState<string>('Análise Concluída');
  const [allowAnonymizedView, setAllowAnonymizedView] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Preferências de mercado
  const [salaryMin, setSalaryMin] = useState<string>('15000');
  const [salaryMax, setSalaryMax] = useState<string>('20000');
  const [modality, setModality] = useState<WorkModality>('Remoto');
  const [city, setCity] = useState('São Paulo');
  const [stateUf, setStateUf] = useState('SP');
  const [availability, setAvailability] = useState<Availability>('Imediata');

  // Confetti Canvas Ref
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cálculo dinâmico de XP
  const calculateTotalXp = (): number => {
    let xp = 200; // Base de cadastro
    if (seniority === 'Júnior') xp += 150;
    else if (seniority === 'Pleno') xp += 250;
    else if (seniority === 'Sênior') xp += 350;

    // XP por verticais
    const verticalXp = selectedVerticals.reduce((acc, id) => {
      const vert = TECHNICAL_VERTICALS.find(v => v.id === id);
      return acc + (vert ? vert.xp : 40);
    }, 0);
    xp += verticalXp;

    // Combos de habilidades
    if (selectedVerticals.includes('frontend') && selectedVerticals.includes('backend')) xp += 100;
    if (selectedVerticals.includes('backend') && selectedVerticals.includes('devops')) xp += 100;
    if (selectedVerticals.includes('data') && selectedVerticals.includes('ml_ai')) xp += 100;

    // Bônus repositório validado
    if (repoValidated) xp += 150;

    // Bônus modo ghost/privacidade configurado
    if (allowAnonymizedView) xp += 50;

    return Math.min(1000, xp);
  };

  const totalXp = calculateTotalXp();
  const xpPercentage = Math.round((totalXp / 1000) * 100);

  // Combos Ativos
  const activeCombos: { title: string; bonus: string; icon: string }[] = [];
  if (selectedVerticals.includes('frontend') && selectedVerticals.includes('backend')) {
    activeCombos.push({ title: 'Full-Stack Specialist', bonus: '+100 XP', icon: '⚡' });
  }
  if (selectedVerticals.includes('backend') && selectedVerticals.includes('devops')) {
    activeCombos.push({ title: 'Cloud Platform Engineer', bonus: '+100 XP', icon: '☁️' });
  }
  if (selectedVerticals.includes('data') && selectedVerticals.includes('ml_ai')) {
    activeCombos.push({ title: 'AI & Data Scientist', bonus: '+100 XP', icon: '🧠' });
  }
  if (selectedVerticals.includes('cyber') && selectedVerticals.includes('arch')) {
    activeCombos.push({ title: 'Secured Architect', bonus: '+80 XP', icon: '🛡️' });
  }

  // Título dinâmico do personagem / dev
  const getDynamicArchetype = () => {
    const hasFront = selectedVerticals.includes('frontend');
    const hasBack = selectedVerticals.includes('backend');
    const hasData = selectedVerticals.includes('data') || selectedVerticals.includes('ml_ai');
    const hasDevOps = selectedVerticals.includes('devops');
    const hasCyber = selectedVerticals.includes('cyber');

    let base = 'Engenheiro de Software';
    if (hasFront && hasBack) base = 'Arquiteto Full-Stack';
    else if (hasData && hasBack) base = 'Engenheiro de Dados & IA';
    else if (hasDevOps && hasBack) base = 'Engenheiro de Plataforma Cloud';
    else if (hasCyber) base = 'Especialista DevSecOps';
    else if (hasFront) base = 'Especialista Frontend & UI';
    else if (hasBack) base = 'Arquiteto de Backend & Microsserviços';

    return `${base} ${seniority}`;
  };

  // Efeito de partículas/confetes quando entra na Fase 5
  useEffect(() => {
    if (currentStage === 5 && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 400;

      interface Particle {
        x: number;
        y: number;
        radius: number;
        color: string;
        vx: number;
        vy: number;
        alpha: number;
        spin: number;
      }

      const colors = ['#FACC15', '#22C55E', '#38BDF8', '#E879F9', '#F97316'];
      const particles: Particle[] = [];

      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 120,
          y: canvas.height / 2 + (Math.random() - 0.5) * 60,
          radius: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 1.2) * 12,
          alpha: 1,
          spin: Math.random() * 0.2
        });
      }

      let animationFrameId: number;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let anyAlive = false;

        particles.forEach(p => {
          if (p.alpha > 0.01) {
            anyAlive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.28; // gravidade
            p.alpha -= 0.008;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        if (anyAlive) {
          animationFrameId = requestAnimationFrame(render);
        }
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [currentStage]);

  const toggleVertical = (id: string) => {
    setErrorMessage('');
    if (selectedVerticals.includes(id)) {
      if (selectedVerticals.length === 1) {
        setErrorMessage('Selecione pelo menos 1 vertical técnica para liberar as missões.');
        return;
      }
      setSelectedVerticals(selectedVerticals.filter(v => v !== id));
    } else {
      setSelectedVerticals([...selectedVerticals, id]);
    }
  };

  const handleValidateRepo = () => {
    if (!githubUrl.trim() || !githubUrl.includes('github.com/')) {
      setErrorMessage('Informe uma URL válida do repositório GitHub para auditoria.');
      return;
    }
    setIsValidatingRepo(true);
    setErrorMessage('');
    setScanStep('Mapeando árvore de arquivos AST...');

    setTimeout(() => {
      setScanStep('Calculando complexidade ciclomática e clean code...');
    }, 450);

    setTimeout(() => {
      setScanStep('Auditando cobertura de testes e padrões de segurança...');
    }, 900);

    setTimeout(() => {
      setIsValidatingRepo(false);
      setRepoValidated(true);
      setScanStep('Auditoria AST Concluída com Sucesso (94/100)');
    }, 1300);
  };

  const handleNextStage = () => {
    setErrorMessage('');
    if (currentStage === 1) {
      setCurrentStage(2);
    } else if (currentStage === 2) {
      if (selectedVerticals.length === 0) {
        setErrorMessage('Selecione ao menos uma vertical técnica para prosseguir.');
        return;
      }
      setCurrentStage(3);
    } else if (currentStage === 3) {
      if (seniority === 'Júnior' && (!githubUrl.trim() || !repoValidated)) {
        setErrorMessage('Regra de Negócio RN05: Candidatos de nível Júnior devem auditar obrigatoriamente um repositório GitHub via AST.');
        return;
      }
      setCurrentStage(4);
    } else if (currentStage === 4) {
      // Submete dados e avança para a celebração (Fase 5)
      const selectedVertTitles = TECHNICAL_VERTICALS
        .filter(v => selectedVerticals.includes(v.id))
        .map(v => v.title);

      completeProfessionalOnboarding({
        headline: getDynamicArchetype(),
        seniority,
        hardSkills: selectedVertTitles,
        salaryMin: Number(salaryMin) || 12000,
        salaryMax: Number(salaryMax) || 18000,
        modality,
        city: city.trim() || 'São Paulo',
        state: stateUf.trim().toUpperCase() || 'SP',
        availability
      });

      setCurrentStage(5);
    }
  };

  const handlePreviousStage = () => {
    setErrorMessage('');
    if (currentStage > 1 && currentStage < 5) {
      setCurrentStage(currentStage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E2E8F0] p-3 sm:p-6 lg:p-8 font-sans selection:bg-amber-400 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* =========================================================================
            GAMIFIED HUD (Heads-Up Display): Barra de Nível, XP, Combos e Estalecas
           ========================================================================= */}
        <div className="bg-[#111622] border border-[#232D3F] rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Luz ambiente de fundo */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Bloco do Jogador / Arquétipo */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full bg-[#0D111A] rounded-[14px] flex items-center justify-center text-amber-400">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-black font-extrabold text-[10px] rounded-md font-mono shadow">
                  LVL {seniority === 'Júnior' ? '1' : seniority === 'Pleno' ? '2' : '3'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Jornada Dev • Q.I. Match
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    <Shield className="w-3 h-3" />
                    Double Opt-In Ativo
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{getDynamicArchetype()}</span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Personalize sua ficha de habilidades para calibrar as perguntas do assistente de IA.
                </p>
              </div>
            </div>

            {/* Recompensas e Métricas de XP */}
            <div className="flex items-center gap-3 bg-[#0B0E17] border border-[#1F2737] p-2.5 sm:p-3 rounded-xl">
              {/* Estalecas */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/25 rounded-lg text-amber-400 font-mono text-xs font-bold">
                <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>+250 Estalecas</span>
              </div>

              {/* XP Progress Tracker */}
              <div className="min-w-[130px] sm:min-w-[150px]">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 mb-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {totalXp} XP
                  </span>
                  <span className="text-slate-500">/ 1000 XP</span>
                </div>
                <div className="w-full h-2 bg-[#1B2230] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Combos ativos identificados */}
          {activeCombos.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-[#1F2737] flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
                Combos Desbloqueados:
              </span>
              {activeCombos.map((combo, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#161E2D] border border-amber-400/30 text-amber-300 px-2.5 py-0.5 rounded-full"
                >
                  <span>{combo.icon}</span>
                  <span>{combo.title}</span>
                  <strong className="text-amber-400 font-mono text-[10px]">{combo.bonus}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            MAPA DE MISSÕES (STEPPER DINÂMICO)
           ========================================================================= */}
        {currentStage < 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { num: 1, label: 'Classe & Nível', sub: 'Senioridade', icon: <Swords className="w-3.5 h-3.5" /> },
              { num: 2, label: 'Árvore de Talentos', sub: 'Tech Stack', icon: <Layers className="w-3.5 h-3.5" /> },
              { num: 3, label: 'Grimório de Código', sub: 'Auditoria AST', icon: <Github className="w-3.5 h-3.5" /> },
              { num: 4, label: 'Pacto & Modo Ghost', sub: 'Preferências', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            ].map(step => {
              const isActive = currentStage === step.num;
              const isPast = currentStage > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (isPast) setCurrentStage(step.num);
                  }}
                  disabled={!isPast && !isActive}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 relative ${
                    isActive
                      ? 'bg-[#182030] border-amber-400 shadow-md shadow-amber-500/10 text-white'
                      : isPast
                      ? 'bg-[#10141E] border-emerald-500/40 text-emerald-300 hover:border-emerald-400 cursor-pointer'
                      : 'bg-[#0D1018] border-[#1F2636] text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                    isActive
                      ? 'bg-amber-400 text-black'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#1A2231] text-slate-500'
                  }`}>
                    {isPast ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] block font-mono uppercase tracking-wider text-slate-400">
                      Missão {step.num}
                    </span>
                    <span className="text-xs font-semibold block truncate text-slate-200">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            FASE 1: ESCOLHA SUA CLASSE & NÍVEL DE PODER (SENIORIDADE)
           ========================================================================= */}
        {currentStage === 1 && (
          <section className="bg-[#121722] p-5 sm:p-7 rounded-2xl border border-[#232D3F] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232D3F] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Swords className="w-4 h-4" />
                  Missão 1: Seleção de Classe Técnica
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Qual é o seu Nível de Autonomia & Domínio de Engenharia?
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Selecione sua patente para calibrar a profundidade das perguntas técnicas geradas pelo assistente de IA.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 self-start sm:self-auto">
                +150 a +350 XP
              </span>
            </div>

            {/* Cards de Nível RPG */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  level: 'Júnior' as Seniority, 
                  title: 'Aprendiz Ágil', 
                  sub: '1 a 2 anos', 
                  xp: '+150 XP',
                  desc: 'Foco em execução guiada, boas práticas, testes básicos e aprendizado contínuo.',
                  stats: { autonomia: 45, impacto: 40, arquitetura: 35 },
                  reqNote: 'Requer validação de repositório de código (RN05)'
                },
                { 
                  level: 'Pleno' as Seniority, 
                  title: 'Operador Tático', 
                  sub: '3 a 5 anos', 
                  xp: '+250 XP',
                  desc: 'Autonomia completa em entregas de ponta a ponta, resolução ágil de débitos técnicos e refatoração.',
                  stats: { autonomia: 80, impacto: 75, arquitetura: 70 },
                  reqNote: 'Recomendado para squads dinâmicos'
                },
                { 
                  level: 'Sênior' as Seniority, 
                  title: 'Mestre Arquiteto', 
                  sub: '6+ anos', 
                  xp: '+350 XP',
                  desc: 'Visão sistêmica, decisões arquiteturais distribuídas, mentoria de pares e governança de resiliência.',
                  stats: { autonomia: 100, impacto: 95, arquitetura: 95 },
                  reqNote: 'Avaliação de liderança e trade-offs complexos'
                },
              ].map(card => {
                const isSelected = seniority === card.level;
                return (
                  <div
                    key={card.level}
                    onClick={() => {
                      setSeniority(card.level);
                      setErrorMessage('');
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between gap-4 group ${
                      isSelected
                        ? 'bg-[#182232] border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-400/30'
                        : 'bg-[#0D111A] border-[#232D3F] hover:border-[#38465E] hover:bg-[#131925]'
                    }`}
                  >
                    {/* Header do Card */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold ${
                          isSelected ? 'bg-amber-400 text-black' : 'bg-[#1F2737] text-slate-400'
                        }`}>
                          {card.level}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {card.xp}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                        {card.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono block mb-2">
                        Tempo de Experiência: {card.sub}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    {/* Barras de Estatísticas RPG */}
                    <div className="space-y-2 pt-3 border-t border-[#1F2737] text-[11px] font-mono">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Autonomia Tática</span>
                          <span className="text-amber-400 font-bold">{card.stats.autonomia}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1B2230] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full transition-all duration-300" 
                            style={{ width: `${card.stats.autonomia}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Impacto em Squad</span>
                          <span className="text-emerald-400 font-bold">{card.stats.impacto}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1B2230] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 rounded-full transition-all duration-300" 
                            style={{ width: `${card.stats.impacto}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] font-mono text-slate-500 italic">
                      {card.reqNote}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso RN05 para Júnior */}
            {seniority === 'Júnior' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-semibold">
                    Regra de Negócio RN05 • Validação Obrigatória de Repositório:
                  </strong>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">
                    Para candidatos de nível Júnior, a auditoria automatizada do repositório GitHub é mandatória na Missão 3 para assegurar evidências técnicas de código limpo e padrões arquiteturais fundamentais.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            FASE 2: ÁRVORE DE TALENTOS & COMBOS TÉCNICOS (VERTICAIS)
           ========================================================================= */}
        {currentStage === 2 && (
          <section className="bg-[#121722] p-5 sm:p-7 rounded-2xl border border-[#232D3F] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232D3F] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Missão 2: Árvore de Habilidades & Verticais
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Ative suas Especialidades na Árvore de Talentos
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Selecione as tecnologias que você domina. Combine verticais complementares para desbloquear bônus de XP e títulos especiais.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  {selectedVerticals.length} selecionada(s)
                </span>
              </div>
            </div>

            {/* Grid de Verticais Técnicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TECHNICAL_VERTICALS.map(vert => {
                const isSelected = selectedVerticals.includes(vert.id);
                return (
                  <div
                    key={vert.id}
                    onClick={() => toggleVertical(vert.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group relative ${
                      isSelected
                        ? 'bg-[#182232] border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-[#0D111A] border-[#232D3F] hover:border-[#38465E] hover:bg-[#131925]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-amber-400 text-black shadow' : 'bg-[#192130] text-slate-400 group-hover:text-amber-400'
                    }`}>
                      {vert.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-xs text-white truncate group-hover:text-amber-300">
                          {vert.title}
                        </h3>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                          +{vert.xp} XP
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                        {vert.skills}
                      </p>
                    </div>

                    {/* Checkmark ativo */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-400 text-black' : 'border border-[#2D3A50] text-transparent'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Painel de Recompensas de Combos */}
            <div className="p-4 rounded-xl bg-[#0D111A] border border-[#232D3F] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">
                    Bônus de Multidisciplinaridade Ativo
                  </strong>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedVerticals.length >= 4 
                      ? 'Engenheiro de Plataforma Full-Stack (+200 XP de Bônus)' 
                      : selectedVerticals.length >= 2 
                      ? 'Especialista Híbrido (+100 XP de Bônus)' 
                      : 'Foco em Domínio Específico'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                  XP das Habilidades: +{selectedVerticals.reduce((acc, id) => {
                    const vert = TECHNICAL_VERTICALS.find(v => v.id === id);
                    return acc + (vert?.xp || 40);
                  }, 0)} XP
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            FASE 3: GRIMÓRIO DE CÓDIGO (GITHUB & VARREDURA AST)
           ========================================================================= */}
        {currentStage === 3 && (
          <section className="bg-[#121722] p-5 sm:p-7 rounded-2xl border border-[#232D3F] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232D3F] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Github className="w-4 h-4" />
                  Missão 3: Grimório de Código & Auditoria AST
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Valide suas Evidências Técnicas com um Repositório GitHub
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Nosso scanner analisa a Árvore Sintática Abstrata (AST) do projeto para extrair métricas de complexidade e qualidade de código sem avaliar sua identidade.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                +150 XP de Bônus
              </span>
            </div>

            {/* Input e Ação de Scanner */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-300 block">
                URL do Repositório Público no GitHub
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      setRepoValidated(false);
                    }}
                    placeholder="https://github.com/usuario/meu-projeto-tecnico"
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateRepo}
                  disabled={isValidatingRepo}
                  className="px-6 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-md shadow-amber-500/10"
                >
                  {isValidatingRepo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Executando Varredura...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Auditar Repositório AST</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Log dinâmico do scanner durante o processamento */}
            {isValidatingRepo && (
              <div className="p-4 rounded-xl bg-[#0D111A] border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-3 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{scanStep}</span>
              </div>
            )}

            {/* Relatório de Auditoria Aprovada */}
            {repoValidated && !isValidatingRepo && (
              <div className="p-5 rounded-xl bg-[#0D111A] border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2737] pb-3">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Repositório Validado com Sucesso • Índice AST 94/100</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Badge Conquistado: 🏅 Grimório Auditado
                  </span>
                </div>

                {/* Métricas do Repositório */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#141A26] border border-[#232D3F]">
                    <span className="text-[10px] text-slate-400 block">Stack Detectada</span>
                    <strong className="text-white font-bold block mt-0.5 truncate">TypeScript / Go</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141A26] border border-[#232D3F]">
                    <span className="text-[10px] text-slate-400 block">Commits Auditados</span>
                    <strong className="text-amber-400 font-bold block mt-0.5">184 commits</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141A26] border border-[#232D3F]">
                    <span className="text-[10px] text-slate-400 block">Clean Code AST</span>
                    <strong className="text-emerald-400 font-bold block mt-0.5">94 / 100</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141A26] border border-[#232D3F]">
                    <span className="text-[10px] text-slate-400 block">Cobertura Testes</span>
                    <strong className="text-sky-400 font-bold block mt-0.5">88% (Jest/Go)</strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            FASE 4: TERMOS DA GUILDA & MODO GHOST (COMPENSAÇÃO & DOUBLE OPT-IN)
           ========================================================================= */}
        {currentStage === 4 && (
          <section className="bg-[#121722] p-5 sm:p-7 rounded-2xl border border-[#232D3F] space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232D3F] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  Missão 4: Termos da Guilda & Modo Ghost
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Defina suas Pretensões Salariais e Modelo de Trabalho
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Garantia Double Opt-In (LGPD): os contratantes não veem seu nome nem contatos antes do seu consentimento mútuo.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                +100 XP
              </span>
            </div>

            {/* Faixa Salarial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Pretensão Salarial Mínima (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400">R$</span>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Pretensão Salarial Máxima (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400">R$</span>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modalidade de Trabalho */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Modalidade de Atuação Preferida
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Remoto' as WorkModality, label: '100% Remoto', icon: '🏠' },
                  { id: 'Híbrido' as WorkModality, label: 'Híbrido', icon: '🏢' },
                  { id: 'Presencial' as WorkModality, label: 'Presencial', icon: '🚀' },
                ].map(item => {
                  const isSelected = modality === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModality(item.id)}
                      className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-amber-400 text-black border-amber-400 font-bold shadow'
                          : 'bg-[#0D111A] border-[#232D3F] text-slate-300 hover:border-[#38465E]'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Localização e Disponibilidade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Cidade Base</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Estado (UF)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={stateUf}
                  onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white focus:border-amber-400 focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Disponibilidade</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as Availability)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Imediata">Imediata ⚡</option>
                  <option value="15 dias">15 dias</option>
                  <option value="30 dias">30 dias</option>
                  <option value="A combinar">A combinar</option>
                </select>
              </div>
            </div>

            {/* Toggle Modo Ghost / Double Opt-In LGPD */}
            <div className="p-4 rounded-xl bg-[#0D111A] border border-[#232D3F] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">
                    Modo Ghost / Furtivo Ativado (Double Opt-In LGPD)
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Seu nome completo, contatos e foto permanecem 100% blindados. As empresas visualizam exclusivamente suas competências técnicas e aderência algorítmica até que você decida aceitar uma aproximação.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAllowAnonymizedView(!allowAnonymizedView)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 shrink-0 relative ${
                  allowAnonymizedView ? 'bg-emerald-400' : 'bg-[#1F2633]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  allowAnonymizedView ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================================
            FASE 5: LEVEL UP & VITÓRIA (CELEBRAÇÃO E RECOMPENSAS DESBLOQUEADAS)
           ========================================================================= */}
        {currentStage === 5 && (
          <section className="bg-[#121722] p-6 sm:p-10 rounded-3xl border border-amber-400/60 text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 animate-fadeIn">
            {/* Canvas de Confete com Partículas Físicas */}
            <canvas 
              ref={confettiCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              
              {/* Emblema Central de Vitória */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 p-1 shadow-2xl shadow-amber-500/30">
                <div className="w-full h-full bg-[#0D111A] rounded-[22px] flex items-center justify-center text-amber-400">
                  <Trophy className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-extrabold px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20">
                  🎉 Level Up Conquistado!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Parabéns! Sua Ficha de Engenharia está Pronta
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Você completou o onboarding gamificado da plataforma Q.I. Match. Seu perfil técnico foi calibrado com sucesso e suas recompensas iniciais foram liberadas.
                </p>
              </div>

              {/* Badges e Bônus Conquistados */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-xl bg-[#0D111A] border border-amber-400/30">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                    <Coins className="w-4 h-4" />
                    <span>+250 Estalecas</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Créditos iniciais creditados para resgate de benefícios.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0D111A] border border-emerald-400/30">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                    <Zap className="w-4 h-4" />
                    <span>{totalXp} XP Acumulado</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Nível de Perfil 100% desbloqueado para o algoritmo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0D111A] border border-sky-400/30">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
                    <Award className="w-4 h-4" />
                    <span>Pioneiro Q.I. Match</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Medalha de talento fundador da rede técnica.
                  </p>
                </div>
              </div>

              {/* Botão de Conclusão / Entrada no Sistema */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-sm font-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Acessar Meu Painel & Iniciar Entrevista com IA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </section>
        )}

        {/* =========================================================================
            ALERTAS DE ERRO & BOTÕES DE NAVEGAÇÃO ENTRE FASES (1 a 4)
           ========================================================================= */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {currentStage < 5 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#232D3F]">
            {currentStage > 1 ? (
              <button
                type="button"
                onClick={handlePreviousStage}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#121722] hover:bg-[#1A2230] border border-[#232D3F] text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar Missão Anterior</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStage}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>{currentStage === 4 ? 'Concluir Missão & Desbloquear Perfil' : 'Avançar Próxima Missão'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
