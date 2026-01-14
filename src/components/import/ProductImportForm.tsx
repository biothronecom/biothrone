
"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { generateProductsAction } from "@/lib/actions";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import ClientProductList from "../products/ClientProductList";
import { Loader2, Wand2 } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Generating...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Generate Products
                </>
            )}
        </Button>
    );
}

export function ProductImportForm() {
    const [isPending, startTransition] = useTransition();
    const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    const formAction = (formData: FormData) => {
        startTransition(async () => {
            setError(null);
            const result = await generateProductsAction(formData);
            if (result.error) {
                setError(result.error);
                setGeneratedProducts([]);
            } else if (result.products) {
                setGeneratedProducts(result.products);
            }
        });
    };

    return (
        <div className="space-y-8">
            <Card>
                <form action={formAction} aria-labelledby="product-import-heading">
                    <CardHeader>
                        <CardTitle id="product-import-heading">Product Names</CardTitle>
                        <CardDescription>Enter one product name per line.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            name="productNames"
                            id="productNames"
                            rows={6}
                            placeholder="e.g.
Reusable Coffee Cup
Organic Cotton T-Shirt
Bamboo Cutlery Set"
                            required
                            aria-labelledby="product-import-heading"
                        />
                        <SubmitButton />
                    </CardContent>
                </form>
            </Card>

            {error && (
                 <Alert variant="destructive" role="alert">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {generatedProducts.length > 0 && (
                <section aria-labelledby="generated-products-heading">
                    <h2 id="generated-products-heading" className="text-3xl font-headline font-bold mb-6 text-center">Generated Products</h2>
                    <ClientProductList products={generatedProducts} />
                </section>
            )}
        </div>
    );
}

    
