import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import VendorFilters from "@/app/vendors/vendor-filters";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button"

export const dynamic = "force-dynamic";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    location?: string;
    date?: string;
    guests?: string;
    type?: string;
  }>;
}) {
  const {
    category,
    q,
    minPrice,
    maxPrice,
    location,
    date,
    guests,
    type,
  } = await searchParams;

  // ============================================================
  // BUILD FILTERS
  // ============================================================

  let where: any = {};

  if (category && category !== "All") {
    where.category = category;
  }

  if (q && q.trim().length > 0) {
    where.OR = [
      {
        businessName: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        occasions: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (location && location.trim().length > 0) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (
    (minPrice && !isNaN(Number(minPrice))) ||
    (maxPrice && !isNaN(Number(maxPrice)))
  ) {
    const priceFilter: any = {};

    if (minPrice && !isNaN(Number(minPrice))) {
      priceFilter.gte = Number(minPrice);
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      priceFilter.lte = Number(maxPrice);
    }

    where.services = {
      some: {
        basePrice: priceFilter,
      },
    };
  }

  // ============================================================
  // GET SESSION
  // ============================================================

  const session = await auth();

  // ============================================================
  // GET VENDORS
  // ============================================================

  const vendors = await prisma.vendorProfile.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      services: {
        select: {
          basePrice: true,
        },
      },
    },
    orderBy: {
      category: "asc",
    },
  });

  // ============================================================
  // GET CATEGORIES
  // ============================================================

  const allVendors = await prisma.vendorProfile.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  const categories = [
    "All",
    ...allVendors.map((v) => v.category).filter(Boolean),
  ];

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Find Your Services
          </h1>

          <p className="mt-2 text-muted-foreground">
            Browse our curated list of vendors for your next event.
          </p>
        </div>

        {!session?.user && (
          <Link href="/vendors/register">
            <Button size="lg">
              Register as a vendor
            </Button>
          </Link>
        )}
      </div>

      {/* ========================================================
          SEARCH + FILTERS
      ======================================================== */}

      <div className="mt-10">
        <form
          action="/vendors"
          method="GET"
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <Input
            type="search"
            name="q"
            placeholder="Search vendors by name or category..."
            defaultValue={q || ""}
            className="h-12 flex-1 rounded-xl"
          />

          {category && category !== "All" && (
            <input
              type="hidden"
              name="category"
              value={category}
            />
          )}

          <Button
            type="submit"
            size="lg"
            className="h-12"
          >
            Search Services
          </Button>

          <VendorFilters
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            location={location}
            date={date}
            guests={guests}
            type={type}
          />
        </form>
      </div>

      {/* ========================================================
          CATEGORY FILTERS
      ======================================================== */}

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={
              cat === "All"
                ? "/vendors"
                : `/vendors?category=${encodeURIComponent(cat)}`
            }
          >
            <Button
              variant={
                category === cat ||
                (!category && cat === "All")
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="rounded-full"
            >
              {cat}
            </Button>
          </Link>
        ))}
      </div>

      {/* ========================================================
          VENDOR LIST
      ======================================================== */}

      {vendors.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            No vendors found.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {vendors
            .filter((vendor) => {
              /*
               * Existing date availability logic
               * is preserved.
               */
              if (date) {
                const d = new Date(date);

                const unavailable =
                  ((vendor.id.length + d.getDate()) % 3) === 0;

                if (unavailable) {
                  return false;
                }
              }

              return true;
            })
            .map((vendor) => {
              // ==================================================
              // MINIMUM SERVICE PRICE
              // ==================================================

              const minPrice =
                vendor.services.length > 0
                  ? Math.min(
                      ...vendor.services.map(
                        (service) => service.basePrice
                      )
                    )
                  : null;

              return (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="group block h-full"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                    {/* ==========================================
                        IMAGE
                    ========================================== */}

                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {vendor.imageUrl ? (
                        <img
                          src={vendor.imageUrl}
                          alt={`${vendor.businessName} — ${vendor.category}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* Category */}
                      <div className="absolute right-4 top-4">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-background/90 px-3 py-1 backdrop-blur"
                        >
                          {vendor.category}
                        </Badge>
                      </div>
                    </div>

                    {/* ==========================================
                        CARD CONTENT
                    ========================================== */}

                    <div className="flex flex-col p-6">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{vendor.businessName}</h3>
                        
                      </div>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" />
                        {vendor.location}
                      </p>

                      <p className="mt-4 flex-1 text-pretty line-clamp-3 text-muted-foreground">
                        {vendor.description || "No description provided."}
                      </p>

                      {minPrice !== null && (
                        <p className="mt-4 text-sm font-medium">
                          Starts from{" "}
                          <span className="text-primary">
                            RM {minPrice.toLocaleString()}
                          </span>
                        </p>
                      )}

                      <div
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "mt-6 w-full",
                      })}
                    >
                      View profile
                    </div>
                    </div>
                  </article>
                </Link>
              );
            })}
        </div>
      )}
    </section>
  );
}
