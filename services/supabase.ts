import { createClient } from '@supabase/supabase-js';

// Bu değerleri .env dosyasından veya hosting panelinden (Netlify/Vercel) çekiyoruz.
// vite.config.ts üzerinden process.env olarak tanımlanmıştır.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Konfigürasyon kontrolü
export const isConfigured = supabaseUrl && supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder');

if (!isConfigured) {
  console.warn('Supabase URL veya Key eksik! Uygulama demo modunda çalışıyor. Auth işlemleri başarısız olacaktır.');
  console.log('DEBUG: Supabase URL durumu:', supabaseUrl ? 'Tanımlı (Geçersiz olabilir)' : 'Tanımsız');
}

// Eğer URL yoksa, uygulamanın çökmesini (crash) engellemek için geçici URL kullanıyoruz.
const validUrl = isConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey && supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-key';

export const supabase: any = createClient(validUrl as string, validKey as string);