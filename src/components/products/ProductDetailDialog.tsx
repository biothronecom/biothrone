
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { Badge } from "../ui/badge";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, X, ArrowUpRight } from "lucide-react";
import { CarbonFootprintAnalysis } from "../carbon/CarbonFootprintAnalysis";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

interface ProductDetailDialogProps {
  product: Product;
  images: { src: string; alt: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function ProductDetailDialog({ product, children, open, onOpenChange, images }: ProductDetailDialogProps) {
  const { dispatch } = useCart();
  const [api, setApi] = React.useState<CarouselApi>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api || !open) {
      if(intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
        if (api.canScrollNext()) {
            api.scrollNext();
        } else {
            api.scrollTo(0);
        }
    }, 2000);

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [api, open]);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: product });
    toast({
      title: "Added to cart!",
      description: `"${product.name}" has been added to your cart.`,
    });
    onOpenChange(false); // Close dialog after adding to cart
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
         <div className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
           <div className="relative aspect-square md:aspect-auto">
              <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={image.src + index}>
                             <div className="relative w-full h-full aspect-square">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover md:rounded-l-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    data-ai-hint="product detail"
                                />
                             </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
               {product.savingsPercentage && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
                    Save {product.savingsPercentage}%
                </Badge>
            )}
            </div>
           <ScrollArea className="flex-grow">
            <div className="p-6 flex flex-col h-full">
                <DialogHeader>
                  <DialogTitle className="font-headline text-3xl mb-2">{product.name}</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-base">
                    {product.description}
                  </DialogDescription>
                </DialogHeader>
                 <div className="my-4 flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                    <p className="text-xl text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                    </p>
                    )}
                </div>
                 {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-4">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                )}

                <Link
                  href={siteConfig.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 my-4"
                >
                  Learn more on our blog <ArrowUpRight className="h-4 w-4" />
                </Link>

                <div className="flex-grow mb-4">
                    <CarbonFootprintAnalysis productDescription={product.description} />
                </div>
                <Button onClick={handleAddToCart} size="lg" className="mt-auto w-full" aria-label={`Add ${product.name} to cart`}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </div>
           </ScrollArea>
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    