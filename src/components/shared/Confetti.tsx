
"use client";

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfettiProps {
    onComplete: () => void;
}

const confettiColors = [
    '#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'
];

export function Confetti({ onComplete }: ConfettiProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 4000); // Animation duration + a little extra

        return () => clearTimeout(timer);
    }, [onComplete]);
    
    // Create a container element for the portal
    const portalRoot = typeof document !== 'undefined' ? document.body : null;

    if (!portalRoot) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[2000] pointer-events-none overflow-hidden" 
            aria-hidden="true"
        >
            {[...Array(150)].map((_, i) => {
                const style: React.CSSProperties = {
                    left: `${Math.random() * 100}vw`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${Math.random() * 2 + 3}s`,
                    backgroundColor: confettiColors[i % confettiColors.length],
                };
                return (
                    <div 
                        key={i} 
                        className="confetti-piece" 
                        style={style} 
                    />
                );
            })}
             <style>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-20vh) rotateZ(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(120vh) rotateZ(720deg);
                        opacity: 0;
                    }
                }
                .confetti-piece {
                    position: absolute;
                    top: -20vh;
                    width: 8px;
                    height: 16px;
                    opacity: 0;
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: 1;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>,
        portalRoot
    );
}
