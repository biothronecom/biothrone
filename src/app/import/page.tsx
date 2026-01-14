
import { ProductImportForm } from "@/components/import/ProductImportForm";
import { FileInput } from 'lucide-react';

export const metadata = {
  title: 'Import Products',
  description: 'Use our AI-powered tool to import products by simply providing a list of names.',
};

export default function ImportPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <FileInput className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-5xl md:text-6xl font-headline font-bold">AI Product Importer</h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Simply paste a list of product names below. Our AI will automatically generate descriptions, prices, and images to populate your store instantly.
        </p>
      </div>
      
      <ProductImportForm />
    </div>
  );
}
