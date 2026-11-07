import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Availability, Seniority, WorkModality } from '../types';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, Check, Plus, X } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C#', 'Go',
  'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Next.js', 'Tailwind CSS'
];

export const CandidateOnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, completeProfessionalOnboarding } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Etapa 1 — Perfil Profissional
  const defaultArea = currentUser?.technicalArea || 'Full-Stack';
  const [headline, setHeadline] = useState(
    `Desenvolvedor(a) ${defaultArea} ${currentUser?.seniority || 'Pleno'}`
  );
  const [seniority, setSeniority] = useState<Seniority>(currentUser?.seniority || 'Pleno');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    const areaLower = defaultArea.toLowerCase();
    if (areaLower.includes('dados') || areaLower.includes('ia')) return ['Python', 'SQL', 'AWS'];
    if (areaLower.includes('devops') || areaLower.includes('cloud')) return ['AWS', 'Docker', 'Kubernetes'];
    if (areaLower.includes('back')) return ['Node.js', 'TypeScript', 'PostgreSQL'];
    return ['React', 'TypeScript', 'Git'];
  });
  const [customSkillText, setCustomSkillText] = useState('');

  // Etapa 2 — Preferências
  const [salaryMin, setSalaryMin] = useState<string>(
    currentUser?.seniority === 'Sênior' ? '14000' : currentUser?.seniority === 'Júnior' ? '4500' : '8500'
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    currentUser?.seniority === 'Sênior' ? '18000' : currentUser?.seniority === 'Júnior' ? '6500' : '11500'
  );
  const [modality, setModality] = useState<WorkModality>('Remoto');
  const [city, setCity] = useState('São Paulo');
  const [stateUf, setStateUf] = useState('SP');
  const [availability, setAvailability] = useState<Availability>('Imediata');

  // Validação
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSkill = (skill: string) => {
    setErrorMsg('');
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    const clean = customSkillText.trim();
    if (!clean) return;
    if (!selectedSkills.some(s => s.toLowerCase() === clean.toLowerCase())) {
      setSelectedSkills([...selectedSkills, clean]);
    }
    setCustomSkillText('');
    setErrorMsg('');
  };

  const handleStep1Next = () => {
    if (!headline.trim()) {
      setErrorMsg('Informe seu cargo ou título profissional.');
      return;
    }
    if (selectedSkills.length === 0) {
      setErrorMsg('Selecione pelo menos uma competência técnica principal.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Next = () => {
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!min || !max || min <= 0 || max < min) {
      setErrorMsg('Informe uma faixa salarial válida (mínimo e máximo).');
      return;
    }
    if (!city.trim() || !stateUf.trim()) {
      setErrorMsg('Informe sua cidade e estado.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalSubmit = () => {
    completeProfessionalOnboarding({
      headline: headline.trim(),
      seniority,
      hardSkills: selectedSkills,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      modality,
      city: city.trim(),
      state: stateUf.trim().toUpperCase(),
      availability
    });
    onComplete();
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-5">

      {/* INDICADOR DE ETAPAS */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-primary text-white' : 'bg-background border border-border'}`}>
            1
          </span>
          <span>Perfil</span>
        </div>
        <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-primary text-white' : 'bg-background border border-border'}`}>
            2
          </span>
          <span>Preferências</span>
        </div>
        <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-primary text-white' : 'bg-background border border-border'}`}>
            3
          </span>
          <span>Confirmação</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-5">

        {/* ==================== ETAPA 1: PERFIL PROFISSIONAL ==================== */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                Qual é a sua especialidade?
              </h2>
              <p className="text-muted-foreground mt-0.5">
                Defina seu título profissional e competências técnicas principais.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Título Profissional ou Cargo:</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end Pleno"
                className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground font-medium text-xs focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Senioridade:</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as Seniority)}
                className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground font-medium text-xs"
              >
                <option value="Júnior">Júnior (1 a 2 anos de experiência prática)</option>
                <option value="Pleno">Pleno (3 a 5 anos de experiência prática)</option>
                <option value="Sênior">Sênior (Mais de 5 anos com autonomia técnica)</option>
                <option value="Especialista">Especialista / Tech Lead</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Competências Técnicas Principais:</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUGGESTED_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${isSelected
                          ? 'bg-primary text-white font-bold shadow-xs'
                          : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {sk} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Adicionar outra habilidade */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillText}
                  onChange={(e) => setCustomSkillText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
                  placeholder="Digitar outra competência..."
                  className="flex-1 h-9 px-3 rounded-base bg-background border border-border text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-3 h-9 bg-background hover:bg-secondary border border-border rounded-base font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 inline" /> Adicionar
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-base bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleStep1Next}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
              >
                Avançar para Preferências <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== ETAPA 2: PREFERÊNCIAS PROFISSIONAIS ==================== */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                Suas condições de trabalho
              </h2>
              <p className="text-muted-foreground mt-0.5">
                A transparência salarial garante que as empresas façam propostas alinhadas à sua expectativa.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Pretensão Mínima (R$):</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground font-bold text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">Pretensão Ideal (R$):</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground font-bold text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1">Modalidade Preferida:</label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value as WorkModality)}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground text-xs"
                >
                  <option value="Remoto">100% Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Disponibilidade:</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as Availability)}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-foreground text-xs"
                >
                  <option value="Imediata">Imediata</option>
                  <option value="15 dias">Em 15 dias</option>
                  <option value="30 dias">Em 30 dias</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-semibold text-foreground mb-1">Cidade:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">UF:</label>
                <input
                  type="text"
                  maxLength={2}
                  value={stateUf}
                  onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 rounded-base bg-background border border-border text-xs text-center font-bold"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-base bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-border hover:bg-background rounded-base font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <button
                type="button"
                onClick={handleStep2Next}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center gap-1.5 shadow-xs transition-all"
              >
                Revisar e Confirmar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== ETAPA 3: CONFIRMAÇÃO & PRIVACIDADE ==================== */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                Pronto para ativar seu perfil
              </h2>
              <p className="text-muted-foreground mt-0.5">
                Confirme as informações abaixo. Você poderá editá-las a qualquer momento.
              </p>
            </div>

            {/* Resumo simples */}
            <div className="p-3.5 bg-background rounded-base border border-border space-y-2">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-muted-foreground">Especialidade:</span>
                <strong className="text-foreground">{headline} ({seniority})</strong>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-muted-foreground">Pretensão Salarial:</span>
                <strong className="text-primary">
                  R$ {Number(salaryMin).toLocaleString('pt-BR')} a R$ {Number(salaryMax).toLocaleString('pt-BR')}
                </strong>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-muted-foreground">Modalidade & Local:</span>
                <span className="text-foreground font-medium">{modality} • {city}/{stateUf}</span>
              </div>
              <div className="pt-1">
                <span className="text-muted-foreground block mb-1">Competências cadastradas:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-white border border-border text-foreground font-semibold text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Explicação clara de privacidade */}
            <div className="p-3.5 bg-secondary/40 rounded-base border border-accent space-y-1">
              <strong className="text-primary font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacidade e Proteção de Dados (LGPD)
              </strong>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                As empresas verão inicialmente apenas o seu índice de compatibilidade e síntese de competências. Seus dados de contato (nome, e-mail, telefone) <strong>só serão compartilhados se você aceitar formalmente o convite</strong> de uma vaga.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-border hover:bg-background rounded-base font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base shadow-xs flex items-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" /> Concluir Cadastro
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
