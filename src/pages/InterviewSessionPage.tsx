import React, { useEffect, useState } from 'react';
import {
  MessageSquare, ChevronRight, ChevronLeft, Mic, Edit3,
  CheckCircle, RefreshCw, Send, AlertCircle, FileText, Brain
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioRecorder } from '../components/AudioRecorder';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import { Candidate, Job, InterviewSession, InterviewQuestion, InterviewAnswer } from '../types';

interface InterviewSessionPageProps {
  onNavigateToReport: (reportId: string) => void;
  onNavigateToMonitor: () => void;
}

export const InterviewSessionPage: React.FC<InterviewSessionPageProps> = ({
  onNavigateToReport,
  onNavigateToMonitor,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [interviewType, setInterviewType] = useState('TIPO_A_GERAL');
  const [selectedJobId, setSelectedJobId] = useState('');

  // Active Session state
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Active question answer state
  const [textInput, setTextInput] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<InterviewAnswer | null>(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedText, setEditedText] = useState('');

  const [savingAnswer, setSavingAnswer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.listCandidates().catch(() => []),
      api.listJobs().catch(() => []),
    ]).then(([cands, jbs]) => {
      setCandidates(cands);
      setJobs(jbs);
      if (cands.length > 0) setSelectedCandidateId(cands[0].id);
      if (jbs.length > 0) setSelectedJobId(jbs[0].id);
    });
  }, []);

  const handleStartSession = async () => {
    if (!selectedCandidateId) {
      setErrorMessage('Selecione um candidato para iniciar a entrevista.');
      return;
    }
    setErrorMessage(null);

    try {
      const session = await api.createInterview({
        candidate_id: selectedCandidateId,
        interview_type: interviewType,
        job_id: interviewType === 'TIPO_B_VAGA' ? selectedJobId : undefined,
      });

      const qs = await api.getInterviewQuestions(session.id);
      setActiveSession(session);
      setQuestions(qs);
      setCurrentQuestionIdx(0);
      loadCurrentQuestionAnswer(session, qs[0]?.id);
    } catch (err: any) {
      setErrorMessage(`Erro ao iniciar sessão: ${err.message}`);
    }
  };

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

  const handleTextSubmit = async () => {
    if (!activeSession || !currentQuestion) return;
    if (textInput.trim().length < 10) {
      setErrorMessage('Por favor elabore uma resposta mais descritiva (mínimo 10 caracteres).');
      return;
    }
    setSavingAnswer(true);
    setErrorMessage(null);

    try {
      const answer = await api.submitTextAnswer({
        session_id: activeSession.id,
        question_id: currentQuestion.id,
        text: textInput,
      });
      setActiveAnswer(answer);
      setEditedText(answer.edited_text || answer.raw_text || '');
      setStatusNotice('Resposta salva com sucesso.');

      // Update session in local state
      setActiveSession((prev) => {
        if (!prev) return null;
        const answersCopy = [...prev.answers];
        const idx = answersCopy.findIndex((a) => a.question_id === currentQuestion.id);
        if (idx >= 0) answersCopy[idx] = answer;
        else answersCopy.push(answer);
        return { ...prev, answers: answersCopy };
      });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleSaveEditedTranscript = async () => {
    if (!activeAnswer) return;
    setSavingAnswer(true);
    try {
      const updated = await api.editAnswerText(activeAnswer.id, editedText);
      setActiveAnswer(updated);
      setIsEditingTranscript(false);
      setStatusNotice('Transcrição corrigida e confirmada para auditoria.');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleAudioCompleted = (answer: InterviewAnswer) => {
    setActiveAnswer(answer);
    setEditedText(answer.raw_text || '');
    setIsEditingTranscript(true); // Open edit mode so candidate can review the transcription
    setStatusNotice('Áudio transcrito com sucesso pelo faster-whisper! Revise o texto abaixo antes da análise.');

    setActiveSession((prev) => {
      if (!prev) return null;
      const copy = [...prev.answers];
      const idx = copy.findIndex((a) => a.id === answer.id);
      if (idx >= 0) copy[idx] = answer;
      else copy.push(answer);
      return { ...prev, answers: copy };
    });
  };

  const handleAnalyzeSession = async () => {
    if (!activeSession) return;
    setAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await api.analyzeInterview(activeSession.id);
      setStatusNotice(res.message);
      // Navigate to report
      setTimeout(() => {
        onNavigateToReport(res.report_id);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(`Erro ao analisar entrevista: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const currentQuestion = questions[currentQuestionIdx];
  const progressPercent = questions.length > 0 ? ((currentQuestionIdx + 1) / questions.length) * 100 : 0;
  const answeredCount = activeSession?.answers.length || 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Entrevista de Triagem Técnica</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Coleta de evidências comportamentais e técnicas através de gravação de áudio ou texto.
        </p>
      </div>

      {statusNotice && (
        <div style={{ padding: '1rem', background: 'rgba(0, 232, 198, 0.1)', border: '1px solid #00E8C6', borderRadius: '10px', color: '#00E8C6', marginBottom: '1.5rem' }}>
          {statusNotice}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '10px', color: '#F87171', marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      {!activeSession ? (
        /* Preparation Screen */
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <Card title="Preparação da Sessão de Entrevista">
            <div className="form-group">
              <label className="form-label">Selecione o Candidato *</label>
              <select
                className="form-select"
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tech_area} - {c.declared_seniority})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Modalidade da Entrevista *</label>
              <select
                className="form-select"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
              >
                <option value="TIPO_A_GERAL">Tipo A — Mapeamento Geral de Competências (8 perguntas abertas)</option>
                <option value="TIPO_B_VAGA">Tipo B — Direcionada por Requisitos da Vaga</option>
              </select>
            </div>

            {interviewType === 'TIPO_B_VAGA' && (
              <div className="form-group">
                <label className="form-label">Selecione a Vaga de Tecnologia *</label>
                <select
                  className="form-select"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company_name || 'Empresa'}) - {j.seniority}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: '10px', margin: '1.5rem 0' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>Instruções do Sistema:</strong>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                <li>Você pode gravar áudio utilizando seu microfone (transcrito localmente com <code>faster-whisper</code>) ou digitar diretamente.</li>
                <li>Após cada transcrição, você tem o direito de <strong>revisar e corrigir o texto</strong> antes de enviá-lo para análise do modelo Qwen3.</li>
                <li>O texto original é preservado para auditoria e transparência.</li>
              </ul>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStartSession}>
              Iniciar Sessão de Entrevista
            </button>
          </Card>
        </div>
      ) : (
        /* Active Interview Questions Screen */
        <div>
          {/* Progress Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Pergunta {currentQuestionIdx + 1} de {questions.length}
              </span>
              <span className="badge badge-cyan">
                {answeredCount} de {questions.length} Respondidas
              </span>
            </div>
            <ProgressBar value={progressPercent} showPercent={false} height={6} />
          </div>

          {currentQuestion && (
            <div className="grid-2">
              {/* Question Card */}
              <Card
                title={`Questão ${currentQuestion.order_index}`}
                subtitle={`Categoria: ${currentQuestion.category}`}
                badge={<Badge status="HARD" label={currentQuestion.category} />}
              >
                <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.5', margin: '1rem 0' }}>
                  "{currentQuestion.text}"
                </p>

                {currentQuestion.rubric && (
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Critério de Avaliação:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {currentQuestion.rubric}
                    </p>
                  </div>
                )}

                {/* Question Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                  <button
                    className="btn btn-secondary"
                    disabled={currentQuestionIdx === 0}
                    onClick={() => {
                      const newIdx = currentQuestionIdx - 1;
                      setCurrentQuestionIdx(newIdx);
                      loadCurrentQuestionAnswer(activeSession, questions[newIdx]?.id);
                    }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={currentQuestionIdx === questions.length - 1}
                    onClick={() => {
                      const newIdx = currentQuestionIdx + 1;
                      setCurrentQuestionIdx(newIdx);
                      loadCurrentQuestionAnswer(activeSession, questions[newIdx]?.id);
                    }}
                  >
                    Próxima <ChevronRight size={16} />
                  </button>
                </div>
              </Card>

              {/* Answer Input Card */}
              <Card title="Sua Resposta" subtitle="Grave áudio com faster-whisper ou digite seu relato detalhado">
                {/* Audio Recorder Module */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <AudioRecorder
                    sessionId={activeSession.id}
                    questionId={currentQuestion.id}
                    onTranscriptionComplete={handleAudioCompleted}
                  />
                </div>

                {/* Review & Edit Transcript Box (Required by prompt) */}
                {isEditingTranscript || (activeAnswer && activeAnswer.input_type === 'AUDIO') ? (
                  <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid rgba(0, 232, 198, 0.3)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        <Edit3 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Revisar e Corrigir Transcrição:
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auditável</span>
                    </div>

                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button className="btn btn-primary" onClick={handleSaveEditedTranscript} disabled={savingAnswer}>
                        <CheckCircle size={14} /> Salvar Correção
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Text Input Alternative */
                  <div className="form-group">
                    <label className="form-label">Resposta em Texto:</label>
                    <textarea
                      className="form-textarea"
                      rows={5}
                      placeholder="Descreva situações concretas, desafios encontrados, tecnologias utilizadas e impactos alcançados..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                      <button className="btn btn-secondary" onClick={handleTextSubmit} disabled={savingAnswer}>
                        <CheckCircle size={16} /> Salvar Resposta em Texto
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Submission and AI Analysis Footer */}
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Finalizar Entrevista e Executar Análise Inteligente</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Envia as respostas confirmadas para o motor Qwen3 (Ollama) e gera o Relatório de Competências preliminar.
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              disabled={analyzing || answeredCount === 0}
              onClick={handleAnalyzeSession}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Processando com Qwen3...
                </>
              ) : (
                <>
                  <Brain size={18} /> Processar com Qwen3
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
