
export const pricing = {
  products: {
    '1': 4.99,  // 50 ml To Go Pouch
    '2': 14.99, // 16 oz Spray Pouch
    '3': 24.99, // 32 oz Refill Large Pouch
    // The bundle price ('4') will be calculated dynamically in products.ts
  },
  shippingCost: 8.95,
  tiers: [
    { name: 'Bronze', minSpend: 0, discountPercent: 0, color: 'text-amber-700' },
    { name: 'Silver', minSpend: 50, discountPercent: 0.05, color: 'text-slate-400' },
    { name: 'Gold', minSpend: 100, discountPercent: 0.10, color: 'text-yellow-500' },
  ]
};

export const calculateTierDiscount = (subtotal: number) => {
  // Find the highest applicable tier
  const applicableTier = [...pricing.tiers].reverse().find(tier => subtotal >= tier.minSpend);
  return applicableTier ? applicableTier.discountPercent : 0;
};

export const calculateNextTier = (subtotal: number) => {
  return pricing.tiers.find(tier => subtotal < tier.minSpend);
};

export const calculatePoints = (subtotal: number) => {
  // 1 point per $1 spent
  return Math.floor(subtotal);
};
