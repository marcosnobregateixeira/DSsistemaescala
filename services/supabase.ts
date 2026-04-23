import { createClient } from '@supabase/supabase-js';

// Usando credenciais fixas para forçar a conexão
const supabaseUrl = 'https://vbgotlwjxbbixkrnbjym.supabase.co';
const supabaseAnonKey = 'sb_publishable_k0EF6q3L336BIjaO2gRzCw_00fgJcHa';

// Função para validar se a URL é válida e aponta para o domínio do Supabase
const isValidSupabaseUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    // Verifica se tem protocolo https e se o domínio contém supabase
    return parsed.protocol === 'https:' && parsed.hostname.includes('supabase');
  } catch {
    return false;
  }
};

const isConfigured = supabaseUrl && 
                   supabaseAnonKey && 
                   isValidSupabaseUrl(supabaseUrl);

if (!isConfigured) {
  console.warn('Supabase: Configuração inválida.');
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }) 
  : null;

