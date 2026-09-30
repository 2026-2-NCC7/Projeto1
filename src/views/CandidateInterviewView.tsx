import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';

export const CandidateInterviewView: React.FC = () => {
  const { activePersona, candidates, interviews, submitInterviewAnswers, contestInterview, retakeInterview } = useApp();
  
  const currentCandidateId = activePersona === 'candidato-marina' ? 'cand-marina' : 'cand-lucas';
  const profile = candidates[currentCandidateId];
  const interviewSession = interviews[currentCandidateId];

  // 5 perguntas pré-definidas para cada candidato conforme o perfil técnico e sênior
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

  // Estado para preenchimento de teste
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
      // Simula processamento por IA
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
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO CONCISO */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-primary font-heading font-bold text-base">
            <Sparkles className="w-4 h-4 text-brandOrange" /> Entrevista de Soft Skills por IA
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avaliação comportamental opcional. Empresas visualizam apenas a síntese autorizada, nunca suas respostas brutas.
          </p>
        </div>
        <span className="text-[11px] bg-secondary text-primary font-bold px-2.5 py-1 rounded shrink-0">
          Auditável (Art. 20 LGPD)
        </span>
      </div>

      {/* SESSÃO CONCLUÍDA: EXIBE RESUMO DAS COMPETÊNCIAS */}
      {isCompleted && (
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-heading font-bold text-sm text-foreground">Resumo de Competências Concluído</h3>
                <span className="text-[10px] bg-secondary text-primary px-2 py-0.5 rounded font-bold">
                  Versão {interviewSession.version}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Processado em: {new Date(interviewSession.completedAt || '').toLocaleString('pt-BR')}</p>
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
                <span className="text-[10px] text-muted-foreground block font-medium">Confiança observada: {item.confidence}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
            * Caso discorde de algum indicador extraído, utilize a opção "Contestar Avaliação" para solicitar análise humana sem prejuízo ao seu perfil.
          </div>
        </div>
      )}

      {/* SESSÃO CONTESTADA */}
      {isContested && (
        <div className="bg-white p-5 rounded-base border border-amber-300 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <AlertCircle className="w-4 h-4" /> Avaliação Contestada — Aguardando Revisão
          </div>
          <p className="text-xs text-muted-foreground">
            Você contestou a última síntese gerada por IA. O status foi registrado em conformidade com o Artigo 20 da LGPD. Você pode optar por refazer as 5 perguntas agora ou aguardar a moderação interna.
          </p>
          <button
            onClick={() => retakeInterview(currentCandidateId)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-base hover:bg-primary-dark"
          >
            Refazer Perguntas Agora
          </button>
        </div>
      )}

      {/* FLUXO PASSO A PASSO (SE NÃO CONCLUÍDA OU SE ESTIVER REFAZENDO) */}
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

    </div>
  );
};