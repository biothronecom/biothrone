
"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, HeartHandshake } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { pricing } from "@/lib/pricing";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { donationProduct, products } from "@/lib/products";
import { toast } from "@/hooks/use-toast";

export function CartSheet() {
  const { state, dispatch } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const productIdsInCart = new Set(state.items.map(item => item.id));
  const hasBundle = productIdsInCart.has('4');
  const hasAllThreeProductsForDiscount = ['1', '2', '3'].every(id => productIdsInCart.has(id));
  const hasDonation = productIdsInCart.has(donationProduct.id);

  const regularItems = state.items.filter(item => item.id !== donationProduct.id);
  const donationAmount = hasDonation ? donationProduct.price : 0;
  
  const subtotal = regularItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let savings = 0;
  if (hasAllThreeProductsForDiscount && !hasBundle) {
      const nonBundleItems = regularItems.filter(item => ['1', '2', '3'].includes(item.id));
      const nonBundleTotal = nonBundleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      savings = nonBundleTotal * 0.20;
  }
  
  const shippingCost = regularItems.length > 0 && !hasBundle ? pricing.shippingCost : 0;
  const total = subtotal - savings + shippingCost + donationAmount;

  const handleAddDonation = () => {
    dispatch({ type: "ADD_ITEM", payload: donationProduct });
     toast({
      title: "Thank You!",
      description: `A $3.00 donation has been added to your cart.`,
    });
  }

  const handleRemoveDonation = () => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: donationProduct.id } });
  }

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.setAttribute('data-cart-open', 'true');
    } else {
      html.removeAttribute('data-cart-open');
    }

    return () => {
      html.removeAttribute('data-cart-open');
    };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary/80" aria-label={`Open cart (${itemCount} items)`}>
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white" aria-hidden="true">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
          <SheetDescription>
            A summary of the products in your shopping cart.
          </SheetDescription>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4">
              <div className="pr-6 space-y-4">
                <ul className="flex flex-col gap-4" aria-label="Items in your cart">
                  {state.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-4">
                      <Image
                        src={item.image}
                        alt={item.altText}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint="product image"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.id !== donationProduct.id && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => {
                                if (item.quantity > 1) {
                                    dispatch({ type: "DECREMENT_ITEM", payload: { id: item.id } })
                                } else {
                                    dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })
                                }
                              }}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </Button>
                            <span className="w-6 text-center" aria-live="polite">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => dispatch({ type: "ADD_ITEM", payload: item })}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground h-8 w-8 mt-1"
                            onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {regularItems.length > 0 && (
                   <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                          <CardTitle className="text-base flex items-center gap-2">
                            <HeartHandshake className="text-primary" />
                            Support Our Mission
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                          <p className="text-sm text-muted-foreground">Help our Down Syndrome focus project with a small $3.00 donation.</p>
                          {hasDonation ? (
                              <div className="flex items-center justify-between text-sm text-primary font-semibold">
                                  <p>Thank you for donating!</p>
                                  <Button variant="link" size="sm" onClick={handleRemoveDonation} className="h-auto p-0 text-destructive">Remove</Button>
                              </div>
                          ) : (
                              <Button onClick={handleAddDonation} className="w-full" variant="outline">
                                  Add $3.00 Donation
                              </Button>
                          )}
                      </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                     <div className="flex justify-between font-semibold text-green-600">
                        <span>Bundle Savings</span>
                        <span>-${savings.toFixed(2)}</span>
                    </div>
                )}
                 <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}</span>
                </div>
                {hasDonation && (
                    <div className="flex justify-between font-semibold text-primary">
                        <span>Donation</span>
                        <span>${donationAmount.toFixed(2)}</span>
                    </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/cart">Proceed to Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow" aria-live="polite">
            <ShoppingCart className="h-24 w-24 text-muted-foreground/30" aria-hidden="true" />
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
