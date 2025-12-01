
import React, { useState, useEffect } from 'react';
import { LayerFile } from '../types';
import { Layers, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, GripVertical, Activity, Disc } from 'lucide-react';

interface GerberViewerProps {
  layers: LayerFile[];
  vias?: number;
  holes?: number;
}

const GerberViewer: React.FC<GerberViewerProps> = ({ layers, vias = 0, holes = 0 }) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({});
  const [orderedLayers, setOrderedLayers] = useState<LayerFile[]>([]);
  const [zoom, setZoom] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // When props change, reset or initialize the ordered list
    setOrderedLayers(layers);
    
    const initialVisibility: Record<string, boolean> = {};
    layers.forEach(l => initialVisibility[l.filename] = true);
    setVisibleLayers(initialVisibility);
  }, [layers]);

  const toggleLayer = (filename: string) => {
    setVisibleLayers(prev => ({ ...prev, [filename]: !prev[filename] }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newOrder = [...orderedLayers];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    setOrderedLayers(newOrder);
    setDraggedIndex(null);
  };

  const formatSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      return (bytes / 1024).toFixed(1) + ' KB';
  };

  const getLayerColor = (type: LayerFile['type']) => {
    switch(type) {
      case 'top-copper': return '#b83d3d'; // Reddish copper
      case 'bottom-copper': return '#3d5eb8'; // Blueish copper
      case 'top-soldermask': return '#2c8a4a'; // Standard green (semi-transparent usually)
      case 'top-silkscreen': return '#ffffff'; // White
      case 'drill': return '#1a1a1a'; // Dark holes
      case 'outline': return '#e6b800'; // Gold/Yellow
      default: return '#888888';
    }
  };

  if (layers.length === 0) {
    return (
      <div className="w-full h-[600px] bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative z-10 p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 text-center">
            <Layers className="w-16 h-16 mb-4 mx-auto text-blue-500 opacity-80" />
            <h3 className="text-xl font-bold text-white mb-2">CAM Görüntüleyici Hazır</h3>
            <p className="text-sm">Dosya yüklenmedi. PCB'nizi analiz etmek için Gerber (ZIP) yükleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden shadow-2xl ring-1 ring-white/10">
      {/* Toolbar */}
      <div className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Canlı Önizleme</span>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><ZoomOut size={16} /></button>
          <span className="text-xs text-slate-500 w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><ZoomIn size={16} /></button>
          <div className="w-px h-4 bg-slate-700 mx-2"></div>
          <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><Maximize size={16} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Layer List Sidebar */}
        <div className="w-72 bg-slate-900 border-r border-slate-700 flex flex-col">
          <div className="flex-1 overflow-y-auto p-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2 mt-2">Katmanlar (Sürükle-Bırak)</h4>
            <div className="space-y-1">
                {orderedLayers.map((layer, idx) => (
                <div key={layer.filename} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors group select-none 
                        ${visibleLayers[layer.filename] ? 'bg-slate-800/50' : 'bg-slate-900 opacity-60'} 
                        ${draggedIndex === idx ? 'opacity-20 border border-dashed border-blue-500' : 'hover:bg-slate-800/80 border border-transparent'}
                    `}>
                    
                    <div className="flex items-center space-x-2 overflow-hidden flex-1">
                    <div className="text-slate-600 cursor-grab active:cursor-grabbing p-1 -ml-1 hover:text-slate-300">
                        <GripVertical size={14} />
                    </div>
                    <div className="w-3 h-3 rounded-sm shadow-sm flex-shrink-0" style={{ backgroundColor: getLayerColor(layer.type) }}></div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs text-slate-300 truncate font-medium" title={layer.filename}>{layer.filename}</span>
                        <span className="text-[10px] text-slate-600">{formatSize(layer.size)}</span>
                    </div>
                    </div>
                    
                    <div onClick={(e) => { e.stopPropagation(); toggleLayer(layer.filename); }} className="p-1 rounded hover:bg-slate-700">
                        {visibleLayers[layer.filename] ? <Eye size={14} className="text-blue-400" /> : <EyeOff size={14} className="text-slate-600" />}
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* Analysis Stats Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                 <Activity size={12} className="mr-1" /> Analiz Özeti
             </h4>
             <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-800 p-2 rounded border border-slate-700/50 flex flex-col items-center">
                     <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tespit Edilen Via</div>
                     <div className="text-lg font-bold text-blue-400 font-mono">{vias}</div>
                 </div>
                 <div className="bg-slate-800 p-2 rounded border border-slate-700/50 flex flex-col items-center">
                     <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Toplam Delik</div>
                     <div className="text-lg font-bold text-white font-mono flex items-center">
                        <Disc size={12} className="mr-1 text-slate-500" /> {holes}
                     </div>
                 </div>
             </div>
          </div>
        </div>

        {/* Main Viewport */}
        <div className="flex-1 relative bg-[#1a1d24] overflow-hidden flex items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                 backgroundSize: `${20 * zoom}px ${20 * zoom}px`
               }}>
          </div>

          {/* Render Area */}
          <div className="relative transition-transform duration-200 ease-out" style={{ transform: `scale(${zoom})` }}>
            {/* Simulated PCB Rendering Stack - Rendered in 'orderedLayers' order to simulate stacking */}
            <div className="relative w-[400px] h-[300px] bg-[#1e293b] shadow-2xl rounded-sm overflow-hidden border border-slate-700/50">
               {/* 1. Base Material (FR4) - Always at bottom */}
               <div className="absolute inset-0 bg-[#354a32]"></div> 
               
               {/* 2. Layers Simulated based on Ordered List */}
               {orderedLayers.map((layer, idx) => {
                 if (!visibleLayers[layer.filename]) return null;
                 
                 // We are simulating the look based on type.
                 // In a real app, drag and drop changes Z-Index. 
                 // Here, since we map in order, the later elements in the array render ON TOP of previous ones (Standard DOM behavior).
                 
                 const commonStyle: React.CSSProperties = { position: 'absolute', inset: 0 };

                 if (layer.type === 'top-silkscreen') {
                    return (
                        <div key={layer.filename} style={{...commonStyle, zIndex: idx + 10}} className="opacity-90 pointer-events-none mix-blend-screen p-2">
                             <div className="border-2 border-white w-full h-full relative">
                                <div className="absolute bottom-2 right-2 text-[10px] text-white font-mono">ProtoRone Rev 1.0</div>
                                <div className="absolute top-10 left-10 w-4 h-4 border border-white rounded-full"></div>
                             </div>
                        </div>
                    );
                 }
                 if (layer.type === 'top-soldermask') {
                     return <div key={layer.filename} style={{...commonStyle, zIndex: idx + 10}} className="bg-[#0f5132] opacity-80 mix-blend-multiply"></div>;
                 }
                 if (layer.type === 'top-copper' || layer.type === 'bottom-copper') {
                     // Simulating copper traces
                     return <div key={layer.filename} style={{...commonStyle, zIndex: idx + 10}} className="border-[20px] border-transparent border-t-red-800/30 opacity-50"></div>
                 }
                 if (layer.type === 'drill') {
                     return (
                         <div key={layer.filename} style={{...commonStyle, zIndex: idx + 20}} className="pointer-events-none">
                             <div className="absolute top-10 left-10 w-2 h-2 bg-black rounded-full shadow-inner"></div>
                             <div className="absolute top-10 left-14 w-2 h-2 bg-black rounded-full shadow-inner"></div>
                             <div className="absolute bottom-10 right-10 w-1 h-1 bg-black rounded-full shadow-inner"></div>
                         </div>
                     );
                 }
                 
                 return null;
               })}
               
               {/* Placeholder Content if no layers match simulated types */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="text-white/5 text-6xl font-bold rotate-45 select-none">PCB PREVIEW</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerberViewer;