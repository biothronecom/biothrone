
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Providers } from '@/context/Providers';
import Link from 'next/link';
import { SocialShare } from '@/components/layout/SocialShare';
import { siteConfig } from '@/lib/config';
import { ServiceWorker } from '@/components/layout/ServiceWorker';
import { PwaInstaller } from '@/components/layout/PwaInstaller';
import { ExitIntentPopup } from '@/components/layout/ExitIntentPopup';
import { FacebookSdk } from '@/components/layout/FacebookSdk';
import Image from 'next/image';

const { appName, appDescription, appUrl, facebook, social } = siteConfig;

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: ["eco-friendly", "toilet cleaner", "sustainable products", "natural cleaning", "septic safe", "Bio-Throne"],
  applicationName: appName,
  category: "E-commerce",
  appleWebApp: {
    capable: true,
    title: appName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  metadataBase: new URL(appUrl),
  openGraph: {
    type: 'website',
    siteName: appName,
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description: appDescription,
    url: appUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${appName} Promotional Image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description: appDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        <Providers>
           <FacebookSdk />
          <div className="flex flex-col min-h-screen font-body antialiased">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="bg-dark-purple text-dark-purple-foreground py-8 mt-20" role="contentinfo">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center gap-4 mb-4">
                        <a href={facebook.pageUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="text-dark-purple-foreground/80 hover:text-dark-purple-foreground"><i className="fab fa-facebook"></i></a>
                        <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram profile" className="text-dark-purple-foreground/80 hover:text-dark-purple-foreground"><i className="fab fa-instagram"></i></a>
                        <a href={social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Visit our TikTok page" className="text-dark-purple-foreground/80 hover:text-dark-purple-foreground"><i className="fab fa-tiktok"></i></a>
                        <a href={social.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Visit our Pinterest profile" className="text-dark-purple-foreground/80 hover:text-dark-purple-foreground"><i className="fab fa-pinterest"></i></a>
                        <a href={social.reddit} target="_blank" rel="noopener noreferrer" aria-label="Visit our Reddit profile" className="text-dark-purple-foreground/80 hover:text-dark-purple-foreground"><i className="fab fa-reddit"></i></a>
                    </div>
                    <div className="text-sm text-dark-purple-foreground/80 space-x-4 flex justify-center items-center">
                         <div className="flex items-center gap-2">
                             <Image src="/Logo.png" alt="Bio-Throne Logo" width={24} height={24} />
                             <span>&copy; 2025 {appName}. All rights reserved.</span>
                         </div>
                        <Link href="/terms" className="hover:underline">Terms of Use & Purchase</Link>
                    </div>
                </div>
            </footer>
          </div>
          <SocialShare />
          <ExitIntentPopup />
          <ServiceWorker />
          <PwaInstaller />
        </Providers>
      </body>
    </html>
  );
}
