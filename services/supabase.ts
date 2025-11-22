import { createClient } from '@supabase/supabase-js';

// Vite ortam değişkenlerini okuma (Standart Vite kullanımı import.meta.env şeklindedir)
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Konfigürasyon kontrolü
export const isConfigured = supabaseUrl && supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder');

let supabaseClient;

if (isConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // URL hash'inden session'ı yakalamak için kritik
    },
  });
} else {
  console.warn('Supabase URL veya Key eksik! Uygulama MOCK (Demo) modunda çalışıyor.');
  
  // Mock (Sahte) İstemci - Hata vermemesi için boş fonksiyonlar
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { session: null }, error: { message: 'Demo Modu: Veritabanı anahtarları girilmediği için giriş yapılamaz.' } }),
      signUp: async () => ({ data: { session: null }, error: { message: 'Demo Modu: Veritabanı anahtarları girilmediği için kayıt olunamaz.' } }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any) => Promise.resolve({ error: { message: 'Demo modunda kayıt yapılamaz.' } }),
      delete: () => ({
        eq: (col: string, val: any) => ({
           eq: (col2: string, val2: any) => Promise.resolve({ error: null }) 
        })
      })
    })
  };
}

export const supabase = supabaseClient;