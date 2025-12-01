
import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, Menu, Shield, LayoutDashboard, X, Globe, ChevronDown } from 'lucide-react';
import { useConfig, Link, useNavigate } from '../context/ConfigContext';

const Navbar: React.FC = () => {
  const { config, user, logout } = useConfig();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-slate-900 text-xs text-gray-300 py-1 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <span className="flex items-center gap-1 cursor-pointer hover:text-white"><Globe size={12}/> {config.currency} ({config.currencySymbol}) <ChevronDown size={10}/></span>
            <span className="text-slate-500">|</span>
            <span className="text-blue-400 font-medium animate-pulse">{config.bannerText}</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/help" className="hover:text-white transition-colors">Yardım Merkezi</Link>
            <Link to="/engineering" className="hover:text-white transition-colors">Mühendislik Rehberi</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative z-20 bg-white">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4 text-slate-600 hover:text-blue-600 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group select-none">
            <div className="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-lg font-black text-xl shadow-lg shadow-blue-600/30 group-hover:bg-blue-700 transition-all transform group-hover:scale-105">
              {config.siteName.charAt(0)}
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{config.siteName}</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Electronics</span>
            </div>
          </Link>

          {/* Desktop Menu - Dynamic */}
          <nav className="hidden lg:flex ml-10 space-x-1">
            {config.menus?.main.map(menuItem => (
                <Link 
                    key={menuItem.id} 
                    to={menuItem.link} 
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all"
                >
                    {menuItem.label}
                </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {user?.role === 'admin' && (
             <Link to="/admin" className="hidden md:flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 border border-red-100 transition">
                <Shield className="w-3 h-3" />
                <span className="text-xs font-bold">Yönetim</span>
             </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200 transition group">
                    <LayoutDashboard className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                    <span className="text-sm font-bold hidden sm:block">{user.username}</span>
                </Link>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-bold text-sm px-3 py-2 rounded-lg hover:bg-slate-50 transition">
              <UserIcon className="w-4 h-4" />
              <span>Giriş</span>
            </Link>
          )}
          
          <Link to="/cart" className="relative cursor-pointer text-slate-700 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-full transition group">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-0.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white group-hover:scale-110 transition">0</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-xl z-40 animate-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col p-4 space-y-2">
             {config.menus?.main.map(menuItem => (
                <Link 
                    key={menuItem.id} 
                    to={menuItem.link} 
                    className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex justify-between items-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {menuItem.label}
                    <ChevronDown size={14} className="-rotate-90 text-slate-300" />
                </Link>
            ))}
            <div className="border-t border-gray-100 my-2 pt-2">
                 {!user ? (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg">
                        <UserIcon size={16} /> Giriş Yap / Kayıt Ol
                    </Link>
                 ) : (
                     <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg">
                        <LayoutDashboard size={16} /> Hesabım
                    </Link>
                 )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
