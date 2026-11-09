import { CandidateProfile, Seniority } from '../types';

export interface CandidateLevelInfo {
  lvl: number;
  seniority: Seniority;
  tier: 'Rank A' | 'Rank B' | 'Rank C';
  title: string;
  power: number;
  maxScore: number;
  currentXp: number;
  xpPercentage: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

/**
 * Retorna as informações unificadas de Nível, Ranking RPG (Rank A / B / C),
 * Poder de Engenharia e XP do candidato para que todas as telas exibam
 * dados 100% consistentes e sincronizados.
 */
export function getCandidateLevelInfo(
  profile?: CandidateProfile | null,
  fallbackSeniority: Seniority = 'Pleno'
): CandidateLevelInfo {
  const seniority = (profile?.seniority || fallbackSeniority) as Seniority;

  let lvl = 2;
  let tier: 'Rank A' | 'Rank B' | 'Rank C' = 'Rank B';
  let title = 'Operador Tático';
  let power = 85;
  let maxScore = 88;
  let badgeBg = 'bg-amber-400/10';
  let badgeBorder = 'border-amber-400/30';
  let badgeText = 'text-amber-400';

  switch (seniority) {
    case 'Júnior':
      lvl = 1;
      tier = 'Rank C';
      title = 'Aprendiz Ágil';
      power = 72;
      maxScore = 75;
      badgeBg = 'bg-purple-500/15';
      badgeBorder = 'border-purple-500/30';
      badgeText = 'text-purple-300';
      break;

    case 'Pleno':
      lvl = 2;
      tier = 'Rank B';
      title = 'Operador Tático';
      power = 85;
      maxScore = 88;
      badgeBg = 'bg-amber-400/15';
      badgeBorder = 'border-amber-400/30';
      badgeText = 'text-amber-300';
      break;

    case 'Sênior':
      lvl = 3;
      tier = 'Rank A';
      title = 'Mestre Arquiteto';
      power = 94;
      maxScore = 98;
      badgeBg = 'bg-emerald-400/15';
      badgeBorder = 'border-emerald-400/30';
      badgeText = 'text-emerald-300';
      break;

    default:
      lvl = 2;
      tier = 'Rank B';
      title = 'Engenheiro de Sistemas';
      power = 82;
      maxScore = 85;
      break;
  }

  // Cálculo Dinâmico e Unificado de XP (Máximo 1000 XP)
  let xp = 450;
  if (seniority === 'Sênior') xp += 300;
  else if (seniority === 'Pleno') xp += 200;
  else xp += 100;

  if (profile) {
    const skillsCount = profile.skills?.length || 0;
    xp += skillsCount * 45;
    if (profile.githubUrl) xp += 100;
    if (profile.isCommunityMember) xp += 75;
  } else {
    xp += 200;
  }

  const currentXp = Math.min(1000, xp);
  const xpPercentage = Math.round((currentXp / 1000) * 100);

  return {
    lvl,
    seniority,
    tier,
    title,
    power,
    maxScore,
    currentXp,
    xpPercentage,
    badgeBg,
    badgeBorder,
    badgeText
  };
}
