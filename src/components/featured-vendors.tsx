import { MapPin } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getT } from "@/lib/i18n-server"

export async function FeaturedVendors() {
  const t = (await getT()).featuredVendors

  const vendors = await prisma.vendorProfile.findMany({
    where: { user: { vendorStatus: "APPROVED" } },
    take: 3,
    include: {
      user: true,
      services: true,
    },
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">{t.title}</h2>

          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </div>

        <a
          href="/vendors"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
          })}
        >
          {t.viewAll}
        </a>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {vendors.map((vendor) => (
          <article
            key={vendor.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={vendor.imageUrl || "/placeholder.svg"}
                alt={`${vendor.businessName} — ${vendor.category}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{vendor.businessName}</h3>

                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {vendor.category}
                </span>
              </div>

              {vendor.location && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {vendor.location}
                </p>
              )}

              <p className="mt-4 flex-1 text-pretty text-muted-foreground">
                {vendor.description || t.fallbackDescription(vendor.category)}
              </p>

              <a
                href={`/vendors/${vendor.id}`}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "mt-6 w-full",
                })}
              >
                {t.viewProfile}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
