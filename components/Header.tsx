import React, { useState } from 'react';
import { ScrollText, Github, LogIn, UserPlus, LogOut, Bookmark, Menu, X, Settings, User } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onAbout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onSaved: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  session: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHome, 
  onAbout, 
  onLogin, 
  onRegister, 
  onSaved,
  onLogout,
  onOpenSettings,
  session 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

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
        
        {/* Desktop Nav */}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenSettings}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Hesap Ayarları"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Giriş
              </button>
              <button 
                onClick={onRegister}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Kayıt Ol</span>
              </button>
            </>
          )}
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <a href="https://github.com/nyx47rd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {session && (
             <button 
                onClick={onSaved} 
                className="text-slate-600"
                title="Kaydedilenler"
             >
               <Bookmark className="w-6 h-6" />
             </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-700">
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-fade-in-up z-40">
          <div className="flex flex-col p-4 gap-2">
            <button 
              onClick={() => handleMobileNav(onHome)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
            >
              <ScrollText className="w-5 h-5" /> Ana Sayfa
            </button>
            <button 
              onClick={() => handleMobileNav(onAbout)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
            >
              <User className="w-5 h-5" /> Hakkımda
            </button>
            
            {session ? (
              <>
                <button 
                  onClick={() => handleMobileNav(onSaved)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <Bookmark className="w-5 h-5" /> Kaydedilenler
                </button>
                <button 
                  onClick={() => handleMobileNav(onOpenSettings)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <Settings className="w-5 h-5" /> Hesabım
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => handleMobileNav(onLogout)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" /> Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => handleMobileNav(onLogin)} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <LogIn className="w-5 h-5" /> Giriş Yap
                </button>
                <button 
                  onClick={() => handleMobileNav(onRegister)} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-white font-medium shadow-md"
                >
                  <UserPlus className="w-5 h-5" /> Kayıt Ol
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};