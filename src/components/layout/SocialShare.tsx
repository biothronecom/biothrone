
"use client";

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/config';
import { imageAssets } from '@/lib/image-assets';
import { ClientOnly } from '../shared/ClientOnly';
import { useIsAdminRoute } from '@/hooks/useIsAdminRoute';

export function SocialShare() {
    const [isVisible, setIsVisible] = useState(false);
    const isAdminRoute = useIsAdminRoute();
    const shareUrl = siteConfig.appUrl;
    const shareText = `A Natural Solution for Fresh, Clean Toilets. Get 20% Off When You Buy The Complete Bundle!`;

    useEffect(() => {
        if (isAdminRoute) return;
        
        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.5) {
                setIsVisible(true);
            } else {
                 setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isAdminRoute]);

    useEffect(() => {
        if (!isVisible || isAdminRoute) return;

        // When the container becomes visible, tell the Facebook SDK to parse and render plugins
        if (typeof window !== 'undefined' && (window as any).FB) {
            (window as any).FB.XFBML.parse();
        }
    }, [isVisible, isAdminRoute]);
    
    if (isAdminRoute) {
        return null;
    }

    const handleShare = (platform: 'facebook-share' | 'pinterest' | 'instagram' | 'tiktok') => {
        let url = '';

        let shareImage = `${siteConfig.appUrl}/og-image.png`; // Fallback image
        if (imageAssets.carousel && imageAssets.carousel.length > 0) {
            const randomIndex = Math.floor(Math.random() * imageAssets.carousel.length);
            const randomImage = imageAssets.carousel[randomIndex];
            shareImage = randomImage.src.startsWith('http') ? randomImage.src : `${siteConfig.appUrl}${randomImage.src}`;
        }

        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        const encodedImage = encodeURIComponent(shareImage);

        switch (platform) {
            case 'facebook-share':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                break;
            case 'pinterest':
                url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`;
                break;
            case 'instagram':
                url = siteConfig.social.instagram;
                break;
            case 'tiktok':
                url = siteConfig.social.tiktok;
                break;
        }

        if (url) {
            if (platform === 'instagram' || platform === 'tiktok') {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                window.open(url, 'sharer', 'toolbar=0,status=0,width=626,height=436');
            }
        }
    };

    return (
        <ClientOnly>
            <div
                // Add a key that changes when visibility changes to force re-render
                key={`fb-like-${isVisible}`}
                className={`fb-like-container-left ${isVisible ? 'visible' : ''}`}
                data-href={siteConfig.facebook.pageUrl}
                data-width=""
                data-layout="button_count"
                data-action="like"
                data-size="large"
                data-share="false"
            >
                {/* The Facebook SDK replaces this content */}
                <i className="fa-solid fa-thumbs-up"></i>
            </div>

            <div className={`social-share-container ${isVisible ? 'visible' : ''}`}>
                <button onClick={() => handleShare('facebook-share')} className="social-share-bubble" aria-label="Share on Facebook">
                    <i className="fab fa-facebook-f"></i>
                </button>
                <button onClick={() => handleShare('pinterest')} className="social-share-bubble" aria-label="Share on Pinterest">
                    <i className="fab fa-pinterest"></i>
                </button>
                <button onClick={() => handleShare('instagram')} className="social-share-bubble" aria-label="Visit our Instagram">
                    <i className="fab fa-instagram"></i>
                </button>
                <button onClick={() => handleShare('tiktok')} className="social-share-bubble" aria-label="Visit our TikTok">
                    <i className="fab fa-tiktok"></i>
                </button>
            </div>
        </ClientOnly>
    );
}
