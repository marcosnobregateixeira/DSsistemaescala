import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('DEBUG: VITE_SUPABASE_URL:', supabaseUrl);
console.log('DEBUG: VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***SET***' : '***NOT SET***');
console.log('DEBUG: import.meta.env keys:', Object.keys(import.meta.env));

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
                   supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                   supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
                   isValidSupabaseUrl(supabaseUrl);

if (!isConfigured) {
  if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL') {
    console.error('Supabase: A URL fornecida parece inválida. Certifique-se de que começa com https:// e é o domínio correto do seu projeto.');
  }
  console.warn('Supabase: Variáveis de ambiente não configuradas ou inválidas. O modo offline (LocalStorage) será utilizado.');
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
