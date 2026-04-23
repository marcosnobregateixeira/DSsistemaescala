import { createClient } from '@supabase/supabase-js';

// Tenta carregar as variáveis de ambiente, com fallbacks e detecção de nomes truncados
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vbgotlwjxbbixkrnbjym.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANO || 'sb_publishable_k0EF6q3L336BIjaO2gRzCw_00fgJcHa';

// Função para validar se a URL é válida e aponta para o domínio do Supabase
const isValidSupabaseUrl = (url: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && (parsed.hostname.includes('supabase.co') || parsed.hostname.includes('supabase.net'));
  } catch {
    return false;
  }
};

const isConfigured = !!(supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl));

export const supabase = (() => {
  if (!isConfigured) {
    if (typeof window !== 'undefined') {
        console.warn('Supabase: Utilizando configuração de fallback para garantir funcionamento.');
    }
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: { 'x-application-name': 'pmce-escalas' }
      }
    });
  } catch (err) {
    if (typeof window !== 'undefined') {
        console.error('Erro crítico na inicialização do Supabase:', err);
    }
    return null;
  }
})();

