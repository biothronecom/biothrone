
"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, BarChart2, Tv, ExternalLink, Copy, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [config, setConfig] = useState({
        appName: siteConfig.appName || "",
        appDescription: siteConfig.appDescription || "",
        appUrl: siteConfig.appUrl || "",
        paypalClientId: siteConfig.paypal?.clientId || "",
        paypalPlanId: siteConfig.paypal?.planId || "",
        googleAnalyticsId: siteConfig.analytics?.googleAnalyticsId || "",
        metaPixelId: siteConfig.analytics?.metaPixelId || "",
        pinterestTagId: siteConfig.analytics?.pinterestTagId || "",
        redditPixelId: siteConfig.analytics?.redditPixelId || "",
        facebookAppId: siteConfig.facebook?.appId || "",
        facebookPageUrl: siteConfig.facebook?.pageUrl || "",
        instagram: siteConfig.social?.instagram || "",
        tiktok: siteConfig.social?.tiktok || "",
        pinterest: siteConfig.social?.pinterest || "",
        reddit: siteConfig.social?.reddit || "",
        blogUrl: siteConfig.blogUrl || "",
    });
    const [generatedSnippet, setGeneratedSnippet] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setConfig(prev => ({ ...prev, [id]: value }));
    };

    const generateEnvSnippet = () => {
        const snippet = `
# Note: Some of these values update src/lib/config.ts directly, while others
# are environment variables that require a server restart to take effect.

# --- Environment Variables (.env) ---

# Google AI API Key (for Genkit) - Keep your existing key if you have one
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PayPal API Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID="${config.paypalClientId}"
NEXT_PUBLIC_PAYPAL_PLAN_ID="${config.paypalPlanId}"

# Google Apps Script Web App URL
NEXT_PUBLIC_APPS_SCRIPT_URL="YOUR_GOOGLE_APPS_SCRIPT_URL"

# Analytics IDs
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="${config.googleAnalyticsId}"
NEXT_PUBLIC_META_PIXEL_ID="${config.metaPixelId}"
NEXT_PUBLIC_PINTEREST_TAG_ID="${config.pinterestTagId}"
NEXT_PUBLIC_REDDIT_PIXEL_ID="${config.redditPixelId}"

# Facebook
NEXT_PUBLIC_FACEBOOK_APP_ID="${config.facebookAppId}"

# --- Values for src/lib/config.ts ---
# You will need to manually update these in the config file.

# Site Info
APP_NAME="${config.appName}"
APP_DESCRIPTION="${config.appDescription}"
APP_URL="${config.appUrl}"

# Social & Blog Links
FACEBOOK_PAGE_URL="${config.facebookPageUrl}"
INSTAGRAM_URL="${config.instagram}"
TIKTOK_URL="${config.tiktok}"
PINTEREST_URL="${config.pinterest}"
REDDIT_URL="${config.reddit}"
BLOG_URL="${config.blogUrl}"

        `.trim();
        setGeneratedSnippet(snippet);
        toast({ title: "Snippet Generated", description: "Copy the snippet and paste it into your .env file or config." });
    };

    const copyToClipboard = () => {
        if (generatedSnippet) {
            navigator.clipboard.writeText(generatedSnippet);
            toast({ title: "Copied to Clipboard!" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Application Settings</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Manage application-wide configurations. Update the values below and generate a snippet to update your <code>.env</code> and <code>config.ts</code> files.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Tv /> Site Configuration</CardTitle>
                            <CardDescription>General information about your application. These are managed in <code>src/lib/config.ts</code>.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                                <Label htmlFor="appName">Application Name</Label>
                                <Input id="appName" value={config.appName} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="appDescription">Application Description</Label>
                                <Input id="appDescription" value={config.appDescription} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="appUrl">Application URL</Label>
                                <Input id="appUrl" value={config.appUrl} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><KeyRound /> Payment Keys</CardTitle>
                            <CardDescription>Credentials for processing payments and subscriptions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                                <Input id="paypalClientId" value={config.paypalClientId} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paypalPlanId">PayPal Subscription Plan ID</Label>
                                <Input id="paypalPlanId" value={config.paypalPlanId} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2"><BarChart2 /> Analytics IDs</CardTitle>
                           <CardDescription>Tracking IDs for various analytics and marketing platforms.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                                <Input id="googleAnalyticsId" value={config.googleAnalyticsId} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
                                <Input id="metaPixelId" value={config.metaPixelId} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pinterestTagId">Pinterest Tag ID</Label>
                                <Input id="pinterestTagId" value={config.pinterestTagId} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="redditPixelId">Reddit Pixel ID</Label>
                                <Input id="redditPixelId" value={config.redditPixelId} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ExternalLink /> Social & Blog URLs</CardTitle>
                            <CardDescription>Links and identifiers for social media integrations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebookAppId">Facebook App ID</Label>
                                <Input id="facebookAppId" value={config.facebookAppId} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebookPageUrl">Facebook Page URL</Label>
                                <Input id="facebookPageUrl" value={config.facebookPageUrl} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input id="instagram" value={config.instagram} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tiktok">TikTok URL</Label>
                                <Input id="tiktok" value={config.tiktok} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pinterest">Pinterest URL</Label>
                                <Input id="pinterest" value={config.pinterest} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reddit">Reddit URL</Label>
                                <Input id="reddit" value={config.reddit} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="blogUrl">Blog URL</Label>
                                <Input id="blogUrl" value={config.blogUrl} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4 sticky top-24">
                    <Button onClick={generateEnvSnippet} className="w-full">
                        <Wand2 className="mr-2" />
                        Generate Configuration Snippet
                    </Button>
                    
                    {generatedSnippet && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Snippet</CardTitle>
                                <CardDescription>Copy this content and paste it into the appropriate files (<code>.env</code> or <code>src/lib/config.ts</code>).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    readOnly
                                    value={generatedSnippet}
                                    className="h-96 font-mono text-xs bg-muted"
                                />
                                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                                    <Copy className="mr-2" />
                                    Copy to Clipboard
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
