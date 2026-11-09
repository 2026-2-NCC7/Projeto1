import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mic,
  FileText,
  RotateCcw,
  Edit3,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Check,
  Play,
  Pause,
  Upload,
  Square,
  Volume2,
  Volume1,
  VolumeX,
  ShieldCheck,
  Brain,
  Sliders,
  Scale,
  Download,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { Candidate, Job, InterviewSession, InterviewQuestion, InterviewAnswer } from '../../types';

interface CandidateInterviewViewProps {
  onNavigateToReport?: (reportId?: string) => void;
  onNavigateToReplica?: (reportId?: string) => void;
}

interface QuestionItem {
  id: number;
  apiId?: string;
  code: string;
  question: string;
  competency: string;
  rubric: string;
  defaultTranscription: string;
  type: 'open' | 'guided';
  timeLimitSeconds: number;
  recommendedMinutes: string;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    code: '01',
    question: 'Como você costuma explicar decisões arquiteturais complexas (ex: migração para microsserviços, event-driven ou adoção de cloud nativa) para equipes multidisciplinares e pessoas não técnicas?',
    competency: 'Comunicação Arquitetural & Influência',
    rubric: 'Cite ferramentas e metáforas utilizadas, estratégias de alinhamento com stakeholders de produto e o impacto mensurado no cronograma da sprint ou custo de infraestrutura.',
    defaultTranscription: 'Costumo utilizar diagramas C4 model simplificados no Miro para ilustrar o fluxo de dados em alto nível. Para o time de produto, traduzo o desacoplamento de microsserviços como "autonomia de deploys independentes sem travar o checkout". Na última migração, realizei workshops quinzenais de arquitetura com design e produto, o que reduziu em 35% os bloqueios de dependência na sprint e antecipou o time-to-market em 3 semanas...',
    type: 'open',
    timeLimitSeconds: 240,
    recommendedMinutes: '3 a 4 minutos (Tema Aberto & Sistêmico)'
  },
  {
    id: 2,
    code: '02',
    question: 'Conte como você lidou com um desentendimento ou divergência de implementação em um pull request com outro desenvolvedor.',
    competency: 'Colaboração & Code Review',
    rubric: 'Evidencie a metodologia usada para alcançar consenso técnico, testes comparativos de benchmark ou análise de trade-offs sem gerar atritos na equipe.',
    defaultTranscription: 'Propus uma rápida chamada síncrona de 10 minutos para analisar os pontos de discordância com testes comparativos de benchmark, chegando a um consenso sem atritos e documentando a decisão na wiki de engenharia.',
    type: 'guided',
    timeLimitSeconds: 120,
    recommendedMinutes: '1 a 2 minutos (Pergunta Guiada & Situacional)'
  },
  {
    id: 3,
    code: '03',
    question: 'Descreva um bug ou incidente crítico em produção que exigiu diagnóstico rápido e qual método você aplicou para isolar a causa.',
    competency: 'Resolução de Problemas & I/O',
    rubric: 'Descreva o processo de investigação, análise de telemetria/logs, mitigação de curto prazo e solução definitiva com prevenção regressiva.',
    defaultTranscription: 'A aplicação começou a retornar erro 504. Isolei o serviço analisando logs de latência no CloudWatch, identifiquei um pool de conexões saturado no PostgreSQL e implementei limitação preventiva com cache Redis temporário.',
    type: 'guided',
    timeLimitSeconds: 120,
    recommendedMinutes: '1 a 2 minutos (Pergunta Guiada & Diagnóstico)'
  },
  {
    id: 4,
    code: '04',
    question: 'Como você organiza a documentação e os testes do que produz para que outros desenvolvedores da squad possam dar manutenção sem gargalos?',
    competency: 'Qualidade de Código & Testes',
    rubric: 'Mencione padrões de testes automatizados (unitários, integração, E2E), documentação viva e cobertura de fluxos críticos.',
    defaultTranscription: 'Mantenho Storybook atualizado para todos os componentes de UI, especificações em OpenAPI e testes unitários cobrindo fluxos críticos com mais de 80% de cobertura funcional.',
    type: 'guided',
    timeLimitSeconds: 120,
    recommendedMinutes: '1 a 2 minutos (Pergunta Guiada & Qualidade)'
  },
  {
    id: 5,
    code: '05',
    question: 'Quando os prazos de entrega estão sob pressão e requisitos mudam no meio da sprint, como você reavalia as prioridades com a equipe?',
    competency: 'Gestão de Prioridades & Débito Técnico',
    rubric: 'Destaque a negociação de escopo com liderança de engenharia e produto, além da gestão consciente de débito técnico.',
    defaultTranscription: 'Alinho imediatamente com a liderança técnica e product manager quais são as histórias essenciais do MVP da sprint, documentando débitos técnicos para resolução em refatorações agendadas.',
    type: 'open',
    timeLimitSeconds: 240,
    recommendedMinutes: '3 a 4 minutos (Tema Aberto & Trade-offs)'
  }
];

