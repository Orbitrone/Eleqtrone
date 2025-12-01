
import React from 'react';
import { useConfig, Link } from '../context/ConfigContext';

const Footer: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <footer className="bg-slate-50 pt-16 pb-8 mt-auto border-t border-gray-200 text-sm font-sans">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Hizmetlerimiz</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="/quote" className="hover:text-blue-600 transition">PCB Üretim</Link></li>
              <li><Link to="/smt" className="hover:text-blue-600 transition">SMT Montaj</Link></li>
              <li><Link to="/stencil" className="hover:text-blue-600 transition">Lazer Stencil</Link></li>
              <li><Link to="/3d-printing" className="hover:text-blue-600 transition">3D Baskı</Link></li>
              <li><Link to="/cnc" className="hover:text-blue-600 transition">CNC İşleme</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Destek</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="/contact" className="hover:text-blue-600 transition">Bize Ulaşın</Link></li>
              <li><Link to="/help" className="hover:text-blue-600 transition">Yardım Merkezi</Link></li>
              <li><Link to="/engineering" className="hover:text-blue-600 transition">Teknik Rehber</Link></li>
              <li><Link to="/faq" className="hover:text-blue-600 transition">S.S.S</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">ProtoRone</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="/about" className="hover:text-blue-600 transition">Hakkımızda</Link></li>
              <li><Link to="/news" className="hover:text-blue-600 transition">Blog & Haberler</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition">Gizlilik Politikası</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition">Kullanım Koşulları</Link></li>
            </ul>
          </div>
           <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Bültenimize Abone Olun</h4>
            <p className="text-slate-500 mb-4 text-xs">Kampanyalar, teknik makaleler ve indirim kodları için.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-500/20">Abone Ol</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
          <div className="flex flex-col gap-1">
            <p>&copy; 2025 {config.siteName} Teknoloji A.Ş. Tüm hakları saklıdır.</p>
            <p>Türkiye'nin Mühendislik ve Üretim Üssü.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <img src="https://placehold.co/40x25/EEE/999?text=VISA" alt="Visa" className="grayscale hover:grayscale-0 transition opacity-50 hover:opacity-100" />
            <img src="https://placehold.co/40x25/EEE/999?text=MC" alt="Mastercard" className="grayscale hover:grayscale-0 transition opacity-50 hover:opacity-100" />
            <img src="https://placehold.co/40x25/EEE/999?text=AMEX" alt="Amex" className="grayscale hover:grayscale-0 transition opacity-50 hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;