
"use client";

import { useState, type ReactNode } from "react";
import { imageAssets } from "@/lib/image-assets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image as ImageIcon, Wand2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type Asset = {
    src: string;
    alt: string;
    hint?: string;
};

type ImageAssetCategory = {
    [key: string]: Asset | Asset[] | { [key: string]: Asset } | string;
};

function isAsset(value: any): value is Asset {
    return value && typeof value.src === 'string' && typeof value.alt === 'string';
}

export default function AdminAssetManagementPage() {
    const [assets, setAssets] = useState(imageAssets);
    const [generatedSnippet, setGeneratedSnippet] = useState("");
    const { toast } = useToast();

    const handleInputChange = (path: string, field: 'src' | 'alt' | 'hint', value: string) => {
        setAssets(prevAssets => {
            const newAssets = JSON.parse(JSON.stringify(prevAssets));
            let current: any = newAssets;
            const keys = path.split(/[\.\[\]]/).filter(Boolean);
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            const lastKey = keys[keys.length - 1];
            if (current && typeof current[lastKey] === 'object' && current[lastKey] !== null) {
                 current[lastKey][field] = value;
            }
            return newAssets;
        });
    };

    const generateSnippet = () => {
        const snippet = `export const imageAssets = ${JSON.stringify(assets, null, 2)};`;
        setGeneratedSnippet(snippet);
        toast({ title: "Snippet Generated", description: "Copy the snippet into src/lib/image-assets.ts" });
    };

     const copyToClipboard = () => {
        if (generatedSnippet) {
            navigator.clipboard.writeText(generatedSnippet);
            toast({ title: "Copied to Clipboard!" });
        }
    };

    function renderAssetRows(assetKey: string, assetValue: any): ReactNode {
        if (isAsset(assetValue)) {
            return (
                <TableRow key={assetKey}>
                    <TableCell className="font-semibold align-top pt-5">{assetKey}</TableCell>
                    <TableCell className="space-y-2">
                        <Label htmlFor={`${assetKey}-src`} className="sr-only">URL</Label>
                        <Input id={`${assetKey}-src`} type="text" value={assetValue.src} onChange={e => handleInputChange(assetKey, 'src', e.target.value)} className="w-full bg-transparent p-1" />
                         <Label htmlFor={`${assetKey}-alt`} className="sr-only">Alt Text</Label>
                        <Input id={`${assetKey}-alt`} type="text" value={assetValue.alt} onChange={e => handleInputChange(assetKey, 'alt', e.target.value)} className="w-full bg-transparent p-1" />
                         <Label htmlFor={`${assetKey}-hint`} className="sr-only">AI Hint</Label>
                        <Input id={`${assetKey}-hint`} type="text" value={assetValue.hint ?? ''} onChange={e => handleInputChange(assetKey, 'hint', e.target.value)} className="w-full bg-transparent p-1" placeholder="AI Hint (optional)" />
                    </TableCell>
                </TableRow>
            );
        } else if (Array.isArray(assetValue)) {
            return assetValue.map((item, index) => {
                if (isAsset(item)) {
                     const key = `${assetKey}[${index}]`;
                    return (
                        <TableRow key={key}>
                            <TableCell className="font-semibold align-top pt-5">{key}</TableCell>
                            <TableCell className="space-y-2">
                                <Label htmlFor={`${key}-src`} className="sr-only">URL</Label>
                                <Input id={`${key}-src`} type="text" value={item.src} onChange={e => handleInputChange(key, 'src', e.target.value)} className="w-full bg-transparent p-1" />
                                <Label htmlFor={`${key}-alt`} className="sr-only">Alt Text</Label>
                                <Input id={`${key}-alt`} type="text" value={item.alt} onChange={e => handleInputChange(key, 'alt', e.target.value)} className="w-full bg-transparent p-1" />
                                <Label htmlFor={`${key}-hint`} className="sr-only">AI Hint</Label>
                                <Input id={`${key}-hint`} type="text" value={item.hint ?? ''} onChange={e => handleInputChange(key, 'hint', e.target.value)} className="w-full bg-transparent p-1" placeholder="AI Hint (optional)" />
                            </TableCell>
                        </TableRow>
                    );
                }
                return null;
            });
        } else if (typeof assetValue === 'object' && assetValue !== null) {
            return Object.entries(assetValue).map(([key, value]) => renderAssetRows(`${assetKey}.${key}`, value));
        }
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Asset Management</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Manage your application's image assets. Edit the values and generate a code snippet to update your <code>image-assets.ts</code> file.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon />
                            Image Asset Editor
                        </CardTitle>
                        <CardDescription>
                            Update URLs, alt text, and AI hints for your images below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset Key</TableHead>
                                    <TableHead>Asset Values (URL, Alt Text, Hint)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(assets).map(([key, value]) => renderAssetRows(key, value))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-4 sticky top-24">
                     <Button onClick={generateSnippet} className="w-full">
                        <Wand2 className="mr-2" />
                        Generate Asset Snippet
                    </Button>
                    
                    {generatedSnippet && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Snippet</CardTitle>
                                <CardDescription>Copy this content and paste it into <code>src/lib/image-assets.ts</code>.</CardDescription>
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
