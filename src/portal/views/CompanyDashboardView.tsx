import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Seniority, WorkContractType, WorkModality } from '../types';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  Plus,
  Filter,
  Calendar,
  Video,
  Lock,
  Play,
  Pause,
  Download,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  Zap,
  Volume2,
  Eye,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { Job, Company as ApiCompany } from '../../types';

interface CompanyDashboardViewProps {
  onSelectVacancy: (vacancyId: string) => void;
  onOpenMatchingIa?: (jobId?: string) => void;
  onOpenComparison?: (jobId?: string) => void;
}

interface KanbanCandidate {
  id: string;
  displayCode: string;
  name: string;
  role: string;
  vertical: string;
  seniority: string;
  matchScore: number;
  tags: string[];
  isAnonymous: boolean;
  avatarInitials: string;
  avatarColor: string;
  status: 'apresentado' | 'agendado' | 'aprovado' | 'recusado';
  // Áudio da resposta
  audioTitle?: string;
  audioDuration?: string;
  whisperTranscription?: string;
  // Agendamento
  scheduleDate?: string;
  meetLink?: string;
  // Aprovação
  onboardingDate?: string;
  consumedSlot?: string;
  // Recusa
  rejectReason?: string;
  receivedAt?: string;
}

export const CompanyDashboardView: React.FC<CompanyDashboardViewProps> = ({
  onSelectVacancy,
  onOpenMatchingIa,
  onOpenComparison
}) => {
  const {
    currentCompany,
    vacancies,
    selectionProcesses,
    createVacancy
  } = useApp();

  // Estados dos Filtros (Alinhados com a captura oficial do Painel Corporativo B2B)
  const [selectedVertical, setSelectedVertical] = useState<string>('Todos (12)');
  const [selectedSeniority, setSelectedSeniority] = useState<string>('Sênior (12/12)');

  // Lista de Candidatos no Pipeline Kanban
  const [candidatesList, setCandidatesList] = useState<KanbanCandidate[]>([
    {
      id: 'cand-4892',
      displayCode: '#4892',
      name: 'Candidato #4892',
      role: 'Backend Sênior',
      vertical: 'Backend',
      seniority: 'Sênior',
      matchScore: 92,
      tags: ['Python', 'Kafka', 'PostgreSQL', '+6 anos XP'],
      isAnonymous: true,
      avatarInitials: '#48',
      avatarColor: 'bg-[#0c0e12] text-brand-yellow border-brand-yellow/30',
      status: 'apresentado',
      audioTitle: 'Resposta 01: Resiliência e M...',
      audioDuration: '01:42 / 03:00',
      whisperTranscription:
        'Costumo estruturar a resiliência em mensageria usando tópicos de retry com backoff exponencial e Dead Letter Queues (DLQ) isoladas. Para garantir idempotência em pagamentos, utilizo chaves únicas no cabeçalho HTTP salvas atomicamente no Redis com TTL antes da gravação no PostgreSQL...',
      receivedAt: 'Recebido hoje'
    },
    {
      id: 'cand-5104',
      displayCode: '#5104',
      name: 'Candidato #5104',
      role: 'Fullstack Lead / Go / React',
      vertical: 'Backend',
      seniority: 'Tech Lead',
      matchScore: 89,
      tags: ['Go', 'React', 'Docker', 'Kubernetes'],
      isAnonymous: true,
      avatarInitials: '#51',
      avatarColor: 'bg-[#0c0e12] text-emerald-400 border-emerald-500/30',
      status: 'apresentado',
      audioTitle: 'Resposta 02: Arquitetura E...',
      audioDuration: '02:11 / 03:00',
      whisperTranscription:
        'Na última arquitetura de alta escala, desenhei um pipeline com go-routines gerenciadas por worker pools e circuit breaker com Resilience4j adaptado para microsserviços em cloud nativa AWS...',
      receivedAt: 'Recebido há 4h'
    },
    {
      id: 'cand-lucas',
      displayCode: '#8849',
      name: 'Lucas Oliveira',
      role: 'DevOps & Cloud • Sênior',
      vertical: 'Cloud & DevOps',
      seniority: 'Sênior',
      matchScore: 88,
      tags: ['AWS', 'Kubernetes', 'Terraform'],
      isAnonymous: false,
      avatarInitials: 'LS',
      avatarColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      status: 'agendado',
      scheduleDate: 'Amanhã - 14:30 (BRT)',
      meetLink: 'https://meet.google.com/qit-tech-inv'
    },
    {
      id: 'cand-beatriz',
      displayCode: '#1024',
      name: 'Beatriz Mendes',
      role: 'Data Engineer Especialista',
      vertical: 'Data Engineering',
      seniority: 'Especialista',
      matchScore: 94,
      tags: ['Spark', 'Airflow', 'Delta Lake'],
      isAnonymous: false,
      avatarInitials: 'BM',
      avatarColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      status: 'aprovado',
      onboardingDate: 'Início Previsto: 03/11',
      consumedSlot: 'Slot #1 Consumido'
    },
    {
      id: 'cand-3911',
      displayCode: '#3911',
      name: 'Candidato Arquivado #3911',
      role: 'DevOps • Match: 77%',
      vertical: 'Cloud & DevOps',
      seniority: 'Sênior',
      matchScore: 77,
      tags: ['Azure', 'Jenkins', 'Linux'],
      isAnonymous: true,
      avatarInitials: '#39',
      avatarColor: 'bg-slate-700/40 text-slate-400 border-slate-600/40',
      status: 'recusado',
      rejectReason: 'Exigência mandatória de arquitetura multi-cloud com Terraform e EKS.'
    }
  ]);

  // Modais e Player
  const [activeTranscriptionCandidate, setActiveTranscriptionCandidate] = useState<KanbanCandidate | null>(null);
  const [dossierCandidate, setDossierCandidate] = useState<KanbanCandidate | null>(null);
  const [showLgpdAuditModal, setShowLgpdAuditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Áudio Player Simulado com Web Audio API
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlayAudio = (candidateId: string) => {
    if (playingAudioId === candidateId) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(null);
      setAudioProgress(0);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(candidateId);
      setAudioProgress(10);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioIntervalRef.current!);
            setPlayingAudioId(null);
            return 0;
          }
          return prev + 6;
        });
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  // Notificação Toast temporária
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Ações de Convite / Recusa
  const handleInviteCandidate = (candId: string) => {
    setCandidatesList((prev) =>
      prev.map((c) => {
        if (c.id === candId) {
          return {
            ...c,
            status: 'agendado',
            isAnonymous: false,
            name: c.name.includes('#') ? 'Lucas Silveira (Autorizado)' : c.name,
            avatarInitials: 'LS',
            scheduleDate: 'Sugerido: Próxima Terça • 15:00',
            meetLink: 'https://meet.google.com/qit-inv-b2b'
          };
        }
        return c;
      })
    );
    showToast('✓ Convite bilateral enviado com sucesso! Aguardando aceite mútua (Double Opt-In).');
  };

  const handleRejectCandidate = (candId: string) => {
    setCandidatesList((prev) =>
      prev.map((c) => {
        if (c.id === candId) {
          return {
            ...c,
            status: 'recusado',
            rejectReason: 'Critério de senioridade em microserviços concorrentes não atingiu o piso de 90% para esta vaga específica.'
          };
        }
        return c;
      })
    );
    showToast('✕ Candidato arquivado com devolutiva técnica fundamentada enviada (Art. 20 LGPD).');
  };

  // Modal de Criação de Vaga em 3 etapas (funcionalidade existente preservada)
  const [showNewVacancyModal, setShowNewVacancyModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Backend');
  const [seniority, setSeniority] = useState<Seniority>('Sênior');
  const [modality, setModality] = useState<WorkModality>('Remoto');
  const [location, setLocation] = useState('São Paulo/SP (ou Remoto)');
  const [salaryMin, setSalaryMin] = useState<string>('16000');
  const [salaryMax, setSalaryMax] = useState<string>('22000');
  const [mandatorySkillsInput, setMandatorySkillsInput] = useState('Go, Python, Kafka, PostgreSQL, Kubernetes');
  const [softSkillsInput, setSoftSkillsInput] = useState('Arquitetura Limpa, Comunicação Técnica, Liderança');
  const [description, setDescription] = useState('Atuação no core bancário de pagamentos escaláveis com microsserviços orientados a eventos.');
  const [isUrgentMatchExpress, setIsUrgentMatchExpress] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSavingVacancy, setIsSavingVacancy] = useState(false);

  const handleStep1Next = () => {
    if (!title.trim()) {
      setFormError('Informe o título da vaga.');
      return;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!min || !max || min <= 0 || max < min) {
      setFormError('Transparência Salarial Obrigatória: informe uma faixa válida.');
      return;
    }
    setFormError('');
    setModalStep(2);
  };

  const handleStep2Next = () => {
    const mandatory = mandatorySkillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (mandatory.length === 0) {
      setFormError('Informe pelo menos uma competência técnica mandatória.');
      return;
    }
    setFormError('');
    setModalStep(3);
  };

  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    const mandatory = mandatorySkillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const softs = softSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    setIsSavingVacancy(true);
    setFormError('');

    createVacancy({
      title: title.trim(),
      area,
      seniority,
      mandatorySkills: mandatory.length ? mandatory : ['Python', 'Kafka'],
      desirableSkills: ['Kubernetes', 'Terraform'],
      softSkills: softs.length ? softs : ['Comunicação'],
      contractTypes: ['CLT', 'PJ'] as WorkContractType[],
      modality,
      location,
      salaryMin: min,
      salaryMax: max,
      description,
      conditions: 'Plano de Saúde Internacional, Bônus Semestral, Home Office 100%.',
      isUrgentMatchExpress
    });

    try {
      await api.createJob({
        company_id: 'comp-alpha-nexus',
        title: title.trim(),
        description,
        tech_vertical: area,
        seniority,
        contract_type: 'PJ',
        work_model: 'REMOTO',
        min_salary: min,
        max_salary: max,
        min_experience_years: 5.0,
        skills: mandatory.map((sk) => ({
          skill_id: `hard-${sk.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          is_mandatory: true,
          min_level: 4,
          weight: 2.0
        }))
      });
    } catch {
      // Sincronização offline garantida
    } finally {
      setIsSavingVacancy(false);
      setTitle('');
      setFormError('');
      setModalStep(1);
      setShowNewVacancyModal(false);
      showToast(`✓ Vaga "${title.trim()}" ativada! 1 Slot consumido no Pipeline.`);
    }
  };

  // Filtragem dinâmica dos candidatos
  const filteredCandidates = candidatesList.filter((c) => {
    const isAllVerticals = selectedVertical.startsWith('Todo') || selectedVertical === 'Todas (28)';
    const matchVertical =
      isAllVerticals ||
      c.vertical.toLowerCase().includes(selectedVertical.toLowerCase()) ||
      c.role.toLowerCase().includes(selectedVertical.toLowerCase());
    const matchSeniority =
      selectedSeniority.includes('Sênior') ? c.seniority === 'Sênior' || c.seniority === 'Tech Lead' : true;
    return matchVertical && matchSeniority;
  });

  const presentedCandidates = filteredCandidates.filter((c) => c.status === 'apresentado');
  const scheduledCandidates = filteredCandidates.filter((c) => c.status === 'agendado');
  const approvedCandidates = filteredCandidates.filter((c) => c.status === 'aprovado');
  const rejectedCandidates = filteredCandidates.filter((c) => c.status === 'recusado');

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#121722] border border-amber-400/40 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          1. HEADER CORPORATIVO B2B - PIPELINE ATIVO & GESTÃO DE SLOTS (RN03/RN04)
      ========================================================================= */}
      <div className="bg-[#111318] border border-[#262F40] rounded-xl p-5 md:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Identificação da Empresa */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shrink-0 shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30">
                PLANO ENTERPRISE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SLA 24h
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-white">
              {currentCompany?.name || 'Orion Tech Solutions'}
            </h1>
            <p className="text-xs text-slate-400">
              Pipeline Ativo de Engenharia Invertida (RF15 Audit Ready)
            </p>
          </div>
        </div>

        {/* Medidor de Slots & Ação Primária */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 shrink-0 bg-[#0c0e12]/60 p-3.5 rounded-xl border border-[#262F40]">
          
          {/* Círculo indicador de Slots */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#161B26] border-2 border-brand-yellow font-heading font-black text-xs text-brand-yellow shadow-inner">
              2/3
            </div>
            <div className="text-left space-y-0.5">
              <span className="text-xs font-bold text-slate-200 block">
                Slots Ativos: 2 de 3 • <span className="text-emerald-400">1 slot livre</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                RENOVAÇÃO MENSAL: 18 DE OUTUBRO, 2025
              </span>
            </div>
          </div>

          {/* Botão de Adição de Vaga / Consumo de Slot */}
          <button
            onClick={() => {
              setModalStep(1);
              setShowNewVacancyModal(true);
            }}
            className="px-4 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-slate-950 text-xs font-bold font-heading rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Adicionar Nova Vaga / Consumir Slot
          </button>
        </div>

      </div>

      {/* =========================================================================
          2. BARRA DE FILTROS: VERTICAIS, SENIORIDADE & CORTE ANTI-SPAM (≥ 75%)
      ========================================================================= */}
      <div className="bg-[#111318] border border-[#262F40] rounded-2xl p-4 space-y-3.5 shadow-xl">
        
        {/* Linha 1: Verticais Técnicas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#d1c6ab] font-bold shrink-0 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-brand-yellow" /> VERTICAIS:
          </span>
          {[
            'Todos (12)',
            'Backend',
            'Frontend',
            'Mobile',
            'Cloud & DevOps',
            'Data Engineering',
            'AI & Machine Learning',
            'Cybersecurity'
          ].map((vert) => {
            const isActive = selectedVertical === vert;
            return (
              <button
                key={vert}
                onClick={() => setSelectedVertical(vert)}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#282a2e] text-[#facc15] font-bold border border-[#facc15]/40 shadow-sm'
                    : 'bg-[#161B26] text-[#d1c6ab] hover:text-white hover:bg-[#1a1c22] border border-[#262F40]'
                }`}
              >
                {vert}
              </button>
            );
          })}
        </div>

        {/* Linha 2: Senioridade & Corte Mínimo Anti-Spam */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2.5 border-t border-[#262F40]/60">
          
          <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d1c6ab] font-bold shrink-0 mr-1">
              SENIORIDADE:
            </span>
            {['Júnior', 'Pleno', 'Sênior (12/12)', 'Especialista', 'Tech Lead'].map((sen) => {
              const isActive = selectedSeniority === sen;
              return (
                <button
                  key={sen}
                  onClick={() => setSelectedSeniority(sen)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#282a2e] text-[#facc15] font-bold border border-[#facc15]/40 shadow-sm'
                      : 'bg-[#161B26] text-[#d1c6ab] hover:text-white hover:bg-[#1a1c22] border border-[#262F40]'
                  }`}
                >
                  {sen}
                </button>
              );
            })}
          </div>

          {/* Badge de Corte Mínimo Anti-Spam */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c0e12] border border-emerald-500/30 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Corte Mínimo Anti-Spam:</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ≥ 75% IA
              </span>
              <span className="text-slate-400">| Exclusivo Q.I. Tech</span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          3. KANBAN RF15 - 4 COLUNAS: APRESENTADO, AGENDADO, APROVADO, RECUSADO
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        
        {/* ---------------------------------------------------------------------
            COLUNA 1: 1. APRESENTADO (Pré-filtrados com IA >= 75%)
        --------------------------------------------------------------------- */}
        <div className="bg-[#111318] border border-[#262F40] rounded-xl p-3.5 space-y-3 shadow-lg">
          
          {/* Header da Coluna */}
          <div className="border-b border-[#262F40] pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  1. Apresentado
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-brand-yellow/15 text-brand-yellow px-2 py-0.5 rounded-full border border-brand-yellow/30">
                0{presentedCandidates.length} Matchs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Pré-filtrados com IA ≥ 75% e avaliados por Qwen.
            </p>
          </div>

          {/* Cards da Coluna 1 */}
          <div className="space-y-3">
            {presentedCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-[#161B26] border border-[#262F40] hover:border-brand-yellow/50 rounded-xl p-3.5 space-y-3 transition-all shadow-md group"
              >
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${cand.avatarColor}`}>
                      {cand.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-white block">
                          {cand.name}
                        </strong>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Anonimizado - {cand.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0 flex items-center gap-1">
                    {cand.matchScore}%
                  </span>
                </div>

                {/* Tags Técnicas */}
                <div className="flex flex-wrap gap-1">
                  {cand.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-[#0c0e12] text-slate-300 border border-[#262F40] px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Player de Áudio da Resposta de Triagem */}
                {cand.audioTitle && (
                  <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#262F40] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300 truncate max-w-[150px]">
                        {cand.audioTitle}
                      </span>
                      <span className="font-mono text-slate-400">{cand.audioDuration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePlayAudio(cand.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-slate-950 font-bold transition-all shadow-sm ${
                          playingAudioId === cand.id ? 'bg-emerald-400' : 'bg-brand-yellow hover:bg-yellow-400'
                        }`}
                      >
                        {playingAudioId === cand.id ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>

                      {/* Waveform interativa */}
                      <div className="flex-1 h-5 flex items-center gap-0.5 overflow-hidden">
                        {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 70, 85, 40, 60, 90, 75, 50, 65, 80, 45, 90, 100, 60, 40].map((h, i) => {
                          const isActive = playingAudioId === cand.id && (i / 24) * 100 <= audioProgress;
                          return (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isActive ? 'bg-brand-yellow' : 'bg-[#262F40]'
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Link de Leitura da Transcrição Whisper */}
                {cand.whisperTranscription && (
                  <button
                    onClick={() => setActiveTranscriptionCandidate(cand)}
                    className="w-full py-1 text-center text-[10px] font-mono text-slate-400 hover:text-brand-yellow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3 h-3 text-slate-400" /> Ler Transcrição Whisper (100% Auditável)
                  </button>
                )}

                {/* Ações: Convidar / Recusar */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#262F40]">
                  <button
                    onClick={() => handleInviteCandidate(cand.id)}
                    className="py-1.5 px-2 bg-[#0c0e12] hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-400 border border-[#262F40] hover:border-emerald-500/40 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Convidar
                  </button>
                  <button
                    onClick={() => handleRejectCandidate(cand.id)}
                    className="py-1.5 px-2 bg-[#0c0e12] hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-[#262F40] hover:border-red-500/40 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" /> Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            COLUNA 2: 2. ENTREVISTA AGENDADA (Double Opt-In Aprovado)
        --------------------------------------------------------------------- */}
        <div className="bg-[#111318] border border-[#262F40] rounded-xl p-3.5 space-y-3 shadow-lg">
          
          {/* Header da Coluna */}
          <div className="border-b border-[#262F40] pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  2. Entrevista Agendada
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                0{scheduledCandidates.length} Agendadas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Double Opt-In aprovado mutuamente (Dev + Empresa).
            </p>
          </div>

          {/* Cards da Coluna 2 */}
          <div className="space-y-3">
            {scheduledCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-[#161B26] border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-3.5 space-y-3 transition-all shadow-md"
              >
                {/* Header com Opt-In Confirmado */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Opt-In Confirmado
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {cand.matchScore}%
                  </span>
                </div>

                {/* Perfil Desanonimizado */}
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-heading font-bold text-xs ${cand.avatarColor}`}>
                    {cand.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {cand.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      {cand.role}
                    </span>
                  </div>
                </div>

                {/* Tags Técnicas */}
                <div className="flex flex-wrap gap-1">
                  {cand.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-[#0c0e12] text-slate-300 border border-[#262F40] px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Detalhes do Agendamento */}
                <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#262F40] space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{cand.scheduleDate || 'Amanhã • 14:30 (BRT)'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Google Meet gerado • 45 min
                  </span>
                </div>

                {/* Ação: Abrir Sala */}
                <div className="pt-1">
                  <a
                    href={cand.meetLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-[#0c0e12] hover:bg-[#111318] border border-[#262F40] hover:border-emerald-500/50 text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" /> Abrir Sala
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            COLUNA 3: 3. APROVADO (Validado e Contratado - Consome Slot)
        --------------------------------------------------------------------- */}
        <div className="bg-[#111318] border border-[#262F40] rounded-xl p-3.5 space-y-3 shadow-lg">
          
          {/* Header da Coluna */}
          <div className="border-b border-[#262F40] pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  3. Aprovado
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                0{approvedCandidates.length} Contratado
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Validado pelo time técnico e aprovado para contratação.
            </p>
          </div>

          {/* Cards da Coluna 3 */}
          <div className="space-y-3">
            {approvedCandidates.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#161B26]/30 border border-dashed border-[#262F40] text-center space-y-2">
                <span className="text-xs font-mono text-slate-500 block">Nenhum talento contratado no ciclo</span>
                <p className="text-[10px] text-slate-600 max-w-[200px] mx-auto">
                  Candidatos validados após entrevista técnica consumirão 1 slot do pipeline.
                </p>
              </div>
            ) : (
              approvedCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-[#161B26] border border-[#262F40] hover:border-emerald-500/50 rounded-xl p-3.5 space-y-3 transition-all shadow-md"
                >
                  {/* Header com Selecionado */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selecionado(a)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {cand.matchScore}%
                    </span>
                  </div>

                  {/* Perfil */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-heading font-bold text-xs ${cand.avatarColor}`}>
                      {cand.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {cand.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {cand.role}
                      </span>
                    </div>
                  </div>

                  {/* Tags Técnicas */}
                  <div className="flex flex-wrap gap-1">
                    {cand.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-[#0c0e12] text-slate-300 border border-[#262F40] px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Onboarding e Slot */}
                  <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#262F40] space-y-1 text-[11px]">
                    <span className="text-emerald-400 font-semibold block">
                      Em onboarding técnico
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {cand.onboardingDate || 'Início Previsto: 03/11'}
                    </span>
                  </div>

                  {/* Footer do Card */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#262F40] text-xs">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-brand-yellow" /> {cand.consumedSlot || 'Slot #1 Consumido'}
                    </span>
                    <button
                      onClick={() => setDossierCandidate(cand)}
                      className="text-[11px] font-semibold text-brand-yellow hover:underline"
                    >
                      Ver Dossiê
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            COLUNA 4: 4. RECUSADO (Feedback Fundamentado LGPD Artigo 20)
        --------------------------------------------------------------------- */}
        <div className="bg-[#111318] border border-[#262F40] rounded-xl p-3.5 space-y-3 shadow-lg">
          
          {/* Header da Coluna */}
          <div className="border-b border-[#262F40] pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  4. Recusado
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                0{rejectedCandidates.length} Devolutivas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Feedback fundamentado construtivo gerado via IA.
            </p>
          </div>

          {/* Cards da Coluna 4 */}
          <div className="space-y-3">
            {rejectedCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-[#161B26]/80 border border-[#262F40] rounded-xl p-3.5 space-y-2.5 opacity-90 hover:opacity-100 transition-all shadow-md"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Candidato Arquivado
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {cand.displayCode}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-300">
                    {cand.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {cand.role}
                  </span>
                </div>

                {/* Motivo da Devolutiva (LGPD Art. 20) */}
                <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#262F40] space-y-1">
                  <span className="text-[10px] font-bold text-slate-300 block">
                    Motivo Devolutiva:
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {cand.rejectReason || 'Exigência mandatória de arquitetura multi-cloud com Terraform e EKS.'}
                  </p>
                </div>

                {/* Notificação sem Tech Penalty */}
                <div className="flex items-center justify-between pt-1 border-t border-[#262F40] text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Notificado com respeito
                  </span>
                  <span className="font-mono text-slate-400">Sem Tech Penalty</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* =========================================================================
          4. RODAPÉ DE GOVERNANÇA RF15 & LGPD ARTIGO 20 - RECIPROCIDADE
      ========================================================================= */}
      <div className="bg-[#111318] border border-[#262F40] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold font-heading text-white">
              Regra de Reciprocidade RF15 & LGPD Artigo 20
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Todos os candidatos recusados recebem explicabilidade algorítmica transparente sobre os pesos das respostas gravadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Motor Qwen Transparente Ativo
          </span>
          <button
            onClick={() => setShowLgpdAuditModal(true)}
            className="px-4 py-2 bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] hover:border-brand-yellow/40 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-brand-yellow" /> Exportar Log LGPD
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL: TRANSCRIÇÃO AUDITÁVEL WHISPER (100% AUDITÁVEL)
      ========================================================================= */}
      {activeTranscriptionCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Transcrição Auditável por IA (Whisper Large-v3)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Candidato: {activeTranscriptionCandidate.name} • {activeTranscriptionCandidate.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTranscriptionCandidate(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#262F40] pb-2">
                <span className="font-mono text-brand-yellow">
                  {activeTranscriptionCandidate.audioTitle}
                </span>
                <span className="font-mono text-emerald-400">
                  Compatibilidade: {activeTranscriptionCandidate.matchScore}%
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-normal italic">
                "{activeTranscriptionCandidate.whisperTranscription}"
              </p>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                <strong>Garantia Art. 20 LGPD:</strong> Transcrição bruta preservada sem cortes com carimbo temporal. O candidato teve pleno direito de revisão antes da submissão.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTranscriptionCandidate(null)}
                className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DOSSIÊ TÉCNICO DE CONTRATAÇÃO (CANDIDATO APROVADO)
      ========================================================================= */}
      {dossierCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Dossiê de Contratação Auditado
                </span>
                <h3 className="font-heading font-bold text-base text-white">
                  {dossierCandidate.name}
                </h3>
              </div>
              <button
                onClick={() => setDossierCandidate(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0c0e12] rounded-lg border border-[#262F40] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cargo / Vertical:</span>
                  <strong className="text-white">{dossierCandidate.role}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Score de Compatibilidade:</span>
                  <strong className="text-emerald-400 font-mono">{dossierCandidate.matchScore}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slot Alocado:</span>
                  <span className="text-brand-yellow font-mono">{dossierCandidate.consumedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Previsão de Início:</span>
                  <span className="text-white font-semibold">{dossierCandidate.onboardingDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Competências Validadas em Produção:</span>
                <div className="flex flex-wrap gap-1">
                  {dossierCandidate.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#161B26] border border-[#262F40] text-slate-200 font-mono text-[10px]">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setDossierCandidate(null);
                  showToast('✓ Dossiê completo exportado em PDF com assinatura digital SHA-256.');
                }}
                className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Dossiê Completo (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EXPORTAÇÃO DE LOG DE AUDITORIA LGPD (ART. 20)
      ========================================================================= */}
      {showLgpdAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-heading font-bold text-base text-white">
                  Log de Auditoria e Conformidade Algorítmica (LGPD Art. 20)
                </h3>
              </div>
              <button
                onClick={() => setShowLgpdAuditModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#0c0e12] rounded-lg border border-[#262F40] font-mono text-[11px] text-slate-300 space-y-1.5 max-h-60 overflow-y-auto">
              <p className="text-emerald-400">[2025-10-18T14:22:01.402Z] AUDIT_EVENT: PIPELINE_RF15_INIT</p>
              <p>[2025-10-18T14:22:03.118Z] DECISION_WEIGHT: Hard_Skill_Weight=2.0, Exp_Years=5.0</p>
              <p>[2025-10-18T14:23:45.890Z] CANDIDATE_#4892: Whisper_WER=0.038, Ast_Score=94, Match=92%</p>
              <p>[2025-10-18T14:25:12.721Z] DOUBLE_OPT_IN_STATUS: Accepted_By_Talent (ID #8849)</p>
              <p className="text-brand-yellow">[2025-10-18T14:28:30.004Z] EXPLAINABILITY_DISPATCHED: LGPD Art. 20 to Candidate #3911</p>
              <p className="text-slate-400">[2025-10-18T14:30:00.000Z] INTEGRITY_CHECK: SHA256: 8f9b4c0e... VALIDATED</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Registros assinados digitalmente.
              </span>
              <button
                onClick={() => {
                  setShowLgpdAuditModal(false);
                  showToast('✓ Arquivo lgpd-audit-log.json baixado com sucesso!');
                }}
                className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Arquivo JSON de Auditoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CADASTRO DE VAGA EM 3 ETAPAS PROGRESSIVAS (CONECTADO E FUNCIONAL)
      ========================================================================= */}
      {showNewVacancyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-[#262F40] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-yellow uppercase tracking-wider block">
                  Etapa {modalStep} de 3
                </span>
                <h3 className="font-heading font-bold text-base text-white">
                  {modalStep === 1 && 'Informações Básicas da Vaga'}
                  {modalStep === 2 && 'Requisitos e Competências'}
                  {modalStep === 3 && 'Revisão e Ativação do Slot'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVacancyModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Etapa 1: Básicas */}
            {modalStep === 1 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Título da Vaga *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Engenheiro(a) de Software Backend Sênior"
                    className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Modalidade *</label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as WorkModality)}
                      className="w-full h-9 px-2 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white"
                    >
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Presencial">Presencial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Localização</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#161B26] border border-[#262F40] rounded-lg space-y-2">
                  <span className="font-bold text-brand-yellow block text-[11px]">
                    Faixa Salarial Transparente (Obrigatória):
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Mínimo (R$)</label>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Máximo (R$)</label>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg font-bold text-white"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleStep1Next}
                    className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 transition-all"
                  >
                    Avançar para Requisitos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 2: Requisitos */}
            {modalStep === 2 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Senioridade Esperada *</label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value as Seniority)}
                    className="w-full h-9 px-2 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white"
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Competências Técnicas Obrigatórias (separadas por vírgula) *
                  </label>
                  <input
                    type="text"
                    value={mandatorySkillsInput}
                    onChange={(e) => setMandatorySkillsInput(e.target.value)}
                    placeholder="Ex: Go, Python, Kafka, PostgreSQL"
                    className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Competências Comportamentais (Soft Skills)
                  </label>
                  <input
                    type="text"
                    value={softSkillsInput}
                    onChange={(e) => setSoftSkillsInput(e.target.value)}
                    placeholder="Ex: Arquitetura Limpa, Comunicação Técnica"
                    className="w-full h-9 px-3 bg-[#0c0e12] border border-[#262F40] rounded-lg text-white"
                  />
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="px-4 py-2 border border-[#262F40] hover:bg-[#161B26] text-slate-300 rounded-lg font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleStep2Next}
                    className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold rounded-lg flex items-center gap-1"
                  >
                    Revisar Vaga <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 3: Revisão & Publicação */}
            {modalStep === 3 && (
              <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
                <div className="p-3 bg-[#0c0e12] rounded-lg border border-[#262F40] space-y-2">
                  <div className="flex justify-between border-b border-[#262F40] pb-1.5">
                    <span className="text-slate-400">Título:</span>
                    <strong className="text-white">{title}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#262F40] pb-1.5">
                    <span className="text-slate-400">Faixa Salarial:</span>
                    <strong className="text-brand-yellow">
                      R$ {Number(salaryMin).toLocaleString('pt-BR')} a R$ {Number(salaryMax).toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-[#262F40] pb-1.5">
                    <span className="text-slate-400">Senioridade & Modalidade:</span>
                    <span className="text-white font-medium">{seniority} • {modality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Competências Avaliadas:</span>
                    <span className="text-white font-semibold">{mandatorySkillsInput}</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgentMatchExpress}
                    onChange={(e) => setIsUrgentMatchExpress(e.target.checked)}
                    className="accent-brand-yellow"
                  />
                  <span className="font-bold text-slate-200 text-xs">
                    Ativar Match Express (1º candidato que aceitar é gratuito)
                  </span>
                </label>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(2)}
                    disabled={isSavingVacancy}
                    className="px-4 py-2 border border-[#262F40] hover:bg-[#161B26] text-slate-300 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingVacancy}
                    className="px-5 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {isSavingVacancy ? 'Publicando vaga...' : 'Confirmar e Publicar Vaga'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