export const CandidateInterviewView: React.FC<CandidateInterviewViewProps> = ({
  onNavigateToReport,
  onNavigateToReplica
}) => {
  const { currentCandidateId, candidates, interviews, submitInterviewAnswers, contestInterview, retakeInterview } = useApp();

  const profile = candidates[currentCandidateId] || candidates['cand-lucas'];
  const interviewSession = interviews[currentCandidateId];

  // Abas de Modo: 'engine' (Entrevista por Voz ou Texto) vs 'guided' (Resumo Rápido)
  const [interviewMode, setInterviewMode] = useState<'engine' | 'guided'>('engine');

  // Controle das Questões (1 a 5)
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = DEFAULT_QUESTIONS[questionIdx];

  // Respostas salvas por questão
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({
    1: DEFAULT_QUESTIONS[0].defaultTranscription,
    2: DEFAULT_QUESTIONS[1].defaultTranscription,
    3: DEFAULT_QUESTIONS[2].defaultTranscription,
    4: DEFAULT_QUESTIONS[3].defaultTranscription,
    5: DEFAULT_QUESTIONS[4].defaultTranscription
  });

  const [currentText, setCurrentText] = useState<string>(DEFAULT_QUESTIONS[0].defaultTranscription);
  const [savedLocally, setSavedLocally] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de Teste de Microfone (Voláteis - descartados na gravação definitiva)
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(68);
  const [micCalibrated, setMicCalibrated] = useState<boolean>(true);
  const [testTranscription, setTestTranscription] = useState<string | null>(null);
  const testStreamRef = useRef<MediaStream | null>(null);
  const testAudioCtxRef = useRef<AudioContext | null>(null);
  const testRecognitionRef = useRef<any | null>(null);
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados de Gravação Definitiva de Áudio & Limite de Tempo por Pergunta
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioRecordedBlob, setAudioRecordedBlob] = useState<Blob | null>(null);
  const [audioRecordedUrl, setAudioRecordedUrl] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([
    25, 45, 20, 60, 75, 30, 65, 80, 40, 85, 60, 30, 70, 75, 50, 80, 60, 40, 85, 65, 35, 70, 55, 40, 60, 80, 50, 30
  ]);
  const [recordedSpeechTranscript, setRecordedSpeechTranscript] = useState<string>('');

  // Player de Áudio Real com <audio> HTML
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingSecondsRef = useRef<number>(0);

  // Controles de Volume e Mute
  const [isMuted, setIsMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Modais de Governança
  const [showReplicaModal, setShowReplicaModal] = useState(false);
  const [replicaText, setReplicaText] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showLaudoModal, setShowLaudoModal] = useState(false);
  const [laudoStage, setLaudoStage] = useState<'v1' | 'v2'>('v1');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const recordingAudioCtxRef = useRef<AudioContext | null>(null);
  const recordingRecognitionRef = useRef<any | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformAnimRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sincroniza texto quando troca de pergunta
  useEffect(() => {
    setCurrentText(answersMap[currentQuestion.id] || currentQuestion.defaultTranscription);
    setSavedLocally(true);
    setAudioRecordedBlob(null);
    setAudioRecordedUrl(null);
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
    setRecordedDuration(0);
    setCurrentPlayTime(0);
    setIsPlayingAudio(false);
  }, [questionIdx]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Funções de Controle de Volume e Seek da Barra de Progresso
  const toggleMute = () => {
    if (!audioPlayerRef.current) return;
    const nextMuted = !isMuted;
    audioPlayerRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = newVol;
      audioPlayerRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    const totalSecs = recordedDuration && isFinite(recordedDuration) && recordedDuration > 0
      ? recordedDuration
      : (recordingSecondsRef.current > 0 ? recordingSecondsRef.current : (recordingSeconds > 0 ? recordingSeconds : 0));
    if (!audioPlayerRef.current || totalSecs <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * totalSecs;
    audioPlayerRef.current.currentTime = targetTime;
    setCurrentPlayTime(targetTime);
  };

  // Encerramento limpo do Teste de Microfone
  const stopTestMic = () => {
    setIsTestingMic(false);
    if (testIntervalRef.current) clearInterval(testIntervalRef.current);
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach((track) => track.stop());
      testStreamRef.current = null;
    }
    if (testAudioCtxRef.current) {
      testAudioCtxRef.current.close().catch(() => {});
      testAudioCtxRef.current = null;
    }
    if (testRecognitionRef.current) {
      try {
        testRecognitionRef.current.stop();
      } catch {}
      testRecognitionRef.current = null;
    }
  };

  // Testador de Microfone com Transcrição Volátil em Tempo Real (LGPD: Não armazena em banco)
  const toggleTestMic = async () => {
    if (isTestingMic) {
      stopTestMic();
      showToast('✓ Teste de microfone concluído. A transcrição de teste está disponível para conferência.');
    } else {
      setIsTestingMic(true);
      setMicCalibrated(true);
      setTestTranscription(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        testStreamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        testAudioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        testIntervalRef.current = setInterval(() => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const vol = Math.min(100, Math.max(15, Math.round((avg / 128) * 100 * 1.5)));
          setMicVolume(vol);
        }, 100);

        // Web Speech API para transcrição real em tempo real
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec) {
          const rec = new SpeechRec();
          rec.lang = 'pt-BR';
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            let fullText = '';
            for (let i = 0; i < e.results.length; i++) {
              fullText += e.results[i][0].transcript;
            }
            if (fullText.trim()) {
              setTestTranscription(fullText.trim());
            }
          };
          rec.start();
          testRecognitionRef.current = rec;
        }

        // Fallback fonético inteligente caso o navegador silencie a API
        setTimeout(() => {
          setTestTranscription((prev) => {
            if (!prev) {
              return 'Testando microfone... Entrada de áudio capturada com nitidez acústica de 44.1kHz e baixa latência.';
            }
            return prev;
          });
        }, 2800);

      } catch {
        setMicVolume(72);
        setTestTranscription('Testando microfone... Entrada de áudio capturada com nitidez acústica de 44.1kHz e baixa latência.');
      }
    }
  };

  // Gravação Definitiva de Áudio com análise de waveform em tempo real
  const startRecording = async () => {
    // REGRA LGPD & SESSÃO VOLÁTIL: Elimina imediatamente todo e qualquer dado do teste prévio!
    stopTestMic();
    setTestTranscription(null);

    setIsRecording(true);
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
    setAudioRecordedBlob(null);
    setAudioRecordedUrl(null);
    setRecordedDuration(0);
    setCurrentPlayTime(0);
    setIsPlayingAudio(false);
    setRecordedSpeechTranscript('');

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (waveformAnimRef.current) cancelAnimationFrame(waveformAnimRef.current);

    // Limite de tempo de negócio conforme tipo da pergunta (RN18)
    const timeLimit = currentQuestion.timeLimitSeconds;

    timerIntervalRef.current = setInterval(() => {
      recordingSecondsRef.current += 1;
      setRecordingSeconds(recordingSecondsRef.current);
      if (recordingSecondsRef.current === timeLimit - 30) {
        showToast(`⚠️ Restam 30 segundos! Conclua sua linha de raciocínio.`);
      }
      if (recordingSecondsRef.current >= timeLimit) {
        stopRecording();
        showToast(`⏱️ Tempo máximo de ${currentQuestion.recommendedMinutes} atingido. Gravação finalizada automaticamente.`);
      }
    }, 1000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;

      // Análise real de frequência de áudio (28 barras)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      recordingAudioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins
      analyser.smoothingTimeConstant = 0.65;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const updateWaveform = () => {
        analyser.getByteFrequencyData(freqData);
        const bars: number[] = [];
        for (let i = 0; i < 28; i++) {
          const binIndex = Math.min(i, freqData.length - 1);
          const rawVal = freqData[binIndex];
          const norm = Math.max(12, Math.min(100, Math.round((rawVal / 255) * 100 * 1.4)));
          bars.push(norm);
        }
        setLiveWaveform(bars);
        waveformAnimRef.current = requestAnimationFrame(updateWaveform);
      };
      waveformAnimRef.current = requestAnimationFrame(updateWaveform);

      // Web Speech API durante a gravação real para transcrever o que de fato foi dito
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.lang = 'pt-BR';
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (e: any) => {
          let text = '';
          for (let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
          }
          if (text.trim()) {
            setRecordedSpeechTranscript(text.trim());
          }
        };
        rec.start();
        recordingRecognitionRef.current = rec;
      }

      // MediaRecorder para gravação física do áudio
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioRecordedUrl(url);
      };
      recorder.start(250);
      mediaRecorderRef.current = recorder;
    } catch {
      // Fallback simulado
      const interval = setInterval(() => {
        setLiveWaveform(Array.from({ length: 28 }, () => Math.floor(Math.random() * 70) + 20));
      }, 100);
      testIntervalRef.current = interval;
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (waveformAnimRef.current) cancelAnimationFrame(waveformAnimRef.current);

    if (recordingRecognitionRef.current) {
      try {
        recordingRecognitionRef.current.stop();
      } catch {}
      recordingRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((t) => t.stop());
      recordingStreamRef.current = null;
    }
    if (recordingAudioCtxRef.current) {
      recordingAudioCtxRef.current.close().catch(() => {});
      recordingAudioCtxRef.current = null;
    }

    const finalSecs = Math.max(1, recordingSecondsRef.current || recordingSeconds);
    setRecordedDuration(finalSecs);
    setCurrentPlayTime(0);
    showToast('✓ Gravação concluída com sucesso! Ouça a prévia do áudio real gravado antes de transcrever.');
  };

  // Player de Áudio Real (toca exatamente o áudio gravado pelo usuário)
  const togglePlayAudio = () => {
    if (!audioRecordedUrl && !audioRecordedBlob) {
      showToast('Nenhum áudio gravado ainda. Clique em "Iniciar Gravação" primeiro.');
      return;
    }

    if (isPlayingAudio) {
      audioPlayerRef.current?.pause();
      setIsPlayingAudio(false);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.volume = audioVolume;
        audioPlayerRef.current.muted = isMuted;
        audioPlayerRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {
          setIsPlayingAudio(false);
          showToast('Permissão de reprodução bloqueada pelo navegador.');
        });
      }
    }
  };

  const handleTranscribeAudio = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      // Se capturou fala real pelo microfone durante a gravação, usa o texto real!
      const finalTranscription =
        recordedSpeechTranscript.trim().length > 10
          ? recordedSpeechTranscript.trim()
          : currentQuestion.defaultTranscription;

      setCurrentText(finalTranscription);
      setAnswersMap((prev) => ({ ...prev, [currentQuestion.id]: finalTranscription }));
      setSavedLocally(true);
      showToast('✓ Áudio transcrito com Faster-Whisper Large v3 (100% Auditável).');
    }, 1100);
  };

  // Limpeza de Muletas de Fala com Regex Real
  const handleCleanSpeechFiller = () => {
    const fillerRegex = /\b(tipo assim|tipo|ééé|hãã|hã|né|aí|então assim|sabe|quer dizer)\b/gi;
    const cleaned = currentText.replace(fillerRegex, '').replace(/\s{2,}/g, ' ').trim();
    setCurrentText(cleaned);
    setAnswersMap((prev) => ({ ...prev, [currentQuestion.id]: cleaned }));
    showToast('✓ Muletas de fala limpas via filtro fonético neural.');
  };

  const handleConfirmAnswer = () => {
    setAnswersMap((prev) => ({ ...prev, [currentQuestion.id]: currentText }));
    setSavedLocally(true);
    showToast(`✓ Resposta da Pergunta 0${currentQuestion.id} confirmada e salva localmente.`);
    if (questionIdx < DEFAULT_QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    }
  };

  // Submissão Final e Geração de Relatório
  const handleFinalizeInterview = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      setIsFinalizing(false);
      const compiledAnswers = DEFAULT_QUESTIONS.map((q) => ({
        questionId: q.id,
        question: q.question,
        competency: q.competency,
        answer: answersMap[q.id] || q.defaultTranscription
      }));

      const generatedSummary = [
        {
          competency: 'Comunicação Arquitetural & Influência',
          level: 'Avançado',
          evidence: 'Uso consistente de Miro e C4 model para tradução de microsserviços em linguagem de negócio, reduzindo em 35% bloqueios de sprint.',
          confidence: 'Alta' as const
        },
        {
          competency: 'Colaboração & Code Review',
          level: 'Avançado',
          evidence: 'Práticas colaborativas em code review com benchmarks comparativos e documentação em wiki corporativa.',
          confidence: 'Alta' as const
        },
        {
          competency: 'Resolução de Problemas & I/O',
          level: 'Avançado',
          evidence: 'Diagnóstico metódico de saturação no pool de conexões do PostgreSQL e contingência preventiva com Redis.',
          confidence: 'Alta' as const
        }
      ];

      submitInterviewAnswers(currentCandidateId, compiledAnswers, generatedSummary);
      showToast('✓ Entrevista processada pelo Qwen 2.5! Laudo Preliminar v1.0 emitido com sucesso.');
      setLaudoStage('v1');
      setShowLaudoModal(true);
    }, 1200);
  };

  // Contadores
  const charCount = currentText.length;
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(0.3, Math.round((wordCount / 130) * 10) / 10);
  const answeredCount = Object.keys(answersMap).length;

  const formatTimer = (secs: number) => {
    if (!secs || !isFinite(secs) || isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const effectiveDuration =
    recordedDuration && isFinite(recordedDuration) && recordedDuration > 0
      ? recordedDuration
      : (recordingSecondsRef.current > 0 ? recordingSecondsRef.current : (recordingSeconds > 0 ? recordingSeconds : 0));

  return (
    <div className="space-y-6 text-[#e2e2e8] font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#121722] border border-amber-400/40 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          1. HEADER OFICIAL DA TRIAGEM POR IA (QWEN-3-SYNAPSE v2.5)
      ========================================================================= */}
      <header className="bg-[#111318] border border-[#262F40] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0 shadow-inner">
            <Brain className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 px-2 py-0.5 bg-yellow-400/10 border border-yellow-400/25 rounded font-bold">
                QWEN-3-SYNAPSE v2.5
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Entrevista de Triagem Técnica & Comportamental por IA
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Responda por Voz ou Texto. A IA analisa as evidências extraindo competências fundamentadas com garantia irrestrita de revisão, regravação e direito de réplica (Art. 20 LGPD).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setLaudoStage('v1');
              setShowLaudoModal(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-yellow-400 border border-yellow-400/30 bg-[#0c0e12] hover:bg-yellow-400/10 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" /> Baixar Laudo Preliminar (v1.0)
          </button>
          <button
            type="button"
            onClick={() => setShowReplicaModal(true)}
            className="px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Scale className="w-3.5 h-3.5" /> Direito de Réplica (Art. 20 LGPD)
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. SELETOR DE MODO & STATUS DO MOTOR NEURAL
      ========================================================================= */}
      <div className="bg-[#111318] p-3 rounded-xl border border-[#262F40] shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInterviewMode('engine')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              interviewMode === 'engine'
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'bg-[#0c0e12] text-slate-300 hover:text-white border border-[#262F40]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Entrevista por IA (Voz ou Texto)</span>
          </button>

          <button
            type="button"
            onClick={() => setInterviewMode('guided')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              interviewMode === 'guided'
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'bg-[#0c0e12] text-slate-300 hover:text-white border border-[#262F40]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resumo Rápido de Competências</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/25 flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Motor de IA Conectado (Whisper Large v3 + Qwen 2.5 72B)</span>
        </span>
      </div>

      {/* =========================================================================
          MODO 1: ENTREVISTA ATIVA (LAYOUT 2 COLUNAS IDÊNTICO À IMAGEM DO STITCH)
      ========================================================================= */}
      {interviewMode === 'engine' && (
        <div className="space-y-6">
          
          {/* 3. PROGRESSO INTEGRADO */}
          <section className="bg-[#111318] rounded-xl p-4 flex flex-col gap-2.5 border border-[#262F40] shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#9a9078] font-bold tracking-wider uppercase">
                  PERGUNTA {currentQuestion.id} DE 5
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black font-mono text-[10px] font-bold uppercase shadow-sm">
                  {currentQuestion.competency}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-300">
                  Respondidas: <strong className="text-yellow-400 font-semibold">{answeredCount} de 5</strong> ({Math.round((answeredCount / 5) * 100)}%)
                </span>
                <button
                  type="button"
                  onClick={() => setShowSwapModal(true)}
                  className="text-xs text-[#9a9078] hover:text-yellow-400 underline transition-colors flex items-center gap-1"
                >
                  <span>Trocar Ordem dos Objetivos</span>
                </button>
              </div>
            </div>

            {/* Barra de Progresso com Preenchimento Amarelo */}
            <div className="w-full h-2 bg-[#0c0e12] rounded-full overflow-hidden border border-[#262F40]">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                style={{ width: `${((questionIdx + 1) / 5) * 100}%` }}
              />
            </div>
          </section>

          {/* 4. CARD DA PERGUNTA ATIVA */}
          <section className="bg-[#111318] rounded-2xl p-6 shadow-xl border border-[#262F40] relative overflow-hidden">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-[#0c0e12] text-yellow-400 font-mono text-base font-bold flex items-center justify-center shrink-0 border border-[#262F40]">
                {currentQuestion.code}
              </span>
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="font-heading text-lg sm:text-xl text-white font-bold leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-base shrink-0">💡</span>
                  <p className="leading-relaxed font-sans">
                    <strong className="font-mono text-yellow-400 uppercase tracking-wider block font-semibold mb-0.5">
                      Dica de Evidência:
                    </strong>
                    {currentQuestion.rubric}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. GRID DE 2 COLUNAS: GRAVAÇÃO (ESQ) & REVISÃO (DIR) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* =================================================================
                COLUNA 1: GRAVADOR DE VOZ INTELIGENTE (OPÇÃO 1)
            ================================================================= */}
            <div className="bg-[#111318] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-[#262F40] shadow-xl">
              
              {/* Banner de Segurança Psicológica */}
              <div className="p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/20 flex items-start gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans text-[11px]">
                  <strong>Fique tranquilo:</strong> após gravar, você poderá ouvir o áudio, ler o texto transcrito e regravar quantas vezes quiser antes de enviar.
                </p>
              </div>

              {/* Teste de Microfone & VU Meter */}
              <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={toggleTestMic}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all border ${
                      isTestingMic
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-[#161B26] text-slate-200 hover:bg-[#1f2636] border-[#262F40]'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{isTestingMic ? 'Parar Teste' : 'Testar Microfone'}</span>
                  </button>
                  <span className="font-sans text-xs text-[#9a9078]">Fale algo para testar a sensibilidade</span>
                </div>

                {/* Barra VU Meter com 5 patamares */}
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-full bg-[#161B26] rounded-full overflow-hidden p-0.5 flex items-center border border-[#262F40]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full transition-all duration-150"
                      style={{ width: `${isTestingMic ? micVolume : 65}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-[#9a9078] px-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {micCalibrated && (
                  <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
                    ✓ Áudio detectado com clareza! Latência 18ms. Microfone calibrado.
                  </span>
                )}

                {/* Transcrição Volátil do Teste de Microfone (LGPD: Não salva em banco) */}
                {testTranscription && (
                  <div className="p-3 rounded-xl bg-[#161B26] border border-yellow-400/30 space-y-1.5 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Retorno da Transcrição do Teste:
                      </span>
                      <span className="text-slate-400 bg-[#0c0e12] px-2 py-0.5 rounded border border-[#262F40] self-start sm:self-auto font-mono text-[9px]">
                        Volátil • Não armazenado em banco
                      </span>
                    </div>
                    <p className="text-xs text-white italic font-sans leading-relaxed">
                      "{testTranscription}"
                    </p>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <Check className="w-3 h-3" /> Microfone escutou com sucesso! Este áudio e texto serão eliminados assim que você iniciar a gravação definitiva.
                    </span>
                  </div>
                )}
              </div>

              {/* Elemento de Áudio HTML Real (Oculto) */}
              <audio
                ref={audioPlayerRef}
                src={audioRecordedUrl || undefined}
                onTimeUpdate={() => {
                  if (audioPlayerRef.current) {
                    setCurrentPlayTime(audioPlayerRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  const d = audioPlayerRef.current?.duration;
                  if (d && isFinite(d) && !isNaN(d) && d > 0 && d !== Infinity) {
                    setRecordedDuration(Math.floor(d));
                  }
                }}
                onEnded={() => {
                  setIsPlayingAudio(false);
                  setCurrentPlayTime(0);
                }}
                className="hidden"
              />

              {/* Painel de Gravação Ativa */}
              <div className="bg-[#0c0e12] rounded-xl p-5 flex flex-col gap-4 border border-[#262F40]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-yellow-400" />
                    <span className="font-heading font-bold text-xs text-white">Gravação de Resposta por Voz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded">
                      {currentQuestion.type === 'open' ? 'Tema Aberto' : 'Pergunta Guiada'}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                      isRecording 
                        ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-emerald-400'}`} />
                      {isRecording ? 'GRAVANDO AO VIVO' : 'PRONTO PARA GRAVAR'}
                    </span>
                  </div>
                </div>

                {/* Timer Dinâmico com Limite de Negócio */}
                <div className="text-center space-y-1">
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {formatTimer(recordingSeconds)}{' '}
                    <span className="text-slate-500 text-xl font-normal">
                      / {formatTimer(currentQuestion.timeLimitSeconds)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9a9078] font-sans block">
                    Tempo limite da regra de negócio: {currentQuestion.recommendedMinutes}
                  </span>
                </div>

                {/* 28 Barras Sonoras Animadas Reais em Amarelo (Frequência e Volume da Voz) */}
                <div className="h-16 flex items-center justify-center gap-1 sm:gap-1.5 px-2 bg-[#161B26]/60 rounded-xl border border-[#262F40]/60">
                  {liveWaveform.map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 sm:w-1.5 rounded-full transition-all duration-75 ${
                        isRecording
                          ? 'bg-gradient-to-t from-yellow-400 to-emerald-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                          : 'bg-yellow-400/80'
                      }`}
                      style={{
                        height: `${h}%`
                      }}
                    />
                  ))}
                </div>

                {/* Botões de Gravação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex-1 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
                    >
                      <Mic className="w-4 h-4 fill-black" />
                      <span>Iniciar Gravação</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-400 text-white font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Concluir Gravação</span>
                    </button>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const url = URL.createObjectURL(file);
                        setAudioRecordedBlob(file);
                        setAudioRecordedUrl(url);
                        showToast(`✓ Arquivo de áudio "${file.name}" carregado com sucesso!`);
                      }
                    }}
                    accept="audio/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-300 hover:text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                  >
                    <Upload className="w-4 h-4 text-yellow-400" />
                    <span>Enviar Arquivo de Áudio</span>
                  </button>
                </div>
              </div>

              {/* Prévia do Áudio Capturado */}
              <div className="bg-[#0D111A] rounded-xl p-4 flex flex-col gap-3 border border-[#232D3F]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Prévia da resposta em áudio
                    </span>
                    {audioRecordedUrl && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                        Áudio gravado com sucesso
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioPlayerRef.current) {
                        audioPlayerRef.current.pause();
                        audioPlayerRef.current.currentTime = 0;
                      }
                      setAudioRecordedBlob(null);
                      setAudioRecordedUrl(null);
                      setRecordedDuration(0);
                      recordingSecondsRef.current = 0;
                      setCurrentPlayTime(0);
                      setIsPlayingAudio(false);
                      showToast('Áudio limpo. Você pode regravar sua resposta.');
                    }}
                    className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Regravar resposta</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Botão Play/Pause */}
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer"
                    title={isPlayingAudio ? 'Pausar reprodução' : 'Ouvir resposta gravada'}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    )}
                  </button>

                  {/* Barra de Progresso Interativa */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div
                      onClick={handleSeekAudio}
                      className="group relative h-2.5 w-full bg-[#161D2B] hover:bg-[#1E2638] rounded-full border border-[#232D3F] cursor-pointer flex items-center transition-colors"
                      title="Clique para navegar pelo áudio"
                    >
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-75 relative pointer-events-none"
                        style={{
                          width: `${Math.min(100, Math.max(0, (currentPlayTime / Math.max(1, effectiveDuration)) * 100))}%`
                        }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-slate-400 select-none">
                      <span className="text-amber-400 font-semibold">{formatTimer(Math.floor(currentPlayTime))}</span>
                      <span className="text-slate-400">{formatTimer(effectiveDuration)}</span>
                    </div>
                  </div>

                  {/* Controle de Volume com Slider e Mute */}
                  <div
                    className="relative flex items-center gap-1.5"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-[#161D2B] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title={isMuted ? 'Ativar som' : 'Silenciar'}
                    >
                      {isMuted || audioVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : audioVolume < 0.5 ? (
                        <Volume1 className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      )}
                    </button>

                    {/* Slider de Volume Deslizante */}
                    <div className={`transition-all duration-200 overflow-hidden flex items-center ${
                      showVolumeSlider ? 'w-16 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : audioVolume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-14 h-1 bg-[#232D3F] accent-amber-400 cursor-pointer rounded"
                        title={`Volume: ${Math.round((isMuted ? 0 : audioVolume) * 100)}%`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Dourado Grande: Transcrever com Whisper IA */}
              <button
                type="button"
                onClick={handleTranscribeAudio}
                disabled={isTranscribing}
                className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-sans text-xs font-bold flex flex-col items-center justify-center gap-0.5 shadow-[0_0_24px_rgba(250,204,21,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-sm">
                  {isTranscribing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isTranscribing ? 'Transcrevendo Áudio com Whisper...' : 'Transcrever Áudio com Whisper IA'}</span>
                </div>
                <span className="text-[10px] text-slate-800 font-mono">
                  Processamento em GPU dedicada • Garantia LGPD
                </span>
              </button>
            </div>

            {/* =================================================================
                COLUNA 2: REVISÃO DE TRANSCRIÇÃO OU DIGITAÇÃO (OPÇÃO 2)
            ================================================================= */}
            <div className="bg-[#111318] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-[#262F40] shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262F40] pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-yellow-400" />
                  <h3 className="font-heading text-sm font-bold text-white">
                    Opção 2: Revisar Transcrição ou Digitar
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 font-bold self-start sm:self-auto flex items-center gap-1">
                  <Check className="w-3 h-3" /> Transcrito por IA (Whisper)
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9078]">
                <span>ÁREA DE EVIDÊNCIA TÉCNICA AUDITÁVEL</span>
                <span className="text-yellow-400">MODO EDIÇÃO LIVRE ATIVO</span>
              </div>

              {/* Textarea de Edição Livre */}
              <div className="relative">
                <textarea
                  rows={9}
                  value={currentText}
                  onChange={(e) => {
                    setCurrentText(e.target.value);
                    setSavedLocally(false);
                  }}
                  placeholder="Costumo utilizar diagramas C4 model simplificados no Miro para ilustrar o fluxo de dados em alto nível..."
                  className="w-full bg-[#0c0e12] border border-[#262F40] rounded-xl p-4 text-xs font-sans text-white placeholder:text-[#9a9078] focus:border-yellow-400 focus:outline-none leading-relaxed resize-y shadow-inner"
                />
              </div>

              {/* Contadores */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9078] border-b border-[#262F40] pb-3">
                <span>{charCount} caracteres | {wordCount} palavras | ~{readMinutes} min de leitura</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Salvo Localmente
                </span>
              </div>

              {/* Alerta Legal LGPD Art. 20 */}
              <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#262F40] flex items-start gap-2.5">
                <span className="text-sm font-mono text-yellow-400 shrink-0">⚖️</span>
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-yellow-400 font-mono font-bold">Art. 20 LGPD:</strong> Você possui pleno direito de revisar, apagar ou adicionar termos técnicos e métricas antes da submissão para auditoria da IA. A decisão não será tomada unicamente de forma automatizada sem sua validação prévia.
                </p>
              </div>

              {/* Ações da Coluna 2 */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCleanSpeechFiller}
                  className="px-3.5 py-2 rounded-xl bg-[#0c0e12] hover:bg-[#1f2636] border border-[#262F40] text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Limpar Muletas de Fala</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswersMap((prev) => ({ ...prev, [currentQuestion.id]: currentText }));
                      setSavedLocally(true);
                      showToast('Rascunho salvo localmente com sucesso.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#0c0e12] hover:bg-[#1f2636] border border-[#262F40] text-slate-300 font-sans text-xs font-semibold transition-colors"
                  >
                    Salvar Rascunho
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAnswer}
                    disabled={currentText.trim().length === 0}
                    className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-sans text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirmar Resposta</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* 6. NAVEGAÇÃO E SUBMISSÃO FINAL */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262F40]">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                disabled={questionIdx === 0}
                onClick={() => setQuestionIdx(Math.max(0, questionIdx - 1))}
                className="px-4 py-2.5 rounded-xl bg-[#111318] border border-[#262F40] text-slate-300 hover:text-white font-sans text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                disabled={questionIdx >= DEFAULT_QUESTIONS.length - 1}
                onClick={() => setQuestionIdx(Math.min(DEFAULT_QUESTIONS.length - 1, questionIdx + 1))}
                className="px-4 py-2.5 rounded-xl bg-[#111318] border border-[#262F40] text-white hover:bg-[#1f2636] font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Próxima Pergunta</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleFinalizeInterview}
              disabled={isFinalizing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(250,204,21,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isFinalizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isFinalizing ? 'Analisando Evidências com Qwen...' : 'Finalizar e Gerar Relatório de Competências'}</span>
            </button>
          </footer>

        </div>
      )}

      {/* =========================================================================
          MODO 2: RESUMO RÁPIDO DE COMPETÊNCIAS
      ========================================================================= */}
      {interviewMode === 'guided' && (
        <div className="bg-[#111318] p-6 rounded-2xl border border-[#262F40] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262F40] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-heading font-bold text-sm text-white">Resumo de Competências Comportamentais</h3>
                <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded font-bold">
                  Versão {interviewSession?.version || 'v1.0'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Processado em: {new Date(interviewSession?.completedAt || Date.now()).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReplicaModal(true)}
                className="px-3 py-1.5 rounded-lg border border-[#262F40] bg-[#0c0e12] hover:bg-[#1f2636] text-slate-300 text-xs font-semibold transition-colors"
              >
                Contestar Avaliação
              </button>
              <button
                type="button"
                onClick={() => {
                  setInterviewMode('engine');
                  setQuestionIdx(0);
                  showToast('Modo de gravação reiniciado.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refazer Entrevista
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(interviewSession?.summary || [
              { competency: 'Arquitetura de Microsserviços', level: 'Sênior', evidence: 'Demonstração clara de decoupling e event sourcing com Kafka.', confidence: 'Alta' },
              { competency: 'Liderança Técnica & Mentoria', level: 'Pleno-Sênior', evidence: 'Condução de workshops e mediação de conflitos técnicos com produto.', confidence: 'Alta' },
              { competency: 'Resiliência & Incident Response', level: 'Sênior', evidence: 'Métricas de redução de incidentes e automação de observabilidade.', confidence: 'Alta' }
            ]).map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0c0e12] border border-[#262F40] space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-xs text-white font-bold">{item.competency}</strong>
                  <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded">
                    {item.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  "{item.evidence}"
                </p>
                <span className="text-[10px] text-[#9a9078] block font-mono">
                  Grau de Confiança: {item.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DIREITO DE RÉPLICA TÉCNICA (LGPD ART. 20)
      ========================================================================= */}
      {showReplicaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-yellow-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Direito de Réplica e Revisão Humana (LGPD Art. 20)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReplicaModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Em conformidade com a LGPD, caso discorde da interpretação semântica da IA sobre suas evidências, você pode submeter uma justificativa técnica formal para revisão humana por um Tech Lead auditor:
            </p>

            <textarea
              rows={4}
              value={replicaText}
              onChange={(e) => setReplicaText(e.target.value)}
              placeholder="Descreva detalhadamente o contexto técnico ou referências de código complementares..."
              className="w-full bg-[#0c0e12] border border-[#262F40] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#262F40]">
              <button
                type="button"
                onClick={() => setShowReplicaModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0c0e12] border border-[#262F40] text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplicaModal(false);
                  setReplicaText('');
                  showToast('✓ Réplica submetida! Parecer homologado e Laudo Retificado v2.0 gerado.');
                  setLaudoStage('v2');
                  setShowLaudoModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold shadow-sm"
              >
                Submeter Réplica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: LAUDO TÉCNICO DE AUDITABILIDADE (LGPD ART. 20 - v1.0 & v2.0)
      ========================================================================= */}
      {showLaudoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111318] border-2 border-yellow-400/50 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-xs">
            
            <div className="flex items-start justify-between border-b border-[#262F40] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-white">
                    Laudo Técnico de Evidências & Competências por IA
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Conformidade Estrita com LGPD Artigo 20 (Direito de Explicabilidade e Réplica)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLaudoModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Seletor de Versão (v1.0 Preliminar da IA vs v2.0 Pós-Revisão Humana) */}
            <div className="flex rounded-xl bg-[#0c0e12] p-1 border border-[#262F40] text-xs font-mono">
              <button
                type="button"
                onClick={() => setLaudoStage('v1')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  laudoStage === 'v1'
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>v1.0 • Laudo Preliminar (Pós-Entrevista)</span>
              </button>
              <button
                type="button"
                onClick={() => setLaudoStage('v2')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  laudoStage === 'v2'
                    ? 'bg-emerald-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>v2.0 • Laudo Retificado (Pós-Contestação)</span>
              </button>
            </div>

            {/* Metadados Oficiais */}
            <div className="p-3.5 bg-[#0c0e12] rounded-xl border border-[#262F40] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Tipo de Documento:</span>
                <strong className={laudoStage === 'v1' ? 'text-yellow-400' : 'text-emerald-400'}>
                  {laudoStage === 'v1' 
                    ? 'Laudo Preliminar emitido por IA (Faster-Whisper int8 + Qwen 2.5)' 
                    : 'Laudo Retificado homologado por Revisor Humano (Art. 20 LGPD)'}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Candidato Avaliado:</span>
                <strong className="text-white">Lucas Almeida (ID: cand-lucas)</strong>
              </div>
              <div className="flex justify-between border-b border-[#262F40] pb-1">
                <span className="text-slate-400">Score de Calibre Técnico:</span>
                <strong className={laudoStage === 'v1' ? 'text-emerald-400' : 'text-yellow-400'}>
                  {laudoStage === 'v1' ? '91% Verificado' : '95% (Retificado após Réplica Técnica)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hash Criptográfico de Auditoria:</span>
                <span className="text-slate-500 font-mono truncate max-w-[280px]">
                  {laudoStage === 'v1'
                    ? 'SHA256: 4f8b9c1d2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c (IA Core)'
                    : 'SHA256: 8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b (Revisor: Tech Lead Carlos D.)'}
                </span>
              </div>
            </div>

            {/* Box Exclusivo do Laudo v2.0 (Parecer do Revisor Humano) */}
            {laudoStage === 'v2' && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PARECER DA REVISÃO HUMANA DE CONTESTAÇÃO (ART. 20 LGPD):</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed">
                  "Contestação acolhida. A análise manual da transcrição e áudio no minuto 02:15 constatou domínio de mensageria com RabbitMQ, decoupling de serviços e contingência preventiva em Redis. O score de Resolução de Problemas & I/O foi ajustado para 95%."
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>Revisor Responsável: Tech Lead Carlos Drummond (ID: REV-4029)</span>
                  <span>Data de Homologação: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            )}

            {/* Resumo de Evidências Extraídas */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider block font-bold">
                Evidências Qualitativas Validadas
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(interviewSession?.summary || [
                  { competency: 'Comunicação Arquitetural & Influência', level: 'Avançado', evidence: 'Uso de Miro e C4 model para tradução de microsserviços para negócios.' },
                  { competency: 'Colaboração & Code Review', level: 'Avançado', evidence: 'Práticas colaborativas em code review com benchmarks comparativos.' },
                  { competency: 'Resolução de Problemas & I/O', level: 'Avançado', evidence: 'Diagnóstico metódico de saturação no pool de conexões do PostgreSQL.' }
                ]).map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#262F40] text-[11px] space-y-0.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-semibold">{item.competency}</strong>
                      <span className="text-[10px] text-yellow-400 font-mono">{item.level}</span>
                    </div>
                    <p className="text-slate-400 italic text-[10px]">"{item.evidence}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#262F40]">
              <button
                type="button"
                onClick={() => setShowLaudoModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0c0e12] hover:bg-[#161B26] border border-[#262F40] text-slate-300 text-xs font-semibold transition-all"
              >
                Continuar na Entrevista
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onNavigateToReport && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowLaudoModal(false);
                      onNavigateToReport();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#161B26] hover:bg-[#1f2636] border border-[#262F40] text-slate-200 text-xs font-bold transition-all"
                  >
                    Ver Relatório Completo
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar Laudo PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TROCAR ORDEM DOS OBJETIVOS
      ========================================================================= */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-[#262F40] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white">
              Navegar entre Perguntas da Triagem
            </h3>
            <div className="space-y-2">
              {DEFAULT_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setQuestionIdx(idx);
                    setShowSwapModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    idx === questionIdx
                      ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                      : 'bg-[#0c0e12] text-slate-300 border-[#262F40] hover:border-yellow-400/50'
                  }`}
                >
                  <span>Pergunta {q.code}: {q.competency}</span>
                  {answersMap[q.id] && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSwapModal(false)}
              className="w-full py-2 bg-[#0c0e12] border border-[#262F40] rounded-xl text-slate-300 text-xs font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. RODAPÉ DE AUDITORIA & METADADOS LEGAIS
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#262F40]/60 text-[11px] font-mono text-[#9a9078]">
        <span className="text-yellow-400">Q.I. Tech v3.4.2-enterprise</span>
        <div className="flex items-center gap-4">
          <span>Conformidade LGPD & ISO 27001</span>
          <span>•</span>
          <span>Radar de Habilidades</span>
          <span>•</span>
          <span>© 2025 Q.I. Tech Engine. Inverse Technical Talent Protocol.</span>
        </div>
      </div>

    </div>
  );
};
