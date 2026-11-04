import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { FeaturedVendors } from "@/components/featured-vendors"
import { SiteFooter } from "@/components/site-footer"
import { getLocale } from "@/lib/i18n-server"

export default async function Page() {
  const locale = await getLocale()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* <SiteHeader /> */}
      <main className="flex-1">
        <Hero />
        <Features locale={locale} />
        <FeaturedVendors />
      </main>
      <SiteFooter />
    </div>
  )
}