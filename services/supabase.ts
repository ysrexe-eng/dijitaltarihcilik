import { createClient } from '@supabase/supabase-js';

// Bu değerleri .env dosyasından veya hosting panelinden (Netlify/Vercel) çekiyoruz.
// vite.config.ts üzerinden process.env olarak tanımlanmıştır.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL veya Key eksik! Uygulama demo modunda çalışıyor. Özellikler çalışmayabilir.');
}

// Eğer URL yoksa, uygulamanın çökmesini (crash) engellemek için geçici/boş bir URL kullanıyoruz.
// Bu sayede arayüz render edilebilir, ancak Auth/DB işlemleri hata verecektir.
const validUrl = supabaseUrl && supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey && supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-key';

export const supabase: any = createClient(validUrl, validKey);