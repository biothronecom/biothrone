
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TermsContent } from '@/components/legal/TermsContent'
import { siteConfig } from '@/lib/config'
import { ClientOnly } from '@/components/shared/ClientOnly'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Terms of Use and Purchase',
  description: `Read the terms of use and purchase agreement for ${siteConfig.appName} products and services.`,
}

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
        <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Home
            </Link>
        </Button>

      <Card>
        <CardHeader>
          <CardTitle as="h1" className="text-5xl font-headline">Terms of Use and Purchase</CardTitle>
          <ClientOnly className="text-muted-foreground" fallback={<Skeleton className="h-4 w-32 mt-1" />}>
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </ClientOnly>
        </CardHeader>
        <CardContent>
          <TermsContent />
        </CardContent>
      </Card>
    </div>
  )
}
