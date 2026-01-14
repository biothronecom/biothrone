
import Link from 'next/link';
import { Package, LayoutDashboard, Shield, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/config';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AccessibilityToolbar } from '@/components/admin/AccessibilityToolbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-view flex flex-col min-h-screen w-full">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Shield className="h-6 w-6 text-primary" />
            <span className="sr-only">Admin Panel</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/asset-management"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Asset Management
          </Link>
          <Link
            href="/admin/settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        {/* Mobile menu could be added here if needed in the future */}
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <AccessibilityToolbar />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`https://wa.me/${siteConfig.supportPhoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-[100]"
              aria-label="Request help via WhatsApp call"
            >
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-orange-accent hover:bg-orange-accent/90 text-orange-accent-foreground shadow-lg"
              >
                <AlertTriangle className="h-7 w-7" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Request Help (WhatsApp)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
