"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Leaf, Loader2 } from "lucide-react";
import { analyzeFootprintAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CarbonFootprintChart } from "./CarbonFootprintChart";
import type { ProductFootprintAnalysisOutput } from "@/ai/flows/product-footprint-analysis";

interface CarbonFootprintAnalysisProps {
  productDescription: string;
}

export function CarbonFootprintAnalysis({ productDescription }: CarbonFootprintAnalysisProps) {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<ProductFootprintAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      setAnalysis(null);
      const result = await analyzeFootprintAction(productDescription);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setAnalysis(result as ProductFootprintAnalysisOutput);
      }
    });
  };

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="text-primary" />
            Carbon Footprint Analysis
          </CardTitle>
          <CardDescription>
            See the estimated environmental impact of this product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analysis && (
            <Button onClick={handleAnalysis} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze with AI"
              )}
            </Button>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {analysis && (
            <div className="space-y-4 mt-4 animate-in fade-in-50">
                <CarbonFootprintChart analysis={analysis} />
                <div className="space-y-2">
                    <h4 className="font-semibold">Comparison</h4>
                    <p className="text-sm text-muted-foreground">{analysis.comparison}</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Suggestions for Improvement</h4>
                    <p className="text-sm text-muted-foreground">{analysis.suggestions}</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
