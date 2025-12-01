
import React, { useState, useEffect } from 'react';
import { Upload, Zap, ShieldCheck, Globe, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig, Link } from '../context/ConfigContext';

const Home: React.FC = () => {
  const { config } = useConfig();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = config.slides;

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000); // 3 Seconds
      return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="flex flex-col font-sans">
      {/* Carousel Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-slate-900 text-white">
          
          {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                  <div className={`absolute inset-0 ${slide.bg} opacity-90`}></div>
                  {/* Background decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-[100px]"></div>
                  </div>

                  <div className="max-w-[1400px] mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center relative z-20">
                      <div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-12 animate-in slide-in-from-left duration-700">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                {slide.tag}
                          </div>
                          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-lg">
                              {slide.title}
                          </h1>
                          <p className="text-xl mb-8 text-slate-200 font-light leading-relaxed drop-shadow-md">
                              {slide.desc}
                          </p>
                          <Link to={slide.btnLink} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-1 inline-flex items-center justify-center">
                                {slide.btnText} <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                      </div>
                      <div className="md:w-1/2 flex justify-center items-center">
                          <div className="relative w-[500px] h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform rotate-[-3deg] hover:rotate-0 transition duration-700 ease-out">
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                      </div>
                  </div>
              </div>
          ))}

          {/* Controls */}
          <button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition">
              <ChevronLeft size={24} />
          </button>
          <button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition">
              <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
              {slides.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/50 hover:bg-white'}`} 
                  />
              ))}
          </div>
      </section>

      {/* Features Grid (Static) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Yıldırım Hızında</h3>
              <p className="text-slate-600 leading-relaxed">24 saatlik express üretim. Otomatik CAM ile sıfır gecikme.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Askeri Sınıf Kalite</h3>
              <p className="text-slate-600 leading-relaxed">ISO 9001:2015 sertifikalı fabrikalar. AOI ve Flying Probe testleri.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Şeffaf Fiyatlandırma</h3>
              <p className="text-slate-600 leading-relaxed">Gizli ücret yok. Havale ile anında %10 indirim fırsatı.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;