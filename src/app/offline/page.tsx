
import { WifiOff } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'You are Offline',
  description: 'This page is displayed when you are offline and the content is not available in the cache.',
};

export default function OfflinePage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center py-20">
      <WifiOff className="h-24 w-24 text-muted-foreground mb-8" aria-hidden="true" />
      <h1 className="text-4xl font-headline font-bold mb-4">You're Currently Offline</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        It seems you've lost your internet connection. Don't worry, some pages might still be available. You can try again or go back to the homepage.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
