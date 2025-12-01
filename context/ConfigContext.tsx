
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig, PriceRule, User, PageContent, PageSection, Order, UserFile, SupportTicket, Notification, Transaction, SavedCard, CarouselSlide, ApiKey, Address, MenuConfig } from '../types';

// --- Internal Router Implementation ---
const RouterContext = createContext<{ path: string; navigate: (path: string) => void }>({ 
    path: '/', 
    navigate: () => {} 
});

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useLocation = () => {
  const { path } = useContext(RouterContext);
  return { pathname: path };
};

export const Link: React.FC<{ to: string; className?: string; children?: React.ReactNode; style?: React.CSSProperties; title?: string; onClick?: () => void }> = ({ to, className, children, style, title, onClick }) => {
  const { navigate } = useContext(RouterContext);
  return (
    <a
      href={`#${to}`}
      className={className}
      style={style}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export const HashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setPath(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useContext(RouterContext);
  const childArray = React.Children.toArray(children);
  const match = childArray.find((child) => {
    return React.isValidElement(child) && (child.props as { path?: string }).path === path;
  });
  
  if (match && React.isValidElement(match)) {
      return <>{(match.props as { element?: React.ReactNode }).element}</>;
  }
  return null;
};

export const Route: React.FC<{ path: string; element: React.ReactNode }> = () => null;
// --- End Router Implementation ---

const DEFAULT_RULES: PriceRule[] = [
  // Layers
  { id: 'base_2layer', name: '2 Katman Baz Fiyat (5 Adet)', value: 50, type: 'base', category: 'layer' },
  { id: 'base_4layer', name: '4 Katman Baz Fiyat', value: 450, type: 'base', category: 'layer' },
  // General
  { id: 'eng_fee', name: 'Mühendislik Bedeli', value: 100, type: 'fixed', category: 'other' },
  // Finishes
  { id: 'finish_hasl', name: 'HASL Kaplama', value: 0, type: 'fixed', category: 'finish' },
  { id: 'finish_lf_hasl', name: 'Kurşunsuz HASL', value: 150, type: 'fixed', category: 'finish' },
  { id: 'finish_enig', name: 'ENIG (Altın)', value: 500, type: 'fixed', category: 'finish' },
  { id: 'finish_silver', name: 'Immersion Silver', value: 800, type: 'fixed', category: 'finish' },
  // Colors
  { id: 'color_green', name: 'Yeşil Maske', value: 0, type: 'fixed', category: 'color' },
  { id: 'color_matte_black', name: 'Mat Siyah Farkı', value: 250, type: 'fixed', category: 'color' },
  // Shipping
  { id: 'shipping_base', name: 'Kargo Baz Ücret', value: 150, type: 'fixed', category: 'shipping' },
  { id: 'shipping_per_kg', name: 'KG Başına Kargo', value: 80, type: 'per_unit', category: 'shipping' },
  // Stencil Pricing
  { id: 'stencil_base', name: 'Stencil (Elek) Baz Fiyat', value: 300, type: 'fixed', category: 'stencil' },
  { id: 'stencil_frame', name: 'Stencil Çerçeve Farkı', value: 200, type: 'fixed', category: 'stencil' },
  { id: 'stencil_mult_electro', name: 'Stencil: Elektro-Polisaj Çarpanı', value: 1.3, type: 'multiplier', category: 'stencil' },
  { id: 'stencil_mult_nickel', name: 'Stencil: Nikel Kaplama Çarpanı', value: 2.0, type: 'multiplier', category: 'stencil' },
  { id: 'stencil_mult_plastic', name: 'Stencil: Plastik Çarpanı', value: 0.8, type: 'multiplier', category: 'stencil' },
];

const DEFAULT_SLIDES: CarouselSlide[] = [
    {
        id: 1,
        title: "Fikirden Üretime Profesyonel Hız",
        desc: "Türkiye'nin en gelişmiş PCB platformu ile yapay zeka destekli analiz ve anında üretim.",
        bg: "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",
        image: "https://www.viasion.com/wp-content/uploads/2025/06/Printed-circuit-board-scaled.jpg",
        btnText: "Gerber Yükle & Fiyat Al",
        btnLink: "/quote",
        tag: "YENİ: 24 Saatte Express"
    },
    {
        id: 2,
        title: "Banka Havalesi ile %10 Ekstra İndirim",
        desc: "Ödemelerinizi Havale/EFT yöntemiyle yapın, anında %10 fiyat avantajı kazanın. Komisyon yok, bekleme yok.",
        bg: "bg-gradient-to-r from-green-900 via-emerald-800 to-green-900",
        image: "https://images.unsplash.com/photo-1601597111158-2fceff2926d9?auto=format&fit=crop&q=80&w=1000",
        btnText: "İndirimli Sipariş Ver",
        btnLink: "/quote",
        tag: "FIRSAT: %10 İNDİRİM"
    },
    {
        id: 3,
        title: "Üniversite ve Eğitim İçin %50 Destek",
        desc: ".edu.tr, .gov.tr ve .k12.tr uzantılı e-postalarla yapılan tüm prototip siparişlerinde %50 indirim uyguluyoruz.",
        bg: "bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
        btnText: "Öğrenci Hesabı Oluştur",
        btnLink: "/login",
        tag: "EĞİTİME DESTEK"
    },
    {
        id: 4,
        title: "TEKNOFEST Projelerine Tam Sponsorluk",
        desc: "Geleceğin mühendisleri için buradayız. Takımını kaydet, PCB üretimini ücretsiz veya maliyetine yapalım.",
        bg: "bg-gradient-to-r from-red-900 via-orange-800 to-red-900",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
        btnText: "Sponsorluk Başvurusu",
        btnLink: "/contact",
        tag: "#MİLLİTEKNOLOJİHAMLESİ"
    },
    {
        id: 5,
        title: "Kurumsal Çözümler & Seri Üretim",
        desc: "Yüksek adetli üretimleriniz için özel müşteri temsilcisi, esnek ödeme ve öncelikli üretim hattı.",
        bg: "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900",
        image: "https://images.unsplash.com/photo-1565514020176-db894a88a927?auto=format&fit=crop&q=80&w=1000",
        btnText: "Kurumsal Teklif Al",
        btnLink: "/contact",
        tag: "B2B ÖZEL"
    }
];

const DEFAULT_MENUS: MenuConfig = {
    main: [
        { id: 'm1', label: 'Anında Fiyat', link: '/quote' },
        { id: 'm2', label: 'Yetenekler', link: '/capabilities' },
        { id: 'm3', label: 'SMT Montaj', link: '/smt' },
        { id: 'm4', label: '3D Baskı', link: '/3d-printing' },
        { id: 'm5', label: 'CNC', link: '/cnc' }
    ],
    footerServices: [
        { id: 'f1', label: 'PCB Üretim', link: '/quote' },
        { id: 'f2', label: 'SMT Montaj', link: '/smt' },
        { id: 'f3', label: 'Lazer Stencil', link: '/quote' },
        { id: 'f4', label: '3D Baskı', link: '/3d-printing' },
        { id: 'f5', label: 'CNC İşleme', link: '/cnc' }
    ]
};

const DEFAULT_PAGES: Record<string, PageContent> = {
  'capabilities': {
    title: 'PCB Üretim Yetenekleri',
    sections: [
      { 
          id: 'cap_1', 
          type: 'hero',
          title: 'Dünya Standartlarında Üretim', 
          subtitle: 'Rigid, Flex, Rigid-Flex ve HDI Teknolojileri',
          content: 'Eleqtrone, 1-32 katman arası en karmaşık tasarımlarınızı askeri sınıf hassasiyetle üretir. IPC Class 2 ve Class 3 standartlarında üretim yapıyoruz.', 
          image: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?auto=format&fit=crop&q=80&w=1000',
          buttons: [{ label: 'Teknik Döküman', link: '#', style: 'outline' }]
      },
      {
          id: 'cap_2',
          type: 'features',
          title: 'Teknik Kapasite Özeti',
          background: 'gray',
          items: [
              { icon: 'Layers', title: 'Katman Sayısı', desc: '1 - 32 Katman' },
              { icon: 'Cpu', title: 'Min. Yol/Aralık', desc: '3 mil / 3 mil' },
              { icon: 'Disc', title: 'Min. Delik', desc: '0.15mm (Lazer ile 0.1mm)' },
              { icon: 'Zap', title: 'Empedans Kontrolü', desc: '+/- %10 Tolerans' },
              { icon: 'Shield', title: 'Malzemeler', desc: 'FR4, Rogers, Alüminyum, Polyimide' },
              { icon: 'CheckCircle', title: 'Yüzey Kaplama', desc: 'HASL, ENIG, OSP, Immersion Silver' }
          ]
      }
    ]
  },
  'about': {
    title: 'Hakkımızda',
    sections: [
        { 
            id: 'abt_1', 
            type: 'text-image',
            title: 'Vizyonumuz & Hikayemiz', 
            content: 'Eleqtrone, Türk mühendislerin donanım geliştirme süreçlerini hızlandırmak amacıyla kuruldu. Geleneksel tedarik zincirindeki hantallığı, dijitalleşme ve yapay zeka ile çözüyoruz.\n\nAmacımız, Türkiye\'yi elektronik üretiminde bölgesel bir güç haline getirmek ve mühendislere "Fikirden Üretime" giden yolda en hızlı araçları sunmaktır.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
            align: 'right'
        },
        {
            id: 'abt_2',
            type: 'cta',
            title: 'Ekibimize Katılın',
            content: 'Geleceği birlikte tasarlamak için yetenekli mühendisler arıyoruz.',
            buttons: [{ label: 'Kariyer', link: '/contact', style: 'primary' }]
        }
    ]
  },
  'contact': { 
      title: 'İletişim', 
      sections: [
          { 
              id: 'cnt_1', 
              type: 'plain',
              title: 'Bize Ulaşın', 
              content: 'info@eleqtrone.com\n+90 850 123 45 67\nTeknopark İstanbul, Pendik/İstanbul',
              image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000' 
          }
      ] 
  },
  'help': { title: 'Yardım', sections: [{ id: 'hlp_1', type: 'plain', title: 'SSS', content: 'Sıkça sorulan sorular.' }] },
  'engineering': { title: 'Mühendislik', sections: [{ id: 'eng_1', type: 'plain', title: 'Rehber', content: 'PCB Tasarım kuralları.' }] },
  'smt': { title: 'SMT Montaj', sections: [{ id: 'smt_1', type: 'hero', title: 'Dizgi Hattı', content: 'Yamaha dizgi makineleri.' }] },
  'cnc': { title: 'CNC İşleme', sections: [{ id: 'cnc_1', type: 'text-image', title: 'CNC Detay', content: 'Hassas işleme.' }] },
  '3d-printing': { title: '3D Baskı', sections: [{ id: '3d_1', type: 'features', title: 'SLA/SLS', content: 'Reçine ve toz baskı.' }] },
};

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'Eleqtrone',
  currency: 'TRY',
  currencySymbol: '₺',
  pricingRules: DEFAULT_RULES,
  bannerText: 'Türkiye\'nin en hızlı PCB üretim hattı: 24 Saatte Kargo!',
  pages: DEFAULT_PAGES,
  slides: DEFAULT_SLIDES,
  menus: DEFAULT_MENUS
};

const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-2025-001', date: '2025-10-24', status: 'Production', total: 1250.50, paymentMethod: 'credit_card',
    items: [{ name: 'Controller_Board_v2.zip', specs: '2 Layers, 100x100mm, Green', qty: 10, price: 1250.50 }],
    estimatedDelivery: '2025-10-28',
    steps: [{ id: 1, label: 'Veri Kontrolü', completed: true }, { id: 2, label: 'Üretimde', completed: true }, { id: 3, label: 'Paketleme', completed: false }]
  },
  { 
    id: 'ORD-2025-002', date: '2025-10-26', status: 'Pending', total: 4500.00, paymentMethod: 'bank_transfer',
    items: [{ name: 'Power_Supply_Unit.zip', specs: '4 Layers, 200x150mm, 2oz Copper', qty: 50, price: 4500.00 }],
    estimatedDelivery: '2025-11-02',
    steps: [{ id: 1, label: 'Veri Kontrolü', completed: false }, { id: 2, label: 'Üretimde', completed: false }]
  },
  { 
    id: 'ORD-2025-003', date: '2025-10-20', status: 'Delivered', total: 850.25, paymentMethod: 'credit_card',
    items: [{ name: 'Sensor_Node.zip', specs: '2 Layers, 50x50mm, Blue', qty: 5, price: 850.25 }],
    estimatedDelivery: '2025-10-23',
    steps: [{ id: 1, label: 'Veri Kontrolü', completed: true }, { id: 2, label: 'Üretimde', completed: true }, { id: 3, label: 'Kargolandı', completed: true }, { id: 4, label: 'Teslimat', completed: true }]
  }
];

