
"use client";

import { useEffect, useState } from 'react';
import { useIsAdminRoute } from '@/hooks/useIsAdminRoute';

export function PwaInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const isAdminRoute = useIsAdminRoute();

    useEffect(() => {
        if (isAdminRoute) return;

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isAdminRoute]);

    useEffect(() => {
        if (isAdminRoute) {
            setShowInstallButton(false);
            return;
        };
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollThreshold = pageHeight * 0.6;

            if (scrollPosition > scrollThreshold) {
                setShowInstallButton(true);
            } else {
                setShowInstallButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isAdminRoute]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
    };

    if (isAdminRoute) {
        return null;
    }

    const isButtonVisible = deferredPrompt && showInstallButton;

    return (
        <button 
            id="install-button" 
            onClick={handleInstallClick} 
            aria-label="Install Bio Throne App"
            className={isButtonVisible ? 'visible' : ''}
        >
            Install App
        </button>
    );
}
