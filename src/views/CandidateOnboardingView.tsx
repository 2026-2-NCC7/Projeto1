import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Availability, Seniority, WorkModality } from '../types';
import { Sparkles, CheckCircle2, ArrowRight, AlertCircle, User, MapPin, DollarSign, Briefcase, Clock, Plus, X } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'Go',
  'SQL',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'Next.js',
  'Tailwind CSS',
  'Spark',
  'Airflow'
];

export const CandidateOnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, completeProfessionalOnboarding } = useApp();

  const defaultArea = currentUser?.technicalArea || 'Full-Stack';
  const [headline, setHeadline] = useState(
    `Desenvolvedor(a) ${defaultArea} ${currentUser?.seniority || 'Pleno'}`
  );
  const [seniority, setSeniority] = useState<Seniority>(currentUser?.seniority || 'Pleno');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    const areaLower = defaultArea.toLowerCase();
    if (areaLower.includes('dados') || areaLower.includes('ia') || areaLower.includes('data')) {
      return ['Python', 'SQL', 'AWS'];
    }
    if (areaLower.includes('devops') || areaLower.includes('cloud') || areaLower.includes('infra')) {
      return ['AWS', 'Docker', 'Kubernetes'];
    }
    if (areaLower.includes('back')) {
      return ['Node.js', 'TypeScript', 'PostgreSQL'];
    }
    return ['React', 'TypeScript', 'Git'];
  });
  const [customSkillText, setCustomSkillText] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      setErrorMsg('Informe seu título profissional para compor o perfil.');
      return;
    }
    if (selectedSkills.length === 0) {
      setErrorMsg('Selecione ou adicione pelo menos uma hard skill principal.');
      return;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!min || !max || min <= 0 || max < min) {
      setErrorMsg('Informe uma pretensão salarial válida (mínimo e máximo).');
      return;
    }
    if (!city.trim() || !stateUf.trim()) {
      setErrorMsg('Informe sua cidade e UF de localização.');
      return;
    }

    completeProfessionalOnboarding({
      headline: headline.trim(),
      seniority,
      hardSkills: selectedSkills,
      salaryMin: min,
      salaryMax: max,
      modality,
      city: city.trim(),
      state: stateUf.trim().toUpperCase(),
      availability
    });

    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="bg-white p-6 rounded-base border border-border shadow-xs space-y-5">
        
        {/* Cabeçalho do Onboarding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brandOrange bg-brandOrange/10 px-2.5 py-0.5 rounded">
              <Sparkles className="w-3.5 h-3.5" /> Passo Único • Configuração Rápida de Perfil
            </span>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground">
              Bem-vindo(a), {currentUser?.name || 'Profissional'}!
            </h2>
            <p className="text-xs text-muted-foreground">
              Complete as informações mínimas do seu perfil técnico para ativar o Matchmaking com proteção Double Opt-In.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-secondary px-2.5 py-1 rounded block">
              +50 🪙 Estalecas Q.I. ao concluir
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Título Profissional e Senioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Título Profissional (Headline) *
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ex: Desenvolvedor(a) Front-end Pleno | React, TypeScript"
                className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" /> Senioridade *
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as Seniority)}
                className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Júnior">Júnior</option>
                <option value="Pleno">Pleno</option>
                <option value="Sênior">Sênior</option>
              </select>
            </div>
          </div>

          {/* Principais Hard Skills */}
          <div className="p-3.5 bg-background rounded-base border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground">
                Principais Hard Skills * <span className="text-muted-foreground font-normal">(selecione ou adicione)</span>
              </label>
              <span className="text-[11px] font-bold text-primary">
                {selectedSkills.length} selecionada(s)
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-white text-foreground border-border hover:bg-secondary/60'
                    }`}
                  >
                    {sk}
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            {/* Adicionar outra skill manualmente */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSkillText}
                onChange={(e) => setCustomSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                placeholder="Adicionar outra tecnologia (ex: Rust, Vue.js, Terraform)..."
                className="flex-1 h-8 px-2.5 bg-white border border-border rounded-base text-xs text-foreground"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3 h-8 bg-secondary text-primary font-bold rounded-base hover:bg-secondary/80 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Incluir
              </button>
            </div>

            {selectedSkills.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Selecionadas:</span>
                {selectedSkills.map(sk => (
                  <span key={sk} className="inline-flex items-center gap-1 text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                    {sk}
                    <button type="button" onClick={() => toggleSkill(sk)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pretensão Salarial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" /> Pretensão Salarial Mínima (R$/mês) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={salaryMin}
                onChange={(e) => {
                  setSalaryMin(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" /> Pretensão Salarial Ideal/Máxima (R$/mês) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={salaryMax}
                onChange={(e) => {
                  setSalaryMax(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full h-9 px-3 bg-background border border-border rounded-base text-foreground font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Modalidade, Localização e Disponibilidade */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block font-semibold text-foreground mb-1">Modalidade Preferida *</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as WorkModality)}
                className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground font-medium"
              >
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Cidade *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ex: São Paulo"
                className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">UF *</label>
              <input
                type="text"
                maxLength={2}
                value={stateUf}
                onChange={(e) => {
                  setStateUf(e.target.value.toUpperCase());
                  setErrorMsg('');
                }}
                placeholder="SP"
                className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Disponibilidade *
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as Availability)}
                className="w-full h-9 px-2.5 bg-background border border-border rounded-base text-foreground font-medium"
              >
                <option value="Imediata">Imediata</option>
                <option value="15 dias">15 dias</option>
                <option value="30 dias">30 dias</option>
                <option value="A combinar">A combinar</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-base bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">
              🔒 Seus contatos permanecem privados até seu aceite individual (Double Opt-In LGPD).
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Salvar Perfil e Ir para o Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
