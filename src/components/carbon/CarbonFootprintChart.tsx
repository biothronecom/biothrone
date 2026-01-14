"use client"

import type { ProductFootprintAnalysisOutput } from "@/ai/flows/product-footprint-analysis"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CarbonFootprintChartProps {
  analysis: ProductFootprintAnalysisOutput
}

export function CarbonFootprintChart({ analysis }: CarbonFootprintChartProps) {
  const carbonFootprintValue = parseFloat(analysis.carbonFootprint) || 0;
  const plasticWasteValue = parseFloat(analysis.plasticWaste) / 1000; // convert g to kg for scale

  const data = [
    {
      name: "Environmental Impact",
      "Carbon Footprint (kg CO2e)": carbonFootprintValue,
      "Plastic Waste (kg)": plasticWasteValue,
    },
  ]

  return (
    <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Legend />
                <Bar dataKey="Carbon Footprint (kg CO2e)" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Plastic Waste (kg)" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
