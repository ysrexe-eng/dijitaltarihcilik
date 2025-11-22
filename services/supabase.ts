import { createClient } from '@supabase/supabase-js';

// Bu değerleri .env dosyasından veya hosting panelinden (Netlify/Vercel) çekiyoruz.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL veya Key eksik! Lütfen .env dosyanızı kontrol edin.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);