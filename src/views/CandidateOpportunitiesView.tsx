import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Building2, CheckCircle, ArrowRight } from 'lucide-react';

export const CandidateOpportunitiesView: React.FC<{ onNavigateToProcess: () => void }> = ({ onNavigateToProcess }) => {
  const { currentCandidateId, vacancies, selectionProcesses, companies } = useApp();
  
  // Vagas que possuem processo com este candidato
  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-base border border-border shadow-xs">
        <h2 className="font-heading font-bold text-base text-foreground">Vagas Compatíveis com seu Perfil</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Oportunidades alinhadas às suas hard skills, senioridade e pretensão salarial.
        </p>
      </div>

      <div className="space-y-4">
        {myProcesses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-base border border-border text-xs text-muted-foreground">
            Nenhuma oportunidade compatível no momento.
          </div>
        ) : (
          myProcesses.map((proc) => {
            const vacancy = vacancies.find(v => v.id === proc.vacancyId);
            const company = companies.find(c => c.id === vacancy?.companyId);
            if (!vacancy) return null;

            return (
              <div key={proc.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-foreground">{vacancy.title}</h3>
                      {vacancy.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded">
                          Match Express
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {company?.name} • {vacancy.modality} ({vacancy.location}) • {vacancy.contractTypes.join('/')}
                    </p>
                  </div>

                  {/* Compatibilidade */}
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-heading font-bold text-primary">{proc.demonstrativeScore}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Compatibilidade</span>
                  </div>
                </div>

                {/* Faixa Salarial e Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-base bg-background border border-border">
                    <strong className="text-[11px] text-muted-foreground block mb-1">Faixa Salarial Mensal:</strong>
                    <span className="text-sm font-bold text-foreground">
                      R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="p-3 rounded-base bg-background border border-border">
                    <strong className="text-[11px] text-muted-foreground block mb-1">Status do Convite:</strong>
                    <span className={`inline-block font-bold text-xs px-2 py-0.5 rounded ${
                      proc.doubleOptInStatus === 'aceito' ? 'bg-emerald-100 text-emerald-800' :
                      proc.doubleOptInStatus === 'recusado' ? 'bg-red-100 text-red-800' : 'bg-secondary text-primary'
                    }`}>
                      {proc.doubleOptInStatus === 'aceito' ? '✓ Aceito (Dados Liberados)' :
                       proc.doubleOptInStatus === 'recusado' ? '✕ Recusado por você' : '⏳ Aguardando sua decisão'}
                    </span>
                  </div>
                </div>

                {/* Justificativa Textual em Linguagem Natural */}
                <div className="p-3 rounded-base bg-secondary/50 border border-border text-xs space-y-1">
                  <strong className="text-[11px] text-primary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Por que este match faz sentido?
                  </strong>
                  <p className="text-foreground leading-relaxed text-[11px]">
                    "{proc.matchExplanation}"
                  </p>
                </div>

                {/* Botão de Ação */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={onNavigateToProcess}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    Ver Linha do Tempo e Decidir <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};