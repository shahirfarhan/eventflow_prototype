import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VendorCard } from "@/components/vendor-card"
import { heroVendors, categories } from "@/lib/vendors"
import Link from "next/link"

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left: copy + search */}
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-primary" aria-hidden="true" />
            Trusted by 2,000+ planners across Malaysia
          </p>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            What Are We Planning Today?
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            All your vendors and bookings. Now in one app.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <Link href="/dashboard/events/new">
                <Button size="lg" className="w-fit gap-2 font-semibold">
                    <Plus className="size-5" aria-hidden="true" />
                    Create Event
                </Button>
            </Link>

            <form
              className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
              action="/vendors"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="vendor-search" className="sr-only">
                  Search vendors by name or category
                </label>
                <input
                  id="vendor-search"
                  name="q"
                  type="search"
                  placeholder="Search vendors by name or category..."
                  className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 font-semibold">
                Search Vendors
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.slice(0, 6).map((category) => (
                <a
                  key={category}
                  href={`/vendors?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-foreground"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: vendor masonry */}
        <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 sm:pt-8">
            <VendorCard vendor={heroVendors[0]} />
            <VendorCard vendor={heroVendors[3]} />
          </div>
          <div className="flex flex-col gap-4">
            <VendorCard vendor={heroVendors[1]} />
            <VendorCard vendor={heroVendors[2]} />
          </div>
        </div>
      </div>
    </section>
  )
}