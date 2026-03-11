// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton pour éviter les instances multiples avec le Hot Reload de Vite
if (!window._supabaseInstance) {
  window._supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = window._supabaseInstance;