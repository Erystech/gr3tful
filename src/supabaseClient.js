import { createClient } from '@supabase/supabase-js';
import { removeRememberedLogin } from './components/utils/visits';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

removeRememberedLogin(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: true,
  },
});
