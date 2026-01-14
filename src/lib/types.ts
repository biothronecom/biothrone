export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  savingsPercentage?: number;
  image: string;
  altText: string;
  description: string;
  category: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
