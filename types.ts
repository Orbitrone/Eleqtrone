
export interface BoardSpecs {
  dimensions: { x: number; y: number };
  layers: 1 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20;
  qty: number;
  // Base Material
  baseMaterial: 'FR-4' | 'Rogers' | 'Aluminum' | 'Copper Core';
  fr4Tg: 'Tg130-140' | 'Tg150-160' | 'Tg170-180';
  // PCB Specs
  thickness: 0.4 | 0.6 | 0.8 | 1.0 | 1.2 | 1.6 | 2.0 | 2.4 | 3.0;
  minTrackSpacing: '0.127mm(5mil)' | '0.1mm(4mil)' | '0.09mm(3.5mil)' | '0.075mm(3mil)';
  minHoleSize: '0.3mm' | '0.25mm' | '0.2mm' | '0.15mm';
  // Color & Finish
  color: 'Green' | 'Red' | 'Yellow' | 'Blue' | 'White' | 'Matte Black' | 'Purple';
  silkscreen: 'White' | 'Black' | 'None';
  surfaceFinish: 'HASL' | 'LeadFreeHASL' | 'ENIG' | 'OSP' | 'ImmersionSilver' | 'ImmersionTin';
  copperWeight: '1oz' | '2oz';
  // Advanced
  goldFingers: boolean;
  flyingProbe: boolean;
  castellatedHoles: boolean;
  impedanceControl: boolean;
  viaProcess: 'Tenting Vias' | 'Plugged Vias' | 'Filled & Capped';
  // Personalization
  removeOrderNumber: boolean;
  confirmProductionFile: boolean;
  // Stencil
  stencil: {
    enabled: boolean;
    side: 'Top' | 'Bottom' | 'Both';
    framework: 'Framed' | 'Frameless';
    size: string;
    counts: number;
    material: 'Stainless Steel' | 'Electropolished Steel' | 'Nickel' | 'Plastic';
  };
  detectedVias: number;
  detectedHoles: number;
}

export interface PriceRule {
  id: string;
  name: string;
  value: number;
  type: 'base' | 'multiplier' | 'fixed' | 'per_unit';
  category: 'layer' | 'finish' | 'color' | 'shipping' | 'stencil' | 'other';
}

// --- CMS TYPES ---

export interface SectionButton {
  label: string;
  link: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface FeatureItem {
  icon: string; // Lucide icon name (e.g., 'Zap', 'Shield')
  title: string;
  desc: string;
}

export type SectionType = 'hero' | 'text-image' | 'features' | 'cta' | 'plain';

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  content?: string; // HTML/Text
  image?: string;
  align?: 'left' | 'right'; // For text-image
  background?: 'white' | 'gray' | 'dark' | 'blue';
  buttons?: SectionButton[];
  items?: FeatureItem[]; // For feature grids
}

export interface PageContent {
  title: string;
  sections: PageSection[];
  isDynamic?: boolean; // Created by admin
}

export interface MenuItem {
    id: string;
    label: string;
    link: string;
}

export interface MenuConfig {
    main: MenuItem[];
    footerServices: MenuItem[];
}

export interface CarouselSlide {
  id: number;
  title: string;
  desc: string;
  bg: string; // Tailwind class
  image: string;
  btnText: string;
  btnLink: string;
  tag: string;
}

export interface SiteConfig {
  siteName: string;
  currency: string;
  currencySymbol: string;
  pricingRules: PriceRule[];
  bannerText: string;
  pages: Record<string, PageContent>;
  menus: MenuConfig; // Dynamic menus
  slides: CarouselSlide[];
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  created: string;
  lastUsed: string;
}

export interface PriceBreakdown {
  basePrice: number;
  engineeringFee: number;
  boardFee: number;
  finishFee: number;
  testFee: number;
  shippingFee: number;
  stencilFee: number;
  specialProcessFee: number; // New for advanced options
  weight: number; // in kg
  total: number;
  details: { label: string; amount: number }[];
}

export interface LayerFile {
  filename: string;
  type: 'top-copper' | 'bottom-copper' | 'top-soldermask' | 'bottom-soldermask' | 'top-silkscreen' | 'bottom-silkscreen' | 'outline' | 'drill' | 'unknown';
  content: string | ArrayBuffer;
  size: number; // in bytes
}

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  city: string;
  country: string;
  phone: string;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  expiry: string;
  holder: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'payment' | 'refund' | 'bonus';
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Answered' | 'Closed';
  lastUpdate: string;
  messages: { sender: 'user' | 'support'; text: string; time: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface User {
  username: string;
  role: 'admin' | 'user';
  token: string;
  email?: string;
  phone?: string;
  company?: string;
  addresses?: Address[];
  walletBalance?: number;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes (1GB = 1073741824)
}

export interface OrderItem {
  name: string;
  specs: string;
  qty: number;
  price: number;
}

export interface OrderStep {
  id: number;
  label: string;
  completed: boolean;
  date?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Production' | 'QualityCheck' | 'Shipped' | 'Delivered';
  total: number;
  paymentMethod: 'credit_card' | 'bank_transfer';
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  steps: OrderStep[]; // Detailed production steps
}

export interface UserFile {
  id: string;
  name: string;
  uploadDate: string;
  size: number; // in bytes
  type: 'gerber' | 'stl' | 'obj' | 'dxf' | 'step' | 'other';
  previewUrl?: string;
}
