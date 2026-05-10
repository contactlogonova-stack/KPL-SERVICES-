import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
  auth: { 
    storageKey: 'kpl-auth', 
    storage: localStorage, 
    cookieDomain: '.kpl-services.com', 
    persistSession: true, 
    autoRefreshToken: true 
  } 
});
