import React, { useState } from 'react';
import { supabase, isConfigured } from '../services/supabase';
import { Loader2, Mail, Lock, ArrowRight, AlertCircle, Database } from 'lucide-react';

interface AuthFormProps {
  type: 'LOGIN' | 'REGISTER';
  onSuccess: () => void;
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isConfigured) {
         throw new Error("Demo Modu: Veritabanı bağlantısı (Supabase Keys) yapılmadığı için işlem gerçekleştirilemedi.");
      }

      if (type === 'REGISTER') {
        // window.location.origin: O anki tarayıcı adresini alır (örn: http://localhost:5173 veya https://site-adiniz.com)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        
        if (error) throw error;
        
        alert('Kayıt başarılı! Lütfen e-posta kutunuzu kontrol edin (gerçek modda) veya giriş yapmayı deneyin.');
        onToggleMode(); 
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      console.error('Auth Hatası:', err);
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            {type === 'LOGIN' ? 'Tekrar Hoşgeldiniz' : 'Aramıza Katılın'}
          </h2>
          <p className="text-slate-400 text-sm">
            {type === 'LOGIN' ? 'Blogları kaydetmek için giriş yapın.' : 'Dijital tarihçilik dünyasını keşfedin.'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {!isConfigured && !error && (
             <div className="mb-6 p-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl flex items-start gap-3">
                 <Database className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                   <span className="font-bold block mb-1">Demo Modu Aktif</span>
                   Veritabanı bağlantısı yapılmadığı için giriş/kayıt işlemleri simüle edilecektir.
                 </div>
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {type === 'LOGIN' ? 'Giriş Yap' : 'Kayıt Ol'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              {type === 'LOGIN' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
              <button
                onClick={onToggleMode}
                className="ml-1 text-indigo-600 font-bold hover:underline"
              >
                {type === 'LOGIN' ? 'Kayıt Olun' : 'Giriş Yapın'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};