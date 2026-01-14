
import type { Product } from './types';
import { imageAssets } from './image-assets';
import { pricing } from './pricing';

const originalBundlePrice = pricing.products['1'] + pricing.products['2'] + pricing.products['3'];
const bundleDiscount = 0.20; // 20%
const bundleFinalPrice = originalBundlePrice * (1 - bundleDiscount);
const savingsPercentage = Math.round(bundleDiscount * 100);

export const products: Product[] = [
  {
    id: '1',
    name: '50 ml To Go Pouch',
    price: pricing.products['1'],
    image: imageAssets.toGoPouch.src,
    altText: imageAssets.toGoPouch.alt,
    description: 'A convenient, travel-sized pouch of our powerful Bio-Throne™ gel. Perfect for keeping your toilet fresh on the go. Shake gently, apply to the bowl, wait a few minutes, then flush.',
    category: 'Bio-Throne™',
    features: ['Travel-Size', 'Easy to Use', 'Instant Freshness'],
  },
  {
    id: '2',
    name: '16 oz Spray Pouch',
    price: pricing.products['2'],
    image: imageAssets.sprayPouch.src,
    altText: imageAssets.sprayPouch.alt,
    description: 'Our standard 16 oz spray pouch is perfect for regular household use. The easy-to-use spray nozzle allows for even application. Shake, spray, wait, and flush for a sparkling, odor-free toilet.',
    category: 'Bio-Throne™',
    features: ['Spray Nozzle', 'Household Size', 'Long-Lasting'],
  },
  {
    id: '3',
    name: '32 oz Refill Large Pouch',
    price: pricing.products['3'],
    image: imageAssets.refillPouch.src,
    altText: imageAssets.refillPouch.alt,
    description: 'Stock up and save with our large 32 oz refill pouch. Perfect for refilling your smaller spray bottles, this eco-friendly option reduces waste and ensures you always have Bio-Throne™ on hand.',
    category: 'Bio-Throne™',
    features: ['Eco-Friendly', 'Value Size', 'Reduces Waste'],
  },
  {
    id: '4',
    name: 'Bio-Throne™ Bundle (Subscription)',
    price: bundleFinalPrice,
    originalPrice: originalBundlePrice,
    savingsPercentage: savingsPercentage,
    image: imageAssets.bundle.src,
    altText: imageAssets.bundle.alt,
    description: 'Save 20% and get FREE shipping with our complete Bio-Throne™ system. This bundle includes the 50ml To Go Pouch, the 16oz Spray Pouch, and the 32oz Refill Pouch, all delivered to you on a recurring subscription.',
    category: 'Deals',
    features: ['Complete System', 'Free Shipping', 'Subscription'],
  },
];

export const donationProduct: Product = {
  id: 'donation-ds',
  name: 'Donation for Down Syndrome Project',
  price: 3.00,
  image: 'https://placehold.co/100x100/a864fd/ffffff.png?text=❤️',
  altText: 'A heart icon symbolizing a donation',
  description: 'A $3.00 donation to support our Down Syndrome focus help project. Thank you for your generosity!',
  category: 'Donation',
  features: [],
}
