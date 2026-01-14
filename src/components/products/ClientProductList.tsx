
"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

export default function ClientProductList({ products }: ProductListProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
