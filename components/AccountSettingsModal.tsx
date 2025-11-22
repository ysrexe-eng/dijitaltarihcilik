import React, { useState, useEffect } from 'react';
import { X, Lock, Trash2, Loader2, Save, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  isRecovery?: boolean;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose, session, isRecovery = false }) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Recovery modunda mesaj göster
  useEffect(() => {
    if (isRecovery && isOpen) {
      setMessage({ type: 'success', text: 'Güvenliğiniz için lütfen yeni bir şifre belirleyin.' });
    }
  }, [isRecovery, isOpen]);

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
        return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
      setNewPassword('');
      
      // Recovery modundaysa kısa süre sonra kapat
      if (isRecovery) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Güncelleme hatası.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem GERİ ALINAMAZ.')) {
        return;
    }

    setDeleteLoading(true);
    try {
        await supabase.from('saved_posts').delete().eq('user_id', session.user.id);
        const { error } = await supabase.rpc('delete_user');

        if (error) {
            console.error('RPC Error:', error);
            if (error.message.includes('function delete_user() does not exist')) {
                throw new Error("Veritabanı ayarı eksik: Lütfen Supabase panelinde 'delete_user' SQL fonksiyonunu oluşturun.");
            }
            throw error;
        }

        await supabase.auth.signOut();
        onClose();
        alert('Hesabınız başarıyla silindi.');
        window.location.reload();

    } catch (err: any) {
        console.error(err);
        alert(`Hata: ${err.message}`);
    } finally {
        setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!isRecovery ? onClose : undefined}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            {isRecovery ? <RefreshCw className="w-5 h-5 text-indigo-600" /> : null}
            {isRecovery ? 'Yeni Şifre Belirle' : 'Hesap Ayarları'}
          </h3>
          {!isRecovery && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {!isRecovery && (
             <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Giriş yapılan e-posta</p>
                <p className="font-medium text-slate-900">{session?.user?.email}</p>
             </div>
          )}

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckIcon /> : <AlertTriangle className="w-4 h-4" />}
                {message.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {isRecovery ? 'Yeni Güçlü Şifreniz' : 'Yeni Şifre Belirle'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="******"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    autoFocus={isRecovery}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !newPassword}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isRecovery ? 'Değiştir' : 'Kaydet'}
                </button>
            </div>
          </form>

          {!isRecovery && (
            <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Tehlikeli Bölge
                </h4>
                <p className="text-xs text-slate-500 mb-4">Hesabınızı sildiğinizde tüm kaydedilen yazılarınız ve verileriniz kalıcı olarak silinir.</p>
                <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Hesabımı Sil
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);