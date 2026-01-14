"use client";

import { useCart } from "@/hooks/use-cart";
import { pricing, calculateNextTier } from "@/lib/pricing";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GamificationPanel() {
    const { state } = useCart();
    const { subtotal, points, tier } = state;

    const nextTier = calculateNextTier(subtotal);

    // Calculate progress to next tier
    let progress = 100;
    let nextTierMessage = "You've reached the highest tier!";

    if (nextTier) {
        const prevTierMin = pricing.tiers.find(t => t.name === tier.name)?.minSpend || 0;
        const totalRange = nextTier.minSpend - prevTierMin;
        const currentProgress = subtotal - prevTierMin;
        progress = Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));

        const toSpend = (nextTier.minSpend - subtotal).toFixed(2);
        nextTierMessage = `Spend $${toSpend} more to unlock ${nextTier.name} Status (${nextTier.discountPercent * 100}% Off)`;
    }

    return (
        <Card className="bg-gradient-to-br from-card to-accent/20 border-accent/20">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2 font-headline">
                    <Trophy className={cn("h-6 w-6", tier.color)} />
                    {tier.name} Member
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Current Points:</span>
                    <span className="font-bold text-lg">{points}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{tier.name}</span>
                        <span>{nextTier ? nextTier.name : 'Max Tier'}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm font-medium text-primary flex items-center gap-1">
                        {nextTierMessage}
                        {nextTier && <ArrowRight className="h-4 w-4" />}
                    </p>
                </div>

                {tier.discountPercent > 0 && (
                    <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-2 rounded-md text-sm text-center font-semibold border border-green-500/20">
                        Active Discount: {tier.discountPercent * 100}% Off
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
