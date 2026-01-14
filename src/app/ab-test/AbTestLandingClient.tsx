"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, ShoppingBag, BadgePercent, Leaf, ShieldCheck, Zap, X, CreditCard } from "lucide-react";

const products = [
  {
    name: "Product 1",
    price: 10,
    description: "High-quality everyday essential built for reliability.",
    features: ["All-day comfort materials", "2-year warranty", "Ships in 2 business days"],
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='400' height='260' fill='%230f172a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='24'>Product 1</text></svg>",
  },
  {
    name: "Product 2",
    price: 20,
    description: "Advanced features and superior performance for pros.",
    features: ["Pro-grade durability", "Priority support", "Flexible add-ons"],
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='400' height='260' fill='%23312e81'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='24'>Product 2</text></svg>",
  },
  {
    name: "Product 3",
    price: 30,
    description: "Versatile and user-friendly for a range of situations.",
    features: ["Ready out-of-box", "USB-C fast charge", "30-day returns"],
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='400' height='260' fill='%234c1d95'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='24'>Product 3</text></svg>",
  },
];

const bundle = {
  name: "Special Bundle Offer",
  price: 45,
  savings: 15,
  image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='400' height='260' fill='%2310b981'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='24'>Bundle</text></svg>",
};

export default function AbTestLandingClient() {
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="space-y-12 py-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary">Premier Deals</h1>
        <p className="text-muted-foreground max-w-2xl">
          Limited time bundles, secure checkout, and clear pricing. A focused landing built for conversion.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" onClick={() => setIsBundleOpen(true)}>
            <BadgePercent className="mr-2 h-4 w-4" /> Explore Bundle Savings
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cart">
              <ShoppingBag className="mr-2 h-4 w-4" /> Go to Checkout
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={() => setIsPayNowOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" /> Pay Now
          </Button>
        </div>
        <div className="text-sm text-muted-foreground bg-primary/10 px-4 py-2 rounded-full">
          Special Offer: Save 15% on your first purchase!
        </div>
      </header>

      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-card">
          <video
            className="w-full h-full"
            poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%23111827'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='32'>Product Demo</text></svg>"
            controls
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 rounded-lg bg-black/60 px-4 py-3 text-white">
            <span className="text-sm sm:text-base">See the full product walkthrough.</span>
            <Button size="sm" variant="secondary" className="text-foreground" onClick={() => setIsVideoOpen(true)}>
              <Play className="mr-2 h-4 w-4" /> Fullscreen
            </Button>
          </div>
        </div>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Why you'll love our lineup</CardTitle>
            <CardDescription>Curated essentials designed for durability, value, and everyday ease.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="text-primary" />
              <p>Top picks balanced between performance and price.</p>
            </div>
            <div className="flex items-center gap-3">
              <BadgePercent className="text-primary" />
              <p>Bundle-first savings to simplify decisions.</p>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="text-primary" />
              <p>Fast checkout with secure PayPal integration.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-3xl font-headline font-bold">Our Products</h2>
          <span className="text-sm text-muted-foreground">Bundle saves up to ${bundle.savings.toFixed(2)}</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.name} className="h-full flex flex-col">
              <div className="relative h-40 w-full">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  <Button asChild>
                    <Link href="/cart">Add to Cart</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mega Saver Highlight</CardTitle>
            <CardDescription>Bold savings. Fresh drops. Zero hesitation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>15% off when you grab any 3 single items.</li>
              <li>Bundles priced to beat the cart math every time.</li>
              <li>Free instant checkout with PayPal - no extra fees.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sustainability, Front and Center</CardTitle>
            <CardDescription>Built to last. Packed to care. Shipped to reduce.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>100% recycled or biodegradable packaging.</li>
              <li>Route-optimized delivery partners.</li>
              <li>Durability-first products to cut waste and returns.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Secure & Seamless</CardTitle>
            <CardDescription>Focused on trust and reliability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="text-primary" />Encrypted PayPal checkout.</div>
            <div className="flex items-center gap-2"><Leaf className="text-primary" />Eco-forward packaging.</div>
            <div className="flex items-center gap-2"><Zap className="text-primary" />Fast, optimized load experience.</div>
          </CardContent>
        </Card>
      </section>

      <section className="text-sm text-muted-foreground bg-muted/60 px-4 py-3 rounded-lg">
        Disclaimer: All product images are for illustrative purposes only. Actual product may vary.
      </section>

      {/* Bundle popup */}
      {isBundleOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <Card className="max-w-lg w-full relative">
            <button
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={() => setIsBundleOpen(false)}
              aria-label="Close bundle offer"
            >
              <X />
            </button>
            <CardHeader>
              <CardTitle>Bundle Offer!</CardTitle>
              <CardDescription>Add a bundle and save more.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image src={bundle.image} alt={bundle.name} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{bundle.name}</p>
                  <p className="text-sm text-muted-foreground">Bundle Price: ${bundle.price.toFixed(2)} (Save ${bundle.savings.toFixed(2)})</p>
                </div>
                <Button asChild>
                  <Link href="/cart">Add Bundle</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pay-now popup (simplified placeholder) */}
      {isPayNowOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <Card className="max-w-md w-full relative">
            <button
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPayNowOpen(false)}
              aria-label="Close payment popup"
            >
              <X />
            </button>
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>Proceed to checkout in the main app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ready to pay? Continue to the main checkout flow to complete your order securely with PayPal.
              </p>
              <Button asChild>
                <Link href="/cart">Go to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-4xl">
            <button
              className="absolute right-3 top-3 text-white hover:text-primary"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video className="w-full h-full" controls autoPlay>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
