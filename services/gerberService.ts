
import JSZip from 'jszip';
import { LayerFile, BoardSpecs } from '../types';

const guessLayerType = (filename: string): LayerFile['type'] => {
  const lower = filename.toLowerCase();
  if (/\.(gtl|cmp|top|l1)$/.test(lower)) return 'top-copper';
  if (/\.(gbl|sol|bot|l2)$/.test(lower)) return 'bottom-copper';
  if (/\.(gts|stc|smt)$/.test(lower)) return 'top-soldermask';
  if (/\.(gbs|sts|smb)$/.test(lower)) return 'bottom-soldermask';
  if (/\.(gto|plc|sst)$/.test(lower)) return 'top-silkscreen';
  if (/\.(gbo|pls|ssb)$/.test(lower)) return 'bottom-silkscreen';
  if (/\.(gko|gm[0-9]|out|profile)$/.test(lower)) return 'outline';
  if (/\.(drl|txt|xln|drd)$/.test(lower)) return 'drill';
  return 'unknown';
};

const parseCoordinates = (content: string): { minX: number, maxX: number, minY: number, maxY: number, found: boolean } => {
  const coordRegex = /X([0-9-]+)Y([0-9-]+)/g;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let found = false;
  
  let match;
  while ((match = coordRegex.exec(content)) !== null) {
      found = true;
      let x = parseInt(match[1]);
      let y = parseInt(match[2]);
      
      // Heuristic: Normalize excessive integer scaling (e.g. 2.4 format vs 3.3 format)
      // Assuming basic metric (mm) or imperial conversion happens later.
      // For this estimation, if > 100000, assume 1/100000 or similar. 
      // Keeping raw relative diff is enough for now.
      
      if (!isNaN(x)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
      if (!isNaN(y)) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  }
  return { minX, maxX, minY, maxY, found };
};

const parseDrillFile = (content: string) => {
  // Simple parser to count tool hits
  // T01C0.300 -> Tool definition
  // X...Y... -> Hit
  
  let vias = 0;
  let holes = 0;
  
  const lines = content.split('\n');
  let currentToolSize = 0;
  
  // Regex for standard Excellon tool def: T01C0.5 or T1C0.020
  const toolDefRegex = /T(\d+)C([0-9.]+)/;
  const toolSelectRegex = /T(\d+)(?!C)/; // Select tool T01
  const hitRegex = /X[0-9-]+Y[0-9-]+/;

  const tools: Record<string, number> = {}; // Tool Code -> Size
  let activeTool = "";

  for (const line of lines) {
      const defMatch = toolDefRegex.exec(line);
      if (defMatch) {
          tools[defMatch[1]] = parseFloat(defMatch[2]);
      }
      
      const selMatch = toolSelectRegex.exec(line);
      if (selMatch) {
          activeTool = selMatch[1];
          currentToolSize = tools[activeTool] || 0;
      }
      
      if (hitRegex.test(line)) {
          // If size < 0.5mm (approx 20mil), consider it a via.
          // Note: Unit detection (Inch vs MM) matters here. 
          // Assuming MM if val < 10, assuming Inch if val < 0.5
          // Heuristic: if val > 1, it's small mm. If val < 0.1 it's small inch.
          
          const isLikelyVia = currentToolSize > 0 && currentToolSize <= 0.5; 
          
          if (isLikelyVia) vias++;
          else holes++;
      }
  }
  
  // Fallback if no tools defined (just count generic hits)
  if (vias === 0 && holes === 0) {
      const hits = (content.match(/X[0-9-]+Y[0-9-]+/g) || []).length;
      holes = hits;
  }

  return { vias, holes };
};

export const processZipFile = async (file: File): Promise<{ layers: LayerFile[], estimatedSpecs: Partial<BoardSpecs> }> => {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(file);
  const layers: LayerFile[] = [];
  let outlineContent: string | null = null;
  let layerCount = 0;
  let totalVias = 0;
  let totalHoles = 0;

  for (const relativePath of Object.keys(unzipped.files)) {
    const zipEntry = unzipped.files[relativePath];
    if (zipEntry.dir || relativePath.startsWith('__MACOSX')) continue;

    const content = await zipEntry.async('text');
    const type = guessLayerType(relativePath);

    if (type !== 'unknown') {
      layers.push({
        filename: relativePath,
        type,
        content,
        size: content.length // Approximation for text files
      });
      
      if (type === 'outline') outlineContent = content;
      if (type.includes('copper')) layerCount++;
      
      if (type === 'drill') {
          const { vias, holes } = parseDrillFile(content);
          totalVias += vias;
          totalHoles += holes;
      }
    }
  }

  const estimatedSpecs: Partial<BoardSpecs> = {};
  
  // Layers
  estimatedSpecs.layers = Math.max(1, Math.min(layerCount, 12)) as BoardSpecs['layers'];
  if (estimatedSpecs.layers > 1 && estimatedSpecs.layers % 2 !== 0) estimatedSpecs.layers = (estimatedSpecs.layers + 1) as any;

  // Dimensions
  if (outlineContent) {
    const { minX, maxX, minY, maxY, found } = parseCoordinates(outlineContent as string);
    if (found) {
        let width = maxX - minX;
        let height = maxY - minY;
        
        // Coordinate scaler heuristic
        if (width > 10000) width /= 1000; // 3.3 metric assumed
        if (height > 10000) height /= 1000;

        // If still huge, maybe 2.4 imperial
        if (width > 1000) width /= 10; 
        if (height > 1000) height /= 10;
        
        // Ensure sensible bounds
        if (width < 5) width = 100; // Fallback
        if (height < 5) height = 100;

        estimatedSpecs.dimensions = { x: Math.round(width), y: Math.round(height) };
    }
  }

  estimatedSpecs.detectedVias = totalVias;
  estimatedSpecs.detectedHoles = totalHoles;

  return { layers, estimatedSpecs };
};