const MOCK_FILES: UserFile[] = [
  { id: 'f1', name: 'Controller_Board_v2.zip', uploadDate: '2025-10-24', size: 2500000, type: 'gerber' },
  { id: 'f2', name: 'Enclosure_Case_v1.stl', uploadDate: '2025-10-22', size: 45000000, type: 'stl' },
  { id: 'f3', name: 'Mechanical_Part.step', uploadDate: '2025-10-20', size: 12000000, type: 'step' },
  { id: 'f4', name: 'Front_Panel.dxf', uploadDate: '2025-10-18', size: 500000, type: 'dxf' },
  { id: 'f5', name: 'Old_Project_Backup.rar', uploadDate: '2025-09-01', size: 300000000, type: 'other' },
  { id: 'f6', name: 'Drone_Frame_Arm.obj', uploadDate: '2025-10-27', size: 15000000, type: 'obj' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', date: '24 Eki 2025', type: 'payment', amount: -1250.50, description: 'Sipariş Ödemesi #ORD-2025-001', status: 'success' },
    { id: 't2', date: '20 Eki 2025', type: 'deposit', amount: 2000.00, description: 'Bakiye Yükleme', status: 'success' },
    { id: 't3', date: '20 Eki 2025', type: 'bonus', amount: 400.00, description: 'Hoşgeldin Bonusu (%20)', status: 'success' },
];

const MOCK_CARDS: SavedCard[] = [
    { id: 'c1', last4: '4242', brand: 'Visa', expiry: '12/26', holder: 'Ahmet Yılmaz' }
];

// Mock Database for ALL Users
const MOCK_ALL_USERS: User[] = [
    { username: 'Admin', role: 'admin', token: 'adm', storageUsed: 0, storageLimit: 0 },
    { username: 'ahmet_yilmaz', email: 'ahmet@test.com', role: 'user', token: 'u1', walletBalance: 2549.50, company: 'Yılmaz Müh.', storageUsed: 50000000, storageLimit: 1073741824, addresses: [{ id: '1', title: 'Merkez Ofis', fullAddress: 'Teknopark İst.', city: 'İstanbul', country: 'TR', phone: '5551234567' }] },
    { username: 'ayse_k', email: 'ayse@tech.com', role: 'user', token: 'u2', walletBalance: 150.00, company: 'Tech Corp', storageUsed: 120000000, storageLimit: 1073741824 },
    { username: 'mehmet_d', email: 'mehmet@uni.edu.tr', role: 'user', token: 'u3', walletBalance: 0, company: 'İTÜ', storageUsed: 1000000, storageLimit: 1073741824 },
];

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  user: User | null;
  login: (u: string, p: string) => boolean;
  register: (email: string, pass: string, name: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  allUsers: User[];
  adminUpdateUser: (username: string, data: Partial<User>) => void;
  updatePriceRule: (id: string, data: Partial<PriceRule>) => void; // Updated signature
  addPriceRule: (rule: PriceRule) => void;
  deletePriceRule: (id: string) => void; // New capability
  updatePageContent: (pageKey: string, content: PageContent) => void;
  createPage: (pageKey: string, title: string) => void;
  deletePage: (pageKey: string) => void;
  updateMenus: (menus: MenuConfig) => void;
  addSlide: (slide: CarouselSlide) => void;
  updateSlide: (id: number, data: Partial<CarouselSlide>) => void;
  deleteSlide: (id: number) => void;
  userOrders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  userFiles: UserFile[];
  userTickets: SupportTicket[];
  userNotifications: Notification[];
  userTransactions: Transaction[];
  userCards: SavedCard[];
  addTicket: (subject: string, message: string) => void;
  depositFunds: (amount: number) => void;
  addFile: (file: File) => void;
  apiKeys: ApiKey[];
  generateApiKey: (name: string) => void;
  deleteApiKey: (id: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [files, setFiles] = useState<UserFile[]>(MOCK_FILES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  
  // --- Auto Localization ---
  useEffect(() => {
      const lang = navigator.language || 'tr-TR';
      let currency = 'TRY';
      let symbol = '₺';

      if (lang.startsWith('en')) { currency = 'USD'; symbol = '$'; }
      else if (lang.startsWith('de') || lang.startsWith('fr') || lang.startsWith('it')) { currency = 'EUR'; symbol = '€'; }
      
      setConfig(prev => ({ ...prev, currency, currencySymbol: symbol }));
  }, []);

  const login = (u: string, p: string) => {
    const foundUser = allUsers.find(user => user.username === u || user.email === u);
    if (foundUser) {
         if (foundUser.role === 'admin' && p === 'admin123') {
             setUser(foundUser);
             return true;
         }
         if (foundUser.role !== 'admin' && p.length > 0) {
             setUser({
                 ...foundUser,
                 addresses: foundUser.addresses || [{ id: '1', title: 'Ofis', fullAddress: 'Teknopark', city: 'İst', country: 'TR', phone: '555' }],
                 walletBalance: foundUser.walletBalance ?? 0,
                 storageUsed: foundUser.storageUsed ?? 0,
                 storageLimit: foundUser.storageLimit ?? 1073741824
             });
             return true;
         }
    }
    if (u === 'admin' && p === 'admin123') {
        const adminUser: User = { username: 'Admin', role: 'admin', token: 'adm', storageUsed: 0, storageLimit: 0 };
        setUser(adminUser);
        return true;
    }
    return false;
  };

  const register = (email: string, pass: string, name: string) => {
      const newUser: User = {
          username: name,
          email: email,
          role: 'user',
          token: `u_${Date.now()}`,
          company: 'Bireysel',
          walletBalance: 0,
          storageUsed: 0,
          storageLimit: 1073741824
      };
      setAllUsers(prev => [...prev, newUser]);
      setUser(newUser); // Auto login
      return true;
  };

  const logout = () => setUser(null);
  const updateUser = (data: Partial<User>) => {
      setUser(prev => prev ? { ...prev, ...data } : null);
      if (user) {
          setAllUsers(prev => prev.map(u => u.username === user.username ? { ...u, ...data } : u));
      }
  };

  const adminUpdateUser = (username: string, data: Partial<User>) => {
      setAllUsers(prev => prev.map(u => u.username === username ? { ...u, ...data } : u));
      // If the admin is updating themselves (unlikely but possible), update local state
      if (user && user.username === username) {
          setUser(prev => prev ? { ...prev, ...data } : null);
      }
  };
  
  const updateConfig = (newConfig: SiteConfig) => setConfig(newConfig);
  // Enhanced Rule Management
  const updatePriceRule = (id: string, data: Partial<PriceRule>) => setConfig(prev => ({...prev, pricingRules: prev.pricingRules.map(r => r.id === id ? {...r, ...data} : r)}));
  const addPriceRule = (rule: PriceRule) => setConfig(prev => ({...prev, pricingRules: [...prev.pricingRules, rule]}));
  const deletePriceRule = (id: string) => setConfig(prev => ({...prev, pricingRules: prev.pricingRules.filter(r => r.id !== id)}));
  
  // CMS: Page Management
  const updatePageContent = (k: string, c: PageContent) => setConfig(prev => ({...prev, pages: {...prev.pages, [k]: c}}));
  const createPage = (pageKey: string, title: string) => {
      const newPage: PageContent = {
          title,
          isDynamic: true,
          sections: [{ id: `sec_${Date.now()}`, type: 'plain', title: 'Yeni Bölüm', content: 'İçerik...' }]
      };
      setConfig(prev => ({...prev, pages: {...prev.pages, [pageKey]: newPage}}));
  };
  const deletePage = (pageKey: string) => {
      const newPages = { ...config.pages };
      delete newPages[pageKey];
      setConfig(prev => ({ ...prev, pages: newPages }));
  };

  const updateMenus = (menus: MenuConfig) => setConfig(prev => ({ ...prev, menus }));

  // Slider Management
  const addSlide = (slide: CarouselSlide) => {
      setConfig(prev => ({ ...prev, slides: [...prev.slides, slide] }));
  };
  const updateSlide = (id: number, data: Partial<CarouselSlide>) => {
      setConfig(prev => ({ ...prev, slides: prev.slides.map(s => s.id === id ? { ...s, ...data } : s) }));
  };
  const deleteSlide = (id: number) => {
      setConfig(prev => ({ ...prev, slides: prev.slides.filter(s => s.id !== id) }));
  };

  const depositFunds = (amount: number) => {
      if (!user) return;
      const bonus = amount * 0.20; 
      const newTrans: Transaction[] = [
          { id: `t-${Date.now()}`, date: 'Şimdi', type: 'deposit', amount: amount, description: 'Kredi Kartı Yükleme', status: 'success' },
          { id: `t-${Date.now()}-b`, date: 'Şimdi', type: 'bonus', amount: bonus, description: 'Bonus (%20)', status: 'success' }
      ];
      setTransactions(prev => [...newTrans, ...prev]);
      updateUser({ walletBalance: (user.walletBalance || 0) + amount + bonus });
  };

  const addFile = (file: File) => {
      if (!user) return;
      if (user.storageUsed + file.size > user.storageLimit) {
          alert("Depolama alanı dolu! (Max 1GB)");
          return;
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: UserFile['type'] = 'other';
      if (['zip', 'rar'].includes(ext || '')) type = 'gerber';
      if (['stl'].includes(ext || '')) type = 'stl';
      if (['obj'].includes(ext || '')) type = 'obj';
      if (['dxf'].includes(ext || '')) type = 'dxf';
      if (['step', 'stp'].includes(ext || '')) type = 'step';

      const newFile: UserFile = {
          id: `f-${Date.now()}`,
          name: file.name,
          size: file.size,
          uploadDate: 'Bugün',
          type
      };
      setFiles(prev => [newFile, ...prev]);
      updateUser({ storageUsed: user.storageUsed + file.size });
  };

  const generateApiKey = (name: string) => {
      const newKey: ApiKey = {
          id: `k-${Date.now()}`,
          name,
          key: `eleq_live_${Math.random().toString(36).substr(2, 18)}`,
          created: new Date().toLocaleDateString(),
          lastUsed: '-'
      };
      setApiKeys(prev => [...prev, newKey]);
  };

  const deleteApiKey = (id: string) => {
      setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  return (
    <ConfigContext.Provider value={{ 
      config, updateConfig, user, login, register, logout, updateUser,
      allUsers, adminUpdateUser,
      updatePriceRule, addPriceRule, deletePriceRule,
      updatePageContent, createPage, deletePage, updateMenus,
      addSlide, updateSlide, deleteSlide,
      userOrders: MOCK_ORDERS, updateOrderStatus: () => {},
      userFiles: files,
      userTickets: [], userNotifications: [], 
      userTransactions: transactions, userCards: MOCK_CARDS,
      addTicket: () => {},
      depositFunds,
      addFile,
      apiKeys, generateApiKey, deleteApiKey
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};
