import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Send,
  Mic, FileText, RotateCcw, Brain, Edit3, ChevronRight, ChevronLeft
} from 'lucide-react';
import { AudioRecorder } from '../../components/AudioRecorder';
import { api } from '../../services/api';
import { Candidate, Job, InterviewSession, InterviewQuestion, InterviewAnswer } from '../../types';

interface CandidateInterviewViewProps {
  onNavigateToReport?: (reportId?: string) => void;
  onNavigateToReplica?: (reportId?: string) => void;
}

export const CandidateInterviewView: React.FC<CandidateInterviewViewProps> = ({
  onNavigateToReport,
  onNavigateToReplica
}) => {
  const { currentCandidateId, candidates, interviews, submitInterviewAnswers, contestInterview, retakeInterview } = useApp();

  const profile = candidates[currentCandidateId] || candidates['cand-lucas'];
  const interviewSession = interviews[currentCandidateId];

  // Mode toggle: 'engine' (Motor IA Real com Áudio Whisper + Extração Verbatim) or 'guided' (5 Perguntas Comportamentais Rápidas)
  const [interviewMode, setInterviewMode] = useState<'engine' | 'guided'>('engine');

  // --- ESTADOS DO MOTOR IA REAL (FASTAPI + WHISPER + QWEN3) ---
  const [apiCandidates, setApiCandidates] = useState<Candidate[]>([]);
  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [selectedApiCandidateId, setSelectedApiCandidateId] = useState('');
  const [interviewType, setInterviewType] = useState('TIPO_A_GERAL');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [activeApiSession, setActiveApiSession] = useState<InterviewSession | null>(null);
  const [apiQuestions, setApiQuestions] = useState<InterviewQuestion[]>([]);
  const [apiQuestionIdx, setApiQuestionIdx] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<InterviewAnswer | null>(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.listCandidates(),
      api.listJobs()
    ])
      .then(([cands, jbs]) => {
        setBackendAvailable(true);
        setApiCandidates(cands);
        setApiJobs(jbs);
        if (cands.length > 0) {
          // Match current persona (Lucas or Marina) to backend candidate
          const matchPersona = currentCandidateId === 'cand-marina'
            ? cands.find(c => c.name.toLowerCase().includes('mariana') || c.name.toLowerCase().includes('beatriz'))
            : cands.find(c => c.name.toLowerCase().includes('lucas'));
          setSelectedApiCandidateId(matchPersona ? matchPersona.id : cands[0].id);
        }
        if (jbs.length > 0) setSelectedJobId(jbs[0].id);
      })
      .catch(() => {
        setBackendAvailable(false);
        setInterviewMode('guided');
      });
  }, [currentCandidateId]);

  const currentApiQuestion = apiQuestions[apiQuestionIdx];

  const loadCurrentQuestionAnswer = (session: InterviewSession, questionId: string) => {
    const existing = session.answers?.find((a) => a.question_id === questionId);
    if (existing) {
      setActiveAnswer(existing);
      setTextInput(existing.edited_text || existing.raw_text || '');
      setEditedText(existing.edited_text || existing.raw_text || '');
    } else {
      setActiveAnswer(null);
      setTextInput('');
      setEditedText('');
    }
    setIsEditingTranscript(false);
  };

  const handleStartApiSession = async () => {
    if (!selectedApiCandidateId) {
      setApiError('Selecione o perfil no motor para iniciar a sessão.');
      return;
    }
    setApiError(null);
    setApiNotice(null);
    try {
      const session = await api.createInterview({
        candidate_id: selectedApiCandidateId,
        interview_type: interviewType,
        job_id: interviewType === 'TIPO_B_VAGA' ? selectedJobId : undefined,
      });
      const qs = await api.getInterviewQuestions(session.id);
      setActiveApiSession(session);
      setApiQuestions(qs);
      setApiQuestionIdx(0);
      if (qs[0]) loadCurrentQuestionAnswer(session, qs[0].id);
    } catch (err: any) {
      setApiError(`Erro ao iniciar sessão no backend: ${err.message}`);
    }
  };

  const handleTextSubmit = async () => {
    if (!activeApiSession || !currentApiQuestion) return;
    if (textInput.trim().length < 10) {
      setApiError('Elabore uma resposta descritiva (mínimo 10 caracteres) com fatos e contexto.');
      return;
    }
    setSavingAnswer(true);
    setApiError(null);
    try {
      const answer = await api.submitTextAnswer({
        session_id: activeApiSession.id,
        question_id: currentApiQuestion.id,
        text: textInput,
      });
      setActiveAnswer(answer);
      setEditedText(answer.edited_text || answer.raw_text || '');
      setApiNotice('Resposta registrada com sucesso no banco SQLite.');
      setActiveApiSession((prev) => {
        if (!prev) return null;
        const copy = [...(prev.answers || [])];
        const idx = copy.findIndex((a) => a.question_id === currentApiQuestion.id);
        if (idx >= 0) copy[idx] = answer;
        else copy.push(answer);
        return { ...prev, answers: copy };
      });
    } catch (err: any) {
      setApiError(`Falha ao salvar resposta: ${err.message}`);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleAudioTranscriptionComplete = (answer: InterviewAnswer) => {
    setActiveAnswer(answer);
    const transcribed = answer.edited_text || answer.raw_text || '';
    setTextInput(transcribed);
    setEditedText(transcribed);
    setApiNotice('Áudio transcrito com sucesso por faster-whisper! Você pode revisar ou editar o texto antes de avançar.');
    setActiveApiSession((prev) => {
      if (!prev || !currentApiQuestion) return prev;
      const copy = [...(prev.answers || [])];
      const idx = copy.findIndex((a) => a.question_id === currentApiQuestion.id);
      if (idx >= 0) copy[idx] = answer;
      else copy.push(answer);
      return { ...prev, answers: copy };
    });
  };

  const handleSaveEditedTranscript = async () => {
    if (!activeAnswer) return;
    setSavingAnswer(true);
    try {
      const updated = await api.editAnswerText(activeAnswer.id, editedText);
      setActiveAnswer(updated);
      setTextInput(updated.edited_text || '');
      setIsEditingTranscript(false);
      setApiNotice('Transcrição revisada e confirmada pelo candidato.');
    } catch (err: any) {
      setApiError(`Erro ao atualizar transcrição: ${err.message}`);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleAnalyzeApiInterview = async () => {
    if (!activeApiSession) return;
    setAnalyzing(true);
    setApiError(null);
    setApiNotice('Executando extração estruturada (Qwen3 / Contingência) + EvidenceVerifier (validação verbatim)...');
    try {
      const res = await api.analyzeInterview(activeApiSession.id);
      setApiNotice(res.message);
      if (onNavigateToReport) {
        onNavigateToReport(res.report_id);
      }
    } catch (err: any) {
      setApiError(`Erro na análise da entrevista: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // --- ESTADOS DO FLUXO GUIADO DE 5 PERGUNTAS ---
  const questionsLucas = [
    { id: 1, competency: 'Comunicação', question: 'Descreva uma situação em que você precisou alinhar uma decisão técnica complexa com pessoas de produto ou design que não tinham formação técnica.' },
    { id: 2, competency: 'Colaboração', question: 'Conte como você lidou com um desentendimento ou divergência de implementação em um pull request com outro desenvolvedor.' },
    { id: 3, competency: 'Resolução de problemas', question: 'Descreva um bug ou incidente crítico em produção que exigiu diagnóstico rápido e qual método você aplicou para isolar a causa.' },
    { id: 4, competency: 'Comunicação & Colaboração', question: 'Como você organiza a documentação e os testes do que produz para que outros desenvolvedores da squad possam dar manutenção sem gargalos?' },
    { id: 5, competency: 'Resolução de problemas', question: 'Quando os prazos de entrega estão sob pressão e requisitos mudam no meio da sprint, como você reavalia as prioridades com a equipe?' }
  ];

  const questionsMarina = [
    { id: 1, competency: 'Adaptabilidade', question: 'Como você atuou quando uma tecnologia consolidada na empresa precisou ser substituída emergencialmente devido a custos ou limitações técnicas?' },
    { id: 2, competency: 'Pensamento analítico', question: 'Descreva um cenário em que foi necessário auditar dados divergentes entre sistemas corporativos e definir a raiz analítica do problema.' },
    { id: 3, competency: 'Liderança', question: 'Conte como você exerceu liderança técnica informal orientando desenvolvedores júnior ou pleno em boas práticas de engenharia de dados.' },
    { id: 4, competency: 'Pensamento analítico', question: 'Diante de cenários de escassez de infraestrutura de dados sob alta carga, quais métricas você prioriza para manter resiliência?' },
    { id: 5, competency: 'Adaptabilidade & Liderança', question: 'Como você equilibra a cobrança de entregas rápidas de análises pela diretoria com a qualidade dos testes e governança de dados?' }
  ];

  const activeQuestions = currentCandidateId === 'cand-marina' ? questionsMarina : questionsLucas;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({
    1: interviewSession?.answers?.[0]?.answer || '',
    2: interviewSession?.answers?.[1]?.answer || '',
    3: interviewSession?.answers?.[2]?.answer || '',
    4: interviewSession?.answers?.[3]?.answer || '',
    5: interviewSession?.answers?.[4]?.answer || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const isCompleted = interviewSession && interviewSession.status === 'concluida';
  const isContested = interviewSession && interviewSession.status === 'contestada';

  const handleNextOrFinish = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const compiledAnswers = activeQuestions.map(q => ({
          questionId: q.id,
          question: q.question,
          competency: q.competency,
          answer: draftAnswers[q.id] || 'Resposta textual fornecida durante a sessão estruturada.'
        }));

        const mockSummary = currentCandidateId === 'cand-marina' ? [
          { competency: 'Adaptabilidade', level: 'Especialista', evidence: 'Transição estratégica de stacks distribuídas com mitigação total de downtime.', confidence: 'Alta' as const },
          { competency: 'Pensamento analítico', level: 'Especialista', evidence: 'Capacidade apurada de decomposição de eventos assíncronos e detecção de anomalias.', confidence: 'Alta' as const },
          { competency: 'Liderança', level: 'Avançado', evidence: 'Mentoria ativa, criação de fóruns técnicos estruturados e disseminação de padrões entre pares.', confidence: 'Alta' as const }
        ] : [
          { competency: 'Comunicação', level: 'Avançado', evidence: 'Demonstrou facilidade em traduzir requisitos técnicos para interfaces funcionais claras.', confidence: 'Alta' as const },
          { competency: 'Colaboração', level: 'Avançado', evidence: 'Práticas colaborativas em code review e resolução síncrona de conflitos técnicos.', confidence: 'Alta' as const },
          { competency: 'Resolução de problemas', level: 'Avançado', evidence: 'Isolamento metódico de gargalos de I/O em produção utilizando telemetria e cache.', confidence: 'Alta' as const }
        ];

        submitInterviewAnswers(currentCandidateId, compiledAnswers, mockSummary);
      }, 900);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO UNIFICADO DE ENTREVISTA IA */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-heading font-bold text-base">
            <Brain className="w-5 h-5 text-brandOrange" /> Entrevista de Triagem Técnica & Comportamental por IA
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Responda por <strong>Gravação de Áudio (faster-whisper local)</strong> ou <strong>Texto</strong>. O motor extrai competências com validação estrita de citações literais (<em>EvidenceVerifier</em>) e garante o Direito de Réplica (Art. 20 LGPD).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onNavigateToReport && (
            <button
              onClick={() => onNavigateToReport()}
              className="px-3 py-1.5 rounded-base bg-secondary text-primary hover:opacity-90 text-xs font-bold flex items-center gap-1.5 border border-primary/20"
            >
              <FileText className="w-3.5 h-3.5" /> Ver Relatório (5 Estados)
            </button>
          )}
          {onNavigateToReplica && (
            <button
              onClick={() => onNavigateToReplica()}
              className="px-3 py-1.5 rounded-base bg-amber-100 text-amber-800 hover:opacity-90 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Direito de Réplica (v1→v2)
            </button>
          )}
        </div>
      </div>

      {/* SELETOR DE MODO: MOTOR IA REAL (ÁUDIO WHISPER + BACKEND) vs SÍNTESE COMPORTAMENTAL RÁPIDA */}
      <div className="bg-white p-3 rounded-base border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInterviewMode('engine')}
            className={`px-3.5 py-2 rounded-base text-xs font-bold flex items-center gap-2 transition-all ${
              interviewMode === 'engine'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Entrevista Completa (Áudio Whisper + Citações Verbatim)
          </button>

          <button
            type="button"
            onClick={() => setInterviewMode('guided')}
            className={`px-3.5 py-2 rounded-base text-xs font-bold flex items-center gap-2 transition-all ${
              interviewMode === 'guided'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Resumo Comportamental do Perfil ({profile?.name})
          </button>
        </div>

        <span className="text-[11px] text-muted-foreground font-medium px-2">
          {backendAvailable ? '✓ Motor FastAPI + SQLite Conectado' : 'Modo Local Ativo'}
        </span>
      </div>

      {/* ==================== MODO 1: MOTOR IA REAL (ÁUDIO WHISPER + QWEN3 + EVIDENCE VERIFIER) ==================== */}
      {interviewMode === 'engine' && (
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-5">
          {apiError && (
            <div className="p-3 rounded-base bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {apiError}
            </div>
          )}
          {apiNotice && (
            <div className="p-3 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {apiNotice}
            </div>
          )}

          {!activeApiSession ? (
            <div className="space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-sm text-foreground">
                  Configurar Nova Sessão de Entrevista Estruturada
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Escolha o formato da entrevista (Geral Tipo A ou Direcionada a uma Vaga Tipo B) para iniciar a coleta por voz ou texto.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-foreground mb-1">Candidato Vinculado (SQLite):</label>
                  <select
                    value={selectedApiCandidateId}
                    onChange={(e) => setSelectedApiCandidateId(e.target.value)}
                    className="w-full h-9 px-3 rounded-base bg-background border border-border text-foreground font-medium"
                  >
                    {apiCandidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.declared_seniority} • {c.tech_area})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Modalidade de Roteiro:</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full h-9 px-3 rounded-base bg-background border border-border text-foreground font-medium"
                  >
                    <option value="TIPO_A_GERAL">Tipo A — Mapeamento Geral de Competências</option>
                    <option value="TIPO_B_VAGA">Tipo B — Entrevista Direcionada a uma Vaga</option>
                  </select>
                </div>

                {interviewType === 'TIPO_B_VAGA' && (
                  <div>
                    <label className="block font-bold text-foreground mb-1">Vaga Alvo:</label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full h-9 px-3 rounded-base bg-background border border-border text-foreground font-medium"
                    >
                      {apiJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.seniority})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartApiSession}
                  className="px-5 py-2.5 rounded-base bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Mic className="w-4 h-4" /> Iniciar Sessão de Entrevista (Áudio / Texto)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Barra de Progresso das Perguntas */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Pergunta {apiQuestionIdx + 1} de {apiQuestions.length}
                  </span>
                  {currentApiQuestion?.category && (
                    <span className="ml-2 text-[11px] bg-secondary text-primary px-2 py-0.5 rounded font-bold">
                      Categoria: {currentApiQuestion.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Respondidas: <strong>{activeApiSession.answers?.length || 0}</strong> / {apiQuestions.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveApiSession(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
                  >
                    Trocar Roteiro
                  </button>
                </div>
              </div>

              {currentApiQuestion && (
                <div className="space-y-4">
                  <div className="p-4 rounded-base bg-secondary/40 border border-border space-y-1.5">
                    <h4 className="font-heading font-bold text-sm text-foreground leading-relaxed">
                      {currentApiQuestion.text}
                    </h4>
                    {currentApiQuestion.rubric && (
                      <p className="text-[11px] text-muted-foreground">
                        <strong>Critério de Evidência:</strong> {currentApiQuestion.rubric}
                      </p>
                    )}
                  </div>

                  {/* GRAVADOR DE ÁUDIO WHISPER + RESPOSTA EM TEXTO */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-5 p-4 rounded-base bg-background border border-border space-y-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-brandOrange" /> Opção 1: Gravar Resposta em Áudio (Whisper pt-BR)
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        O áudio é processado localmente pelo modelo <code>faster-whisper-small</code> (int8) e você pode revisar a transcrição.
                      </p>
                      <AudioRecorder
                        sessionId={activeApiSession.id}
                        questionId={currentApiQuestion.id}
                        onTranscriptionComplete={handleAudioTranscriptionComplete}
                      />
                    </div>

                    <div className="lg:col-span-7 p-4 rounded-base bg-background border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          Opção 2: Digitar ou Revisar Transcrição da Resposta
                        </span>
                        {activeAnswer && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            ✓ Resposta Salva ({activeAnswer.input_type})
                          </span>
                        )}
                      </div>

                      {!isEditingTranscript ? (
                        <>
                          <textarea
                            rows={4}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Descreva o contexto real, as ferramentas utilizadas, sua ação direta e os resultados mensuráveis..."
                            className="w-full bg-white border border-border rounded-base p-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex items-center justify-between gap-2">
                            {activeAnswer ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditedText(textInput);
                                  setIsEditingTranscript(true);
                                }}
                                className="px-3 py-1.5 rounded-base border border-border bg-white text-xs font-semibold text-foreground flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Editar Transcrição Confirmada
                              </button>
                            ) : <span />}

                            <button
                              type="button"
                              onClick={handleTextSubmit}
                              disabled={savingAnswer}
                              className="px-4 py-1.5 rounded-base bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              {savingAnswer ? 'Salvando...' : 'Salvar Resposta'}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={4}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full bg-white border border-primary rounded-base p-3 text-xs text-foreground"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingTranscript(false)}
                              className="px-3 py-1.5 rounded-base border border-border text-xs"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEditedTranscript}
                              disabled={savingAnswer}
                              className="px-4 py-1.5 rounded-base bg-primary text-white text-xs font-bold"
                            >
                              Confirmar Revisão da Transcrição
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navegação entre Perguntas e Botão de Extração de Competências */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={apiQuestionIdx === 0}
                        onClick={() => {
                          const prevIdx = apiQuestionIdx - 1;
                          setApiQuestionIdx(prevIdx);
                          loadCurrentQuestionAnswer(activeApiSession, apiQuestions[prevIdx].id);
                        }}
                        className="px-3 py-1.5 rounded-base border border-border text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                      </button>

                      <button
                        type="button"
                        disabled={apiQuestionIdx >= apiQuestions.length - 1}
                        onClick={() => {
                          const nextIdx = apiQuestionIdx + 1;
                          setApiQuestionIdx(nextIdx);
                          loadCurrentQuestionAnswer(activeApiSession, apiQuestions[nextIdx].id);
                        }}
                        className="px-3 py-1.5 rounded-base border border-border text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                      >
                        Próxima <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAnalyzeApiInterview}
                      disabled={analyzing || (activeApiSession.answers?.length || 0) === 0}
                      className="px-5 py-2 rounded-base bg-brandOrange hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <Brain className="w-4 h-4" />
                      {analyzing
                        ? 'Processando Extração & Verificando Evidências...'
                        : 'Concluir e Gerar Relatório de Competências (IA)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODO 2: RESUMO COMPORTAMENTAL DO PERFIL ==================== */}
      {interviewMode === 'guided' && (
        <>
          {isCompleted && (
            <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-heading font-bold text-sm text-foreground">Resumo de Competências Comportamentais</h3>
                    <span className="text-[10px] bg-secondary text-primary px-2 py-0.5 rounded font-bold">
                      Versão {interviewSession.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Processado em: {new Date(interviewSession.completedAt || '').toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => contestInterview(currentCandidateId)}
                    className="px-3 py-1.5 rounded-base border border-border hover:bg-background text-foreground text-xs font-semibold"
                  >
                    Contestar Avaliação
                  </button>
                  <button
                    onClick={() => retakeInterview(currentCandidateId)}
                    className="px-3 py-1.5 rounded-base bg-secondary text-primary hover:bg-secondary/80 text-xs font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refazer Entrevista
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {interviewSession.summary.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-base bg-background border border-border space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-foreground font-bold">{item.competency}</strong>
                      <span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded">
                        {item.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      "{item.evidence}"
                    </p>
                    <span className="text-[10px] text-muted-foreground block font-medium">
                      Confiança observada: {item.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isContested && (
            <div className="bg-white p-5 rounded-base border border-amber-300 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4" /> Avaliação Contestada — Aguardando Revisão
              </div>
              <p className="text-xs text-muted-foreground">
                Você contestou a síntese gerada por IA. O status foi registrado em conformidade com o Artigo 20 da LGPD.
              </p>
              <button
                onClick={() => retakeInterview(currentCandidateId)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-base hover:bg-primary-dark"
              >
                Refazer Perguntas Agora
              </button>
            </div>
          )}

          {!isCompleted && !isContested && (
            <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Pergunta {currentQuestionIndex + 1} de {activeQuestions.length}
                </span>
                <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded font-bold">
                  Competência Foco: {activeQuestions[currentQuestionIndex].competency}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-foreground leading-relaxed">
                  {activeQuestions[currentQuestionIndex].question}
                </h4>

                <textarea
                  rows={4}
                  value={draftAnswers[activeQuestions[currentQuestionIndex].id] || ''}
                  onChange={(e) => setDraftAnswers({
                    ...draftAnswers,
                    [activeQuestions[currentQuestionIndex].id]: e.target.value
                  })}
                  placeholder="Digite aqui sua resposta objetiva destacando ações práticas, ferramentas e resultados alcançados..."
                  className="w-full bg-background border border-border rounded-base p-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-1.5 rounded-base border border-border text-xs text-muted-foreground hover:bg-background disabled:opacity-40"
                >
                  Anterior
                </button>

                <button
                  onClick={handleNextOrFinish}
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-base bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {isProcessing ? (
                    <>Processando com IA...</>
                  ) : currentQuestionIndex === activeQuestions.length - 1 ? (
                    <>Finalizar e Gerar Resumo <Send className="w-3.5 h-3.5 ml-1" /></>
                  ) : (
                    <>Próxima Pergunta →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
