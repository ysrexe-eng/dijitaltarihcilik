import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { AuthForm } from './components/AuthForm';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { BlogPost, ViewState } from './types';
import { ArrowRight, BookOpen, TrendingUp, Globe, Cpu, Bookmark, Loader2 } from 'lucide-react';
import { supabase, isConfigured } from './services/supabase';

// Blog content 
const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Dijital Arşivlerin Yükselişi: Erişilebilirlik Devrimi',
    summary: 'Fiziksel arşivlerin dijitalleşmesi, araştırmacıların kaynaklara erişim hızını artırırken coğrafi sınırları ortadan kaldırıyor. Artık tozlu raflar değil, bulut sunucular tarihin hafızasını taşıyor.',
    content: `
### Arşivciliğin Altın Çağı

Tarih araştırmacılığı yüzyıllar boyunca sabır, zaman ve büyük seyahat bütçeleri gerektiren bir uğraştı. Bir Osmanlı fermanını incelemek için İstanbul'a, bir sanayi devrimi raporu için Londra'ya gitmek zorundaydınız. Ancak son yirmi yılda yaşanan dijital dönüşüm, bu paradigmaları kökten değiştirdi.

#### Dijitalleşmenin Somut Etkileri

Dijital arşivler sadece belgelerin fotoğrafını çekip internete yüklemekten ibaret değildir. Bu süreç, **OCR (Optik Karakter Tanıma)** ve **HTR (El Yazısı Metin Tanıma)** teknolojileri ile belgelerin "içinde" arama yapabilmeyi mümkün kılar.

*   **Mekansal Özgürlük:** Bugün bir lise öğrencisi, evindeki bilgisayardan *Library of Congress* veya *British Museum* arşivlerine saniyeler içinde erişebilir.
*   **Koruma (Preservation):** Fiziksel belgeler ışık, nem ve insan temasıyla yıpranır. Dijital kopyalar, orijinal eserin fiziksel ömrünü uzatır.
*   **Veri Madenciliği:** Milyonlarca sayfalık diplomatik yazışmalar içinde belirli bir ismin geçtiği yerleri saniyeler içinde bulmak, manuel yöntemlerle bir ömür sürebilirdi.

#### Zorluklar ve Sınırlılıklar

Her devrim kendi sorunlarını da beraberinde getirir. Dijital arşivlerdeki en büyük sorun **"Bağlam Kaybı"**dır. Fiziksel bir arşivde bir dosyayı incelerken, o dosyanın yanındaki diğer belgeleri de görürsünüz ve olaylar arası ilişki kurarsınız. Dijital aramalar ise genellikle nokta atışı sonuçlar verir, bu da araştırmacının büyük resmi görmesini zorlaştırabilir.

Aşağıdaki grafik, son yıllarda akademik araştırmalarda dijital kaynakların kullanım oranındaki dramatik artışı göstermektedir.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/01/25/19/02/book-3955129_1280.jpg',
    tags: ['#Arşiv', '#Teknoloji', '#VeriAnalizi'],
    readTime: 8,
    impact: 'positive'
  },
  {
    id: '2',
    title: 'Bilgi Kirliliği ve Dijital Tarih Yazımı',
    summary: 'İnternet, bilgiye erişimi kolaylaştırırken yanlış bilginin yayılmasını da hızlandırdı. "Post-Truth" (Hakikat Ötesi) çağında tarihçi, gerçeğin bekçisi olmak zorunda.',
    content: `
### Veri Okyanusunda Pusulasız Kalmak

Dijital çağın en büyük paradoksu şudur: Bilgiye erişim tarihte hiç olmadığı kadar kolayken, *doğru* bilgiye ulaşmak giderek zorlaşmaktadır. Sosyal medya algoritmaları, sansasyonel ve duygusal içerikleri öne çıkarırken, sıkıcı ama doğru olan tarihsel gerçekler geri planda kalmaktadır.

#### Dijital Dezenformasyon Türleri

