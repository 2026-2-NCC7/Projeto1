import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  ThumbsUp, 
  MessageSquare,
  CreditCard,
  Gift,
  AlertCircle
} from 'lucide-react';

export const CompanyVacancyDetailView: React.FC<{ vacancyId: string; onBack: () => void }> = ({ vacancyId, onBack }) => {
  const { 
    vacancies, 
    candidates, 
    interviews,
    selectionProcesses, 
    companyCredits,
    commercialConfig,
    unlockCandidateProfile,
    updateProcessStage, 
    approveCandidate, 
    rejectCandidate, 
    updateInternalNotes, 
    giveFeedback 
  } = useApp();
  
  const vacancy = vacancies.find(v => v.id === vacancyId);
  const processes = selectionProcesses.filter(p => p.vacancyId === vacancyId);

  const [selectedProcessId, setSelectedProcessId] = useState<string>(processes[0]?.id || '');
  const selectedProcess = processes.find(p => p.id === selectedProcessId) || processes[0];
  const selectedCandidate = selectedProcess ? candidates[selectedProcess.candidateId] : null;
  const candidateInterview = selectedCandidate ? interviews[selectedCandidate.id] : null;

  const [noteDraft, setNoteDraft] = useState(selectedProcess?.internalNotes || '');

  if (!vacancy) {
    return <div className="p-4 text-xs">Vaga não encontrada.</div>;
  }

  const handleSaveNotes = () => {
    if (!selectedProcess) return;
    updateInternalNotes(selectedProcess.id, noteDraft);
  };

  return (
    <div className="space-y-6">
      
      {/* TOPO DA VAGA */}
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button onClick={onBack} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para todas as vagas e financeiro
          </button>
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2 flex-wrap">
            {vacancy.title}
            {vacancy.isUrgentMatchExpress && (
              <span className="text-[10px] bg-brandOrange/20 text-brandOrange font-bold px-2 py-0.5 rounded">
                Match Express (1º Candidato com Aceite é Grátis)
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            {vacancy.seniority} • {vacancy.modality} • Faixa Transparente: R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-background border border-border text-foreground font-semibold px-2.5 py-1 rounded">
            Saldo: <strong className="text-primary">{companyCredits} crédito(s)</strong>
          </span>
          <span className="text-xs bg-secondary text-primary font-bold px-2.5 py-1 rounded">
            {processes.length} Candidato(s) na Shortlist
          </span>
        </div>
      </div>

      {/* GRADE DIVIDIDA: LISTA DE CANDIDATOS À ESQUERDA | DETALHES E ETAPAS À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: LISTA DE CANDIDATOS */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
            Ranking Explicável da Shortlist
          </h3>

          {processes.map((proc, index) => {
            const cand = candidates[proc.candidateId];
            const isSelected = proc.id === selectedProcess?.id;
            const isUnlocked = proc.accessGranted;
            const hasOptIn = proc.doubleOptInStatus === 'aceito';

            return (
              <div
                key={proc.id}
                onClick={() => {
                  setSelectedProcessId(proc.id);
                  setNoteDraft(proc.internalNotes || '');
                }}
                className={`p-4 rounded-base border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-white border-primary shadow-xs ring-1 ring-primary/20' 
                    : 'bg-white border-border hover:bg-background'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-xs font-bold text-foreground">
                        {isUnlocked ? cand?.name.replace(' (fictício)', '').replace(' (fictícia)', '') : `Candidato #${proc.candidateId.slice(-4).toUpperCase()}`}
                      </strong>
                      {isUnlocked ? (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Unlock className="w-2.5 h-2.5" /> Dados Liberados
                        </span>
                      ) : hasOptIn ? (
                        <span className="text-[9px] bg-brandOrange/20 text-brandOrange font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Aceitou! Desbloquear
                        </span>
                      ) : (
                        <span className="text-[9px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Aguardando Opt-In
                        </span>
                      )}
                      {proc.unlockedFreeGrant && (
                        <span className="text-[9px] bg-secondary text-primary font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Gift className="w-2.5 h-2.5" /> 1º Grátis (Cortesia)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">{cand?.headline}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-heading font-bold text-primary">{proc.demonstrativeScore}%</span>
                    <span className="text-[8px] text-muted-foreground block uppercase">Match #{index + 1}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border">
                  <span className="text-muted-foreground">Etapa atual:</span>
                  <span className="font-bold text-foreground capitalize">
                    {proc.currentStage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA: DETALHE DO CANDIDATO SELECIONADO E GESTÃO DE ETAPAS */}
        <div className="lg:col-span-7 bg-white p-5 rounded-base border border-border shadow-xs space-y-5">
          {selectedProcess && selectedCandidate ? (
            <>
              {/* CABEÇALHO DO CANDIDATO */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                      {selectedProcess.accessGranted 
                        ? selectedCandidate.name.replace(' (fictício)', '').replace(' (fictícia)', '') 
                        : `Candidato #${selectedCandidate.id.slice(-4).toUpperCase()} (Identidade Protegida pela LGPD)`}
                    </h4>
                    <p className="text-xs text-muted-foreground">{selectedCandidate.headline}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedCandidate.city}/{selectedCandidate.state} • Senioridade: {selectedCandidate.seniority} • Pretensão: R$ {selectedCandidate.salaryMin.toLocaleString('pt-BR')} - R$ {selectedCandidate.salaryMax.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Status do Double Opt-In */}
                <div className="text-left sm:text-right shrink-0">
                  {selectedProcess.doubleOptInStatus === 'aceito' ? (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Double Opt-In Confirmado
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Aguardando Aceite do Candidato
                    </span>
                  )}
                </div>
              </div>

              {/* DADOS DE CONTATO E DESBLOQUEIO COMERCIAL */}
              <div className="p-4 rounded-base bg-background border border-border text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Canais de Contato & Identificação:
                  </strong>
                  {selectedProcess.unlockedFreeGrant && (
                    <span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Cortesia do 1º Candidato
                    </span>
                  )}
                </div>

                {selectedProcess.accessGranted ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-foreground font-medium pt-1">
                    <p>📧 E-mail: <strong>{selectedCandidate.email}</strong></p>
                    <p>📱 Telefone/WhatsApp: <strong>{selectedCandidate.phone}</strong></p>
                    {selectedCandidate.linkedinUrl && (
                      <p>🔗 LinkedIn: <a href={selectedCandidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary underline font-bold">Acessar perfil verificado</a></p>
                    )}
                    {selectedCandidate.githubUrl && (
                      <p>💻 GitHub: <a href={selectedCandidate.githubUrl} target="_blank" rel="noreferrer" className="text-primary underline font-bold">Acessar repositórios</a></p>
                    )}
                  </div>
                ) : selectedProcess.doubleOptInStatus === 'aceito' ? (
                  <div className="p-3 bg-white rounded-base border border-brandOrange/40 space-y-3">
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-brandOrange shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block">
                          Candidato confirmou interesse (Double Opt-In)
                        </strong>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Desbloqueie os dados de contato utilizando 1 crédito corporativo ou compra unitária com NFS-e.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => unlockCandidateProfile(selectedProcess.id, 'credit')}
                        disabled={companyCredits <= 0}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold rounded-base text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Desbloquear com 1 Crédito (Saldo: {companyCredits})
                      </button>

                      <button
                        onClick={() => unlockCandidateProfile(selectedProcess.id, 'single_purchase')}
                        className="px-3.5 py-2 bg-brandOrange hover:opacity-95 text-white font-bold rounded-base text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Desbloqueio Avulso + NFS-e (R$ {commercialConfig.singleUnlockPriceBrl})
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    🔒 Contatos protegidos pela LGPD. Serão liberados assim que o candidato confirmar o convite.
                  </p>
                )}
              </div>

              {/* JUSTIFICATIVA E SOFT SKILLS EXPLICÁVEIS (DINÂMICAS POR CANDIDATO) */}
              <div className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-base border border-border text-xs space-y-1">
                  <strong className="text-primary font-bold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Explicabilidade do Match ({selectedProcess.demonstrativeScore}%):
                  </strong>
                  <p className="text-foreground leading-relaxed text-[11px]">
                    "{selectedProcess.matchExplanation}"
                  </p>
                </div>

                {/* Resumo Autorizado das Soft Skills (Conectado à entrevista real do candidato selecionado) */}
                <div className="border border-border rounded-base p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-foreground font-bold text-[11px]">
                      Síntese Autorizada de Competências Comportamentais (IA Estruturada):
                    </strong>
                    {candidateInterview && candidateInterview.status === 'concluida' && (
                      <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                        Rubrica v{candidateInterview.version} • Confiança Alta
                      </span>
                    )}
                  </div>

                  {candidateInterview && candidateInterview.status === 'concluida' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {candidateInterview.summary.map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-background rounded border border-border text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-semibold">{item.competency}</span>
                              <strong className="text-primary">{item.level}</strong>
                            </div>
                            <p className="text-[10px] text-foreground leading-snug">
                              "{item.evidence}"
                            </p>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        * A empresa visualiza apenas a síntese autorizada; respostas brutas permanecem privadas.
                      </span>
                    </>
                  ) : candidateInterview && candidateInterview.status === 'contestada' ? (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>O candidato solicitou revisão da síntese automatizada (Art. 20 da LGPD).</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-background border border-border rounded text-[11px] text-muted-foreground">
                      ℹ️ Entrevista comportamental opcional ainda não realizada (sem impacto no score técnico).
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROLE MANUAL DAS ETAPAS SELETIVAS */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-foreground">
                    Etapa do Processo Seletivo:
                  </strong>
                  <span className="text-[11px] font-bold text-primary bg-secondary px-2 py-0.5 rounded capitalize">
                    {selectedProcess.currentStage.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => updateProcessStage(selectedProcess.id, 'entrevista_agendada')}
                    className="px-3 py-1.5 rounded-base border border-border hover:bg-background font-semibold"
                  >
                    Agendar Entrevista
                  </button>

                  <button
                    onClick={() => updateProcessStage(selectedProcess.id, 'entrevista_realizada')}
                    className="px-3 py-1.5 rounded-base border border-border hover:bg-background font-semibold"
                  >
                    Entrevista Realizada
                  </button>

                  <button
                    onClick={() => updateProcessStage(selectedProcess.id, 'em_avaliacao')}
                    className="px-3 py-1.5 rounded-base border border-border hover:bg-background font-semibold"
                  >
                    Marcar em Avaliação
                  </button>

                  <button
                    onClick={() => approveCandidate(selectedProcess.id)}
                    className="px-4 py-1.5 rounded-base bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar Candidato
                  </button>

                  <button
                    onClick={() => rejectCandidate(selectedProcess.id)}
                    className="px-3 py-1.5 rounded-base text-destructive hover:bg-destructive/10 border border-destructive/30 font-bold"
                  >
                    Recusar Candidato
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => giveFeedback(selectedProcess.id)}
                    disabled={selectedProcess.feedbackGiven}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 disabled:opacity-50"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> 
                    {selectedProcess.feedbackGiven ? '✓ Feedback de Aderência Registrado' : 'Confirmar Qualidade do Match'}
                  </button>
                </div>
              </div>

              {/* OBSERVAÇÕES INTERNAS */}
              <div className="border-t border-border pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-muted-foreground text-[11px] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Notas Internas do Recrutador (Privadas):
                  </strong>
                  <button
                    onClick={handleSaveNotes}
                    className="text-primary font-bold text-[11px] hover:underline"
                  >
                    Salvar Notas
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Anotações internas dos entrevistadores. Estas informações nunca são compartilhadas com o candidato..."
                  className="w-full bg-background border border-border rounded-base p-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Selecione um candidato na lista ao lado para ver detalhes e atualizar etapas.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};