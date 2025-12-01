
import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Package, CheckCircle, Truck, RefreshCcw, Image as ImageIcon, Code, Key, Users, Edit3, Search, DollarSign, AlertCircle, Link as LinkIcon, Layout, ChevronDown, ChevronUp, ExternalLink, Shield, X, Lock, Wallet, MapPin, Settings } from 'lucide-react';
import { PageSection, Order, User, MenuConfig, SectionType, FeatureItem, SectionButton, CarouselSlide, Address, PriceRule } from '../types';

const Admin: React.FC = () => {
  const { config, updateConfig, user, allUsers, adminUpdateUser, updatePriceRule, addPriceRule, deletePriceRule, updatePageContent, createPage, deletePage, updateMenus, userOrders, updateOrderStatus, apiKeys, generateApiKey, deleteApiKey, addSlide, updateSlide, deleteSlide } = useConfig();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'cms' | 'pages' | 'menus' | 'slides' | 'api' | 'pricing'>('dashboard');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('about');
  const [newPageKey, setNewPageKey] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  
  // Slider State
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [slideForm, setSlideForm] = useState<Partial<CarouselSlide>>({});

  // User Edit State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');
  const [userAddressForm, setUserAddressForm] = useState<Partial<Address>>({});
  
  // Pricing Rule State
  const [newRuleData, setNewRuleData] = useState<Partial<PriceRule>>({});
  const [addingRuleCategory, setAddingRuleCategory] = useState<string | null>(null);

  const stats = {
      revenue: userOrders.reduce((acc, o) => acc + o.total, 0),
      orders: userOrders.length,
      users: allUsers.length,
      files: allUsers.reduce((acc, u) => acc + (u.storageUsed || 0), 0) / (1024*1024*1024) // GB
  };

  if (user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-red-600 font-bold">Erişim Engellendi: Yetkisiz Giriş.</div>;
  }

  // --- CMS Logic Helpers (Sections, etc.) ---
  const handleSectionFieldUpdate = (pageKey: string, sectionId: string, field: keyof PageSection, value: any) => {
    const page = config.pages[pageKey];
    const updatedSections = page.sections.map(sec => 
        sec.id === sectionId ? { ...sec, [field]: value } : sec
    );
    updatePageContent(pageKey, { ...page, sections: updatedSections });
  };

  const handleFeatureItemUpdate = (pageKey: string, sectionId: string, index: number, field: keyof FeatureItem, value: string) => {
      const page = config.pages[pageKey];
      const section = page.sections.find(s => s.id === sectionId);
      if (!section || !section.items) return;
      const newItems = [...section.items];
      newItems[index] = { ...newItems[index], [field]: value };
      handleSectionFieldUpdate(pageKey, sectionId, 'items', newItems);
  };

  const addFeatureItem = (pageKey: string, sectionId: string) => {
      const page = config.pages[pageKey];
      const section = page.sections.find(s => s.id === sectionId);
      if (!section) return;
      const newItems = [...(section.items || []), { icon: 'Box', title: 'Yeni Özellik', desc: 'Açıklama...' }];
      handleSectionFieldUpdate(pageKey, sectionId, 'items', newItems);
  };

  const removeFeatureItem = (pageKey: string, sectionId: string, index: number) => {
      const page = config.pages[pageKey];
      const section = page.sections.find(s => s.id === sectionId);
      if (!section || !section.items) return;
      const newItems = section.items.filter((_, i) => i !== index);
      handleSectionFieldUpdate(pageKey, sectionId, 'items', newItems);
  };
  
  const handleButtonUpdate = (pageKey: string, sectionId: string, index: number, field: keyof SectionButton, value: string) => {
       const page = config.pages[pageKey];
       const section = page.sections.find(s => s.id === sectionId);
       if (!section || !section.buttons) return;
       const newBtns = [...section.buttons];
       newBtns[index] = { ...newBtns[index], [field]: value };
       handleSectionFieldUpdate(pageKey, sectionId, 'buttons', newBtns);
  };
  
  const addButton = (pageKey: string, sectionId: string) => {
       const page = config.pages[pageKey];
       const section = page.sections.find(s => s.id === sectionId);
       if (!section) return;
       const newBtns = [...(section.buttons || []), { label: 'Detaylar', link: '#', style: 'primary' as const }];
       handleSectionFieldUpdate(pageKey, sectionId, 'buttons', newBtns);
  };

  const handleAddSection = (pageKey: string, type: SectionType = 'plain') => {
      const page = config.pages[pageKey];
      const newSection: PageSection = {
          id: `sec_${Date.now()}`,
          type: type,
          title: 'Yeni Bölüm Başlığı',
          content: 'Buraya içeriğinizi giriniz...',
          background: 'white',
          items: type === 'features' ? [{icon: 'Zap', title: 'Hızlı', desc: 'Özellik açıklaması.'}, {icon: 'Shield', title: 'Güvenli', desc: 'Özellik açıklaması.'}] : undefined,
          buttons: type === 'hero' || type === 'cta' ? [{label: 'Eylem Butonu', link: '#', style: 'primary'}] : undefined
      };
      updatePageContent(pageKey, { ...page, sections: [...page.sections, newSection] });
  };

  const handleDeleteSection = (pageKey: string, sectionId: string) => {
      if(!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
      const page = config.pages[pageKey];
      const updatedSections = page.sections.filter(sec => sec.id !== sectionId);
      updatePageContent(pageKey, { ...page, sections: updatedSections });
  };

  const handleCreatePage = () => {
      if (newPageKey && newPageTitle) {
          createPage(newPageKey.toLowerCase().replace(/\s+/g, '-'), newPageTitle);
          setNewPageKey('');
          setNewPageTitle('');
          alert("Sayfa başarıyla oluşturuldu! İçeriği düzenlemeye başlayabilirsiniz.");
      }
  };

  const handleAddMenuItem = (menu: 'main' | 'footerServices', label: string, link: string) => {
      const newMenu = { ...config.menus };
      newMenu[menu] = [...newMenu[menu], { id: `m_${Date.now()}`, label, link }];
      updateMenus(newMenu);
  };

  const handleRemoveMenuItem = (menu: 'main' | 'footerServices', id: string) => {
      const newMenu = { ...config.menus };
      newMenu[menu] = newMenu[menu].filter(m => m.id !== id);
      updateMenus(newMenu);
  };

  // --- User Management Handlers ---
  const openUserEdit = (u: User) => {
      setEditingUser(u);
      setUserForm(u);
      setNewPassword('');
      setUserAddressForm({});
  };

  const saveUserChanges = () => {
      if (editingUser) {
          adminUpdateUser(editingUser.username, userForm);
          setEditingUser(null); // Close modal
      }
  };
  
  const resetUserPassword = () => {
      if (editingUser && newPassword) {
          // In a real app, this would call an API. Here we simulate.
          alert(`"${editingUser.username}" kullanıcısının şifresi "${newPassword}" olarak değiştirildi.`);
          setNewPassword('');
      }
  };
  
  const addUserAddress = () => {
      if (editingUser && userAddressForm.title && userAddressForm.fullAddress) {
          const newAddr: Address = {
              id: `addr_${Date.now()}`,
              title: userAddressForm.title || '',
              fullAddress: userAddressForm.fullAddress || '',
              city: userAddressForm.city || '',
              country: userAddressForm.country || '',
              phone: userAddressForm.phone || ''
          };
          const updatedAddresses = [...(editingUser.addresses || []), newAddr];
          adminUpdateUser(editingUser.username, { addresses: updatedAddresses });
          
          // Update local form view
          setEditingUser({...editingUser, addresses: updatedAddresses});
          setUserAddressForm({});
      }
  };
  
  const deleteUserAddress = (addrId: string) => {
       if (editingUser) {
            const updatedAddresses = (editingUser.addresses || []).filter(a => a.id !== addrId);
            adminUpdateUser(editingUser.username, { addresses: updatedAddresses });
            setEditingUser({...editingUser, addresses: updatedAddresses});
       }
  };

  // --- Slider Management Handlers ---
  const startEditSlide = (slide?: CarouselSlide) => {
      if (slide) {
          setEditingSlideId(slide.id);
          setSlideForm(slide);
      } else {
          setEditingSlideId(-1); // New slide
          setSlideForm({
              id: Date.now(),
              title: '',
              desc: '',
              bg: 'bg-slate-900',
              image: '',
              btnText: '',
              btnLink: '',
              tag: ''
          });
      }
  };

  const saveSlide = () => {
      if (editingSlideId === -1) {
          // Add New
          addSlide(slideForm as CarouselSlide);
      } else {
          // Update
          if (editingSlideId) updateSlide(editingSlideId, slideForm);
      }
      setEditingSlideId(null);
      setSlideForm({});
  };

  // --- Pricing Rule Handlers ---
  const handleAddNewRule = (category: string) => {
      if (!newRuleData.id || !newRuleData.name || newRuleData.value === undefined) {
          alert("Lütfen ID, İsim ve Değer alanlarını doldurun.");
          return;
      }
      addPriceRule({
          id: newRuleData.id,
          name: newRuleData.name,
          value: Number(newRuleData.value),
          type: newRuleData.type || 'fixed',
          category: category as any
      });
      setAddingRuleCategory(null);
      setNewRuleData({});
  };

  const renderSidebarItem = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}>
      {icon} <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col sticky top-0 h-screen overflow-y-auto">
            <div className="mb-8 px-4 pt-4">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Shield size={24} /> <span className="font-black text-xl tracking-tight">ADMIN</span>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kontrol Merkezi</p>
            </div>
            <nav className="space-y-1 flex-1">
                {renderSidebarItem('dashboard', <Package size={18} />, 'Genel Bakış')}
                {renderSidebarItem('users', <Users size={18} />, 'Kullanıcılar')}
                {renderSidebarItem('orders', <Truck size={18} />, 'Siparişler')}
                <div className="py-2 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">İçerik Yönetimi</div>
                {renderSidebarItem('slides', <ImageIcon size={18} />, 'Slider Yönetimi')}
                {renderSidebarItem('pricing', <DollarSign size={18} />, 'Fiyatlandırma')}
                {renderSidebarItem('cms', <Edit3 size={18} />, 'Sayfa Editörü')}
                {renderSidebarItem('pages', <Layout size={18} />, 'Sayfa Yapısı')}
                {renderSidebarItem('menus', <LinkIcon size={18} />, 'Menüler')}
                <div className="py-2 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Geliştirici</div>
                {renderSidebarItem('api', <Code size={18} />, 'API Anahtarları')}
            </nav>
            <div className="mt-auto pt-6 border-t border-slate-100 px-4 text-xs text-slate-400">
                <p>Versiyon 3.6.0</p>
                <p>Server: Online</p>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-slate-800">Hoş Geldiniz, Admin.</h1>
                        <span className="text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-full border shadow-sm">{new Date().toLocaleDateString('tr-TR', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
                    </div>
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                             <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full -mr-6 -mt-6"></div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><DollarSign size={14}/> Toplam Ciro</div>
                                <div className="text-3xl font-black text-slate-800">{config.currencySymbol}{stats.revenue.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</div>
                                <div className="mt-auto pt-4 text-xs text-green-600 font-bold flex items-center gap-1"><ChevronUp size={12}/> %12 artış</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                             <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full -mr-6 -mt-6"></div>
                             <div className="relative z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Users size={14}/> Kullanıcılar</div>
                                <div className="text-3xl font-black text-blue-600">{stats.users}</div>
                                <div className="mt-auto pt-4 text-xs text-blue-600 font-bold">Aktif Müşteri</div>
                             </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-full -mr-6 -mt-6"></div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Truck size={14}/> Bekleyen Sipariş</div>
                                <div className="text-3xl font-black text-purple-600">{stats.orders}</div>
                                <div className="mt-auto pt-4 text-xs text-purple-600 font-bold">İşlem Gerekli</div>
                            </div>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                             <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-full -mr-6 -mt-6"></div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><Layout size={14}/> Dosya Alanı</div>
                                <div className="text-3xl font-black text-orange-600">{stats.files.toFixed(2)} GB</div>
                                <div className="mt-auto pt-4 text-xs text-orange-600 font-bold">Toplam Veri</div>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-6">Gelir Analizi (Son 6 Ay)</h3>
                             <div className="h-64 flex items-end space-x-4 px-4 pb-4 border-b border-slate-100">
                                 {[40, 65, 35, 80, 55, 90].map((h, i) => (
                                     <div key={i} className="flex-1 flex flex-col items-center group">
                                         <div className="w-full bg-blue-100 rounded-t-lg relative h-full overflow-hidden">
                                             <div className="absolute bottom-0 left-0 w-full bg-blue-600 transition-all duration-1000 group-hover:bg-blue-500" style={{height: `${h}%`}}></div>
                                         </div>
                                         <span className="text-xs text-slate-400 mt-2 font-bold">{['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'][i]}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4">Son Aktiviteler</h3>
                             <div className="space-y-4">
                                 {userOrders.slice(0, 4).map(o => (
                                     <div key={o.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><DollarSign size={14}/></div>
                                         <div>
                                             <div className="text-sm font-bold text-slate-700">Yeni Sipariş Alındı</div>
                                             <div className="text-xs text-slate-500">#{o.id} - {config.currencySymbol}{o.total}</div>
                                         </div>
                                         <div className="ml-auto text-[10px] text-slate-400">{o.date}</div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'pricing' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-slate-800">Fiyatlandırma Motoru</h2>
                    <p className="text-slate-500 text-sm">Sipariş hesaplamasında kullanılan temel, katman ve ek işlem ücretlerini buradan yönetebilirsiniz. Kurallar sipariş motoru tarafından ID üzerinden kullanılır.</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {['layer', 'finish', 'color', 'shipping', 'stencil', 'other'].map(category => (
                            <div key={category} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                                        {category === 'layer' && <Package size={18}/>}
                                        {category === 'finish' && <CheckCircle size={18}/>}
                                        {category === 'color' && <ImageIcon size={18}/>}
                                        {category === 'shipping' && <Truck size={18}/>}
                                        {category === 'stencil' && <Layout size={18}/>}
                                        {category === 'other' && <Settings size={18}/>}
                                        {category === 'layer' ? 'Katman Bazlı' : category === 'finish' ? 'Kaplama Ücretleri' : category === 'color' ? 'Renk Farkları' : category === 'shipping' ? 'Kargo Ayarları' : category === 'stencil' ? 'Stencil (Elek)' : 'Diğer'}
                                    </h3>
                                    <button onClick={() => setAddingRuleCategory(addingRuleCategory === category ? null : category)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"><Plus size={18}/></button>
                                </div>
                                <div className="space-y-3">
                                    {config.pricingRules.filter(r => r.category === category).map(rule => (
                                        <div key={rule.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded border border-slate-100 group hover:border-blue-200 transition">
                                            <div className="flex-1 min-w-0">
                                                <input 
                                                    className="bg-transparent font-bold text-sm text-slate-700 w-full outline-none focus:text-blue-600" 
                                                    value={rule.name}
                                                    onChange={(e) => updatePriceRule(rule.id, { name: e.target.value })}
                                                />
                                                <div className="text-[10px] text-slate-400 font-mono truncate">{rule.id}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select 
                                                    value={rule.type}
                                                    onChange={(e) => updatePriceRule(rule.id, { type: e.target.value as any })}
                                                    className="bg-white border rounded text-[10px] p-1 h-7"
                                                >
                                                    <option value="fixed">Sabit</option>
                                                    <option value="multiplier">Çarpan</option>
                                                    <option value="base">Baz</option>
                                                    <option value="per_unit">Birim</option>
                                                </select>
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        value={rule.value} 
                                                        onChange={(e) => updatePriceRule(rule.id, { value: parseFloat(e.target.value) })}
                                                        className="w-20 text-right border rounded p-1 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none h-7"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 w-4 text-center">
                                                    {rule.type === 'multiplier' ? 'x' : config.currencySymbol}
                                                </span>
                                                <button onClick={() => deletePriceRule(rule.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                    ))}
                                    {addingRuleCategory === category && (
                                        <div className="bg-blue-50/50 p-3 rounded border border-blue-200 animate-in fade-in">
                                            <div className="text-xs font-bold text-blue-500 mb-2">Yeni Kural Ekle</div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input placeholder="Kural ID (örn: extra_gold)" className="border rounded p-1.5 text-xs font-mono" value={newRuleData.id || ''} onChange={e => setNewRuleData({...newRuleData, id: e.target.value})} />
                                                <input type="number" placeholder="Değer" className="border rounded p-1.5 text-xs" value={newRuleData.value || ''} onChange={e => setNewRuleData({...newRuleData, value: e.target.value as any})} />
                                            </div>
                                            <input placeholder="Kural Adı (Görünen İsim)" className="w-full border rounded p-1.5 text-xs mb-2" value={newRuleData.name || ''} onChange={e => setNewRuleData({...newRuleData, name: e.target.value})} />
                                            <select className="w-full border rounded p-1.5 text-xs mb-2 bg-white" value={newRuleData.type || 'fixed'} onChange={e => setNewRuleData({...newRuleData, type: e.target.value as any})}>
                                                <option value="fixed">Sabit Ücret (+)</option>
                                                <option value="multiplier">Çarpan (x)</option>
                                                <option value="base">Baz Fiyat</option>
                                                <option value="per_unit">Birim Başına</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button onClick={() => setAddingRuleCategory(null)} className="flex-1 bg-white border rounded py-1 text-xs text-slate-500 hover:bg-slate-50">İptal</button>
                                                <button onClick={() => handleAddNewRule(category)} className="flex-1 bg-blue-600 text-white rounded py-1 text-xs font-bold hover:bg-blue-700">Ekle</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ... other existing tabs ... */}
            {activeTab === 'slides' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Slider (Carousel) Yönetimi</h2>
                            <p className="text-slate-500 text-sm">Ana sayfadaki manşet görsellerini buradan yönetebilirsiniz.</p>
                        </div>
                        <button onClick={() => startEditSlide()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            <Plus size={18}/> Yeni Slide Ekle
                        </button>
                    </div>

                    {editingSlideId !== null && (
                        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg mb-6 animate-in slide-in-from-top-5">
                            <h3 className="font-bold text-slate-800 mb-4">{editingSlideId === -1 ? 'Yeni Slide Ekle' : 'Slide Düzenle'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Başlık</label>
                                    <input className="w-full border rounded p-2 text-sm" value={slideForm.title || ''} onChange={e => setSlideForm({...slideForm, title: e.target.value})} placeholder="Büyük Başlık" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Etiket / Tag</label>
                                    <input className="w-full border rounded p-2 text-sm" value={slideForm.tag || ''} onChange={e => setSlideForm({...slideForm, tag: e.target.value})} placeholder="Örn: KAMPANYA" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Açıklama</label>
                                    <textarea className="w-full border rounded p-2 text-sm" rows={2} value={slideForm.desc || ''} onChange={e => setSlideForm({...slideForm, desc: e.target.value})} placeholder="Kısa açıklama metni" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Görsel URL</label>
                                    <input className="w-full border rounded p-2 text-sm" value={slideForm.image || ''} onChange={e => setSlideForm({...slideForm, image: e.target.value})} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Arkaplan Class (Tailwind)</label>
                                    <input className="w-full border rounded p-2 text-sm font-mono" value={slideForm.bg || ''} onChange={e => setSlideForm({...slideForm, bg: e.target.value})} placeholder="bg-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Buton Metni</label>
                                    <input className="w-full border rounded p-2 text-sm" value={slideForm.btnText || ''} onChange={e => setSlideForm({...slideForm, btnText: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Buton Linki</label>
                                    <input className="w-full border rounded p-2 text-sm" value={slideForm.btnLink || ''} onChange={e => setSlideForm({...slideForm, btnLink: e.target.value})} />
                                </div>
                            </div>
                            
                            {/* Preview */}
                            <div className="bg-slate-100 p-4 rounded-lg mb-4">
                                <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Önizleme</p>
                                <div className={`relative h-40 rounded-lg overflow-hidden ${slideForm.bg || 'bg-slate-900'} text-white flex items-center p-8`}>
                                     <div className="w-1/2 z-10">
                                        <span className="text-[10px] bg-white/20 px-2 py-1 rounded">{slideForm.tag || 'TAG'}</span>
                                        <h4 className="text-lg font-bold mt-2 leading-tight">{slideForm.title || 'Başlık'}</h4>
                                        <p className="text-xs opacity-80 mt-1 line-clamp-2">{slideForm.desc || 'Açıklama...'}</p>
                                     </div>
                                     {slideForm.image && <img src={slideForm.image} className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-50 mask-image-gradient" alt="preview" />}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingSlideId(null)} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded">İptal</button>
                                <button onClick={saveSlide} className="bg-green-600 text-white px-6 py-2 rounded font-bold text-sm hover:bg-green-700">Kaydet</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {config.slides.map((slide) => (
                            <div key={slide.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 group hover:border-blue-200 transition">
                                <img src={slide.image} alt={slide.title} className="w-full md:w-32 h-20 object-cover rounded-lg bg-slate-100" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{slide.tag}</span>
                                        <h4 className="font-bold text-slate-800">{slide.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-1">{slide.desc}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditSlide(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition"><Edit3 size={18}/></button>
                                    <button onClick={() => deleteSlide(slide.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                     <h2 className="text-2xl font-bold text-slate-800">Kullanıcı Yönetimi</h2>
                     
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                         <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left">
                                 <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                     <tr>
                                         <th className="px-4 py-3">Kullanıcı</th>
                                         <th className="px-4 py-3">Rol</th>
                                         <th className="px-4 py-3">Şirket</th>
                                         <th className="px-4 py-3 text-right">Bakiye</th>
                                         <th className="px-4 py-3 text-center">İşlem</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {allUsers.map((u, i) => (
                                         <tr key={i} className="hover:bg-slate-50">
                                             <td className="px-4 py-3 font-bold text-slate-700">{u.username} <span className="text-slate-400 font-normal text-xs block">{u.email}</span></td>
                                             <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                                             <td className="px-4 py-3 text-slate-600">{u.company || '-'}</td>
                                             <td className="px-4 py-3 text-right font-mono font-bold text-green-600">{config.currencySymbol}{u.walletBalance?.toFixed(2) || '0.00'}</td>
                                             <td className="px-4 py-3 text-center">
                                                 <button onClick={() => openUserEdit(u)} className="text-blue-600 hover:bg-blue-50 p-2 rounded font-bold text-xs flex items-center justify-center mx-auto gap-1 transition">
                                                     <Edit3 size={14}/> Düzenle
                                                 </button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                    {/* Edit User Modal Overlay */}
                    {editingUser && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
                            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                        <Users size={20} className="text-blue-600"/> Kullanıcı Düzenle: {editingUser.username}
                                    </h3>
                                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                                </div>
                                
                                <div className="p-6 overflow-y-auto space-y-6">
                                    {/* Section 1: Basic Info & Wallet */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1">Temel Bilgiler</h4>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">E-posta</label>
                                                <input className="w-full border rounded p-2 text-sm bg-slate-50" value={userForm.email || ''} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Şirket</label>
                                                <input className="w-full border rounded p-2 text-sm" value={userForm.company || ''} onChange={e => setUserForm({...userForm, company: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Telefon</label>
                                                <input className="w-full border rounded p-2 text-sm" value={userForm.phone || ''} onChange={e => setUserForm({...userForm, phone: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Rol</label>
                                                <select className="w-full border rounded p-2 text-sm bg-white" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as any})}>
                                                    <option value="user">Kullanıcı</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1">Cüzdan & Güvenlik</h4>
                                            <div className="bg-green-50 p-3 rounded border border-green-100">
                                                <label className="block text-xs font-bold text-green-700 mb-1 flex items-center gap-1"><Wallet size={12}/> Cüzdan Bakiyesi</label>
                                                <div className="flex gap-2">
                                                    <input type="number" className="w-full border border-green-200 rounded p-2 text-sm font-bold text-green-800" value={userForm.walletBalance} onChange={e => setUserForm({...userForm, walletBalance: parseFloat(e.target.value)})} />
                                                    <span className="flex items-center text-xs font-bold text-green-600">{config.currencySymbol}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                                <label className="block text-xs font-bold text-red-700 mb-1 flex items-center gap-1"><Lock size={12}/> Şifre Sıfırla</label>
                                                <div className="flex gap-2">
                                                    <input type="password" placeholder="Yeni Şifre" className="w-full border border-red-200 rounded p-2 text-sm bg-white" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                                    <button onClick={resetUserPassword} className="bg-red-600 text-white px-3 rounded text-xs font-bold hover:bg-red-700">Değiştir</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Addresses */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1 mb-3">Adres Yönetimi</h4>
                                        <div className="space-y-2 mb-4">
                                            {editingUser.addresses?.map(addr => (
                                                <div key={addr.id} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} className="text-slate-400"/>
                                                        <span className="text-sm font-bold text-slate-700">{addr.title}</span>
                                                        <span className="text-xs text-slate-500 truncate max-w-[200px]">{addr.fullAddress}</span>
                                                    </div>
                                                    <button onClick={() => deleteUserAddress(addr.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
                                                </div>
                                            ))}
                                            {(!editingUser.addresses || editingUser.addresses.length === 0) && <p className="text-xs text-slate-400 italic">Kayıtlı adres yok.</p>}
                                        </div>
                                        
                                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                                            <div className="text-xs font-bold text-slate-500 mb-2">Yeni Adres Ekle</div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input placeholder="Başlık (Ev, İş)" className="border rounded p-1.5 text-xs" value={userAddressForm.title || ''} onChange={e => setUserAddressForm({...userAddressForm, title: e.target.value})} />
                                                <input placeholder="Şehir" className="border rounded p-1.5 text-xs" value={userAddressForm.city || ''} onChange={e => setUserAddressForm({...userAddressForm, city: e.target.value})} />
                                                <input placeholder="Telefon" className="border rounded p-1.5 text-xs" value={userAddressForm.phone || ''} onChange={e => setUserAddressForm({...userAddressForm, phone: e.target.value})} />
                                                <input placeholder="Ülke" className="border rounded p-1.5 text-xs" value={userAddressForm.country || ''} onChange={e => setUserAddressForm({...userAddressForm, country: e.target.value})} />
                                            </div>
                                            <input placeholder="Tam Adres" className="w-full border rounded p-1.5 text-xs mb-2" value={userAddressForm.fullAddress || ''} onChange={e => setUserAddressForm({...userAddressForm, fullAddress: e.target.value})} />
                                            <button onClick={addUserAddress} className="w-full bg-blue-600 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-700">Adresi Ekle</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded transition">İptal</button>
                                    <button onClick={saveUserChanges} className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Değişiklikleri Kaydet</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default Admin;
