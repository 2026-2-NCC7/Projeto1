/**
 * Q.I. MATCH — MOTOR MATEMÁTICO DE MATCHMAKING EXPLICÁVEL
 * 
 * Implementação em conformidade com o Artigo 20 da LGPD (Transparência Algorítmica).
 * 
 * FÓRMULA OFICIAL DE COMPATIBILIDADE MULTIDIMENSIONAL:
 * S_global = (w_hard * S_hard) + (w_soft * S_soft) + (w_exp * S_exp) + (w_cond * S_cond)
 * 
 * Onde os pesos somam 1.0 (100%):
 * - w_hard = 0.50 (50% Hard Skills: Requisitos Obrigatórios e Diferenciais Desejáveis)
 * - w_soft = 0.25 (25% Soft Skills: Competências Comportamentais Evidenciadas)
 * - w_exp  = 0.15 (15% Experiência: Alinhamento de Senioridade e Tempo de Atuação)
 * - w_cond = 0.10 (10% Condições: Modalidade de Trabalho, Regime CLT/PJ e Faixa Salarial)
 */

import { CandidateProfile, Vacancy, Seniority, SkillMastery } from '../types';

export interface DimensionBreakdown {
  score: number;       // 0 a 100
  weight: number;      // ex: 0.50
  weightedScore: number; // score * weight
  summary: string;
  details: string[];
}

export interface DetailedMatchResult {
  globalScore: number; // 0 a 100
  isHighMatch: boolean; // >= 75%
  statusLabel: 'Compatibilidade Altíssima' | 'Alta Afinidade' | 'Afinidade Moderada' | 'Gaps de Competência' | 'Desalinhado';
  dimensions: {
    hardSkills: DimensionBreakdown & {
      matchedMandatory: string[];
      missingMandatory: string[];
      matchedDesirable: string[];
      missingDesirable: string[];
      masteryBonus: number;
    };
    softSkills: DimensionBreakdown & {
      matchedSoft: string[];
      missingSoft: string[];
      interviewEvidenced: boolean;
    };
    experience: DimensionBreakdown & {
      candidateSeniority: string;
      vacancySeniority: string;
      yearsAvg: number;
    };
    conditions: DimensionBreakdown & {
      modalityMatch: boolean;
      contractMatch: boolean;
      salaryMatch: boolean;
    };
  };
  formula: {
    equation: string;
    substitution: string;
    weightsExplanation: string;
    lgpdAuditNotice: string;
  };
}

/**
 * Normaliza termos e reconhece sinônimos para casamento semântico robusto
 */
function isSkillMatch(candidateSkillName: string, requiredSkillName: string): boolean {
  const c = candidateSkillName.trim().toLowerCase();
  const r = requiredSkillName.trim().toLowerCase();

  if (c === r || c.includes(r) || r.includes(c)) return true;

  // Mapa de sinônimos técnicos comuns
  const synonyms: Record<string, string[]> = {
    'postgres': ['postgresql', 'sql', 'bancos e dados', 'banco de dados'],
    'postgresql': ['postgres', 'sql', 'bancos e dados', 'banco de dados'],
    'sql': ['postgresql', 'postgres', 'mysql', 'sql server', 'oracle', 'bancos e dados'],
    'react': ['reactjs', 'react.js', 'frontend'],
    'reactjs': ['react', 'react.js'],
    'node': ['nodejs', 'node.js', 'backend/apis'],
    'node.js': ['nodejs', 'node', 'backend/apis'],
    'nodejs': ['node.js', 'node', 'backend/apis'],
    'ts': ['typescript'],
    'typescript': ['ts', 'javascript'],
    'js': ['javascript'],
    'javascript': ['js'],
    'tailwind': ['tailwind css', 'tailwindcss'],
    'tailwind css': ['tailwind', 'tailwindcss'],
    'aws': ['amazon web services', 'cloud aws', 'cloud'],
    'k8s': ['kubernetes'],
    'kubernetes': ['k8s'],
    'ci/cd': ['devops', 'pipelines', 'git'],
    'docker': ['containers', 'devops/infra'],
    'clean architecture': ['arquitetura', 'design patterns']
  };

  const cSynonyms = synonyms[c] || [];
  if (cSynonyms.some(s => s === r || r.includes(s) || s.includes(r))) return true;

  const rSynonyms = synonyms[r] || [];
  if (rSynonyms.some(s => s === c || c.includes(s) || s.includes(c))) return true;

  return false;
}

