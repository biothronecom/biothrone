"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Type, MousePointerClick, Contrast, Settings2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type A11ySettings = {
    largeText: boolean;
    highContrast: boolean;
    touchMode: boolean;
};

export function AccessibilityToolbar() {
    const [settings, setSettings] = useState<A11ySettings>({
        largeText: false,
        highContrast: false,
        touchMode: false,
    });

    const [isOpen, setIsOpen] = useState(false);

    // Load settings on mount
    useEffect(() => {
        const saved = localStorage.getItem("admin-a11y-settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(parsed);
                applySettings(parsed);
            } catch (e) {
                console.error("Failed to load a11y settings", e);
            }
        }
    }, []);

    const applySettings = (newSettings: A11ySettings) => {
        const body = document.body;

        if (newSettings.largeText) body.classList.add("admin-large-text");
        else body.classList.remove("admin-large-text");

        if (newSettings.highContrast) body.classList.add("admin-high-contrast");
        else body.classList.remove("admin-high-contrast");

        if (newSettings.touchMode) body.classList.add("admin-touch-mode");
        else body.classList.remove("admin-touch-mode");
    };

    const toggleSetting = (key: keyof A11ySettings) => {
        setSettings((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("admin-a11y-settings", JSON.stringify(next));
            applySettings(next);
            return next;
        });
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2">
            {isOpen && (
                <div className="bg-background border rounded-lg shadow-lg p-2 flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-5">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={settings.largeText ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => toggleSetting("largeText")}
                                    className="h-12 w-12"
                                    aria-label="Toggle Large Text"
                                >
                                    <Type className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Large Text</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={settings.highContrast ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => toggleSetting("highContrast")}
                                    className="h-12 w-12"
                                    aria-label="Toggle High Contrast"
                                >
                                    <Contrast className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>High Contrast</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={settings.touchMode ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => toggleSetting("touchMode")}
                                    className="h-12 w-12"
                                    aria-label="Toggle Touch Mode"
                                >
                                    <MousePointerClick className="h-6 w-6" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Touch Mode (Larger Buttons)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            <Button
                size="icon"
                variant="secondary"
                className="h-14 w-14 rounded-full shadow-xl border-2 border-primary"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open Accessibility Menu"
            >
                <Settings2 className="h-7 w-7" />
            </Button>
        </div>
    );
}
