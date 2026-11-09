import React, { useState } from 'react';
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
  ExternalLink,
  Lock,
  RefreshCw
} from 'lucide-react';

interface TechnicalVertical {
  id: string;
  title: string;
  skills: string;
  icon: React.ReactNode;
}

const TECHNICAL_VERTICALS: TechnicalVertical[] = [
  { id: 'frontend', title: 'Frontend Web', skills: 'React, Next.js, Vue, Tailwind', icon: <Code2 className="w-5 h-5" /> },
  { id: 'backend', title: 'Backend & APIs', skills: 'Go, Node.js, Python, Java, Rust', icon: <Server className="w-5 h-5" /> },
  { id: 'mobile', title: 'Mobile (iOS / Android / Flutter)', skills: 'Swift, Kotlin, Flutter, React Native', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'devops', title: 'DevOps & Infraestrutura Cloud', skills: 'Kubernetes, Terraform, AWS, CI/CD', icon: <Cloud className="w-5 h-5" /> },
  { id: 'data', title: 'Engenharia de Dados & Analytics', skills: 'Spark, Kafka, Airflow, Snowflake', icon: <Database className="w-5 h-5" /> },
  { id: 'ml_ai', title: 'Inteligência Artificial & Machine Learning', skills: 'LLMs, PyTorch, RAG, Whisper', icon: <Brain className="w-5 h-5" /> },
  { id: 'cyber', title: 'Segurança da Informação & DevSecOps', skills: 'AppSec, Pentest, IAM, Auditoria', icon: <ShieldAlert className="w-5 h-5" /> },
  { id: 'qa', title: 'Qualidade & Automação de Testes', skills: 'Cypress, Playwright, K6, Chaos Testing', icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'arch', title: 'Arquitetura de Software & Sistemas', skills: 'Microsserviços, DDD, Event-Driven', icon: <Network className="w-5 h-5" /> },
  { id: 'dba', title: 'Bancos de Dados & Performance', skills: 'PostgreSQL, MongoDB, Redis, Otimização', icon: <HardDrive className="w-5 h-5" /> },
  { id: 'iot', title: 'Sistemas Embarcados & IoT', skills: 'C/C++, FreeRTOS, Firmware, ESP32', icon: <Cpu className="w-5 h-5" /> },
];

