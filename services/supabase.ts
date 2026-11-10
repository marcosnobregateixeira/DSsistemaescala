import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://vbgotlwjxbbixkrnbjym.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_k0EF6q3L336BIjaO2gRzCw_00fgJcHa';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

if (!isConfigured) {
  console.warn('Supabase: Variáveis de ambiente não configuradas ou contêm valores padrão. O modo offline (LocalStorage) será utilizado.');
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }) 
  : null;
