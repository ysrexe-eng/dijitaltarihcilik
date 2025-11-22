import React, { useState } from 'react';
import { supabase, isConfigured } from '../services/supabase';
import { Loader2, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, KeyRound, ArrowLeft, HelpCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'LOGIN' | 'REGISTER';
  onSuccess: () => void;
  onToggleMode: () => void;
}

type AuthStep = 'CREDENTIALS' | 'OTP' | 'FORGOT_PASSWORD';

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onToggleMode }) => {
  const [step, setStep] = useState<AuthStep>('CREDENTIALS');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isConfigured) throw new Error("Sistem bağlantısı kurulamadı.");

      // 1. Adım: Şifre Kontrolü
      const { error: pwError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (pwError) throw pwError;

      // 2. Adım: Şifre doğruysa, oturumu hemen kapat (2FA zorunluluğu için)
      // Bu sayede sadece şifre ile giriş yapılmış oturumun devam etmesini engelliyoruz.
      await supabase.auth.signOut();

      // 3. Adım: Doğrulama Kodu Gönder
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      });

      if (otpError) throw otpError;

      // 4. Adım: UI'ı OTP ekranına geçir
      setStep('OTP');
      setSuccessMessage('Şifre doğrulandı. E-posta adresinize gönderilen kodu giriniz.');

    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isConfigured) throw new Error("Sistem bağlantısı kurulamadı.");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      
      if (error) throw error;
      
      setSuccessMessage('Kayıt işleminiz alındı. Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.');
      setTimeout(() => {
         onToggleMode(); // Login ekranına dön
         setStep('CREDENTIALS');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Kayıt oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpToken,
        type: 'email',
      });

      if (error) throw error;
      
      onSuccess(); // Başarılı giriş
    } catch (err: any) {
      setError(err.message || 'Kod hatalı veya süresi dolmuş.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      setTimeout(() => {
          setStep('CREDENTIALS');
          setSuccessMessage(null);
      }, 4000);

    } catch (err: any) {
      setError(err.message || 'İşlem gerçekleştirilemedi.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccessMessage(null);
    setStep('CREDENTIALS');
    setOtpToken('');
  };

  // ---------------- RENDER HELPERS ----------------

  const renderCredentialsStep = () => (
    <form onSubmit={type === 'LOGIN' ? handleLoginFlow : handleRegister} className="space-y-4 animate-fade-in-up">
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
        <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Şifre</label>
            {type === 'LOGIN' && (
                <button 
                    type="button" 
                    onClick={() => { setError(null); setStep('FORGOT_PASSWORD'); }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    Şifremi Unuttum?
                </button>
            )}
        </div>
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
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in-up">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">İki Adımlı Doğrulama</h3>
        <p className="text-sm text-slate-500 mt-1">
          Güvenliğiniz için <strong>{email}</strong> adresine gönderilen kodu giriniz.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Doğrulama Kodu</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
          <input
            type="text"
            required
            value={otpToken}
            onChange={(e) => setOtpToken(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-indigo-300 bg-indigo-50/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-xl tracking-widest text-center text-indigo-900 placeholder-indigo-300"
            placeholder="000000"
            maxLength={6}
            autoFocus
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Doğrula ve Tamamla'}
      </button>

      <button
        type="button"
        onClick={resetState}
        className="w-full py-2 text-slate-500 text-sm font-medium hover:text-slate-800 flex items-center justify-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Geri Dön
      </button>
    </form>
  );

  const renderForgotPasswordStep = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4 animate-fade-in-up">
      <div className="text-center mb-6">
         <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-amber-600" />
         </div>
         <h3 className="text-lg font-bold text-slate-900">Şifre Sıfırlama</h3>
         <p className="text-sm text-slate-500 mt-1">
           Hesabınıza ait e-posta adresini giriniz. Size bir sıfırlama bağlantısı göndereceğiz.
         </p>
      </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sıfırlama Bağlantısı Gönder'}
      </button>

      <button
        type="button"
        onClick={() => { setError(null); setSuccessMessage(null); setStep('CREDENTIALS'); }}
        className="w-full py-2 text-slate-500 text-sm font-medium hover:text-slate-800 flex items-center justify-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Giriş Ekranına Dön
      </button>
    </form>
  );

  return (
    <div className="max-w-md mx-auto mt-20 px-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
           {/* Arkaplan Efekti */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-[-50%] left-[-20%] w-48 h-48 bg-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
           </div>
           
           <h2 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">
            {type === 'REGISTER' ? 'Hesap Oluştur' : 
             step === 'FORGOT_PASSWORD' ? 'Şifremi Unuttum' : 
             step === 'OTP' ? 'Güvenlik Doğrulaması' : 'Giriş Yap'}
          </h2>
          <p className="text-slate-400 text-sm relative z-10">
            {type === 'REGISTER' ? 'Dijital tarihçilik topluluğuna katılın.' : 
             step === 'OTP' ? 'Lütfen kimliğinizi doğrulayın.' :
             step === 'FORGOT_PASSWORD' ? 'Hesabınızı kurtarın.' :
             'Hesabınıza güvenli erişim sağlayın.'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {type === 'REGISTER' ? renderCredentialsStep() : (
             <>
               {step === 'CREDENTIALS' && renderCredentialsStep()}
               {step === 'OTP' && renderOtpStep()}
               {step === 'FORGOT_PASSWORD' && renderForgotPasswordStep()}
             </>
          )}

          {step === 'CREDENTIALS' && (
            <div className="mt-6 text-center pt-4 border-t border-slate-100">
                <p className="text-slate-600 text-sm">
                {type === 'LOGIN' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                <button
                    onClick={() => {
                    resetState();
                    onToggleMode();
                    }}
                    className="ml-1 text-indigo-600 font-bold hover:underline"
                >
                    {type === 'LOGIN' ? 'Kayıt Olun' : 'Giriş Yapın'}
                </button>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