1.  **Bağlamdan Koparma:** Gerçek bir tarihi fotoğrafın, tamamen farklı bir olayla ilişkilendirilerek paylaşılması. Örneğin, İspanyol Gribi dönemine ait bir fotoğrafın, güncel bir salgınla ilişkilendirilmesi.
2.  **Anakronizm:** Geçmişteki olayları bugünün ahlaki ve sosyal normlarıyla yargılayarak çarpıtmak.
3.  **Deepfake ve AI Manipülasyonu:** Yapay zeka ile oluşturulan sahte tarihi videolar veya fotoğraflar, gerçeği ayırt etmeyi imkansız hale getirebilir.

#### Tarihçinin Yeni Sorumluluğu

Tarihçiler artık sadece geçmişi yorumlayan akademisyenler değil, aynı zamanda dijital dünyadaki bilgi akışını filtreleyen "doğrulayıcılar" (fact-checkers) olmak zorundadır. Dijital okuryazarlık, artık tarih eğitiminin ayrılmaz bir parçasıdır.

> "Geçmiş değiştirilemez, ancak geçmişe dair algımız bir tweet ile değiştirilebilir."

Bu durum, kaynak kritiği yöntemlerinin dijital çağa uyarlanmasını zorunlu kılmaktadır. Bir web sitesinin alan adı uzantısı (.edu, .org), yazarın kimliği ve sitenin güncellenme sıklığı, artık bir parşömenin mürekkep analizi kadar önemlidir.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#Dezenformasyon', '#Medya', '#EleştirelDüşünce'],
    readTime: 10,
    impact: 'negative'
  },
  {
    id: '3',
    title: 'Dijital Karanlık Çağ: Geleceğin Tarihi Siliniyor mu?',
    summary: 'Bugün ürettiğimiz dijital veriler 100 yıl sonra okunabilecek mi? Dosya formatlarının eskimesi ve "Bit Rot" tehdidi, geleceğin tarihçilerini kaynaksız bırakabilir.',
    content: `
### Kalıcılık İllüzyonu

Mermere kazınan bir yazı binlerce yıl dayanır. Kağıda yazılan bir mektup, uygun koşullarda 500 yıl okunabilir. Peki ya sabit diskinize kaydettiğiniz bir Word dosyası? Muhtemelen 20 yıl sonra o dosyayı açacak bir yazılım bulamayacaksınız.

#### Dijital Eskime (Digital Obsolescence)

Teknoloji hızla ilerlerken, geride bıraktığı formatları "çöp" haline getiriyor. 1990'larda popüler olan "Floppy Disk"leri bugün okuyacak bilgisayar yok. Benzer şekilde, bugün kullandığımız .docx veya .jpg formatlarının 50 yıl sonra destekleneceğinin garantisi yok.

#### "Bit Rot" ve Veri Çürümesi

Dijital veriler fiziksel medyalarda (HDD, SSD) saklanır. Bu medyalar zamanla manyetik özelliklerini kaybeder. Buna "Bit Rot" denir. Bir bitin 0'dan 1'e dönüşmesi, devasa bir veritabanını bozuk (corrupt) hale getirebilir.

> Vint Cerf (İnternetin Babalarından): "21. yüzyıl, bilgi çağının kara deliği olabilir."

Tarihçiler ve arşivciler, bu sorunu aşmak için sürekli **Veri Göçü (Migration)** ve **Emülasyon** stratejileri geliştiriyor. Yani verileri sürekli yeni formatlara dönüştürüyorlar. Ancak bu, devasa bir maliyet ve iş gücü gerektiriyor.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#VeriKaybı', '#Gelecek', '#Teknoloji'],
    readTime: 7,
    impact: 'negative'
  },
  {
    id: '4',
    title: 'Mekansal Tarih: Coğrafi Bilgi Sistemleri (GIS)',
    summary: 'Tarihi sadece zaman çizgisi üzerinden değil, haritalar üzerinden okumak. GIS teknolojisi, tarihsel verileri görselleştirerek yeni bağlantıları ortaya çıkarıyor.',
    content: `
### Tarihin Coğrafyası

Geleneksel tarih anlatısı "ne zaman" sorusuna odaklanır. Ancak "nerede" sorusu da en az onun kadar önemlidir. **Coğrafi Bilgi Sistemleri (GIS)**, tarihsel verileri harita katmanları üzerinde görselleştirerek, çıplak gözle görülemeyen desenleri ortaya çıkarır.

#### Uygulama Alanları

1.  **Salgın Hastalıkların Yayılımı:** 14. yüzyıldaki Veba salgınının ticaret yolları üzerinden nasıl yayıldığını simüle etmek.
2.  **Şehir Tarihi:** İstanbul'un 1500, 1700 ve 1900 yıllarındaki yerleşim sınırlarını üst üste koyarak kentsel büyümeyi analiz etmek.
3.  **Askeri Tarih:** Bir savaş alanındaki birlik hareketlerini, arazi koşullarıyla birlikte üç boyutlu olarak modellemek.

GIS sayesinde tarihçiler, binlerce sayfalık vergi kayıtlarını (Tahrir Defterleri) interaktif haritalara dönüştürebiliyor. Bu, sosyal ve ekonomik tarihin anlaşılmasında devrim niteliğinde bir adımdır.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#GIS', '#Harita', '#MekansalAnaliz'],
    readTime: 9,
    impact: 'positive'
  },
  {
    id: '5',
    title: 'Yapay Zeka ve Tarihçilik: Dost mu Düşman mı?',
    summary: 'Yapay zeka algoritmaları, hasarlı metinleri tamamlamaktan eski dilleri çevirmeye kadar tarihçilere süper güçler kazandırıyor. Ancak etik sınırlar nerede başlıyor?',
    content: `
### Silikon Tarihçiler

Yapay zeka (AI), sadece bir otomasyon aracı değil, artık bir analiz partneri. Gemini, GPT-4 gibi dil modelleri, milyonlarca sayfalık metni saniyeler içinde özetleyebiliyor. Ancak tarih disiplini için asıl heyecan verici gelişmeler daha spesifik alanlarda yaşanıyor.

#### AI'ın Başarıları

*   **Metin Tamamlama:** Antik Yunan yazıtlarındaki silinmiş veya kırılmış kısımları, istatistiksel olasılıklarla %80'e varan doğrulukla tamamlayan "Ithaca" gibi projeler.
*   **Otomatik Çeviri:** Sümerce veya Akadca gibi ölü dillerin anlık çevirisi.
*   **Örüntü Tanıma:** Yüzlerce yıllık tablolardaki ressam fırça darbelerini analiz ederek sahte eserleri tespit etme.

#### Hız vs Derinlik

Yapay zeka, tarihçiye zaman kazandırır ancak yorumlama yeteneği hala insan zihnine muhtaçtır. AI, "ne" ve "nasıl" sorularına harika cevaplar verebilir ancak "neden" sorusunda, insan duygularını ve dönemin ruhunu (Zeitgeist) anlamakta yetersiz kalabilir.

Aşağıdaki grafik, dijital araçların araştırma süreçlerinde ne kadar zaman kazandırdığını göstermektedir.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#YapayZeka', '#AI', '#Gelecek'],
    readTime: 6,
    impact: 'mixed'
  },
  {
    id: '6',
    title: 'Video Oyunları ile Tarih Öğretimi',
    summary: 'Assassin\'s Creed veya Civilization gibi oyunlar, genç nesillerin tarihle ilk temas noktası oluyor. Simülasyonlar, sınıf içi eğitimden daha etkili olabilir mi?',
    content: `
### Oynayarak Öğrenmek

Tarih dersleri genellikle ezberci ve sıkıcı olarak algılanır. Ancak video oyunları, oyuncuyu pasif bir dinleyiciden aktif bir katılımcıya dönüştürür. Bir şehri yönetmek, bir savaşa katılmak veya tarihi bir karakterle konuşmak, empati kurmayı kolaylaştırır.

#### Simülasyonun Gücü

*   **Assassin's Creed:** Ubisoft'un "Discovery Tour" modu, oyundaki şiddet öğelerini çıkararak Antik Mısır, Yunanistan ve Viking dönemlerini interaktif bir müzeye dönüştürdü. Öğretmenler bu modu derslerde kullanıyor.
*   **Civilization:** Oyunculara teknoloji ağacını, diplomasiyi ve coğrafyanın medeniyetler üzerindeki etkisini öğretir.
*   **Paradox Oyunları:** Europa Universalis gibi strateji oyunları, karmaşık politik ve ekonomik sistemleri anlamayı sağlar.

Tabii ki oyunlar ticari ürünlerdir ve tarihi gerçeklikten sapabilirler. Ancak bir kıvılcım çakmak ve merak uyandırmak için eşsiz araçlardır. Tarihçiler, oyun geliştiricileriyle işbirliği yaparak daha doğru simülasyonlar üretmelidir.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#Oyunlaştırma', '#Eğitim', '#Simülasyon'],
    readTime: 7,
    impact: 'positive'
  },
  {
    id: '7',
    title: 'Sanal Müzecilik ve Ziyaretçi Deneyimi',
    summary: 'Müzeler artık duvarların ötesine taşıyor. Sanal Gerçeklik (VR) ve Artırılmış Gerçeklik (AR) ile evinizin salonundan Göbeklitepe\'yi gezmek mümkün.',
    content: `
### Duvarsız Müzeler

Geleneksel müzecilik anlayışı "nesneleri korumak ve sergilemek" üzerine kuruluydu. Ancak dijital çağda müzeler, birer deneyim merkezine dönüşüyor. Fiziksel bir mekana bağlı kalmadan, dünyanın öbür ucundaki bir eseri üç boyutlu olarak inceleyebiliyoruz.

#### Sürükleyici Deneyimler (Immersive Experiences)

Sanal gerçeklik teknolojileri, ziyaretçiyi pasif bir gözlemci olmaktan çıkarıp tarihin içine davet ediyor. Örneğin, **British Museum**'un sanal turunda Mısır mumyalarını katman katman inceleyebiliyorsunuz.

Bu alandaki ilginç ve yenilikçi çalışmalardan biri de, genç bir yazılımcı olan Emir'in geliştirdiği **"Emir_v2.1"** kod adlı deneysel algoritmadır. Bu algoritma, antik harabelerin sadece 3 boyutlu modelini çıkarmakla kalmıyor, aynı zamanda o dönemdeki ışık ve gölge oyunlarını da simüle ederek ziyaretçiye "o anı yaşıyormuş" hissi veriyor. Henüz prototip aşamasında olsa da, bu tür kişisel girişimler sektörün geleceği için umut verici.

#### Erişilebilirlik

Sanal turlar, engelli bireyler veya seyahat imkanı olmayan öğrenciler için büyük bir fırsat eşitliği yaratıyor. Artık Louvre Müzesi'ni gezmek için Paris'e uçak bileti almanıza gerek yok.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#SanalMüze', '#VR', '#Eğitim'],
    readTime: 5,
    impact: 'positive'
  },
  {
    id: '8',
    title: 'Blokzincir ve Tarih: Değiştirilemez Arşivler',
    summary: 'Tarihi belgelerin manipüle edilmesini önlemek için kripto teknolojileri kullanılabilir mi? Blokzincir (Blockchain), dijital tarihin noterliğini yapmaya aday.',
    content: `
### Dijital Güvenin İnşası

Dijital belgelerin en büyük zaafı, kolayca kopyalanabilir ve değiştirilebilir olmalarıdır. Bir fotoğrafın montajlanıp montajlanmadığını anlamak her geçen gün zorlaşıyor. İşte bu noktada **Blokzincir** teknolojisi devreye giriyor.

#### Tarihsel NFT'ler?

Konu maymun resimleri satmak değil. Blokzincir, bir verinin ne zaman oluşturulduğunu ve o tarihten sonra değiştirilip değiştirilmediğini matematiksel olarak kanıtlar.

*   **Kanıtlanabilirlik:** Bir gazeteci veya tarihçi, çektiği fotoğrafı blokzincire kaydettiğinde, o fotoğrafın "orijinal" hali sonsuza kadar mühürlenmiş olur.
*   **Sansürsüzlük:** Merkezi olmayan bir ağda saklanan veriler, tek bir otorite tarafından silinemez veya değiştirilemez.

Bu teknoloji, özellikle savaş suçlarının belgelenmesi veya politik tarih yazımı gibi hassas konularda "dijital noter" görevi görebilir. Geleceğin arşivleri, sadece tozlu raflarda değil, dağıtık defterlerde (ledger) tutulacak.
    `,
    author: 'Yaşar Efe Çelik',
    date: '22.11.2025',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['#Blokzincir', '#Güvenlik', '#Teknoloji'],
    readTime: 8,
    impact: 'positive'
  }
];

const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in-up">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-indigo-900 h-32 relative">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 bg-white p-1 rounded-full shadow-lg">
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-indigo-900 text-4xl font-serif font-bold border-4 border-white">
              Y
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-12 px-8 text-center">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Yaşar Efe Çelik</h2>
        <p className="text-indigo-600 font-medium text-lg mb-8">9. Sınıf Öğrencisi & Dijital Tarih Meraklısı</p>
        
        <div className="flex justify-center gap-4 mb-10">
           <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
             <span className="block text-2xl font-bold text-slate-800">8</span>
             <span className="text-xs text-slate-500 uppercase tracking-wide">Makale</span>
           </div>
           <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
             <span className="block text-2xl font-bold text-slate-800">2025</span>
             <span className="text-xs text-slate-500 uppercase tracking-wide">Kuruluş</span>
           </div>
        </div>

        <div className="prose prose-lg prose-slate mx-auto text-left">
          <p className="lead">
            Merhaba! Tarih ve teknoloji arasındaki köprüde yürümeyi seven bir öğrenciyim.
          </p>
          <p>
            Bu blog, "Tarih sadece geçmişte kalan bir şey midir, yoksa onu bugünün teknolojisiyle yeniden mi yazıyoruz?" sorusuna cevap aramak için kuruldu. Dijitalleşmenin tarih disiplinini nasıl dönüştürdüğünü, lise düzeyinde bir araştırmacı gözüyle inceliyorum.
          </p>
          <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Misyonum
                </h4>
                <p className="text-sm text-indigo-800">Tarih biliminin dijital araçlarla nasıl evrildiğini anlamak ve akranlarıma anlatmak.</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> İlgi Alanlarım
                </h4>
                <p className="text-sm text-amber-800">Yapay Zeka, Veri Madenciliği, Coğrafi Bilgi Sistemleri (GIS), Dijital Arşivcilik.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CATEGORIES = ['Tümü', 'Teknoloji', 'Analiz', 'Eğitim'];

export default function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [posts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  
  // Auth & Database State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Auth Setup (Supabase v2)
  useEffect(() => {
    // URL hash kontrolü (Recovery linkleri için manuel kontrol)
    // Bazı e-posta istemcileri ve tarayıcılarda 'PASSWORD_RECOVERY' event'i tetiklenmeden
    // sayfa yüklenebiliyor. Bu durumda URL'deki 'type=recovery' parametresine bakarak
    // modu manuel olarak açıyoruz.
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsRecoveryMode(true);
      setIsSettingsOpen(true);
    }

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.warn("Auth session check error:", e);
      } finally {
        setAuthLoading(false);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event: string, session: any) => {
        setSession(session);
        setAuthLoading(false);
        
        // Şifre sıfırlama akışı kontrolü (Event bazlı)
        if (event === 'PASSWORD_RECOVERY') {
           setIsRecoveryMode(true);
           setIsSettingsOpen(true);
        }

        // URL Temizleme:
        // Eğer recovery modundaysak (URL'de type=recovery varsa veya event geldiyse) URL'i temizleme.
        // Aksi takdirde şifre sıfırlama token'ı kaybolabilir.
        const isRecoveryHash = window.location.hash.includes('type=recovery');
        
        if (session && window.location.hash && event !== 'PASSWORD_RECOVERY' && !isRecoveryHash) {
           window.history.replaceState(null, '', window.location.pathname);
        }
      });

      return () => subscription.unsubscribe();
    };
    
    setupAuth();
  }, []);

  // Fetch Saved Posts
  useEffect(() => {
    if (session) {
      const fetchSavedPosts = async () => {
        try {
          const { data, error } = await supabase
            .from('saved_posts')
            .select('post_id')
            .eq('user_id', session.user.id);
          
          if (data && !error) {
            setSavedPostIds(data.map((item: any) => item.post_id));
          }
        } catch (e) {
          console.warn("Fetch posts error (likely due to mock mode):", e);
        }
      };
      fetchSavedPosts();
    } else {
      setSavedPostIds([]);
    }
  }, [session]);

  const handleReadArticle = (post: BlogPost) => {
    setSelectedPost(post);
    setViewState(ViewState.ARTICLE);
    window.scrollTo(0, 0);
  };

  const handleToggleSave = async (postId: string) => {
    if (!session) {
      alert('Blog kaydetmek için lütfen giriş yapın.');
      setViewState(ViewState.LOGIN);
      return;
    }

    try {
      const isSaved = savedPostIds.includes(postId);
      
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('post_id', postId);
        
        if (!error) {
          setSavedPostIds(prev => prev.filter(id => id !== postId));
        } else {
           alert(error.message);
        }
      } else {
        // Save
        const { error } = await supabase
          .from('saved_posts')
          .insert([{ user_id: session.user.id, post_id: postId }]);
        
        if (!error) {
          setSavedPostIds(prev => [...prev, postId]);
        } else {
          alert(error.message);
        }
      }
    } catch (e: any) {
      alert(e.message || "İşlem sırasında hata oluştu");
    }
  };

  const filteredPosts = useMemo(() => {
    // Show saved posts only
    if (viewState === ViewState.SAVED) {
      return posts.filter(p => savedPostIds.includes(p.id));
    }

    if (selectedCategory === 'Tümü') return posts;
    
    const lowerCat = selectedCategory.toLowerCase();
    const tagMap: Record<string, string[]> = {
      'teknoloji': ['teknoloji', 'yapayzeka', 'ai', 'blokzincir', 'vr'],
      'analiz': ['analiz', 'verianalizi', 'mekansalanaliz', 'gis'],
      'eğitim': ['eğitim', 'oyunlaştırma', 'simülasyon', 'sanalmüze']
    };

    const targetTags = tagMap[lowerCat] || [lowerCat];

    return posts.filter(post => 
      post.tags.some(tag => 
        targetTags.some(target => tag.toLowerCase().includes(target))
      )
    );
  }, [posts, selectedCategory, viewState, savedPostIds]);

  // Auth Loading Splash Screen (Optional, prevents flickering)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-serif">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => (
    <main className="animate-fade-in-up">
      {/* Conditional Hero: Only show on standard HOME view */}
      {viewState === ViewState.HOME && (
        <div className="relative bg-slate-900 text-white overflow-hidden mb-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-32 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              22.11.2025 • Dijital Tarihçilik Blogu
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Geçmişin İzinde,<br />Geleceğin Teknolojisiyle.
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
              Yaşar Efe Çelik tarafından hazırlanan, dijitalleşmenin tarih yazımı üzerindeki devrimsel etkilerini inceleyen araştırma platformu.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20">
                Okumaya Başla
              </button>
            </div>
          </div>
        </div>
      )}

      {viewState === ViewState.SAVED && (
         <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-indigo-600" />
              Kaydedilen Yazılar
            </h2>
            <p className="text-slate-500 mt-2">Okuma listenizdeki makaleler burada saklanır.</p>
         </div>
      )}

      {/* Featured Stats Bar - Only on HOME */}
      {viewState === ViewState.HOME && (
        <div className="max-w-6xl mx-auto px-4 -mt-10 mb-16 relative z-10">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="flex items-center gap-4 p-2">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><TrendingUp size={24}/></div>
                  <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Dijital Erişim</p>
                      <p className="text-2xl font-bold text-slate-900">%800 Artış</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-2">
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><Globe size={24}/></div>
                  <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Küresel Arşiv</p>
                      <p className="text-2xl font-bold text-slate-900">250+ Kütüphane</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-2">
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Cpu size={24}/></div>
                  <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">AI Analizi</p>
                      <p className="text-2xl font-bold text-slate-900">Milisaniye Hız</p>
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div id="posts" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {viewState === ViewState.HOME && (
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Son Yazılar</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
              </div>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article 
                key={post.id} 
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${
                   // Feature first post only on Home view with 'All' category
                   viewState === ViewState.HOME && index === 0 && selectedCategory === 'Tümü' 
                    ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-0' 
                    : 'delay-100'
                }`}
                onClick={() => handleReadArticle(post)}
              >
                <div className={`overflow-hidden relative ${
                    viewState === ViewState.HOME && index === 0 && selectedCategory === 'Tümü' 
                    ? 'lg:h-full h-64' 
                    : 'h-56'
                }`}>
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  {savedPostIds.includes(post.id) && (
                     <div className="absolute top-4 right-4">
                        <div className="bg-indigo-600 p-1.5 rounded-full shadow-lg">
                           <Bookmark className="w-3 h-3 text-white fill-current" />
                        </div>
                     </div>
                  )}
                  <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full shadow-sm border border-slate-100">
                          {post.tags[0].replace('#', '')}
                      </span>
                  </div>
                </div>
                
                <div className={`p-6 flex flex-col justify-center ${
                    viewState === ViewState.HOME && index === 0 && selectedCategory === 'Tümü' 
                    ? 'lg:p-10' 
                    : ''
                }`}>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                    <span className="text-indigo-600 font-bold">{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} dk okuma</span>
                  </div>
                  
                  <h3 className={`font-serif font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight ${
                      viewState === ViewState.HOME && index === 0 && selectedCategory === 'Tümü' 
                      ? 'text-2xl lg:text-3xl' 
                      : 'text-xl'
                  }`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 mb-6 leading-relaxed line-clamp-3 text-sm lg:text-base">
                    {post.summary}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-bold text-indigo-600 group-hover:translate-x-2 transition-transform duration-300">
                    Devamını Oku <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">
                {viewState === ViewState.SAVED 
                    ? 'Henüz kaydedilmiş bir yazınız yok.' 
                    : 'Bu kategoride henüz yazı bulunmuyor.'}
            </p>
            <button 
                onClick={() => {
                    setViewState(ViewState.HOME);
                    setSelectedCategory('Tümü');
                }} 
                className="text-indigo-600 font-bold mt-2 hover:underline"
            >
                Tüm yazıları gör
            </button>
          </div>
        )}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200">
      <Header 
        onHome={() => setViewState(ViewState.HOME)} 
        onAbout={() => setViewState(ViewState.ABOUT)}
        onLogin={() => setViewState(ViewState.LOGIN)}
        onRegister={() => setViewState(ViewState.REGISTER)}
        onSaved={() => setViewState(ViewState.SAVED)}
        onLogout={() => supabase.auth.signOut()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        session={session}
      />

      {(viewState === ViewState.HOME || viewState === ViewState.SAVED) && renderMainContent()}

      {viewState === ViewState.ABOUT && <AboutPage />}

      {(viewState === ViewState.LOGIN || viewState === ViewState.REGISTER) && (
        <AuthForm 
          type={viewState as 'LOGIN' | 'REGISTER'}
          onSuccess={() => setViewState(ViewState.HOME)}
          onToggleMode={() => setViewState(viewState === ViewState.LOGIN ? ViewState.REGISTER : ViewState.LOGIN)}
        />
      )}

      {viewState === ViewState.ARTICLE && selectedPost && (
        <ArticleView 
          article={selectedPost} 
          onBack={() => setViewState(ViewState.HOME)} 
          isSaved={savedPostIds.includes(selectedPost.id)}
          onToggleSave={handleToggleSave}
        />
      )}

      <AccountSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => {
           setIsSettingsOpen(false);
           setIsRecoveryMode(false);
        }}
        session={session}
        isRecovery={isRecoveryMode}
      />

      <footer className="bg-slate-900 text-white py-16 mt-auto border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
                 <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg"><BookOpen className="w-5 h-5 text-white" /></div>
                    <span className="text-xl font-serif font-bold">Dijital Tarihçilik</span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                     Yaşar Efe Çelik'in tarih ve teknoloji üzerine kişisel araştırma blogu. Geçmişin verilerini geleceğin araçlarıyla analiz ediyoruz.
                 </p>
            </div>
            <div className="md:text-right">
                <h4 className="font-bold text-lg mb-6">Hızlı Bağlantılar</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                    <li onClick={() => setViewState(ViewState.HOME)} className="hover:text-indigo-400 cursor-pointer transition-colors">Ana Sayfa</li>
                    <li onClick={() => setViewState(ViewState.ABOUT)} className="hover:text-indigo-400 cursor-pointer transition-colors">Hakkımda</li>
                    {session && <li onClick={() => setViewState(ViewState.SAVED)} className="hover:text-indigo-400 cursor-pointer transition-colors">Kaydedilenler</li>}
                </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-600">© 2025 Yaşar Efe Çelik. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}