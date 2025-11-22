import React, { useState } from 'react';
import { supabase, isConfigured } from '../services/supabase';
import { Loader2, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthFormProps {
  type: 'LOGIN' | 'REGISTER';
  onSuccess: () => void;
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login States
  const [useOtp, setUseOtp] = useState(false); // OTP modu aktif mi?
  const [otpSent, setOtpSent] = useState(false); // Kod gönderildi mi?

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isConfigured) {
         // Sessiz hata fırlatma, kullanıcıya teknik detay yerine genel mesaj
         throw new Error("Sistem bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.");
      }

      if (type === 'REGISTER') {
        // KAYIT OLMA
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        
        if (error) throw error;
        
        alert('Kayıt işleminiz alındı. Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.');
        onToggleMode(); 
      } 
      else {
        // GİRİŞ YAPMA
        if (useOtp) {
          // OTP (Kod) İle Giriş
          if (!otpSent) {
            // 1. Adım: Kodu Gönder
            const { error } = await supabase.auth.signInWithOtp({
              email,
              options: {
                shouldCreateUser: false, // Sadece kayıtlı kullanıcılar kod alabilir
              }
            });
            if (error) throw error;
            setOtpSent(true);
            alert(`Doğrulama kodu ${email} adresine gönderildi.`);
          } else {
            // 2. Adım: Kodu Doğrula
            const { data, error } = await supabase.auth.verifyOtp({
              email,
              token: otpToken,
              type: 'email',
            });
            if (error) throw error;
            onSuccess();
          }
        } else {
          // Standart Şifreli Giriş
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error('Auth İşlem Hatası:', err);
      setError(err.message || 'İşlem sırasında beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setOtpSent(false);
    setOtpToken('');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            {type === 'LOGIN' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </h2>
          <p className="text-slate-400 text-sm">
            {type === 'LOGIN' 
              ? 'Hesabınıza güvenli bir şekilde erişin.' 
              : 'Dijital tarihçilik topluluğuna katılın.'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
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
                  disabled={otpSent} // Kod gönderildiyse e-postayı kilitle
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Şifre Alanı - Sadece Kayıtta veya OTP kapalıysa göster */}
            {(!useOtp || type === 'REGISTER') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required={!useOtp}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* OTP Kodu Girme Alanı */}
            {useOtp && otpSent && type === 'LOGIN' && (
               <div className="animate-fade-in-up">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Doğrulama Kodu</label>
                 <div className="relative">
                   <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                   <input
                     type="text"
                     required
                     value={otpToken}
                     onChange={(e) => setOtpToken(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 border border-indigo-300 bg-indigo-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-lg tracking-widest"
                     placeholder="123456"
                     maxLength={6}
                   />
                 </div>
                 <p className="text-xs text-slate-500 mt-1">E-posta adresinize gelen 6 haneli kodu giriniz.</p>
               </div>
            )}

            {/* OTP Toggle - Sadece Login ekranında */}
            {type === 'LOGIN' && !otpSent && (
              <div className="flex items-center gap-2 py-2 cursor-pointer" onClick={() => setUseOtp(!useOtp)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${useOtp ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                  {useOtp && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-slate-600 select-none">E-posta Kodu ile Giriş Yap (Güvenli)</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {type === 'LOGIN' 
                    ? (useOtp ? (otpSent ? 'Doğrula ve Giriş Yap' : 'Kodu Gönder') : 'Giriş Yap') 
                    : 'Kayıt Ol'}
                  {!otpSent && <ArrowRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              {type === 'LOGIN' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
              <button
                onClick={() => {
                  resetForm();
                  onToggleMode();
                }}
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