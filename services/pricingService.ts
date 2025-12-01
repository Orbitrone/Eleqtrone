
import { BoardSpecs, PriceBreakdown, SiteConfig } from '../types';

export const calculatePrice = (specs: BoardSpecs, config: SiteConfig, paymentMethod: 'credit_card' | 'bank_transfer' = 'credit_card'): PriceBreakdown => {
  const rules = config.pricingRules;
  const getRuleVal = (id: string) => rules.find(r => r.id === id)?.value || 0;

  let basePrice = 0;
  let engineeringFee = getRuleVal('eng_fee');
  let boardFee = 0;
  let specialProcessFee = 0;
  
  const areaSqMm = specs.dimensions.x * specs.dimensions.y;
  const isSmallBoard = specs.dimensions.x <= 100 && specs.dimensions.y <= 100;

  // 1. Base Price (Layers)
  if (specs.layers <= 2) {
    basePrice = (isSmallBoard && specs.qty <= 10) ? getRuleVal('base_2layer') : getRuleVal('base_2layer') * 1.5;
  } else {
    basePrice = getRuleVal('base_4layer') + ((specs.layers - 4) * 250);
    engineeringFee *= (1 + (specs.layers * 0.15));
  }

  // 2. Material & Thickness
  let materialMultiplier = 1;
  if (specs.baseMaterial === 'Rogers') {
      materialMultiplier = 3.5;
      specialProcessFee += 500;
  } else if (specs.baseMaterial === 'Aluminum') {
      materialMultiplier = 1.8;
  }

  if (specs.fr4Tg === 'Tg170-180') {
      materialMultiplier += 0.2;
  }

  // 3. Board Fee Calculation
  const areaCostPerMm2 = 0.002 * (specs.layers / 2) * materialMultiplier;
  boardFee = (areaSqMm * specs.qty * areaCostPerMm2);

  // 4. Finish & Adders
  let finishFee = 0;
  if (specs.surfaceFinish === 'LeadFreeHASL') finishFee = getRuleVal('finish_lf_hasl');
  if (specs.surfaceFinish === 'ENIG') finishFee = getRuleVal('finish_enig');
  if (specs.surfaceFinish === 'ImmersionSilver') finishFee = getRuleVal('finish_silver');
  
  let colorFee = 0;
  if (specs.color === 'Matte Black' || specs.color === 'Purple') colorFee = 250;

  // 5. Advanced Specs Fees
  if (specs.goldFingers) specialProcessFee += 300;
  if (specs.impedanceControl) {
      specialProcessFee += 200; // Impedance test fee
      engineeringFee += 100; 
  }
  if (specs.viaProcess === 'Plugged Vias') specialProcessFee += 150;
  if (specs.viaProcess === 'Filled & Capped') specialProcessFee += 400;
  
  // Min Track/Hole penalties
  if (specs.minTrackSpacing === '0.09mm(3.5mil)') specialProcessFee += 200;
  if (specs.minTrackSpacing === '0.075mm(3mil)') specialProcessFee += 500;
  if (specs.minHoleSize === '0.2mm') specialProcessFee += 150;
  if (specs.minHoleSize === '0.15mm') specialProcessFee += 400;

  if (specs.copperWeight === '2oz') boardFee *= 1.4;

  // 6. Stencil Fee
  let stencilFee = 0;
  if (specs.stencil.enabled) {
      // Base Stencil Price
      stencilFee = getRuleVal('stencil_base');
      
      // Framework
      if (specs.stencil.framework === 'Framed') {
          stencilFee += getRuleVal('stencil_frame');
      }
      
      // Side (Both sides = more expensive)
      if (specs.stencil.side === 'Both') {
          stencilFee *= 1.5;
      }
      
      // Material Cost Factors (Multipliers)
      if (specs.stencil.material === 'Electropolished Steel') {
          stencilFee *= getRuleVal('stencil_mult_electro');
      } else if (specs.stencil.material === 'Nickel') {
          stencilFee *= getRuleVal('stencil_mult_nickel');
      } else if (specs.stencil.material === 'Plastic') {
          stencilFee *= getRuleVal('stencil_mult_plastic');
      }
      // Stainless Steel is base (x1)

      if (specs.stencil.counts > 1) {
          stencilFee *= specs.stencil.counts;
      }
  }

  // 7. Shipping
  const volumeCm3 = (specs.dimensions.x / 10) * (specs.dimensions.y / 10) * (specs.thickness / 10);
  const weightKgPerBoard = (volumeCm3 * 2.0) / 1000; // Density approx
  const totalWeight = weightKgPerBoard * specs.qty;
  const shippingFee = getRuleVal('shipping_base') + (Math.max(0, totalWeight - 0.5) * getRuleVal('shipping_per_kg'));

  const drillCost = (specs.detectedHoles * 0.05) + (specs.detectedVias * 0.02); 

  let subTotal = basePrice + engineeringFee + boardFee + finishFee + colorFee + shippingFee + drillCost + stencilFee + specialProcessFee;

  // 8. Discounts
  let discountAmount = 0;
  if (paymentMethod === 'bank_transfer') {
    discountAmount = subTotal * 0.10;
  }

  const details = [
    { label: 'Baz Fiyat', amount: basePrice },
    { label: 'Mühendislik', amount: engineeringFee },
    { label: 'PCB Malzeme', amount: boardFee },
    { label: 'Bitiş/Renk', amount: finishFee + colorFee },
    { label: 'Özel İşlemler', amount: specialProcessFee },
    { label: 'Delik/Via', amount: drillCost },
    { label: 'Kargo', amount: shippingFee }
  ];
  
  if (stencilFee > 0) details.push({ label: 'Elek (Stencil)', amount: stencilFee });
  if (discountAmount > 0) details.push({ label: 'Havale İndirimi (%10)', amount: -discountAmount });

  return {
    basePrice,
    engineeringFee,
    boardFee,
    finishFee,
    testFee: specs.flyingProbe ? 0 : 50,
    shippingFee,
    stencilFee,
    specialProcessFee,
    weight: totalWeight,
    total: parseFloat((subTotal - discountAmount).toFixed(2)),
    details
  };
};
