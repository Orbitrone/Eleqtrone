
import React, { useState, useMemo } from 'react';
import { Layers as LayersIcon, Cpu, CreditCard, Banknote, HelpCircle, Settings, Zap } from 'lucide-react';
import { BoardSpecs, LayerFile } from '../types';
import { calculatePrice } from '../services/pricingService';
import { processZipFile } from '../services/gerberService';
import GerberViewer from '../components/GerberViewer';
import { useConfig } from '../context/ConfigContext';

// --- Constants for Dropdowns ---
const LAYER_OPTS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const QTY_OPTS = [5, 10, 25, 50, 100, 250, 500, 1000];
const THICKNESS_OPTS = [0.4, 0.6, 0.8, 1.0, 1.2, 1.6, 2.0, 2.4, 3.0];
const COLOR_OPTS = ['Green', 'Red', 'Yellow', 'Blue', 'White', 'Matte Black', 'Purple'];

const INITIAL_SPECS: BoardSpecs = {
  dimensions: { x: 100, y: 100 },
  layers: 2,
  qty: 5,
  baseMaterial: 'FR-4',
  fr4Tg: 'Tg130-140',
  thickness: 1.6,
  minTrackSpacing: '0.127mm(5mil)',
  minHoleSize: '0.3mm',
  color: 'Green',
  silkscreen: 'White',
  surfaceFinish: 'HASL',
  copperWeight: '1oz',
  goldFingers: false,
  flyingProbe: true,
  castellatedHoles: false,
  impedanceControl: false,
  viaProcess: 'Tenting Vias',
  removeOrderNumber: false,
  confirmProductionFile: false,
  stencil: { enabled: false, side: 'Top', framework: 'Frameless', size: '370x470mm', counts: 1, material: 'Stainless Steel' },
  detectedVias: 0,
  detectedHoles: 0
};

// Helper Component for Tooltip
const Tooltip: React.FC<{ text: string; title?: string }> = ({ text, title }) => (
    <div className="group relative inline-flex items-center ml-1 align-middle">
        <HelpCircle className="w-3 h-3 text-slate-400 cursor-help hover:text-blue-500" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700">
            {title && <div className="font-bold text-blue-300 mb-1">{title}</div>}
            <div className="leading-relaxed">{text}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
    </div>
);

