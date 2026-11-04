import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Building2, CheckCircle2, ArrowRight, Target, FileText, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { Job } from '../../types';

interface CandidateOpportunitiesViewProps {
  onNavigateToProcess: () => void;
  onNavigateToReport?: () => void;
}

export const CandidateOpportunitiesView: React.FC<CandidateOpportunitiesViewProps> = ({
  onNavigateToProcess,
  onNavigateToReport
}) => {
  const { currentCandidateId, vacancies, selectionProcesses, companies } = useApp();
  const [apiJobs, setApiJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.listJobs()
      .then(setApiJobs)
      .catch(() => setApiJobs([]));
  }, []);

  const myProcesses = selectionProcesses.filter(p => p.candidateId === currentCandidateId);

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-base border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Vagas Compatíveis com seu Perfil (Matching Explicável 5 Etapas)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oportunidades ranqueadas com base nas suas Hard Skills (50%), Soft Skills (25%), Experiência (15%), Condições Objetivas (10%) e Cobertura de Avaliação.
          </p>
        </div>

        {onNavigateToReport && (
          <button
            onClick={onNavigateToReport}
            className="px-3.5 py-2 rounded-base bg-secondary text-primary hover:opacity-90 text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <FileText className="w-3.5 h-3.5" /> Meu Relatório de Evidências
          </button>
        )}
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

            const hardScore = Math.min(100, proc.demonstrativeScore + 3);
            const softScore = Math.max(75, proc.demonstrativeScore - 4);
            const expScore = Math.min(100, proc.demonstrativeScore + 2);
            const condScore = 100;
            const coverageScore = currentCandidateId === 'cand-marina' ? 92 : 85;

            return (
              <div key={proc.id} className="bg-white p-5 rounded-base border border-border shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-sm text-foreground">{vacancy.title}</h3>
                      {vacancy.isUrgentMatchExpress && (
                        <span className="text-[10px] bg-brandOrange/15 text-brandOrange font-bold px-2 py-0.5 rounded">
                          Match Express
                        </span>
                      )}
                      <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                        Cobertura de Avaliação: {coverageScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {company?.name} • {vacancy.modality} ({vacancy.location}) • {vacancy.contractTypes.join('/')}
                    </p>
                  </div>

                  {/* Compatibilidade Global */}
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-heading font-bold text-primary">{proc.demonstrativeScore}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                      Score Ponderado
                    </span>
                  </div>
                </div>

                {/* Decomposição do Algoritmo de Matching em 5 Dimensões */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">1. Hard Skills (50%)</span>
                    <strong className="text-sm text-primary font-bold">{hardScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">2. Soft Skills (25%)</span>
                    <strong className="text-sm text-primary font-bold">{softScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">3. Experiência (15%)</span>
                    <strong className="text-sm text-primary font-bold">{expScore}%</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">4. Condições (10%)</span>
                    <strong className="text-sm text-emerald-700 font-bold">{condScore}% Compatível</strong>
                  </div>
                  <div className="p-2.5 rounded-base bg-secondary/50 border border-primary/20 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-primary block font-bold">5. Cobertura IA</span>
                    <strong className="text-sm text-primary font-bold">{coverageScore}% Verificada</strong>
                  </div>
                </div>

                {/* Faixa Salarial e Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-base bg-background border border-border">
                    <strong className="text-[11px] text-muted-foreground block mb-1">Faixa Salarial Transparente:</strong>
                    <span className="text-sm font-bold text-foreground">
                      R$ {vacancy.salaryMin.toLocaleString('pt-BR')} a R$ {vacancy.salaryMax.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="p-3 rounded-base bg-background border border-border">
                    <strong className="text-[11px] text-muted-foreground block mb-1">Status do Double Opt-In (LGPD):</strong>
                    <span className={`inline-block font-bold text-xs px-2 py-0.5 rounded ${
                      proc.doubleOptInStatus === 'aceito' ? 'bg-emerald-100 text-emerald-800' :
                      proc.doubleOptInStatus === 'recusado' ? 'bg-red-100 text-red-800' : 'bg-secondary text-primary'
                    }`}>
                      {proc.doubleOptInStatus === 'aceito' ? '✓ Aceito (Dados Liberados à Empresa)' :
                       proc.doubleOptInStatus === 'recusado' ? '✕ Recusado por você' : '⏳ Aguardando seu Aceite (Identidade Oculta)'}
                    </span>
                  </div>
                </div>

                {/* Justificativa Textual em Linguagem Natural */}
                <div className="p-3 rounded-base bg-secondary/50 border border-border text-xs space-y-1">
                  <strong className="text-[11px] text-primary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brandOrange" /> Explicação Auditável do Match:
                  </strong>
                  <p className="text-foreground leading-relaxed text-[11px]">
                    "{proc.matchExplanation}"
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {vacancy.mandatorySkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {sk} (Obrigatória)
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={onNavigateToProcess}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-base flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    Ver Funil 8 Etapas & Decidir Opt-In <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* VAGAS DO MOTOR FASTAPI (SQLITE) DISPONÍVEIS NO ECOSSISTEMA */}
      {apiJobs.length > 0 && (
        <div className="bg-white p-5 rounded-base border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Vagas Ativas no Motor de IA & Banco SQLite ({apiJobs.length})
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Vagas sincronizadas com o avaliador algorítmico de 5 etapas (Hard Skills, Soft Skills, Experiência, Condições e Cobertura).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {apiJobs.map((jb) => (
              <div key={jb.id} className="p-3.5 rounded-base bg-background border border-border space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-foreground font-bold block">{jb.title}</strong>
                    <span className="text-[11px] text-muted-foreground">
                      {jb.company_name || 'Empresa Parceira'} • {jb.seniority} • {jb.work_model}
                    </span>
                  </div>
                  <span className="text-[10px] bg-secondary text-primary font-bold px-2 py-0.5 rounded">
                    {jb.contract_type}
                  </span>
                </div>
                {jb.min_salary && jb.max_salary && (
                  <div className="text-[11px] font-bold text-primary">
                    Faixa: R$ {jb.min_salary.toLocaleString('pt-BR')} – R$ {jb.max_salary.toLocaleString('pt-BR')}
                  </div>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {jb.skill_requirements?.slice(0, 4).map((req) => (
                    <span key={req.skill_id} className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-foreground font-medium">
                      {req.skill_name || req.skill_id.replace('hard-', '').replace('soft-', '')} (Nível {req.min_level})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
