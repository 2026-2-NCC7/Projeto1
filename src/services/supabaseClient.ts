import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente configuráveis em .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// MÉTODOS DE AUTENTICAÇÃO SUPABASE (EMAIL, GOOGLE, GITHUB)
// ==============================================================================

/**
 * Login com Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase ainda não configurado no .env.local');
  }
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

/**
 * Login com GitHub OAuth
 */
export async function signInWithGithub() {
  if (!supabase) {
    throw new Error('Supabase ainda não configurado no .env.local');
  }
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
}

/**
 * Cadastro com Email & Senha + Metadados de Perfil
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  role: 'profissional' | 'empresa',
  metadata: {
    fullName: string;
    techArea?: string;
    seniority?: string;
    companyName?: string;
    cnpj?: string;
  }
) {
  if (!supabase) {
    throw new Error('Supabase ainda não configurado no .env.local');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: metadata.fullName,
        tech_area: metadata.techArea,
        declared_seniority: metadata.seniority,
        company_name: metadata.companyName,
        cnpj: metadata.cnpj,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Login direto com Email & Senha
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase ainda não configurado no .env.local');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Logout
 */
export async function signOut() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

/**
 * Obtém perfil público do usuário logado
 */
export async function getProfile(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('Erro ao buscar perfil Supabase:', error.message);
    return null;
  }

  return data;
}
