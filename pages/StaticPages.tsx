
import React from 'react';
import { useConfig, useLocation, Link } from '../context/ConfigContext';
import { Layers, Cpu, Disc, Zap, Shield, CheckCircle, ArrowRight, Box, Globe, Anchor, Activity, Image as ImageIcon } from 'lucide-react';
import { PageSection } from '../types';

interface DynamicPageProps {
  pageKey?: string;
}

// Helper to map string icon names to Components
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
    const icons: Record<string, React.ElementType> = {
        Layers, Cpu, Disc, Zap, Shield, CheckCircle, Box, Globe, Anchor, Activity
    };
    const IconComponent = icons[name] || Box;
    return <IconComponent className={className} />;
};

const SectionRenderer: React.FC<{ section: PageSection; idx: number }> = ({ section, idx }) => {
    const bgClass = section.background === 'gray' ? 'bg-slate-50' : section.background === 'dark' ? 'bg-slate-900 text-white' : section.background === 'blue' ? 'bg-blue-600 text-white' : 'bg-white';
    const textClass = (section.background === 'dark' || section.background === 'blue') ? 'text-white' : 'text-slate-800';
    const subTextClass = (section.background === 'dark' || section.background === 'blue') ? 'text-slate-200' : 'text-slate-600';

    switch (section.type) {
        case 'hero':
            return (
                <div className="relative bg-slate-900 py-24 md:py-32 overflow-hidden">
                     {section.image && (
                         <>
                            <div className="absolute inset-0 opacity-40">
                                <img src={section.image} className="w-full h-full object-cover" alt="bg" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/50"></div>
                         </>
                     )}
                     <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                         {section.subtitle && <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-blue-300 text-xs font-bold mb-8 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">{section.subtitle}</div>}
                         <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-xl max-w-4xl mx-auto">{section.title}</h1>
                         <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">{section.content}</p>
                         {section.buttons && (
                             <div className="flex flex-wrap justify-center gap-4">
                                 {section.buttons.map((btn, i) => (
                                     <Link key={i} to={btn.link} className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center transition transform hover:-translate-y-1 ${btn.style === 'outline' ? 'border-2 border-slate-500 hover:border-white text-white hover:bg-white hover:text-slate-900' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30'}`}>
                                         {btn.label} <ArrowRight size={20} className="ml-2" />
                                     </Link>
                                 ))}
                             </div>
                         )}
                     </div>
                </div>
            );

        case 'features':
            return (
                <div className={`py-24 ${bgClass}`}>
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>{section.title}</h2>
                            <p className={`max-w-2xl mx-auto text-lg ${subTextClass}`}>{section.content}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {section.items?.map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition duration-300 group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition duration-300"></div>
                                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                        <IconRenderer name={item.icon} className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        
        case 'text-image':
             return (
                 <div className={`py-24 ${bgClass}`}>
                     <div className="max-w-7xl mx-auto px-4">
                         <div className={`flex flex-col lg:flex-row items-center gap-16 ${section.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                             <div className="flex-1 lg:pr-8">
                                 <div className="w-20 h-2 bg-blue-600 rounded-full mb-8"></div>
                                 <h2 className={`text-4xl font-bold mb-8 ${textClass} leading-tight`}>{section.title}</h2>
                                 <div className={`prose prose-lg ${subTextClass} whitespace-pre-line leading-relaxed`}>{section.content}</div>
                                 {section.buttons && (
                                     <div className="mt-10 flex flex-wrap gap-4">
                                         {section.buttons.map((btn, i) => (
                                             <Link key={i} to={btn.link} className="inline-flex items-center text-blue-600 font-bold text-lg hover:text-blue-700 border-b-2 border-blue-600 pb-1 hover:border-blue-700 transition">
                                                 {btn.label} <ArrowRight size={20} className="ml-2" />
                                             </Link>
                                         ))}
                                     </div>
                                 )}
                             </div>
                             <div className="flex-1 w-full">
                                 {section.image ? (
                                     <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.01] transition duration-500 group">
                                         <img src={section.image} alt={section.title} className="w-full h-full object-cover aspect-[4/3]" />
                                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500"></div>
                                     </div>
                                 ) : (
                                     <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-dashed border-slate-200 text-slate-400">
                                         <ImageIcon size={48}/>
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>
                 </div>
             );
        
        case 'cta':
            return (
                <div className="py-24 bg-blue-600 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                    
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{section.title}</h2>
                        <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light">{section.content}</p>
                        {section.buttons && section.buttons.map((btn, i) => (
                            <Link key={i} to={btn.link} className="inline-block bg-white text-blue-900 px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-white/20">
                                {btn.label}
                            </Link>
                        ))}
                    </div>
                </div>
            );

        default: // Plain Text
            return (
                <div className={`py-20 ${bgClass}`}>
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className={`text-3xl font-bold mb-8 ${textClass}`}>{section.title}</h2>
                         <div className={`flex flex-col md:flex-row gap-12`}>
                            <div className="flex-1">
                                <div className={`prose prose-lg ${subTextClass} whitespace-pre-line leading-relaxed`}>{section.content}</div>
                            </div>
                            {section.image && (
                                <div className="md:w-1/3">
                                    <img src={section.image} alt={section.title} className="rounded-xl shadow-lg w-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
    }
};

const DynamicPage: React.FC<DynamicPageProps> = ({ pageKey }) => {
  const { config } = useConfig();
  const location = useLocation();
  
  // Determine key: either prop or derived from URL
  const effectiveKey = pageKey || location.pathname.replace('/', '');
  const pageData = config.pages[effectiveKey];

  if (!pageData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Box className="w-24 h-24 text-slate-200 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-slate-500 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-400 mb-8">URL: /{effectiveKey}</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="font-sans pb-0 min-h-screen bg-white">
       {/* If page doesn't start with Hero, show standard header */}
       {pageData.sections[0]?.type !== 'hero' && (
          <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
             <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="w-8 h-[2px] bg-blue-400"></span> Sayfa
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{pageData.title}</h1>
             </div>
          </div>
       )}

       {pageData.sections.map((section, idx) => (
           <SectionRenderer key={section.id} section={section} idx={idx} />
       ))}
    </div>
  );
};

export const Capabilities = () => <DynamicPage pageKey="capabilities" />;
export const SMTAssembly = () => <DynamicPage pageKey="smt" />;
export const ThreeDPrinting = () => <DynamicPage pageKey="3d-printing" />;
export const CNC = () => <DynamicPage pageKey="cnc" />;
export const About = () => <DynamicPage />;
export const Contact = () => <DynamicPage pageKey="contact" />;
export const Help = () => <DynamicPage pageKey="help" />;
export const Engineering = () => <DynamicPage pageKey="engineering" />;
