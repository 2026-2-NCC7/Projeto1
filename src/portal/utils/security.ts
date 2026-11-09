/**
 * MÓDULO OFICIAL DE SEGURANÇA E CONFORMIDADE LGPD - Q.I. TECH
 * - Avaliação de Força de Senha em Tempo Real
 * - Trava Progressiva contra Ataques de Força Bruta (Rate Limiting com Anti-Reload Cookie)
 * - Sanitização e Prevenção de XSS e Clickjacking
 * - Ticket de Sessão Magro (Lean Session Token sem PII)
 */

export interface PasswordCriterion {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 a 4
  label: 'Inaceitável' | 'Fraca' | 'Média' | 'Forte' | 'Excelente';
  color: string;
  percentage: number;
  criteria: PasswordCriterion[];
  isStrongEnough: boolean;
}

/**
 * Avalia a força da senha em tempo real com critérios rigorosos de segurança
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const p = password || '';
  
  const hasMinLength = p.length >= 8;
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(p);

  const criteria: PasswordCriterion[] = [
    { id: 'min_len', label: 'Mínimo de 8 caracteres', met: hasMinLength },
    { id: 'case', label: 'Letras maiúsculas e minúsculas', met: hasUpper && hasLower },
    { id: 'number', label: 'Ao menos um número (0-9)', met: hasNumber },
    { id: 'special', label: 'Caractere especial (!@#$...)', met: hasSpecial }
  ];

  let passedCount = criteria.filter(c => c.met).length;
  if (p.length >= 12 && passedCount >= 3) {
    passedCount = Math.min(4, passedCount + 1);
  }

  let label: PasswordStrengthResult['label'] = 'Inaceitável';
  let color = '#ef4444'; // red-500
  let percentage = 0;

  if (p.length === 0) {
    percentage = 0;
    label = 'Inaceitável';
  } else if (passedCount <= 1) {
    percentage = 25;
    label = 'Fraca';
    color = '#ef4444'; // red
  } else if (passedCount === 2) {
    percentage = 50;
    label = 'Média';
    color = '#f59e0b'; // amber
  } else if (passedCount === 3) {
    percentage = 75;
    label = 'Forte';
    color = '#84cc16'; // lime
  } else {
    percentage = 100;
    label = 'Excelente';
    color = '#10b981'; // emerald
  }

  // A senha só é permitida se tiver pelo menos 8 chars, maiúscula, minúscula, número e caractere especial
  const isStrongEnough = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    score: passedCount,
    label,
    color,
    percentage,
    criteria,
    isStrongEnough
  };
}

// =========================================================================
// TRAVA PROGRESSIVA CONTRA FORÇA BRUTA (RATE LIMITING COM ANTI-RELOAD)
// =========================================================================

const LOCKOUT_COOKIE_KEY = 'qitech_sec_lockout';
const LOCKOUT_STORAGE_KEY = 'qitech_sec_lockout_ts';
const ATTEMPTS_STORAGE_KEY = 'qitech_sec_attempts';

/**
 * Lê o tempo de bloqueio persistido em cookie e localStorage
 */
export function getRemainingLockoutSeconds(): number {
  const now = Date.now();
  
  // 1. Tenta ler do Cookie para evitar bypass via limpeza seletiva de localStorage
  let cookieLockoutUntil = 0;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + LOCKOUT_COOKIE_KEY + '=([^;]+)'));
    if (match) {
      cookieLockoutUntil = parseInt(match[2], 10) || 0;
    }
  }

  // 2. Tenta ler do localStorage
  let storageLockoutUntil = 0;
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (raw) {
      storageLockoutUntil = parseInt(raw, 10) || 0;
    }
  }

  const effectiveLockout = Math.max(cookieLockoutUntil, storageLockoutUntil);
  if (effectiveLockout > now) {
    return Math.ceil((effectiveLockout - now) / 1000);
  }

  return 0;
}

/**
 * Registra uma tentativa de login falha.
 * A partir da 3ª falha consecutiva, ativa a trava progressiva.
 */
export function recordFailedLoginAttempt(): {
  attempts: number;
  isLocked: boolean;
  lockoutSeconds: number;
} {
  const currentAttempts = (parseInt(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || '0', 10) || 0) + 1;
  localStorage.setItem(ATTEMPTS_STORAGE_KEY, String(currentAttempts));

  let lockoutSeconds = 0;

  if (currentAttempts === 3) {
    lockoutSeconds = 30; // 30s na 3ª tentativa falha
  } else if (currentAttempts === 4) {
    lockoutSeconds = 60; // 60s na 4ª tentativa falha
  } else if (currentAttempts >= 5) {
    lockoutSeconds = 120; // 120s na 5ª em diante
  }

  if (lockoutSeconds > 0) {
    const lockoutUntil = Date.now() + (lockoutSeconds * 1000);
    // Salva no localStorage
    localStorage.setItem(LOCKOUT_STORAGE_KEY, String(lockoutUntil));
    
    // Salva no Cookie com SameSite=Strict e Max-Age para persistir mesmo com refresh de página (F5)
    if (typeof document !== 'undefined') {
      document.cookie = `${LOCKOUT_COOKIE_KEY}=${lockoutUntil}; max-age=${lockoutSeconds}; path=/; SameSite=Strict`;
    }
    
    return { attempts: currentAttempts, isLocked: true, lockoutSeconds };
  }

  return { attempts: currentAttempts, isLocked: false, lockoutSeconds: 0 };
}

/**
 * Limpa o histórico de tentativas após autenticação bem-sucedida
 */
export function clearLoginAttempts(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${LOCKOUT_COOKIE_KEY}=; max-age=0; path=/; SameSite=Strict`;
  }
}

// =========================================================================
// ANTI-CLICKJACKING & DETECÇÃO DE SITES FALSOS (FRAME BUSTER)
// =========================================================================

export function isEmbeddedInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Se bloqueado por cross-origin, está em iframe!
  }
}

export function preventClickjacking(): boolean {
  if (isEmbeddedInIframe()) {
    try {
      if (window.top) {
        window.top.location = window.self.location;
        return true;
      }
    } catch {
      console.warn('[Segurança Q.I. Tech] Tentativa de embutir a plataforma em site terceiro detectada e bloqueada.');
    }
  }
  return false;
}

// =========================================================================
// SANITIZAÇÃO DE INPUTS CONTRA XSS
// =========================================================================

export function sanitizeInput(val: string): string {
  if (!val) return '';
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// =========================================================================
// TICKET DE SESSÃO MAGRO (LEAN SESSION TICKET - SEM PII)
// =========================================================================

export interface LeanSessionTicket {
  ticketId: string;      // Token anônimo UUID v4
  userId: string;        // Apenas ID do usuário (sem email, CPF ou salário)
  role: string;          // Papel de controle de acesso (RBAC)
  issuedAt: string;      // ISO String
  expiresAt: string;     // Expiração do ticket (8 horas)
  flags: {
    httpOnly: true;
    secure: true;
    sameSite: 'Strict';
  };
}

export function generateLeanTicket(userId: string, role: string): LeanSessionTicket {
  const randomId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `tk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const now = new Date();
  const expires = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 horas

  const ticket: LeanSessionTicket = {
    ticketId: randomId,
    userId,
    role,
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    flags: {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    }
  };

  // Simula persistência em Cookie com flag segura
  if (typeof document !== 'undefined') {
    document.cookie = `qitech_ticket=${ticket.ticketId}; max-age=${8 * 3600}; path=/; SameSite=Strict`;
  }

  return ticket;
}

