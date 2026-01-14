'use server';

import { productFootprintAnalysis } from "@/ai/flows/product-footprint-analysis";
import { generateProductDescription } from "@/ai/flows/product-description";
import type { Product } from "./types";
import { imageAssets } from "./image-assets";

export async function analyzeFootprintAction(productDescription: string) {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return {
      error: "Carbon analysis is unavailable: missing NEXT_PUBLIC_GEMINI_API_KEY. Add the key and retry.",
    };
  }

  try {
    const result = await productFootprintAnalysis({ productDescription });
    return result;
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to analyze carbon footprint. Please try again.",
    };
  }
}

export async function generateProductsAction(formData: FormData) {
  const productNamesRaw = formData.get('productNames') as string;
  
  if (!productNamesRaw) {
    return { error: "Product names are required." };
  }

  const productNames = productNamesRaw.split('\n').filter(name => name.trim() !== '');

  const generatedProducts: Product[] = [];

  for (const name of productNames) {
    try {
      const descriptionResult = await generateProductDescription({
        productName: name,
        productCategory: "Eco-friendly",
        keyFeatures: "Sustainable, Recyclable, Low-impact",
      });

      generatedProducts.push({
        id: crypto.randomUUID(),
        name: name,
        price: Math.floor(Math.random() * (100 - 10 + 1)) + 10,
        description: descriptionResult.description,
        image: imageAssets.generatedProduct.src,
        altText: imageAssets.generatedProduct.alt,
        category: "Generated",
        features: ["Sustainable", "Recyclable"],
      });
    } catch (error) {
      console.error(`Failed to generate description for ${name}:`, error);
      // still add product with default description
       generatedProducts.push({
        id: crypto.randomUUID(),
        name: name,
        price: Math.floor(Math.random() * (100 - 10 + 1)) + 10,
        description: `A high-quality, eco-friendly ${name}.`,
        image: imageAssets.generatedProduct.src,
        altText: imageAssets.generatedProduct.alt,
        category: "Generated",
        features: [],
      });
    }
  }
  
  return { products: generatedProducts };
}
