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
      detectSessionInUrl: true,
    },
  });
} else {
  // Fallback Client (Sessiz Mod)
  // Kullanıcıya "demo" yazısı göstermez, sadece konsola teknik log düşer.
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { session: null }, error: { message: 'Bağlantı yapılandırması eksik. Lütfen yönetici ile iletişime geçin.' } }),
      signInWithOtp: async () => ({ data: { session: null }, error: { message: 'Bağlantı yapılandırması eksik.' } }),
      verifyOtp: async () => ({ data: { session: null }, error: { message: 'Doğrulama yapılamadı.' } }),
      signUp: async () => ({ data: { session: null }, error: { message: 'Kayıt işlemi şu an gerçekleştirilemiyor.' } }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ error: { message: 'Güncelleme yapılamadı.' } }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any) => Promise.resolve({ error: { message: 'İşlem kaydedilemedi.' } }),
      delete: () => ({
        eq: (col: string, val: any) => ({
           eq: (col2: string, val2: any) => Promise.resolve({ error: null }) 
        })
      })
    }),
    rpc: () => Promise.resolve({ error: { message: 'İşlem gerçekleştirilemedi.' } })
  };
}

export const supabase = supabaseClient;