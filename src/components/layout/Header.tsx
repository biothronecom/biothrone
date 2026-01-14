
import Link from "next/link";
import { CartSheet } from "../cart/CartSheet";
import { Shield } from "lucide-react";
import { ClientOnly } from "../shared/ClientOnly";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-dark-purple text-dark-purple-foreground shadow-md sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl sm:text-4xl font-bold font-headline flex items-center gap-2" aria-label="Bio-Throne™ Home Page">
              <Image src="/Logo.png" alt="Bio-Throne Logo" width={40} height={40} />
              Bio-Throne™
            </Link>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
             <Button variant="link" asChild className="text-sm sm:text-base text-dark-purple-foreground/80 hover:text-dark-purple-foreground px-2 sm:px-4 hidden md:flex">
                <Link href="/#how-to-use-heading">How It Works</Link>
            </Button>
             <Button variant="link" asChild className="text-sm sm:text-base text-dark-purple-foreground/80 hover:text-dark-purple-foreground px-2 sm:px-4 hidden md:flex">
                <Link href="/#commitment-section">Why Us?</Link>
            </Button>
            <ClientOnly fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-primary/80">
                  <Link href="/admin/dashboard" aria-label="Admin Dashboard">
                    <Shield className="h-6 w-6" />
                  </Link>
                </Button>
            </ClientOnly>
            <ClientOnly fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
              <CartSheet />
            </ClientOnly>
          </nav>
        </div>
      </div>
    </header>
  );
}
