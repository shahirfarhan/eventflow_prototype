import { prisma } from "@/lib/prisma";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import VendorFilters from "@/app/vendors/vendor-filters";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button"
import { SaveVendorButton } from "@/components/save-vendor-button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import LoadMoreGrid from "./load-more-grid";
import { getT } from "@/lib/i18n-server";

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

  // Only approved vendors are shown to planners
  let where: any = { user: { vendorStatus: "APPROVED" } };

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

  const [session, t] = await Promise.all([auth(), getT()]);

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
      // Every review's stars, for the "★ 4.9 (214)" line on each card
      reviews: { select: { rating: true } },
    },
    orderBy: {
      category: "asc",
    },
  });

  // Existing date availability logic (unchanged), applied up front so the
  // "No vendors found" message and the Load more count use the real list
  const shownVendors = vendors.filter((vendor) => {
    if (date) {
      const d = new Date(date);
      const unavailable = ((vendor.id.length + d.getDate()) % 3) === 0;
      if (unavailable) return false;
    }
    return true;
  });

  // ============================================================
  // GET CATEGORIES
  // ============================================================

  const canSave = session?.user?.role === "ORGANIZER";
  const savedVendorIds = new Set(
    canSave
      ? (
          await prisma.savedVendor.findMany({
            where: { userId: session!.user!.id },
            select: { vendorId: true },
          })
        ).map((s) => s.vendorId)
      : []
  );

  // ============================================================
  // BOTTOM TAB BAR (phones, signed-in planners and vendors)
  // ============================================================

  const role = session?.user?.role;
  const showTabBar =
    !!session?.user?.id && (role === "VENDOR" || role === "ORGANIZER" || role === "ADMIN");

  const [pendingCount, unreadCount] = showTabBar
    ? await Promise.all([
        role === "VENDOR"
          ? prisma.booking.count({
              where: { vendor: { userId: session!.user!.id }, status: "PENDING" },
            })
          : Promise.resolve(0),
        prisma.message.count({
          where: { receiverId: session!.user!.id, readAt: null },
        }),
      ])
    : [0, 0];

  const allVendors = await prisma.vendorProfile.findMany({
    where: { user: { vendorStatus: "APPROVED" } },
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
    <section
      className={
        showTabBar
          ? // Extra room at the bottom on phones so the tab bar doesn't cover the last card
            "mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 md:pb-20 lg:px-8"
          : "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      }
    >
      {showTabBar && (
        <DashboardNav
          mobileOnly
          isVendor={role === "VENDOR"}
          isOrganizer={role === "ORGANIZER"}
          isAdmin={role === "ADMIN"}
          pendingCount={pendingCount}
          unreadCount={unreadCount}
        />
      )}

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t.vendors.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {t.vendors.subtitle}
          </p>
        </div>

        {/* {!session?.user && (
          <Link href="/vendors/register">
            <Button size="lg">
              Register as a vendor
            </Button>
          </Link> */}
        {/* )} */}
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
            placeholder={t.vendors.searchPlaceholder}
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
            {t.vendors.searchButton}
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
              {/* "All" is the filter's value; only its label is translated */}
              {cat === "All" ? t.vendors.all : cat}
            </Button>
          </Link>
        ))}
      </div>

      {/* ========================================================
          VENDOR LIST
      ======================================================== */}

      {shownVendors.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            {t.vendors.noVendors}
          </p>
        </div>
      ) : (
        // Phones: 2 columns, 10 at a time with "Load more". Desktop: 3 columns, all of them.
        // The key resets back to 10 whenever the search or filters change.
        <LoadMoreGrid
          key={JSON.stringify({ category, q, minPrice, maxPrice, location, date, guests, type })}
          pageSize={10}
          className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-6"
        >
          {shownVendors
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

              // ==================================================
              // RATING (worked out from the vendor's reviews)
              // ==================================================

              const reviewCount = vendor.reviews.length;
              const avgRating =
                reviewCount > 0
                  ? vendor.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount
                  : null;

              return (
                <article
                  key={vendor.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  style={{ position: "relative" }}
                >
                  {/* Makes the whole card clickable without putting the
                      save button inside the link */}
                  <Link
                    href={`/vendors/${vendor.id}`}
                    aria-label={t.vendors.viewVendor(vendor.businessName)}
                    className="absolute inset-0"
                    style={{ position: "absolute", inset: 0, zIndex: 0 }}
                  />

                  {/* ==========================================
                      IMAGE
                  ========================================== */}

                  {/* Phones: square photo (2 columns). Desktop: wide photo */}
                  <div className="relative aspect-square w-full overflow-hidden md:aspect-[16/10]">
                    {vendor.imageUrl ? (
                      <img
                        src={vendor.imageUrl}
                        alt={`${vendor.businessName} — ${vendor.category}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground md:text-sm">
                          {t.vendors.noImage}
                        </span>
                      </div>
                    )}

                    {/* Category (top right) */}
                    <div className="absolute right-2 top-2 max-w-[calc(100%-3.5rem)] md:right-4 md:top-4 md:max-w-none">
                      <Badge
                        variant="secondary"
                        className="block max-w-full truncate rounded-full bg-background/90 px-2 py-0.5 text-[11px] backdrop-blur md:px-3 md:py-1 md:text-xs"
                      >
                        {vendor.category}
                      </Badge>
                    </div>

                    {/* Save (phones: top left of the photo, so the name has room) */}
                    {canSave && (
                      <span
                        className="absolute left-2 top-2 md:hidden"
                        style={{ zIndex: 10 }}
                      >
                        <SaveVendorButton
                          vendorId={vendor.id}
                          initialSaved={savedVendorIds.has(vendor.id)}
                        />
                      </span>
                    )}
                  </div>

                  {/* ==========================================
                      CARD CONTENT
                  ========================================== */}

                  <div className="flex flex-1 flex-col p-3 md:p-6">
                    <div
                      className="flex items-center justify-between gap-3"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                    >
                      <h3 className="min-w-0 truncate text-[15px] font-bold leading-snug md:text-xl">
                        {vendor.businessName}
                      </h3>
                      {canSave && (
                        // Desktop: next to the name. Sits above the card link so clicking it saves
                        <span className="hidden md:inline-flex" style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
                          <SaveVendorButton
                            vendorId={vendor.id}
                            initialSaved={savedVendorIds.has(vendor.id)}
                            className="border-0 bg-transparent shadow-none ring-0 backdrop-blur-none hover:bg-muted"
                          />
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground md:mt-2 md:text-sm">
                      <MapPin className="hidden size-4 shrink-0 md:block" aria-hidden="true" />
                      <span className="truncate">{vendor.location}</span>
                    </p>

                    {/* Desktop only: description cut to exactly 3 lines, so every card is the same height.
                        (md:line-clamp-3 shows it AND clamps it; "md:block" would undo the clamp.) */}
                    <p className="mt-4 hidden h-[4.5rem] overflow-hidden text-pretty leading-6 text-muted-foreground md:line-clamp-3">
                      {vendor.description || t.vendors.noDescription}
                    </p>

                    {/* Rating: always shown, "New" until the first review */}
                    {avgRating !== null ? (
                      <p
                        className="mt-1.5 flex items-center gap-1 text-sm md:mt-4"
                        aria-label={t.vendors.rated(avgRating.toFixed(1), reviewCount)}
                      >
                        <Star className="h-4 w-4 fill-[#F08A4B] text-[#F08A4B]" aria-hidden="true" />
                        <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviewCount.toLocaleString()})</span>
                      </p>
                    ) : (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground md:mt-4">
                        <Star className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                        {t.vendors.newNoReviews}
                      </p>
                    )}

                    {/* Price */}
                    {minPrice !== null && (
                      <p className="mt-1 text-xs font-medium md:mt-2 md:text-sm">
                        <span className="text-muted-foreground md:text-foreground">{t.vendors.from} </span>
                        <span className="text-primary">RM {minPrice.toLocaleString()}</span>
                      </p>
                    )}

                    {/* Desktop: full-width button */}
                    <div className="hidden md:block">
                      <div
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                          className: "mt-6 w-full",
                        })}
                      >
                        {t.vendors.viewProfile}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </LoadMoreGrid>
      )}
    </section>
  );
}
