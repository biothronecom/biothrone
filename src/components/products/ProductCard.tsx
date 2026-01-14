
"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { ProductDetailDialog } from "./ProductDetailDialog";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Confetti } from "../shared/Confetti";
import { ClientOnly } from "../shared/ClientOnly";
import { imageAssets } from "@/lib/image-assets";


interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    dispatch({ type: "ADD_ITEM", payload: product });
    toast({
      title: "Added to cart!",
      description: `"${product.name}" has been added to your cart.`,
    });

    if (product.id === '4') {
        setShowConfetti(true);
    }
  };

  const openDialog = () => setIsDialogOpen(true);

  // Create a list of 4 images for the carousel.
  // Start with the product's main image, then add others from the generic carousel.
  const productImages = [
      { src: product.image, alt: product.altText },
      ...imageAssets.carousel.slice(0, 3) 
  ].slice(0, 4); // Ensure it's exactly 4 images

  return (
    <>
      <ClientOnly>
        {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      </ClientOnly>
      <Card
        onClick={openDialog}
        className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group w-full"
        role="button"
        aria-label={`View details for ${product.name}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDialog()}
      >
        <CardHeader className="p-0 relative">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.altText}
              fill
              className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint="product image"
            />
             {product.savingsPercentage && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    Save {product.savingsPercentage}%
                </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle as="h3" className="font-headline text-2xl mb-2">{product.name}</CardTitle>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button onClick={handleAddToCart} className="w-full text-base py-6" aria-label={`Add ${product.name} to cart`}>
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
      <ProductDetailDialog 
        product={product} 
        images={productImages}
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
}
