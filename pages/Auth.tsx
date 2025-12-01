
import React, { useState } from 'react';
import { useConfig, useNavigate, Link } from '../context/ConfigContext';
import { 
  LayoutDashboard, Package, FileText, Settings, LogOut, Clock, CheckCircle, Truck, 
  Search, CreditCard, ChevronRight, Bell, Plus, MessageSquare, Wallet, 
  DollarSign, Cpu, Banknote, Save, Trash2, UploadCloud, AlertTriangle, File, HardDrive,
  Mail, Lock, User as UserIcon, Facebook, Chrome
} from 'lucide-react';
import { Order, UserFile } from '../types';

// --- LOGIN / REGISTER PAGE ---

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useConfig();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
        if (login(username, password)) {
            if (username === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } else {
            alert("Hatalı giriş! (Demo için: admin/admin123 veya kayıt olun)");
        }
    } else {
        if (register(email, password, username)) {
            alert("Kayıt başarılı! Yönlendiriliyorsunuz...");
            navigate('/dashboard');
        }
    }
  };

  const handleSocialLogin = (provider: string) => {
      alert(`${provider} ile giriş şu an demo modunda.`);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 max-w-lg px-10 text-white">
              <h1 className="text-5xl font-bold mb-6">Geleceği Tasarla.</h1>
              <p className="text-xl text-slate-300 mb-8">Türkiye'nin en gelişmiş PCB üretim platformuna hoş geldiniz. Fikirden üretime sadece birkaç tık.</p>
              <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
                      <div className="text-3xl font-bold text-blue-400">24s</div>
                      <div className="text-xs text-slate-300 uppercase">Hızlı Üretim</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
                      <div className="text-3xl font-bold text-green-400">%100</div>
                      <div className="text-xs text-slate-300 uppercase">Yerli Üretim</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">E</div>
                  <h2 className="text-2xl font-bold text-slate-800">{isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluştur'}</h2>
                  <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Hesabınıza giriş yapın' : 'Hemen ücretsiz üye olun'}</p>
              </div>

              {/* Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                  <button 
                    onClick={() => setIsLogin(true)} 
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      Giriş Yap
                  </button>
                  <button 
                    onClick={() => setIsLogin(false)} 
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      Kayıt Ol
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                      <div className="relative">
                          <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                          <input 
                            type="email" 
                            placeholder="E-posta Adresi" 
                            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                      </div>
                  )}
                  <div className="relative">
                      <UserIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="Kullanıcı Adı" 
                        className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                  </div>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        placeholder="Şifre" 
                        className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                  </div>

                  {isLogin && (
                      <div className="text-right">
                          <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Şifremi Unuttum?</a>
                      </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30">
                      {isLogin ? 'Giriş Yap' : 'Ücretsiz Kayıt Ol'}
                  </button>
              </form>

              <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-xs text-slate-400 font-bold uppercase">veya</span>
                  <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-slate-700 text-sm">
                      <Chrome size={18} className="text-red-500" /> Google
                  </button>
                  <button onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-slate-700 text-sm">
                      <Facebook size={18} className="text-blue-600" /> Facebook
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const FileIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'gerber': return <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs">ZIP</div>;
        case 'stl': return <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded flex items-center justify-center font-bold text-xs">STL</div>;
        case 'obj': return <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded flex items-center justify-center font-bold text-xs">OBJ</div>;
        case 'dxf': return <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center font-bold text-xs">DXF</div>;
        case 'step': return <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded flex items-center justify-center font-bold text-xs">STP</div>;
        default: return <File className="text-slate-400 w-10 h-10" />;
    }
};

// --- DASHBOARD ---
// (Keeping the Dashboard component as is, since it was already good, just ensuring exports are correct)

export const Dashboard: React.FC = () => {
  const { user, logout, updateUser, userOrders, userFiles, config, userTickets, userNotifications, userTransactions, userCards, addTicket, depositFunds, addFile } = useConfig();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'files' | 'wallet' | 'support' | 'settings'>('overview');
  
  // Local States for Settings
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [depositAmount, setDepositAmount] = useState<number>(1000);

  if (!user) return <div className="p-10 text-center text-slate-500">Oturum süresi doldu. Lütfen tekrar giriş yapın. <br/> <Link to="/login" className="text-blue-600 font-bold">Giriş Ekranı</Link></div>;

  // Storage Calculation
  const storagePercent = Math.min(100, ((user.storageUsed || 0) / (user.storageLimit || 1)) * 100);
  const storageUsedMB = ((user.storageUsed || 0) / (1024*1024)).toFixed(2);
  const storageTotalMB = ((user.storageLimit || 1) / (1024*1024)).toFixed(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) addFile(e.target.files[0]);
  };

  const renderSidebarItem = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}>
      {icon} <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <div className="w-full md:w-72 bg-slate-50 border-r p-6 flex flex-col">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">{user.username[0].toUpperCase()}</div>
                <div>
                    <h3 className="font-bold text-slate-800">{user.username}</h3>
                    <p className="text-xs text-slate-500">{user.company || 'Bireysel Hesap'}</p>
                </div>
            </div>
            <nav className="space-y-2 flex-1">
                {renderSidebarItem('overview', <LayoutDashboard size={20} />, 'Genel Bakış')}
                {renderSidebarItem('orders', <Package size={20} />, 'Siparişlerim')}
                {renderSidebarItem('files', <FileText size={20} />, 'Dosyalarım')}
                {renderSidebarItem('wallet', <Wallet size={20} />, 'Cüzdan')}
                {renderSidebarItem('support', <MessageSquare size={20} />, 'Destek')}
                {renderSidebarItem('settings', <Settings size={20} />, 'Ayarlar')}
            </nav>
            <button onClick={logout} className="mt-6 flex items-center text-red-500 px-4 py-2 font-bold text-sm hover:bg-red-50 rounded transition"><LogOut size={16} className="mr-2"/> Çıkış Yap</button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab === 'overview' ? 'Kontrol Paneli' : activeTab}</h1>
                <div className="bg-white p-2 rounded-full border shadow-sm cursor-pointer hover:bg-gray-50 relative">
                    <Bell size={20} className="text-slate-500"/>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-1">Aktif Siparişler</div>
                            <div className="text-3xl font-black text-blue-600">{userOrders.filter(o => o.status !== 'Delivered').length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-1">Cüzdan Bakiyesi</div>
                            <div className="text-3xl font-black text-green-600">{config.currencySymbol}{user.walletBalance?.toFixed(2)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-1">Depolama</div>
                            <div className="flex justify-between items-end mb-2">
                                <div className="text-3xl font-black text-slate-800">{storagePercent.toFixed(0)}%</div>
                                <div className="text-xs text-slate-400 font-bold">{storageUsedMB} MB</div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: `${storagePercent}%`}}></div></div>
                        </div>
                    </div>
                    
                    {/* Recent Activity / Timeline would go here */}
                </div>
            )}

            {activeTab === 'files' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">Toplam {userFiles.length} dosya</div>
                        <div className="relative overflow-hidden group">
                             <button className={`flex items-center px-4 py-2 rounded-lg font-bold text-white shadow-lg shadow-blue-200 transition ${storagePercent >= 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                <UploadCloud size={18} className="mr-2"/> Yeni Yükle
                             </button>
                             {storagePercent < 100 && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />}
                        </div>
                    </div>

                    {/* Quota Bar */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                            <span className="flex items-center"><HardDrive size={16} className="mr-2 text-slate-400"/> Depolama Kullanımı</span>
                            <span>{storageUsedMB} MB / {storageTotalMB} MB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${storagePercent > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{width: `${storagePercent}%`}}></div>
                        </div>
                        {storagePercent >= 100 && <div className="mt-2 text-xs text-red-500 font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> Kota limitine ulaşıldı.</div>}
                    </div>

                    {/* File List */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        {userFiles.map(f => (
                            <div key={f.id} className="flex items-center p-4 border-b last:border-0 hover:bg-slate-50 transition">
                                <FileIcon type={f.type} />
                                <div className="ml-4 flex-1">
                                    <div className="font-bold text-slate-800">{f.name}</div>
                                    <div className="text-xs text-slate-500">{f.uploadDate} • {(f.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <button className="text-blue-600 font-bold text-xs hover:underline bg-blue-50 px-3 py-1 rounded">İndir</button>
                            </div>
                        ))}
                        {userFiles.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">Henüz dosya yüklenmedi.</div>}
                    </div>
                </div>
            )}

            {activeTab === 'wallet' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Bonus Banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse"></div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold mb-1">🎉 %20 Bonus Fırsatı!</h3>
                                <p className="text-indigo-100 text-sm">Şimdi kredi kartı ile bakiye yükleyin, anında %20 ekstra bakiye kazanın.</p>
                            </div>
                            <div className="text-4xl font-black opacity-90">+%20</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Bakiye Yükle</h3>
                            <div className="flex gap-2 mb-4">
                                {[500, 1000, 2500, 5000].map(amt => (
                                    <button key={amt} onClick={() => setDepositAmount(amt)} className={`px-3 py-2 rounded border font-bold text-sm transition ${depositAmount === amt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 hover:bg-slate-100 border-transparent'}`}>{amt}₺</button>
                                ))}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100">
                                <div className="flex justify-between text-sm mb-1"><span>Yüklenecek Tutar:</span> <span className="font-bold">{depositAmount}₺</span></div>
                                <div className="flex justify-between text-sm text-green-600 font-bold"><span>Bonus (%20):</span> <span>+{depositAmount * 0.2}₺</span></div>
                                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-slate-800"><span>Toplam Bakiye:</span> <span>{depositAmount * 1.2}₺</span></div>
                            </div>
                            <button onClick={() => depositFunds(depositAmount)} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">Güvenli Ödeme Yap</button>
                        </div>
                        
                        {/* History */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4">Son İşlemler</h3>
                             <div className="space-y-3">
                                 {userTransactions.map(t => (
                                     <div key={t.id} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                         <div>
                                             <div className="font-bold text-slate-700">{t.description}</div>
                                             <div className="text-xs text-slate-400">{t.date}</div>
                                         </div>
                                         <div className={`font-bold ${t.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                                             {t.amount > 0 ? '+' : ''}{t.amount}₺
                                         </div>
                                     </div>
                                 ))}
                                 {userTransactions.length === 0 && <div className="text-slate-400 text-sm italic">Henüz işlem yok.</div>}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Kişisel Bilgiler</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Ad Soyad</label>
                                <input type="text" defaultValue={user.username} className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">E-posta</label>
                                <input type="email" defaultValue={user.email} className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Telefon</label>
                                <input type="text" defaultValue={user.phone} className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Şirket</label>
                                <input type="text" defaultValue={user.company} className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition"><Save size={16} className="inline mr-1"/> Değişiklikleri Kaydet</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Şifre Güvenliği</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="password" placeholder="Mevcut Şifre" className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                            <input type="password" placeholder="Yeni Şifre" className="w-full border rounded-lg p-2 text-sm bg-slate-50" />
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-900 transition">Şifreyi Güncelle</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-800">Kayıtlı Adresler</h3>
                            <button className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg font-bold hover:bg-green-100 transition">+ Yeni Adres</button>
                        </div>
                        {user.addresses?.map(addr => (
                            <div key={addr.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{addr.title}</div>
                                    <div className="text-xs text-slate-500">{addr.fullAddress}</div>
                                </div>
                                <button className="text-red-400 hover:text-red-600 bg-white p-2 rounded shadow-sm"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        {(!user.addresses || user.addresses.length === 0) && <p className="text-sm text-slate-400 italic">Kayıtlı adres bulunamadı.</p>}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
