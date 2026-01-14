
"use client";

import { Button } from "@/components/ui/button";
import { Leaf, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import ClientProductList from "@/components/products/ClientProductList";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { imageAssets } from "@/lib/image-assets";
import { products } from "@/lib/products";


export default function HomeClient() {
    const allProducts = products;
    const bundleProduct = allProducts.find(p => p.id === '4');
    const regularProducts = allProducts.filter(p => p.id !== '4');

    const handleScrollToProducts = () => {
        const productsSection = document.getElementById("products");
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScrollToBundle = () => {
        const bundleSection = document.getElementById("bundle-section");
        if (bundleSection) {
            bundleSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="space-y-20">
            <section className="bg-background py-12 md:py-20 relative overflow-hidden rounded-lg" aria-labelledby="hero-heading">
                <div className="bubbles-container" aria-hidden="true">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6 text-center md:text-left">
                        <h1 id="hero-heading" className="text-5xl lg:text-7xl font-headline font-bold text-foreground">A Natural Solution for a Fresh Toilet</h1>
                        <p className="text-lg text-muted-foreground">Bio-Throne™ harnesses the power of nature to eliminate odors and prevent clogs, leaving your toilet fresh and your plumbing clear. Safe for you, your septic system, and the planet.</p>
                        <Button size="lg" className="text-lg py-7 px-10 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleScrollToProducts}>Claim Your Fresh Toilet Now</Button>
                    </div>
                     <div className="flex justify-center">
                        <Carousel className="w-full max-w-md" opts={{ loop: true }} aria-roledescription="carousel" aria-label="Product and lifestyle images">
                          <CarouselContent>
                            {imageAssets.carousel.map((image, index) => (
                              <CarouselItem key={index} aria-roledescription="slide" aria-label={`Image ${index + 1}`}>
                                <div className="p-1">
                                  <Card>
                                    <CardContent className="relative aspect-video flex items-center justify-center p-0">
                                       <Image 
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="rounded-lg object-cover"
                                            data-ai-hint={image.hint}
                                       />
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="hidden sm:flex" aria-label="Previous slide" />
                          <CarouselNext className="hidden sm:flex" aria-label="Next slide" />
                        </Carousel>
                    </div>
                </div>
            </section>
            
            <section role="region" aria-label="Special Offer" className="relative overflow-hidden rounded-lg">
                 <div className="bubbles-container" aria-hidden="true">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>
                <button 
                  className="w-full bg-primary/10 font-semibold text-xl text-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-primary/20 transition-colors animate-pulse-shadow relative z-10"
                  onClick={handleScrollToBundle}
                >
                    <p className="mb-2 text-primary text-3xl">Don't Miss Out: Get 20% Off When You Buy The Complete Bundle!</p>
                </button>
            </section>

            <section className="grid md:grid-cols-3 gap-8 text-center" aria-labelledby="features-heading">
                <h2 id="features-heading" className="sr-only">Product Features</h2>
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <Leaf className="mx-auto h-12 w-12 text-primary mb-4" aria-hidden="true" />
                    <h3 className="text-2xl font-bold font-headline mb-2">Natural Odor Elimination</h3>
                    <p className="text-muted-foreground">Utilizes essential oils and natural enzymes that neutralize unpleasant odors rather than masking them.</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <Zap className="mx-auto h-12 w-12 text-primary mb-4" aria-hidden="true" />
                    <h3 className="text-2xl font-bold font-headline mb-2">Biological Declogging</h3>
                    <p className="text-muted-foreground">Biodegradable enzymes and bacteria break down organic waste, preventing clogs and ensuring smooth plumbing.</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm">
                    <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" aria-hidden="true" />
                    <h3 className="text-2xl font-bold font-headline mb-2">Eco-Friendly & Safe</h3>
                    <p className="text-muted-foreground">Free from harsh chemicals, making it safe for septic systems and the environment.</p>
                </div>
            </section>

            <ClientOnly
                fallback={
                    <section id="products" className="space-y-8 relative overflow-hidden rounded-lg p-8 bg-card" aria-labelledby="products-heading-skeleton">
                        <div className="relative z-10">
                             <div className="flex justify-center items-center gap-4 mb-8">
                                <Skeleton className="h-[60px] w-[60px]" />
                                <Skeleton className="h-10 w-64" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" aria-live="polite" aria-busy="true">
                                <Skeleton className="h-96 w-full" />
                                <Skeleton className="h-96 w-full" />
                                <Skeleton className="h-96 w-full" />
                            </div>
                        </div>
                    </section>
                }
            >
                <section id="products" className="space-y-8 relative overflow-hidden rounded-lg p-8 bg-card" aria-labelledby="products-heading">
                    <div className="bubbles-container" aria-hidden="true">
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                    </div>
                    <div className="grey-bubbles-container" aria-hidden="true">
                        <div className="grey-bubble"></div>
                        <div className="grey-bubble"></div>
                        <div className="grey-bubble"></div>
                        <div className="grey-bubble"></div>
                        <div className="grey-bubble"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="space-y-8">
                            <div className="flex justify-center items-center gap-4 mb-8">
                                <Image src="/Logo.png" alt="Bio-Throne Logo" width={60} height={60} />
                                <h2 id="products-heading" className="text-4xl font-bold text-center font-headline">Our Products</h2>
                            </div>
                            <ClientProductList products={regularProducts} />
                        </div>
                    </div>
                </section>
            </ClientOnly>
            
            {bundleProduct && (
                <section id="bundle-section" className="bg-accent/50 p-8 rounded-lg relative overflow-hidden" aria-labelledby="bundle-offer-heading">
                     <div className="bubbles-container" aria-hidden="true">
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                    </div>
                    <div className="space-y-8 relative z-10">
                        <h2 id="bundle-offer-heading" className="text-4xl font-bold font-headline text-center text-primary">Exclusive Bundle: The Ultimate Cleaning System</h2>
                        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">Why buy one when you can have it all? Get our complete Bio-Throne™ system with this bundle and save 20%. It's the smartest way to keep every toilet in your life fresh and clean.</p>
                        <ClientOnly fallback={<Skeleton className="h-96 w-full max-w-sm mx-auto" aria-live="polite" aria-busy="true" />}>
                            <div className="max-w-sm mx-auto">
                                <ProductCard product={bundleProduct} />
                            </div>
                        </ClientOnly>
                    </div>
                </section>
            )}

            <section id="how-to-use-heading" className="bg-card text-center p-6 md:p-8 rounded-lg relative overflow-hidden" aria-labelledby="how-to-use-main-heading">
                <div className="grey-bubbles-container" aria-hidden="true">
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                    <div className="grey-bubble"></div>
                </div>
                <div className="relative z-10">
                    <h3 id="how-to-use-main-heading" className="text-3xl font-bold font-headline mb-4">How to Use Bio-Throne™ Liquid Gel</h3>
                    <div className="text-left max-w-3xl mx-auto space-y-4 text-muted-foreground mb-8">
                        <p>
                            <strong>For a Fresh Toilet:</strong> Shake gently before use. Spray the liquid gel directly onto the toilet bowl's surface to eliminate odors on contact, leaving behind a pleasant, natural scent.
                        </p>
                        <p>
                            <strong>To Prevent Clogs:</strong> Simply pour a small amount of the gel directly into the toilet water. The natural enzymes and bacteria will get to work breaking down organic waste in your pipes, ensuring everything flows smoothly.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="overflow-hidden">
                             <CardHeader>
                                <CardTitle className="text-2xl font-headline">Usage Tutorial</CardTitle>
                             </CardHeader>
                            <CardContent className="p-0">
                                <div className="aspect-video flex items-center justify-center bg-muted">
                                    <p className="text-muted-foreground">Video coming soon</p>
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="overflow-hidden">
                             <CardHeader>
                                <CardTitle className="text-2xl font-headline">Odor Elimination</CardTitle>
                             </CardHeader>
                            <CardContent className="p-0">
                                <div className="aspect-video flex items-center justify-center bg-muted">
                                    <p className="text-muted-foreground">Video coming soon</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-left max-w-3xl mx-auto space-y-4 text-muted-foreground mt-8">
                        <h4 className="text-2xl font-bold font-headline text-foreground">How It Works</h4>
                        <p>
                            <strong>Odor Neutralization:</strong> Essential oils like eucalyptus, tea tree, or lavender provide a pleasant scent while natural enzymes break down odor-causing compounds.
                        </p>
                        <p>
                           <strong>Declogging Action:</strong> A mix of bacteria and enzymes specifically targets and digests organic matter (e.g., human waste, toilet paper), preventing buildup in pipes and promoting free flow in the plumbing system.
                        </p>
                    </div>
                </div>
            </section>

             <section id="commitment-section" aria-labelledby="commitment-heading">
                <Card>
                    <CardHeader>
                        <h3 id="commitment-heading" className="text-3xl font-bold font-headline text-center text-primary">Our Commitment to a Greener Planet</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                             <div className="space-y-4 text-muted-foreground">
                                <p>
                                    At Bio-Throne™, we're not just focused on creating effective, natural cleaning products; we're deeply committed to reducing our environmental impact at every step. Our innovative packaging and shipping strategies are designed to significantly lower CO2 emissions compared to traditional brands.
                                </p>
                                <p>
                                    Our flexible pouches use 70% less plastic than rigid bottles, are lighter to ship, and take up less space. This means fewer trucks on the road, less fuel consumed, and a smaller carbon footprint for every bottle that reaches your door.
                                </p>
                                <Link
                                    href="https://your-blogger-url.blogspot.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 my-4"
                                >
                                    Learn more on our blog <ArrowUpRight className="h-4 w-4" />
                                </Link>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.commitment.packaging.src} alt={imageAssets.commitment.packaging.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.commitment.packaging.hint} />
                                 </div>
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.commitment.footprint.src} alt={imageAssets.commitment.footprint.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.commitment.footprint.hint} />
                                 </div>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section aria-labelledby="footprint-heading">
                <Card>
                    <CardHeader>
                        <h3 id="footprint-heading" className="text-3xl font-bold font-headline text-center text-primary">Our Footprint</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="grid grid-cols-2 gap-4">
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.footprint.founder.src} alt={imageAssets.footprint.founder.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.footprint.founder.hint} />
                                 </div>
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.footprint.cleanBathroom.src} alt={imageAssets.footprint.cleanBathroom.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.footprint.cleanBathroom.hint} />
                                 </div>
                             </div>
                             <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Our journey started in a small bathroom with a big idea: what if cleaning your restroom could also help clean the planet? Through the ups and downs of the world, through financial burdens and countless sleepless nights, we held onto that vision. We were resilient. We believed that we could create a product that was not only effective but also kind to the environment.
                                </p>
                                <p>
                                    Bio-Throne™ is more than just a product; it's a testament to our commitment to a better future. Every pouch we ship is a step towards a cleaner, healthier world for everyone. We're proud of our journey and invite you to be a part of it.
                                </p>
                                <Link
                                    href="https://your-blogger-url.blogspot.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 my-4"
                                >
                                    Learn more on our blog <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <p className="font-semibold">
                                    Proudly designed and made in the USA.
                                </p>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
             <section aria-labelledby="less-is-more-heading">
                <Card>
                    <CardHeader>
                        <h3 id="less-is-more-heading" className="text-3xl font-bold font-headline text-center text-primary">Less is More</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                             <div className="space-y-4 text-muted-foreground">
                                <p>
                                    You might think you're just buying a toilet cleaner. Another pouch for the cupboard, another box on your doorstep. And yes, you're getting a sparkling fresh toilet and reducing your carbon footprint. But we believe in a different kind of math.
                                </p>
                                <p>
                                    Your purchase is more than a transaction; it's a statement. For me and my team, living with Down syndrome, it's a chance to prove that 'less' can be so much 'more'. It's a job, a purpose, and a way to serve our community and our planet. You're not just a customer; you're part of a story that says everyone has value. Thank you for seeing the 'more' in our 'less'.
                                </p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.lessIsMore.team.src} alt={imageAssets.lessIsMore.team.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.lessIsMore.team.hint} />
                                 </div>
                                 <div className="relative aspect-square">
                                    <Image src={imageAssets.lessIsMore.community.src} alt={imageAssets.lessIsMore.community.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover" data-ai-hint={imageAssets.lessIsMore.community.hint} />
                                 </div>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