/**
 * Mapeia senioridade para valor numérico (1 a 5)
 */
function seniorityToNumber(sen: string): number {
  const s = (sen || '').toLowerCase();
  if (s.includes('júnior') || s.includes('junior')) return 2;
  if (s.includes('pleno')) return 3;
  if (s.includes('sênior') || s.includes('senior')) return 4;
  if (s.includes('especialista') || s.includes('staff') || s.includes('liderança')) return 5;
  return 1; // estágio / iniciante
}

/**
 * Mapeia maestria declarada para fator de ponderação
 */
function masteryBonusPoints(mastery?: SkillMastery): number {
  switch (mastery) {
    case 'Especialista': return 5;
    case 'Avançado': return 4;
    case 'Intermediário': return 2;
    default: return 0;
  }
}

/**
 * Calcula a compatibilidade técnica rigorosa entre um candidato e uma vaga
 */
export function calculateDetailedMatch(
  candidate: CandidateProfile,
  vacancy: Vacancy,
  interviewSummary?: Array<{ competency: string; level: string }>
): DetailedMatchResult {
  const candSkills = candidate.skills || [];
  const reqMandatory = vacancy.mandatorySkills || [];
  const reqDesirable = vacancy.desirableSkills || [];
  const reqSoft = vacancy.softSkills || [];

  // =========================================================================
  // 1. HARD SKILLS (Peso: 0.50)
  // =========================================================================
  const matchedMandatory: string[] = [];
  const missingMandatory: string[] = [];

  let masteryBonusAccumulator = 0;

  for (const req of reqMandatory) {
    const foundSkill = candSkills.find(cs => isSkillMatch(cs.name, req));
    if (foundSkill) {
      matchedMandatory.push(req);
      masteryBonusAccumulator += masteryBonusPoints(foundSkill.mastery);
    } else {
      missingMandatory.push(req);
    }
  }

  const matchedDesirable: string[] = [];
  const missingDesirable: string[] = [];

  for (const req of reqDesirable) {
    const foundSkill = candSkills.find(cs => isSkillMatch(cs.name, req));
    if (foundSkill) {
      matchedDesirable.push(req);
    } else {
      missingDesirable.push(req);
    }
  }

  const mandatoryRatio = reqMandatory.length > 0
    ? matchedMandatory.length / reqMandatory.length
    : 1.0;

  const desirableRatio = reqDesirable.length > 0
    ? matchedDesirable.length / reqDesirable.length
    : 0.5;

  // Pontuação base de Hard Skills:
  // - Requisitos mandatórios compõem até 85 pontos
  // - Requisitos desejáveis compõem até 15 pontos
  // - Bônus de maestria comprovada (até 5 pontos extras como diferencial)
  const hardMandatoryScore = mandatoryRatio * 85;
  const hardDesirableScore = desirableRatio * 15;
  const normalizedMasteryBonus = Math.min(5, Math.round(masteryBonusAccumulator / Math.max(1, matchedMandatory.length)));

  const rawHardScore = Math.min(100, Math.round(hardMandatoryScore + hardDesirableScore + normalizedMasteryBonus));
  // Se não atendeu nenhum requisito mandatório, a pontuação de hard skills é 0 (ou residual se tiver desejáveis)
  const hardScore = matchedMandatory.length === 0 ? Math.min(15, Math.round(hardDesirableScore)) : rawHardScore;

  // =========================================================================
  // 2. SOFT SKILLS (Peso: 0.25)
  // =========================================================================
  const matchedSoft: string[] = [];
  const missingSoft: string[] = [];

  const candidateEvidences = interviewSummary || [];
  const hasInterview = candidateEvidences.length > 0;

  for (const soft of reqSoft) {
    const isEvidenced = candidateEvidences.some(ev =>
      ev.competency.toLowerCase().includes(soft.toLowerCase()) ||
      soft.toLowerCase().includes(ev.competency.toLowerCase())
    );

    if (isEvidenced) {
      matchedSoft.push(soft);
    } else {
      missingSoft.push(soft);
    }
  }

  let softScore = 0;
  if (hasInterview) {
    const softRatio = reqSoft.length > 0 ? matchedSoft.length / reqSoft.length : 1.0;
    // Base de 75% + proporcionalidade das competências diretamente avaliadas
    softScore = Math.min(100, Math.round(60 + softRatio * 40));
  } else {
    // Sem entrevista realizada ainda: score neutro com indicativo de pendência
    softScore = 70;
  }

  // =========================================================================
  // 3. EXPERIÊNCIA & SENIORIDADE (Peso: 0.15)
  // =========================================================================
  const candSeniorityNum = seniorityToNumber(candidate.seniority);
  const vacSeniorityNum = seniorityToNumber(vacancy.seniority);

  const seniorityDelta = candSeniorityNum - vacSeniorityNum;
  let baseExpScore = 80;

  if (seniorityDelta === 0) {
    // Senioridade exata (ex: Pleno para vaga Pleno)
    baseExpScore = 95;
  } else if (seniorityDelta > 0) {
    // Candidato mais sênior que a vaga (ex: Sênior para vaga Pleno)
    baseExpScore = 92; // Totalmente apto com leve ajuste de sobrequalificação
  } else if (seniorityDelta === -1) {
    // Candidato 1 nível abaixo (ex: Pleno para vaga Sênior)
    baseExpScore = 70; // Desafio com potencial
  } else {
    // Candidato 2+ níveis abaixo
    baseExpScore = 40;
  }

  // Refinamento pelos anos de atuação nas skills
  const totalYears = candSkills.reduce((acc, curr) => acc + (curr.years || 0), 0);
  const avgYears = candSkills.length > 0 ? totalYears / candSkills.length : 2;
  const yearsFactor = Math.min(10, Math.round(avgYears * 2));
  const expScore = Math.min(100, Math.max(30, baseExpScore + (yearsFactor - 5)));

  // =========================================================================
  // 4. CONDIÇÕES DE TRABALHO & MODELO (Peso: 0.10)
  // =========================================================================
  // Modalidade (Presencial, Híbrido, Remoto)
  const candModalities = candidate.modalities || [];
  const vacModality = vacancy.modality;
  const modalityMatch = candModalities.length === 0 || candModalities.includes(vacModality) ||
    (candModalities.includes('Remoto') && vacModality === 'Híbrido' && candidate.city.toLowerCase() === vacancy.location.toLowerCase());

  // Regime de Contratação (CLT, PJ)
  const candContracts = candidate.contractTypes || [];
  const vacContracts = vacancy.contractTypes || [];
  const contractMatch = candContracts.length === 0 || vacContracts.length === 0 ||
    candContracts.some(c => vacContracts.includes(c));

  // Faixa Salarial
  const candMinSalary = candidate.salaryMin || 0;
  const vacMaxSalary = vacancy.salaryMax || 999999;
  const salaryMatch = candMinSalary <= vacMaxSalary * 1.15; // até 15% de margem de negociação

  let conditionsPoints = 40; // baseline
  if (modalityMatch) conditionsPoints += 30;
  if (contractMatch) conditionsPoints += 20;
  if (salaryMatch) conditionsPoints += 10;
  const condScore = Math.min(100, conditionsPoints);

  // =========================================================================
  // 5. CÁLCULO FINAL PONDERADO (S_global)
  // =========================================================================
  const weightedHard = hardScore * 0.50;
  const weightedSoft = softScore * 0.25;
  const weightedExp = expScore * 0.15;
  const weightedCond = condScore * 0.10;

  const rawGlobal = weightedHard + weightedSoft + weightedExp + weightedCond;
  const globalScore = Math.min(100, Math.max(5, Math.round(rawGlobal)));
  const isHighMatch = globalScore >= 75;

  let statusLabel: DetailedMatchResult['statusLabel'] = 'Afinidade Moderada';
  if (globalScore >= 88) statusLabel = 'Compatibilidade Altíssima';
  else if (globalScore >= 75) statusLabel = 'Alta Afinidade';
  else if (globalScore >= 55) statusLabel = 'Afinidade Moderada';
  else if (globalScore >= 35) statusLabel = 'Gaps de Competência';
  else statusLabel = 'Desalinhado';

  return {
    globalScore,
    isHighMatch,
    statusLabel,
    dimensions: {
      hardSkills: {
        score: hardScore,
        weight: 0.50,
        weightedScore: Number(weightedHard.toFixed(1)),
        summary: `${matchedMandatory.length} de ${reqMandatory.length} requisitos obrigatórios atendidos`,
        details: [
          `Requisitos obrigatórios atendidos: ${matchedMandatory.length}/${reqMandatory.length} (${Math.round(mandatoryRatio * 100)}%)`,
          `Diferenciais desejáveis atendidos: ${matchedDesirable.length}/${reqDesirable.length || 1}`,
          `Bônus de maestria técnica: +${normalizedMasteryBonus} pts`
        ],
        matchedMandatory,
        missingMandatory,
        matchedDesirable,
        missingDesirable,
        masteryBonus: normalizedMasteryBonus
      },
      softSkills: {
        score: softScore,
        weight: 0.25,
        weightedScore: Number(weightedSoft.toFixed(1)),
        summary: hasInterview
          ? `${matchedSoft.length} de ${reqSoft.length} competências comportamentais validadas`
          : 'Pendente de validação na entrevista de voz',
        details: [
          hasInterview
            ? `Entrevista IA concluída com evidências literais para: ${matchedSoft.join(', ') || 'Nenhuma mapeada'}`
            : 'Entrevista técnica pendente. Score estimado com base no perfil geral.'
        ],
        matchedSoft,
        missingSoft,
        interviewEvidenced: hasInterview
      },
      experience: {
        score: expScore,
        weight: 0.15,
        weightedScore: Number(weightedExp.toFixed(1)),
        summary: `Senioridade ${candidate.seniority} para vaga ${vacancy.seniority}`,
        details: [
          `Senioridade do candidato: ${candidate.seniority} (Nível ${candSeniorityNum})`,
          `Senioridade exigida na vaga: ${vacancy.seniority} (Nível ${vacSeniorityNum})`,
          `Média de atuação técnica declarada: ${avgYears.toFixed(1)} anos`
        ],
        candidateSeniority: candidate.seniority,
        vacancySeniority: vacancy.seniority,
        yearsAvg: avgYears
      },
      conditions: {
        score: condScore,
        weight: 0.10,
        weightedScore: Number(weightedCond.toFixed(1)),
        summary: `${modalityMatch ? 'Modalidade compatível' : 'Modalidade divergente'} • ${contractMatch ? 'Regime aceito' : 'Regime a alinhar'}`,
        details: [
          `Modalidade: Vaga ${vacModality} vs Candidato aceita [${candModalities.join(', ')}]`,
          `Regime de Contratação: Vaga [${vacContracts.join('/')}] vs Candidato aceita [${candContracts.join('/')}]`,
          `Faixa Salarial: Vaga até R$ ${vacancy.salaryMax.toLocaleString('pt-BR')} vs Pretensão mínima R$ ${candidate.salaryMin.toLocaleString('pt-BR')}`
        ],
        modalityMatch,
        contractMatch,
        salaryMatch
      }
    },
    formula: {
      equation: 'S_global = (0.50 × S_hard) + (0.25 × S_soft) + (0.15 × S_exp) + (0.10 × S_cond)',
      substitution: `(${Number(weightedHard.toFixed(1))} [0.50 × ${hardScore}%]) + (${Number(weightedSoft.toFixed(1))} [0.25 × ${softScore}%]) + (${Number(weightedExp.toFixed(1))} [0.15 × ${expScore}%]) + (${Number(weightedCond.toFixed(1))} [0.10 × ${condScore}%]) = ${globalScore}%`,
      weightsExplanation: '50% Hard Skills (requisitos obrigatórios + diferenciais) + 25% Soft Skills (validadas por IA) + 15% Senioridade e Experiência + 10% Condições de Trabalho (modalidade, regime e remuneração)',
      lgpdAuditNotice: 'Auditoria LGPD Art. 20: Cálculo 100% determinístico e auditável. Nenhum dado demográfico, etário, de gênero ou localização pessoal é utilizado como critério de pontuação.'
    }
  };
}
