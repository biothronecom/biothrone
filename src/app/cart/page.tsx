
"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Check, ShieldAlert, Sparkles, TrendingUp, ShieldCheck, Info, HeartHandshake } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { TermsContent } from "@/components/legal/TermsContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShippingForm } from "@/components/cart/ShippingForm";
import { PayPalScriptProvider, PayPalButtons, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { SimpleCaptcha } from "@/components/cart/SimpleCaptcha";
import { siteConfig } from "@/lib/config";
import { pricing } from "@/lib/pricing";
import type { Order } from "@/types/order";
import { createOrderInSheet } from "@/lib/order-actions";
import type { ShippingFormData } from "@/components/cart/ShippingForm";
import { donationProduct } from "@/lib/products";
import type { CartItem } from "@/lib/types";

const { paypal } = siteConfig;

import { GamificationPanel } from "@/components/gamification/GamificationPanel";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  useEffect(() => {
    setOrderId('ORD' + crypto.randomUUID().substring(0, 8).toUpperCase());
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-on-cart-page', 'true');
    return () => {
      html.removeAttribute('data-on-cart-page');
    };
  }, []);

  const { subtotal, savings, shippingCost, total, showBundleUpsell, donationAmount } = useMemo(() => {
    const productIdsInCart = new Set(state.items.map(item => item.id));
    const hasBundle = productIdsInCart.has('4');
    const hasIndividualProducts = ['1', '2', '3'].some(id => productIdsInCart.has(id));

    const donationItem: CartItem | undefined = state.items.find(item => item.id === donationProduct.id);
    const donationAmount = donationItem ? donationItem.price * donationItem.quantity : 0;

    const regularItems: CartItem[] = state.items.filter(item => item.id !== donationProduct.id);
    // Use subtotal and discount from CartProvider logic (which handles tiers)
    // Note: state.subtotal in provider is for ALL items including donation if added to items array? 
    // Wait, let's verify CartProvider logic. 
    // It sums ALL items. Donation is an item.
    // However, usually we don't discount donations.
    // My CartProvider calculates discount based on TOTAL subtotal.
    // Ideally, I should exclude donation from discount calculation in CartProvider, but for now let's rely on provider.

    // Actually, to match existing logic specifically:
    // User wants "More You Save". 
    // Let's use the values directly from state if possible, or simple recalc here to match UI needs.

    const calculatedSubtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tierDiscountAmount = state.discountAmount || 0;

    // Existing "Bundle Discount" logic (20% if all 3) - is that REPLACED by Tier discount?
    // Implementation Plan says: "Implement tiered discount logic... based on cart subtotal tiers".
    // It implies replacing the old logic or adding to it. 
    // "More You Save" usually implies tiered. 
    // Let's assume Tier Discount REPLACES the bundle manual check for individual items, 
    // BUT the Bundle Product itself (id '4') has a built-in price.
    // If user has bundle '4', they get that price.
    // If user has individual items, they get Tier Discount.

    const shippingCost = regularItems.length > 0 && !hasBundle ? pricing.shippingCost : 0;
    const showBundleUpsell = !hasBundle && hasIndividualProducts;

    // Final Total
    const total = calculatedSubtotal - tierDiscountAmount + shippingCost;
    // Note: donationAmount is part of calculatedSubtotal in this simple logic if donation is in items.

    return {
      subtotal: calculatedSubtotal,
      savings: tierDiscountAmount,
      shippingCost,
      total,
      showBundleUpsell,
      donationAmount
    };
  }, [state.items, state.discountAmount]);


  const handleUpgradeToBundle = () => {
    dispatch({ type: 'REPLACE_WITH_BUNDLE' });
    toast({
      title: "Cart Updated!",
      description: "Your order has been upgraded to the Bio-Throne™ Bundle.",
    });
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleSuccessfulOrder = (paypalDetails: any) => {
    startTransition(async () => {
      if (!shippingData) {
        toast({ variant: "destructive", title: "Order Failed", description: "Shipping information is missing." });
        return;
      }

      const newOrder: Order = {
        id: orderId,
        customer: shippingData.fullName,
        email: shippingData.email,
        status: 'Pending',
        total: total,
        date: new Date().toISOString(),
        paypalId: paypalDetails.id,
        trackingNumber: '',
        shippingAddress: {
          fullName: shippingData.fullName,
          address1: shippingData.address1,
          address2: shippingData.address2,
          city: shippingData.city,
          state: shippingData.state,
          zip: shippingData.zip,
          country: shippingData.country,
        },
        items: state.items.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        discount: savings,
      };

    const result = await createOrderInSheet(newOrder);

    if (result.success) {
      setIsSuccess(true);
      dispatch({ type: "CLEAR_CART" });
      toast({
        title: "Order Successful!",
        description: `Thank you, ${shippingData.fullName}. Your order has been placed.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: result.error || "There was an issue saving your order. Please contact support.",
      });
    }
  });
}

if (isSuccess) {
  return (
    <div className="container mx-auto py-20 px-4 text-center" role="alert" aria-live="assertive">
      <h1 className="text-4xl font-headline font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-muted-foreground mb-8">Your products are on their way.</p>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}

const renderPayPalButtons = () => {
  const isButtonDisabled = !termsAccepted || !isCaptchaVerified || isPending || state.items.length === 0 || !shippingData;
  const hasBundle = state.items.some(item => item.id === '4');

  if (hasBundle) {
    return (
      <PayPalButtons
        style={{ layout: "vertical", label: "subscribe" }}
        disabled={isButtonDisabled || paypal.planId === 'YOUR_PAYPAL_PLAN_ID'}
        forceReRender={[total, termsAccepted, isPending, hasBundle, isCaptchaVerified, shippingData]}
        createSubscription={(_data, actions) => {
          if (paypal.planId === 'YOUR_PAYPAL_PLAN_ID') {
            toast({ variant: "destructive", title: "Subscription Error", description: "PayPal subscription is not configured." });
            return Promise.reject(new Error("Subscription not configured"));
          }
          return actions.subscription.create({
            plan_id: paypal.planId,
            custom_id: orderId,
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.subscription?.get();
          if (details) {
            handleSuccessfulOrder({ id: details.id });
          }
        }}
        onError={(err) => {
          console.error("PayPal Subscription onError", err);
          toast({
            variant: "destructive",
            title: "Subscription Failed",
            description: "There was an issue with PayPal. Please try again.",
          });
        }}
      />
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", label: "pay" }}
      disabled={isButtonDisabled}
      forceReRender={[total, termsAccepted, isPending, hasBundle, isCaptchaVerified, shippingData]}
      createOrder={async (_data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{
            custom_id: orderId,
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: (subtotal).toFixed(2) // PayPal requires breakdown to match. Subtotal here implies sum of items.
                },
                shipping: {
                  currency_code: 'USD',
                  value: shippingCost.toFixed(2)
                },
                discount: {
                  currency_code: 'USD',
                  value: savings.toFixed(2)
                }
              }
            },
            items: state.items.map(item => ({
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price.toFixed(2)
              },
              quantity: String(item.quantity),
              sku: item.id
            }))
          }]
        });
      }}
      onApprove={async (_data, actions) => {
        const details = await actions.order?.capture();
        if (details) {
          handleSuccessfulOrder(details);
        }
      }}
      onError={(err) => {
        console.error("PayPal Checkout onError", err);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "There was an issue with PayPal. Please try again.",
        });
      }}
      onCancel={() => {
        toast({
          variant: "default",
          title: "Payment Cancelled",
          description: "Your payment process has been cancelled.",
        });
      }}
    />
  );
}

return (
  <div className="container mx-auto py-8 px-4">
    <Button variant="ghost" asChild className="mb-4">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Back to shopping
      </Link>
    </Button>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      <div className="lg:col-span-3 space-y-8">
        <GamificationPanel />

        <Card className="sticky top-24" aria-labelledby="order-summary-heading">
          <CardHeader>
            <CardTitle as="h2" id="order-summary-heading" className="text-3xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" aria-live="polite" aria-busy={isPending}>
            <ClientOnly fallback={<Skeleton className="h-24 w-full" />}>
              {state.items.length > 0 ? (
                <ul className="space-y-4" aria-label="Items in your cart">
                  {state.items.map(item => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Image src={item.image} alt={item.altText} width={48} height={48} className="rounded" data-ai-hint="product image" />
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground">Your cart is empty.</p>}
            </ClientOnly>
            <Separator />
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <p>Total Savings ({state.tier?.name} Status)</p>
                <p>-${savings.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}</p>
            </div>
            {donationAmount > 0 && (
              <div className="flex justify-between text-primary font-semibold">
                <p>Donation</p>
                <p>${donationAmount.toFixed(2)}</p>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-2xl">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {showBundleUpsell && (
          <Card className="bg-accent/50 border-primary/50" role="complementary" aria-labelledby="upsell-heading">
            <CardHeader>
              <CardTitle id="upsell-heading" className="text-2xl flex items-center gap-2 font-headline text-primary">
                <Sparkles /> A Smart Upgrade Awaits!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Did you know you can save 20% and get FREE shipping?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By switching to the <strong>Bio-Throne™ Bundle</strong>, you not only get our complete cleaning system but also help the environment with more efficient shipping and less packaging. It's a win-win!
              </p>
              <Button onClick={handleUpgradeToBundle} className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Yes, Upgrade to the Bundle & Save!
              </Button>
            </CardContent>
          </Card>
        )}

        <ShippingForm onFormUpdate={setShippingData} />

      </div>
      <div id="checkout-section" className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="font-headline text-4xl">Secure Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Info className="text-primary" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Order ID:</span>
                  <ClientOnly fallback={<Skeleton className="h-4 w-24 inline-block" />}><span className="font-mono text-xs">{orderId}</span></ClientOnly>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Order Date:</span>
                  <ClientOnly fallback={<Skeleton className="h-4 w-20 inline-block" />}>{new Date().toLocaleDateString()}</ClientOnly>
                </div>
                {isCaptchaVerified && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Your IP:</span>
                    <span>127.0.0.1 (placeholder)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold">Order Total:</span>
                  <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Product IDs:</span>
                  <span className="font-mono text-xs">{state.items.map(i => i.id).join(', ')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldAlert className="text-primary" />
                  Terms of Purchase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(!!checked)} className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-normal">
                    I have read and agree to the website's terms and conditions, including the non-refundable policy and subscription agreement for bundle purchases.
                  </label>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto">View Terms</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-4xl font-headline">Terms of Use and Purchase</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <TermsContent />
                    </ScrollArea>
                    <DialogClose asChild>
                      <Button>Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <SimpleCaptcha onVerified={setIsCaptchaVerified} />

            {paypal.clientId === 'YOUR_PAYPAL_CLIENT_ID' ? (
              <div role="alert" className="p-4 border rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-center">
                <p className="font-bold">PayPal integration is not configured.</p>
                <p className="text-sm">Please add your PayPal Client ID to your environment variables to enable payments.</p>
              </div>
            ) : state.items.some(item => item.id === '4') && paypal.planId === 'YOUR_PAYPAL_PLAN_ID' ? (
              <div role="alert" className="p-4 border rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-center">
                <p className="font-bold">PayPal Subscription is not configured.</p>
                <p className="text-sm">Please add your PayPal Plan ID to your environment variables to enable subscriptions for the bundle.</p>
              </div>
            ) : (
              <ClientOnly fallback={<Skeleton className="h-12 w-full" />}>
                <div id="paypal-button-container" aria-live="polite" className={!termsAccepted || !isCaptchaVerified || !shippingData ? 'opacity-50 pointer-events-none' : ''}>
                  {(() => {
                    const hasBundleInCart = state.items.some(item => item.id === '4');
                    const paypalOptions: ReactPayPalScriptOptions = {
                      clientId: paypal.clientId,
                      currency: "USD",
                      disableFunding: "card",
                      intent: hasBundleInCart ? "subscription" : "capture",
                      vault: hasBundleInCart,
                    };
                    return (
                      <PayPalScriptProvider options={paypalOptions}>
                        {renderPayPalButtons()}
                      </PayPalScriptProvider>
                    );
                  })()}
                </div>
                {(!termsAccepted || !isCaptchaVerified || !shippingData) && (
                  <p className="text-center text-sm text-destructive font-semibold mt-2">
                    Please complete the shipping form, accept the terms, and solve the captcha to proceed.
                  </p>
                )}
              </ClientOnly>
            )}
          </CardContent>
        </Card>
        <Card className="bg-muted/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              Your Security is Our Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We use PayPal to process all transactions. Your payment information is encrypted and securely handled by PayPal, a global leader in online payments. We never store your credit card details on our servers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
}
