import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StatsChart } from './StatsChart';
import { ComparisonChart } from './ComparisonChart';
import { StorageChart } from './StorageChart';

interface ArticleViewProps {
  article: BlogPost;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, isSaved, onToggleSave }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onToggleSave(article.id);
    setIsSaving(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.summary,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-[60]">
        <div 
          className="h-full bg-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
        <nav className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Geri Dön</span>
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                isCopied 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Paylaş"
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {isCopied && <span className="text-xs font-medium">Kopyalandı!</span>}
            </button>
            <button 
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Kaydet"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </nav>

        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold tracking-wide uppercase">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-slate-500 text-sm border-y border-slate-100 py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-serif font-bold">
                {article.author.charAt(0)}
              </div>
              <span className="font-medium text-slate-700">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} dk okuma</span>
            </div>
          </div>
        </header>

        <div className="relative aspect-[21/9] w-full mb-16 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="prose prose-lg prose-indigo mx-auto markdown-content font-serif">
          <p className="lead text-xl md:text-2xl text-slate-600 font-light mb-10 leading-relaxed">
            {article.summary}
          </p>
          
          <ReactMarkdown>{article.content}</ReactMarkdown>

          {/* Dinamik Grafik Alanı */}
          {article.id === '1' && (
            <div className="my-12 not-prose transform hover:scale-[1.01] transition-transform duration-500">
              <StatsChart />
              <p className="text-center text-xs md:text-sm text-slate-500 mt-3 italic">
                Şekil 1.1: Son 15 yılda akademik çalışmalarda dijital kaynak kullanımının artışı.
              </p>
            </div>
          )}
          
           {article.id === '3' && (
            <div className="my-12 not-prose transform hover:scale-[1.01] transition-transform duration-500">
              <StorageChart />
            </div>
          )}

          {article.id === '5' && (
            <div className="my-12 not-prose transform hover:scale-[1.01] transition-transform duration-500">
              <ComparisonChart />
            </div>
          )}
          
          {article.id === '2' && (
             <div className="my-12 p-8 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl not-prose shadow-sm">
               <h4 className="font-bold text-amber-900 mb-3 text-xl font-serif">Araştırmacı Notu</h4>
               <p className="text-amber-800 leading-relaxed">
                 Bu makalede bahsedilen 'Deepfake' örnekleri, tarihsel belgelerin manipülasyonunun ne kadar kolaylaştığını göstermektedir. Bir tarihçinin görevi artık sadece belgeyi okumak değil, belgenin meta verisini analiz etmektir.
               </p>
             </div>
          )}
        </div>
        
        <div className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Okumaya Devam Et</h3>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-slate-600 mb-4">Bu konu hakkında daha fazla bilgi edinmek ister misiniz?</p>
                <button onClick={onBack} className="text-indigo-600 font-bold hover:underline">
                    Diğer Yazılara Göz At &rarr;
                </button>
            </div>
        </div>

      </article>
    </div>
  );
};