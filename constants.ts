
import { BoardSpecs } from './types';

// Now managed via ConfigContext, but kept for initial state reference if needed.
export const DEFAULT_SPECS: BoardSpecs = {
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
  stencil: {
    enabled: false,
    side: 'Top',
    framework: 'Frameless',
    size: '370x470mm',
    counts: 1,
    material: 'Stainless Steel'
  },
  detectedVias: 0,
  detectedHoles: 0
};

export const LAYER_OPTIONS = [1, 2, 4, 6, 8, 10, 12];
export const QTY_OPTIONS = [5, 10, 25, 50, 100, 500, 1000];
export const THICKNESS_OPTIONS = [0.4, 0.6, 0.8, 1.0, 1.2, 1.6, 2.0];
export const COLOR_OPTIONS = ['Green', 'Red', 'Yellow', 'Blue', 'White', 'Matte Black'];