// Reusable Option Button
interface OptionBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const OptionBtn: React.FC<OptionBtnProps> = ({ label, active, onClick, color }) => (
    <button 
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-xs font-bold border rounded transition-all flex items-center justify-center gap-2
          ${active ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}
      `}
    >
        {color && <span className="w-3 h-3 rounded-full border shadow-sm" style={{backgroundColor: color}}></span>}
        {label}
    </button>
);

const Quote: React.FC = () => {
  const { config } = useConfig();
  const [specs, setSpecs] = useState<BoardSpecs>(INITIAL_SPECS);
  const [layers, setLayers] = useState<LayerFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');

  const price = useMemo(() => calculatePrice(specs, config, paymentMethod), [specs, config, paymentMethod]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFileName(file.name);
    try {
      const result = await processZipFile(file);
      setLayers(result.layers);
      if (result.estimatedSpecs) setSpecs(prev => ({ ...prev, ...result.estimatedSpecs }));
    } catch (err) {
      alert("Dosya işlenemedi.");
    } finally {
      setIsUploading(false);
    }
  };

  const updateSpec = <K extends keyof BoardSpecs>(key: K, value: BoardSpecs[K]) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] pt-6 pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-4">
        
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Standart PCB Siparişi</h1>
            <div className="text-sm text-slate-500 flex gap-2 mt-1">
                <span>FR-4</span><span>•</span><span>Çok Katmanlı</span><span>•</span><span>Hızlı Üretim</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Viewer & Upload */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center"><LayersIcon className="w-4 h-4 mr-2 text-blue-600" /> Gerber Analizi</h3>
                    {fileName && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold truncate max-w-[150px]">{fileName}</span>}
                </div>
                <div className="bg-slate-900 h-[350px] relative">
                    <GerberViewer layers={layers} vias={specs.detectedVias} holes={specs.detectedHoles} />
                    {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">Analiz ediliyor...</div>}
                </div>
                <div className="p-4 bg-white">
                     <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-blue-50 hover:border-blue-400 transition group cursor-pointer">
                         <input type="file" accept=".zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                         <Zap className="w-8 h-8 mx-auto text-slate-400 group-hover:text-blue-500 mb-2" />
                         <p className="text-sm font-bold text-slate-700">Gerber Dosyası Yükle</p>
                         <p className="text-xs text-slate-400 mt-1">Otomatik analiz için (ZIP/RAR)</p>
                    </div>
                </div>
            </div>
          </div>

          {/* MIDDLE: Specs Form */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Section 1: Base Core */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-600" /> Temel Özellikler
                </h3>
                
                <div className="space-y-4">
                    {/* Dimensions & Layers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Base Material</label>
                            <div className="flex flex-wrap gap-2">
                                {['FR-4', 'Rogers', 'Aluminum'].map(m => (
                                    <OptionBtn key={m} label={m} active={specs.baseMaterial === m} onClick={() => updateSpec('baseMaterial', m as any)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Layers</label>
                            <select value={specs.layers} onChange={(e) => updateSpec('layers', +e.target.value as any)} className="w-full border rounded px-2 py-2 text-sm font-bold bg-slate-50">
                                {LAYER_OPTS.map(l => <option key={l} value={l}>{l} Layers</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Dimensions (mm)</label>
                            <div className="flex gap-2">
                                <input type="number" value={specs.dimensions.x} onChange={(e) => updateSpec('dimensions', {...specs.dimensions, x: +e.target.value})} className="w-full border rounded px-2 py-2 text-sm font-bold text-center" />
                                <span className="self-center text-slate-400">x</span>
                                <input type="number" value={specs.dimensions.y} onChange={(e) => updateSpec('dimensions', {...specs.dimensions, y: +e.target.value})} className="w-full border rounded px-2 py-2 text-sm font-bold text-center" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">PCB Qty</label>
                            <select value={specs.qty} onChange={(e) => updateSpec('qty', +e.target.value)} className="w-full border rounded px-2 py-2 text-sm font-bold bg-slate-50">
                                {QTY_OPTS.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center">FR-4 TG <Tooltip title="Glass Transition Temp" text="PCB'nin dayanabileceği maksimum sıcaklık sınıfı." /></label>
                             <div className="flex flex-wrap gap-1">
                                {['Tg130-140', 'Tg150-160', 'Tg170-180'].map(t => (
                                    <button key={t} onClick={() => updateSpec('fr4Tg', t as any)} className={`text-[10px] font-bold px-2 py-1 rounded border ${specs.fr4Tg === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600'}`}>{t.replace('Tg', '')}</button>
                                ))}
                             </div>
                        </div>
                        <div>
                             <label className="text-[11px] font-bold text-slate-400 uppercase mb-1">Thickness</label>
                             <select value={specs.thickness} onChange={(e) => updateSpec('thickness', +e.target.value as any)} className="w-full border rounded px-2 py-1 text-sm">
                                 {THICKNESS_OPTS.map(t => <option key={t} value={t}>{t} mm</option>)}
                             </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Colors & Coating */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                 <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-purple-600" /> Görünüm & Kaplama
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">PCB Color</label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTS.map(c => (
                                <OptionBtn 
                                    key={c} 
                                    label={c} 
                                    active={specs.color === c} 
                                    onClick={() => updateSpec('color', c as any)}
                                    color={c.toLowerCase().replace('matte ', '') === 'white' ? '#eee' : c.toLowerCase().replace('matte ', '')} 
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">
                            Surface Finish <Tooltip title="Yüzey Kaplama (Surface Finish)" text="Bakır padlerin korozyondan korunması ve lehimlenebilirlik (solderability) için kaplama tipi." />
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['HASL', 'LeadFreeHASL', 'ENIG', 'OSP', 'ImmersionSilver', 'ImmersionTin'].map(s => (
                                <OptionBtn key={s} label={s === 'LeadFreeHASL' ? 'LF-HASL' : s} active={specs.surfaceFinish === s} onClick={() => updateSpec('surfaceFinish', s as any)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Advanced Tech */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                 <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-600" /> İleri Teknoloji
                </h3>
                <div className="space-y-3">
                     <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                         <span className="text-xs font-bold text-slate-700 flex items-center">Via Covering <Tooltip title="Via Kaplama" text="Viaların lehim maskesi ile kapatılması (Tenting) veya doldurulması." /></span>
                         <select value={specs.viaProcess} onChange={(e) => updateSpec('viaProcess', e.target.value as any)} className="text-xs border rounded p-1 font-medium">
                             <option value="Tenting Vias">Tenting Vias (Standart)</option>
                             <option value="Plugged Vias">Plugged Vias (+Cost)</option>
                             <option value="Filled & Capped">Filled & Capped (L3+)</option>
                         </select>
                     </div>
                     <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                         <span className="text-xs font-bold text-slate-700 flex items-center">Impedance Control <Tooltip text="Yüksek frekanslı devreler için empedans kontrolü." /></span>
                         <div className="flex gap-2">
                            <button onClick={() => updateSpec('impedanceControl', true)} className={`px-3 py-1 text-xs rounded ${specs.impedanceControl ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Yes</button>
                            <button onClick={() => updateSpec('impedanceControl', false)} className={`px-3 py-1 text-xs rounded ${!specs.impedanceControl ? 'bg-slate-200 text-slate-700' : 'bg-white border'}`}>No</button>
                         </div>
                     </div>
                     <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                         <span className="text-xs font-bold text-slate-700 flex items-center">Gold Fingers <Tooltip text="Kart kenarındaki bağlantı noktaları için sert altın kaplama." /></span>
                         <input type="checkbox" checked={specs.goldFingers} onChange={(e) => updateSpec('goldFingers', e.target.checked)} className="w-4 h-4" />
                     </div>
                </div>
            </div>

            {/* Section 4: Stencil */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-slate-800 flex items-center">SMT Stencil (Elek)</h3>
                     {/* Standard Checkbox */}
                     <div className="flex items-center">
                        <label className="flex items-center cursor-pointer relative group">
                            <input 
                                type="checkbox"
                                checked={specs.stencil.enabled}
                                onChange={(e) => updateSpec('stencil', { ...specs.stencil, enabled: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`ml-2 text-xs font-bold transition-colors ${specs.stencil.enabled ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                {specs.stencil.enabled ? 'Siparişle Birlikte Üret' : 'Stencil Ekle'}
                            </span>
                        </label>
                     </div>
                </div>
                {specs.stencil.enabled && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-100 animate-in fade-in slide-in-from-top-2">
                        <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Malzeme (Material)</label>
                            <select className="w-full text-xs border rounded p-1.5 bg-white font-medium" value={specs.stencil.material} onChange={(e) => updateSpec('stencil', {...specs.stencil, material: e.target.value as any})}>
                                <option value="Stainless Steel">Stainless Steel (Standart)</option>
                                <option value="Electropolished Steel">Electropolished Steel (Hassas)</option>
                                <option value="Nickel">Nickel (Ultra Hassas)</option>
                                <option value="Plastic">Plastic Film (Prototip)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Framework</label>
                            <select className="w-full text-xs border rounded p-1.5 bg-white" value={specs.stencil.framework} onChange={(e) => updateSpec('stencil', {...specs.stencil, framework: e.target.value as any})}>
                                <option value="Frameless">Çerçevesiz (Ekonomik)</option>
                                <option value="Framed">Çerçeveli (Hazır)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Side</label>
                            <select className="w-full text-xs border rounded p-1.5 bg-white" value={specs.stencil.side} onChange={(e) => updateSpec('stencil', {...specs.stencil, side: e.target.value as any})}>
                                <option value="Top">Top Side</option>
                                <option value="Bottom">Bottom Side</option>
                                <option value="Both">Both Sides</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

          </div>

          {/* RIGHT: Sticky Price Sidebar */}
          <div className="lg:col-span-3 relative">
            <div className="sticky top-24 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase font-bold">Tahmini Tutar</span>
                        <span className="text-2xl font-black">{config.currencySymbol}{price.total.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300">{specs.qty} Adet</div>
                        <div className="text-[10px] text-slate-400 mt-1">24-48 Saat Üretim</div>
                    </div>
                </div>
                
                <div className="p-4 space-y-4">
                    {/* Payment Selector */}
                    <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Ödeme Yöntemi</label>
                         <div className="grid grid-cols-2 gap-2">
                             <button onClick={() => setPaymentMethod('credit_card')} className={`p-2 border rounded flex flex-col items-center ${paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}>
                                 <CreditCard size={18} className="mb-1"/> <span className="text-[10px] font-bold">Kredi Kartı</span>
                             </button>
                             <button onClick={() => setPaymentMethod('bank_transfer')} className={`p-2 border rounded flex flex-col items-center relative ${paymentMethod === 'bank_transfer' ? 'border-green-600 bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>
                                 <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1 rounded font-bold animate-bounce">IND %10</div>
                                 <Banknote size={18} className="mb-1"/> <span className="text-[10px] font-bold">Havale / EFT</span>
                             </button>
                         </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-2 text-xs pt-2 border-t border-gray-100">
                        {price.details.map((d, i) => (
                            <div key={i} className="flex justify-between group hover:bg-slate-50 p-1 rounded">
                                <span className="text-slate-500">{d.label}</span>
                                <span className={`font-bold ${d.amount < 0 ? 'text-green-600' : 'text-slate-800'}`}>{config.currencySymbol}{Math.abs(d.amount).toFixed(2)}</span>
                            </div>
                        ))}
                         <div className="flex justify-between p-1 text-slate-400 italic">
                            <span>Tahmini Ağırlık</span>
                            <span>{price.weight.toFixed(2)} kg</span>
                        </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition flex justify-center items-center">
                        Sepete Ekle <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs">{config.currencySymbol}{price.total.toFixed(2)}</span>
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Quote;
