import React from 'react';
import { ScrollText, Github, LogIn, UserPlus, LogOut, Bookmark } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onAbout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onSaved: () => void;
  onLogout: () => void;
  session: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHome, 
  onAbout, 
  onLogin, 
  onRegister, 
  onSaved,
  onLogout,
  session 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
          <div className="bg-indigo-900 p-2.5 rounded-lg group-hover:bg-indigo-700 transition-colors shadow-md">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold text-slate-900 leading-none">
              Dijital Tarihçilik
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1 tracking-wide uppercase">
              Yaşar Efe Çelik
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={onHome} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Ana Sayfa</button>
          <button onClick={onAbout} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Hakkımda</button>
          {session && (
             <button onClick={onSaved} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
               <Bookmark className="w-4 h-4" />
               Kaydedilenler
             </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          ) : (
            <>
              <button 
                onClick={onLogin}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Giriş
              </button>
              <button 
                onClick={onRegister}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Kayıt Ol</span>
              </button>
            </>
          )}
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <a href="https://github.com/nyx47rd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};