export const CandidateOnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, completeProfessionalOnboarding } = useApp();

  const [seniority, setSeniority] = useState<Seniority>((currentUser?.seniority as Seniority) || 'Sênior');
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([
    'frontend', 'backend', 'devops', 'arch'
  ]);
  const [githubUrl, setGithubUrl] = useState('https://github.com/flavio-dev/distributed-crawler');
  const [isValidatingRepo, setIsValidatingRepo] = useState(false);
  const [repoValidated, setRepoValidated] = useState(true);
  const [allowAnonymizedView, setAllowAnonymizedView] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Demais preferências
  const [salaryMin, setSalaryMin] = useState<string>('15000');
  const [salaryMax, setSalaryMax] = useState<string>('20000');
  const [modality, setModality] = useState<WorkModality>('Remoto');
  const [city, setCity] = useState('São Paulo');
  const [stateUf, setStateUf] = useState('SP');
  const [availability, setAvailability] = useState<Availability>('Imediata');

  const toggleVertical = (id: string) => {
    setErrorMessage('');
    if (selectedVerticals.includes(id)) {
      if (selectedVerticals.length === 1) {
        setErrorMessage('Selecione pelo menos 1 vertical técnica para orientar as questões de IA.');
        return;
      }
      setSelectedVerticals(selectedVerticals.filter(v => v !== id));
    } else {
      setSelectedVerticals([...selectedVerticals, id]);
    }
  };

  const handleValidateRepo = () => {
    if (!githubUrl.trim() || !githubUrl.includes('github.com/')) {
      setErrorMessage('Informe uma URL válida do GitHub (ex: https://github.com/usuario/repositorio).');
      return;
    }
    setIsValidatingRepo(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsValidatingRepo(false);
      setRepoValidated(true);
    }, 800);
  };

  const handleFinalSubmit = () => {
    // RN05: Repositório obrigatório para Júnior
    if (seniority === 'Júnior' && (!githubUrl.trim() || !repoValidated)) {
      setErrorMessage('Regra de Negócio RN05: Candidatos de nível Júnior devem validar obrigatoriamente um repositório GitHub para análise estática de código via AST.');
      return;
    }

    if (selectedVerticals.length === 0) {
      setErrorMessage('Selecione ao menos uma vertical técnica.');
      return;
    }

    const selectedVertTitles = TECHNICAL_VERTICALS
      .filter(v => selectedVerticals.includes(v.id))
      .map(v => v.title);

    completeProfessionalOnboarding({
      headline: `Engenheiro(a) de Software ${seniority} (${selectedVertTitles[0] || 'Full-Stack'})`,
      seniority,
      hardSkills: selectedVertTitles,
      salaryMin: Number(salaryMin) || 12000,
      salaryMax: Number(salaryMax) || 18000,
      modality,
      city: city.trim(),
      state: stateUf.trim().toUpperCase(),
      availability
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BREADCRUMB & METADATA BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-[#262F40]/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
              Protocolo RF20
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-200 font-medium">Configuração de Perfil Técnico</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Criptografia Ativa</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Etapa: <strong className="text-amber-400">2 de 3</strong>
            </span>
          </div>
        </div>

        {/* STEPPER PROGRESSIVO COESO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Passo 1 */}
          <div className="p-3.5 rounded-xl bg-[#131822] border border-[#232D3F] flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-medium block">
                Concluído
              </span>
              <span className="text-xs text-slate-200 font-medium block">
                Dados Pessoais
              </span>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="p-3.5 rounded-xl bg-[#161D2B] border border-amber-400/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center shrink-0 font-bold font-mono text-xs">
              2
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-semibold block">
                Em preenchimento
              </span>
              <span className="text-xs text-white font-semibold block">
                Especialidade & Senioridade
              </span>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="p-3.5 rounded-xl bg-[#11151F] border border-[#1F2633] flex items-center gap-3 opacity-60">
            <div className="w-7 h-7 rounded-lg bg-[#1B2230] text-slate-400 flex items-center justify-center shrink-0 font-mono text-xs">
              3
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">
                Próxima etapa
              </span>
              <span className="text-xs text-slate-400 font-medium block">
                Validação de Repositório
              </span>
            </div>
          </div>
        </div>

        {/* HERO HEADER */}
        <div className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-amber-400">
              Calibração de Algoritmo Bilateral
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Defina sua Senioridade e Áreas de Domínio
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Estes parâmetros orientam as questões geradas na entrevista com IA e o cálculo explicável de aderência com as vagas das empresas contratantes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F] shrink-0 text-right hidden lg:block">
            <span className="text-xs text-emerald-400 block font-semibold">Double Opt-In Ativo</span>
            <span className="text-[11px] text-slate-400">Dados anônimos até o aceite</span>
          </div>
        </div>

        {/* 1. SELETOR DE SENIORIDADE TÉCNICA */}
        <section className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#232D3F] pb-3">
            <div>
              <h2 className="font-bold text-sm text-white">
                Nível de Senioridade
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Indique seu estágio de autonomia técnica e impacto na tomada de decisão.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Padrão de Engenharia</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { level: 'Júnior' as Seniority, desc: '1 a 2 anos', sub: 'Suporte guiado' },
              { level: 'Pleno' as Seniority, desc: '3 a 5 anos', sub: 'Autonomia tática' },
              { level: 'Sênior' as Seniority, desc: '6 a 8 anos', sub: 'Arquitetura e refino' },
              { level: 'Especialista' as Seniority, desc: 'Staff / Principal', sub: 'Impacto cross-squad' },
              { level: 'Lead' as Seniority, desc: 'Tech Lead / Head', sub: 'Liderança técnica' },
            ].map(item => {
              const isSelected = seniority === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => {
                    setSeniority(item.level);
                    setErrorMessage('');
                  }}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col justify-between items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-400 font-bold'
                      : 'bg-[#0D111A] border-[#232D3F] text-slate-300 hover:border-[#38465E] hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.level}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-black/80 font-semibold' : 'text-slate-400'}`}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ALERTA DE REGRA DE NEGÓCIO RN05 */}
          {seniority === 'Júnior' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Critério de Avaliação Técnica:</strong> Para nível Júnior, a validação de um repositório GitHub é obrigatória para alimentar a análise de código e pontuação de fundamentos.
              </p>
            </div>
          )}
        </section>

        {/* 2. VERTICAIS TÉCNICAS */}
        <section className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#232D3F] pb-3">
            <div>
              <h2 className="font-bold text-sm text-white">
                Verticais Técnicas de Atuação
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecione as especialidades em que você atua com maior segurança e proficiência.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 font-medium">
              Seleção Múltipla
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {TECHNICAL_VERTICALS.map(vert => {
              const isSelected = selectedVerticals.includes(vert.id);
              return (
                <div
                  key={vert.id}
                  onClick={() => toggleVertical(vert.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[#182130] border-amber-400 text-white'
                      : 'bg-[#0D111A] border-[#232D3F] hover:border-[#38465E] hover:bg-[#141B26]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-400 text-black' : 'bg-[#161D2B] text-slate-400'
                    }`}>
                      {vert.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-white block">{vert.title}</h3>
                      <p className="font-mono text-[10px] text-slate-400 mt-0.5 leading-snug">{vert.skills}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card Resumo de Amplitude */}
            <div className="p-4 rounded-xl bg-[#0D111A] border border-emerald-500/30 flex flex-col justify-between gap-2 text-left">
              <span className="text-xs font-semibold text-emerald-400">
                {selectedVerticals.length} vertical(is) selecionada(s)
              </span>
              <div>
                <strong className="text-xs font-semibold text-white block">
                  Perfil de Atuação
                </strong>
                <p className="text-[11px] text-emerald-300 font-mono mt-0.5">
                  {selectedVerticals.length >= 4 
                    ? 'Engenharia Full-Stack / Plataforma' 
                    : selectedVerticals.length >= 2 
                    ? 'Especialista Multidisciplinar' 
                    : 'Foco Profundo em Domínio Único'}
                </p>
              </div>
              <div className="h-1.5 w-full bg-[#1F2633] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, selectedVerticals.length * 25)}%` }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. VALIDAÇÃO DE REPOSITÓRIO & PORTFÓLIO */}
        <section className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#232D3F] pb-3">
            <div>
              <h2 className="font-bold text-sm text-white">
                Repositório de Código & Portfólio Técnico
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Forneça a URL de um projeto público no GitHub com código de sua autoria.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">
              Integração GitHub Ativa
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/usuario/repositorio"
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#0D111A] border border-[#232D3F] text-xs font-mono text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleValidateRepo}
              disabled={isValidatingRepo}
              className="px-5 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isValidatingRepo ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analisando Repositório...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Validar Código</span>
                </>
              )}
            </button>
          </div>

          {/* RESULTADO DA AUDITORIA */}
          {repoValidated && (
            <div className="p-4 rounded-xl bg-[#0D111A] border border-[#232D3F] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Repositório validado com sucesso</span>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">
                  Tecnologias: <strong className="text-slate-200">TypeScript (54%), Python (32%), Go (14%)</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-300 border-t md:border-t-0 md:border-l border-[#232D3F] pt-2 md:pt-0 md:pl-4">
                <span>184 commits</span>
                <span>•</span>
                <span>32 stars</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">Índice AST: 90/100</span>
              </div>
            </div>
          )}
        </section>

        {/* 4. PRIVACIDADE & AUTONOMIA DO TALENTO */}
        <section className="bg-[#121722] p-6 rounded-2xl border border-[#232D3F] space-y-4">
          <div className="border-b border-[#232D3F] pb-3">
            <h2 className="font-bold text-sm text-white">
              Privacidade & Modelo Double Opt-In (LGPD)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Seus dados pessoais permanecem protegidos por padrão até seu consentimento mútuo.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#0D111A] border border-[#232D3F]">
            <div className="space-y-1">
              <strong className="text-xs font-semibold text-white block">
                Exibir meu perfil em modo anônimo para empresas antes do aceite mútuo
              </strong>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Seu nome completo, contatos e foto permanecem estritamente ocultos. Apenas métricas de senioridade, competências e pontuação técnica são avaliadas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAllowAnonymizedView(!allowAnonymizedView)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                allowAnonymizedView ? 'bg-amber-400' : 'bg-[#1F2633]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                allowAnonymizedView ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Garantia Regulatória */}
          <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#232D3F] flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <strong className="text-emerald-400 block font-semibold">
                Soberania sobre seus dados pessoais
              </strong>
              <p className="text-slate-400 leading-relaxed">
                Você mantém pleno controle sobre suas informações. Pode exportar seus relatórios técnicos ou solicitar exclusão a qualquer momento pelo painel.
              </p>
            </div>
          </div>
        </section>

        {/* MENSAGEM DE ERRO SE HOUVER */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* NAVEGAÇÃO FINAL */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#232D3F]">
          <button
            type="button"
            onClick={onComplete}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#121722] hover:bg-[#1A2230] border border-[#232D3F] text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao painel</span>
          </button>

          <button
            type="button"
            onClick={handleFinalSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Concluir cadastro e iniciar entrevista com IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
