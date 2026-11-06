import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CandidateSkill, SkillMastery } from '../types';
import { Plus, Trash2, CheckCircle2, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';

const SKILL_CATALOG_SAMPLES = [
  // Linguagens
  { name: 'JavaScript', category: 'Linguagens' },
  { name: 'TypeScript', category: 'Linguagens' },
  { name: 'Python', category: 'Linguagens' },
  { name: 'Java', category: 'Linguagens' },
  { name: 'C#', category: 'Linguagens' },
  { name: 'Go', category: 'Linguagens' },
  { name: 'Rust', category: 'Linguagens' },
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
  // Bancos
  { name: 'PostgreSQL', category: 'Bancos e dados' },
  { name: 'MongoDB', category: 'Bancos e dados' },
  { name: 'Redis', category: 'Bancos e dados' },
  { name: 'SQL', category: 'Bancos e dados' },
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps/Infra' },
  { name: 'Git', category: 'DevOps/Infra' },
  { name: 'Kubernetes', category: 'DevOps/Infra' }
];

export const CandidateProfileView: React.FC = () => {
  const { currentCandidateId, candidates, updateCandidateProfile, addCandidateSkill, removeCandidateSkill, suggestNewSkill, joinCommunity } = useApp();
  
  const profile = candidates[currentCandidateId] || candidates['cand-lucas'];

  // Estados locais para edição rápida de skill
  const [selectedSkillName, setSelectedSkillName] = useState(SKILL_CATALOG_SAMPLES[0].name);
  const [selectedMastery, setSelectedMastery] = useState<SkillMastery>('Intermediário');
  const [experienceYears, setExperienceYears] = useState(2);
  const [experienceMonths, setExperienceMonths] = useState(0);

  // Sugestão de nova habilidade
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Adesão à comunidade
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  // Confirmação de exclusão e feedback
  const [skillToDelete, setSkillToDelete] = useState<CandidateSkill | null>(null);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  if (!profile) {
    return <div className="p-4 text-xs text-muted-foreground">Perfil não localizado para a persona ativa.</div>;
  }

  // Cálculo de completude do perfil (demonstrativo sem bloqueio)
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

  const handleAddSkill = () => {
    const catalogItem = SKILL_CATALOG_SAMPLES.find(s => s.name === selectedSkillName);
    const safeYears = Math.max(0, Number(experienceYears) || 0);
    const safeMonths = Math.max(0, Math.min(11, Number(experienceMonths) || 0));

    const newSkill: CandidateSkill = {
      id: `sk-${Date.now()}`,
      name: selectedSkillName,
      category: catalogItem?.category || 'Geral',
      mastery: selectedMastery,
      years: safeYears,
      months: safeMonths
    };
    addCandidateSkill(currentCandidateId, newSkill);
    setProfileNotice(`✓ Habilidade "${selectedSkillName}" adicionada com sucesso ao seu perfil técnico.`);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const handleSuggestCustom = () => {
    if (!customSkillInput.trim()) return;
    suggestNewSkill(customSkillInput);
    const newSkill: CandidateSkill = {
      id: `sk-custom-${Date.now()}`,
      name: customSkillInput.trim(),
      category: 'Especialidade Sugerida',
      mastery: selectedMastery,
      years: Math.max(0, Number(experienceYears) || 0),
      months: Math.max(0, Math.min(11, Number(experienceMonths) || 0)),
      isCustom: true,
      status: 'pendente_revisao'
    };
    addCandidateSkill(currentCandidateId, newSkill);
    setCustomSkillInput('');
    setShowCustomModal(false);
    setProfileNotice(`✓ Habilidade sugerida "${newSkill.name}" adicionada ao seu perfil.`);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const confirmDeleteSkill = () => {
    if (!skillToDelete) return;
    removeCandidateSkill(currentCandidateId, skillToDelete.id);
    setProfileNotice(`Habilidade "${skillToDelete.name}" removida do seu perfil.`);
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
    setProfileNotice('🎉 Perfil na Comunidade Técnica criado com sucesso!');
    setTimeout(() => setProfileNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* CARD PRINCIPAL DE IDENTIFICAÇÃO E COMPLETUDE */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-foreground">{profile.name}</h2>
                <span className="text-[10px] bg-secondary text-primary px-2 py-0.5 rounded font-bold">
                  {profile.seniority}
                </span>
                <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded font-medium">
                  {profile.visibility}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.headline}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                📍 {profile.city}/{profile.state} • Disponibilidade: <strong>{profile.availability}</strong>
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto text-left sm:text-right shrink-0">
            <span className="text-xs font-bold text-foreground">Completude do Perfil</span>
            <div className="w-full sm:w-36 h-2 bg-background border border-border rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">{completenessPercent}% das informações preenchidas</span>
          </div>
        </div>

        {/* FEEDBACK NOTICE */}
        {profileNotice && (
          <div className="mt-4 p-3 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-xs transition-all">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{profileNotice}</span>
          </div>
        )}
      </div>

      {/* ADESÃO À COMUNIDADE (SE AINDA NÃO FOR MEMBRO) */}
      {!profile.joinedCommunity && (
        <div className="bg-secondary/40 border border-accent p-4 rounded-base flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <strong className="text-xs font-bold text-primary flex items-center gap-1.5">
              🚀 Participe da Comunidade Técnica Q.I. Tech
            </strong>
            <p className="text-xs text-foreground">
              Conecte-se com outros desenvolvedores, compartilhe artigos e participe do programa "Quem Indica" para acumular Estalecas Q.I.
            </p>
          </div>
          <button
            onClick={() => setShowCommunityModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base shadow-xs shrink-0 transition-all"
          >
            Ativar Perfil Comunitário
          </button>
        </div>
      )}

      {/* GESTÃO DE HARD SKILLS */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">Habilidades Técnicas (Hard Skills)</h3>
            <p className="text-xs text-muted-foreground">
              Cadastre suas tecnologias e frameworks com nível de domínio e tempo de prática comprovado.
            </p>
          </div>
          <button
            onClick={() => setShowCustomModal(true)}
            className="text-xs text-primary font-bold hover:underline self-start sm:self-auto"
          >
            + Sugerir habilidade fora da lista
          </button>
        </div>

        {/* Formulário de Adição Rápida */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-background p-4 rounded-base border border-border text-xs">
          <div>
            <label className="block text-muted-foreground font-medium mb-1">Tecnologia do Catálogo:</label>
            <select
              value={selectedSkillName}
              onChange={(e) => setSelectedSkillName(e.target.value)}
              className="w-full h-9 bg-white border border-border rounded-base px-2.5 text-foreground font-medium"
            >
              {SKILL_CATALOG_SAMPLES.map(s => (
                <option key={s.name} value={s.name}>{s.name} ({s.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Nível de Domínio:</label>
            <select
              value={selectedMastery}
              onChange={(e) => setSelectedMastery(e.target.value as SkillMastery)}
              className="w-full h-9 bg-white border border-border rounded-base px-2.5 text-foreground font-medium"
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Especialista">Especialista</option>
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Tempo de Experiência:</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Math.max(0, Number(e.target.value) || 0))}
                className="w-1/2 h-9 bg-white border border-border rounded-base px-2 text-foreground"
                placeholder="Anos"
              />
              <input
                type="number"
                min="0"
                max="11"
                value={experienceMonths}
                onChange={(e) => setExperienceMonths(Math.max(0, Math.min(11, Number(e.target.value) || 0)))}
                className="w-1/2 h-9 bg-white border border-border rounded-base px-2 text-foreground"
                placeholder="Meses"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddSkill}
              className="w-full h-9 bg-primary hover:bg-primary-dark text-white font-bold rounded-base flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" /> Adicionar Habilidade
            </button>
          </div>
        </div>

        {/* Tabela de Habilidades Adicionadas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-base">
            <thead className="bg-background text-muted-foreground border-b border-border">
              <tr>
                <th className="p-2.5">Habilidade</th>
                <th className="p-2.5">Categoria</th>
                <th className="p-2.5">Domínio</th>
                <th className="p-2.5">Tempo de Experiência</th>
                <th className="p-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profile.skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">Nenhuma habilidade adicionada ainda.</td>
                </tr>
              ) : (
                profile.skills.map((sk) => (
                  <tr key={sk.id} className="hover:bg-background/60">
                    <td className="p-2.5 font-bold text-foreground flex items-center gap-2">
                      {sk.name}
                      {sk.isCustom && (
                        sk.status === 'aprovada' ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            ✓ Aprovada pela Curadoria
                          </span>
                        ) : (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">
                            ⏳ Pendente de Revisão
                          </span>
                        )
                      )}
                    </td>
                    <td className="p-2.5 text-muted-foreground">{sk.category}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-primary">
                        {sk.mastery}
                      </span>
                    </td>
                    <td className="p-2.5 text-foreground">{sk.years} ano(s) {sk.months ? `e ${sk.months} m.` : ''}</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setSkillToDelete(sk)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                        title="Remover habilidade"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEMAIS DADOS DO PERFIL (PREFERÊNCIAS E CONTRATAÇÃO) */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-2">
          Preferências de Contratação & Condições (Privadas até o Double Opt-In)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-muted-foreground font-medium mb-1">Pretensão Salarial:</span>
            <div className="p-2.5 bg-background rounded-base border border-border font-bold text-foreground">
              R$ {profile.salaryMin.toLocaleString('pt-BR')} a R$ {profile.salaryMax.toLocaleString('pt-BR')}
            </div>
          </div>

          <div>
            <span className="block text-muted-foreground font-medium mb-1">Modelos Aceitos:</span>
            <div className="p-2.5 bg-background rounded-base border border-border text-foreground font-medium">
              {profile.contractTypes.join(', ')}
            </div>
          </div>

          <div>
            <span className="block text-muted-foreground font-medium mb-1">Modalidades Aceitas:</span>
            <div className="p-2.5 bg-background rounded-base border border-border text-foreground font-medium">
              {profile.modalities.join(', ')}
            </div>
          </div>

          <div>
            <span className="block text-muted-foreground font-medium mb-1">Visibilidade do Perfil:</span>
            <select
              value={profile.visibility}
              onChange={(e) => updateCandidateProfile(currentCandidateId, { visibility: e.target.value as any })}
              className="w-full h-10 bg-background border border-border rounded-base px-2.5 font-bold text-primary"
            >
              <option value="Ativo">Ativo (Aberto a convites)</option>
              <option value="Discreto">Discreto (Oculto da empresa atual)</option>
              <option value="Pausado">Pausado (Fora de buscas)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            Seus contatos permanecem privados até seu aceite individual por vaga.
          </span>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `dados-lgpd-${profile.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1.5 rounded-base bg-secondary text-primary font-bold hover:bg-secondary/80 shrink-0 transition-all"
          >
            📥 Exportar Meus Dados (LGPD)
          </button>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO DE SKILL */}
      {skillToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-base border border-border p-5 max-w-sm w-full shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm">
              <AlertTriangle className="w-4 h-4" /> Confirmar Remoção
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tem certeza que deseja remover <strong>{skillToDelete.name}</strong> do seu perfil? Esta alteração impactará seu score de compatibilidade nas vagas abertas.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSkillToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-muted-foreground hover:bg-background rounded-base border border-border"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteSkill}
                className="px-4 py-1.5 text-xs bg-destructive text-white font-bold rounded-base hover:opacity-90 shadow-xs"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUGERIR HABILIDADE INEXISTENTE */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-base border border-border p-5 max-w-md w-full shadow-lg space-y-4">
            <h4 className="font-heading font-bold text-sm text-foreground">Sugerir Nova Habilidade Técnica</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Caso sua stack ou framework não conste no catálogo inicial, digite o nome abaixo. A habilidade será incorporada ao seu perfil imediatamente como <em>"pendente de revisão"</em>, sem alterar silenciosamente o catálogo global do sistema.
            </p>
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Ex: Mojo, Qiskit, Solidity..."
              className="w-full h-9 bg-background border border-border rounded-base px-3 text-xs focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-background rounded-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleSuggestCustom}
                className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded-base hover:bg-primary-dark"
              >
                Salvar no Meu Perfil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADERIR À COMUNIDADE PESSOA FÍSICA */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-base border border-border p-5 max-w-md w-full shadow-lg space-y-4">
            <h4 className="font-heading font-bold text-sm text-foreground">Entrar na Comunidade Q.I. Tech</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Confirmando sua adesão, criaremos seu perfil social como <strong>pessoa física</strong> aproveitando suas hard skills públicas, foto e biografia.
            </p>
            <div className="p-3 bg-background rounded-base text-[11px] text-muted-foreground space-y-1">
              <p>✓ <strong>Não será exibido:</strong> Pretensão salarial, disponibilidade ou dados de recrutamento.</p>
              <p>✓ <strong>Será exibido:</strong> Nome, foto, headline técnica e tags de habilidades autorizadas.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCommunityModal(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-background rounded-base"
              >
                Agora Não
              </button>
              <button
                onClick={handleConfirmCommunity}
                className="px-4 py-1.5 text-xs bg-primary text-white font-bold rounded-base hover:bg-primary-dark"
              >
                Confirmar Criação do Perfil Comunitário
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
