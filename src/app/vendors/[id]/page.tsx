import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  ArrowLeft,
  Star,
  Calendar,
  Pencil,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import VendorServices from "@/components/vendor-services";
import { SaveVendorButton } from "@/components/save-vendor-button";
import { SocialLinksRow } from "@/components/social-links";
import { VendorPhotoGrid } from "@/components/vendor-photo-grid";
import { MobileTabBar } from "@/components/dashboard/mobile-tab-bar";
import BookingChatDialog from "@/app/dashboard/bookings/booking-chat-dialog";
import { AvailabilityPicker } from "@/components/vendor-availability";
import { getPublicAvailability } from "@/lib/availability";
import { formatKey, todayKey } from "@/lib/date-keys";

/** What goes after the price, by pricing model ("" = a fixed price) */
const PRICE_UNIT: Record<string, string> = {
  FIXED: "",
  PER_HOUR: "/hour",
  PER_PAX: "/pax",
  PER_DAY: "/day",
};

export default async function PublicVendorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          vendorStatus: true,
        },
      },
      services: {
        include: {
          // In the order the vendor chose (first = cover)
          images: { orderBy: { createdAt: "asc" } },
          packages: {
            include: {
              images: true,
            },
          },
        },
      },
      reviews: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!vendor) {
    notFound();
  }

  // Unapproved vendors: only the vendor themselves and admins can see the page
  const isApproved = vendor.user.vendorStatus === "APPROVED";
  const canPreview =
    session?.user?.id === vendor.user.id || session?.user?.role === "ADMIN";
  if (!isApproved && !canPreview) {
    notFound();
  }

  const canSave = session?.user?.role === "ORGANIZER";
  const isSaved = canSave
    ? !!(await prisma.savedVendor.findUnique({
        where: {
          userId_vendorId: { userId: session!.user!.id!, vendorId: vendor.id },
        },
        select: { id: true },
      }))
    : false;

  const socialLinks = {
    instagram: vendor.instagram,
    facebook: vendor.facebook,
    tiktok: vendor.tiktok,
    youtube: vendor.youtube,
    twitter: vendor.twitter,
    linkedin: vendor.linkedin,
  };
  const hasSocials = Object.values(socialLinks).some(Boolean);
  const isOwner = session?.user?.id === vendor.user.id;
  const reviewCount = vendor.reviews.length;

  // Main photo first, then the rest (max 8)
  const photos = [vendor.imageUrl, ...vendor.galleryImages]
    .filter((u): u is string => !!u)
    .slice(0, 8);

  /* ---------- Cheapest price for the booking card ---------- */
  // "Custom / quote" services have no comparable price, so they're left out
  const priced = vendor.services.filter(
    (s) => s.pricingModel !== "CUSTOM" && Number(s.basePrice) > 0,
  );
  const cheapest = priced.reduce<(typeof priced)[number] | null>(
    (min, s) => (!min || Number(s.basePrice) < Number(min.basePrice) ? s : min),
    null,
  );
  const hasOnlyQuotes = !cheapest && vendor.services.length > 0;

  /* ---------- Availability (booked + blocked days show as unavailable) ---------- */
  const availability = await getPublicAvailability(vendor.id);
  const nextFreeLabel = availability.nextFree
    ? availability.nextFree === todayKey()
      ? `Today, ${formatKey(availability.nextFree, { year: false })}`
      : formatKey(availability.nextFree, { year: false })
    : null;

  /* ---------- Booking card (sidebar on desktop, after "About" on phones) ---------- */
  const bookingCard = (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      {/* Price */}
      {cheapest ? (
        <>
          <p className="text-sm text-muted-foreground">Services from</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              RM {Number(cheapest.basePrice).toLocaleString("en-MY")}
            </span>
            {PRICE_UNIT[cheapest.pricingModel] && (
              <span className="text-base font-medium text-muted-foreground">
                {PRICE_UNIT[cheapest.pricingModel]}
              </span>
            )}
          </p>
        </>
      ) : hasOnlyQuotes ? (
        <>
          <p className="text-sm text-muted-foreground">Pricing</p>
          <p className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-foreground">
            Custom quote
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No services listed yet.</p>
      )}

      {/* Reviews summary */}
      {vendor.rating > 0 ? (
        <a
          href="#reviews"
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-foreground">{vendor.rating.toFixed(1)}</span>
          <span>
            · {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </span>
        </a>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No reviews yet</p>
      )}

      {/* Availability: opens the calendar; shows the chosen date afterwards */}
      <div className="mt-4">
        <AvailabilityPicker
          vendorName={vendor.businessName}
          from={availability.from}
          to={availability.to}
          unavailable={availability.unavailable}
          closedWeekdays={availability.closedWeekdays}
          nextFreeLabel={nextFreeLabel}
        />
      </div>

      {/* Message vendor (opens your existing chat with them) */}
      {!isOwner && (
        <div className="mt-5">
          {session?.user ? (
            <BookingChatDialog
              title={`Chat with ${vendor.businessName}`}
              description="Discuss your requirements with the vendor."
              peerId={vendor.user.id}
              directPeerName={vendor.businessName}
              contextVendorBusinessName={vendor.businessName}
              trigger={
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-foreground bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message vendor
                </button>
              }
            />
          ) : (
            <>
              <Button asChild className="h-12 w-full">
                <Link href="/login">Log in to message or book</Link>
              </Button>
            </>
          )}
        </div>
      )}

      {/* Trust points */}
      <ul className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
        <li className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <span>
            <span className="font-semibold text-foreground">Approved by Gaffers</span>
            <span className="block text-muted-foreground">
              Every vendor is reviewed before going live.
            </span>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <span>
            <span className="font-semibold text-foreground">Pay through Gaffers</span>
            <span className="block text-muted-foreground">
              Receipts are tracked on your booking.
            </span>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <span>
            <span className="font-semibold text-foreground">Replies within 24 hours</span>
            <span className="block text-muted-foreground">
              Chat and book without leaving the app.
            </span>
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-10 lg:px-8">

        {/* ======================================================
            BACK TO VENDORS
        ====================================================== */}

        <div className="mb-4 sm:mb-6">
          <Link
            href="/vendors"
            className="-ml-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Link>
        </div>

        {/* ======================================================
            VENDOR HERO
        ====================================================== */}

        {photos.length > 0 && (
          <div className="mb-5 sm:mb-8">
            <VendorPhotoGrid photos={photos} name={vendor.businessName} />
          </div>
        )}

        {/* Name + save icon (planners) / edit (owner) on the same line */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 break-words text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {vendor.businessName}
          </h1>

          {canSave && (
            <div className="shrink-0">
              <SaveVendorButton
                vendorId={vendor.id}
                initialSaved={isSaved}
                className="border-0 bg-transparent shadow-none ring-0 backdrop-blur-none hover:bg-muted"
              />
            </div>
          )}

          {isOwner && (
            <Button asChild variant="outline" className="h-10 shrink-0">
              <Link href="/dashboard/profile">
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {vendor.category && <Badge variant="secondary">{vendor.category}</Badge>}

          {vendor.location && (
            <span className="inline-flex items-center">
              <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
              {vendor.location}
            </span>
          )}

          {vendor.rating > 0 && (
            <a href="#reviews" className="inline-flex items-center hover:text-foreground">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {vendor.rating.toFixed(1)}
              </span>
              <span className="ml-1">
                ({reviewCount} review{reviewCount === 1 ? "" : "s"})
              </span>
            </a>
          )}
        </div>

        {/* SOCIAL LOGOS (under the name) */}
        {hasSocials && (
          <div className="mt-4">
            <SocialLinksRow links={socialLinks} businessName={vendor.businessName} />
          </div>
        )}

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">

          {/* ====================================================
              LEFT / MAIN COLUMN
          ==================================================== */}

          <div className="min-w-0 space-y-6 md:col-span-2 md:space-y-8">

            {/* ABOUT */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">About</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {vendor.description || "No description provided."}
                </p>

                {vendor.occasions && (
                  <div className="border-t pt-5">
                    <h3 className="mb-3 flex items-center text-sm font-semibold">
                      <Calendar className="mr-2 h-4 w-4" />
                      Perfect for Occasions
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {vendor.occasions
                        .split(",")
                        .map((occ) => occ.trim())
                        .filter(Boolean)
                        .map((occ, i) => (
                          <Badge key={i} variant="secondary">
                            {occ}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BOOKING CARD: phones only (desktop has it in the sidebar) */}
            <div className="md:hidden">{bookingCard}</div>

            {/* SERVICES */}
            <section id="services" className="min-w-0 scroll-mt-24">
              <h2 className="mb-3 text-xl font-bold tracking-tight sm:mb-4 sm:text-2xl">
                Services
              </h2>

              <VendorServices
                vendor={{
                  id: vendor.id,
                  businessName: vendor.businessName,
                  location: vendor.location,
                  user: {
                    id: vendor.user.id,
                  },
                  services: vendor.services,
                }}
              />
            </section>

            {/* REVIEWS */}
            <section id="reviews" className="min-w-0 scroll-mt-24">
              <h2 className="mb-3 text-xl font-bold tracking-tight sm:mb-4 sm:text-2xl">
                Reviews
                {reviewCount > 0 && (
                  <span className="ml-2 text-base font-medium text-muted-foreground">
                    ({reviewCount})
                  </span>
                )}
              </h2>

              {reviewCount > 0 ? (
                <div className="grid gap-3 sm:gap-4">
                  {vendor.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 truncate font-semibold">
                            {review.author.name ?? "Planner"}
                          </div>

                          <div className="flex shrink-0" aria-label={`${review.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="break-words text-sm leading-relaxed text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No reviews yet.
                </div>
              )}
            </section>
          </div>

          {/* ====================================================
              RIGHT / BOOKING CARD (desktop, stays in view)
          ==================================================== */}

          <aside className="hidden min-w-0 md:block">
            <div className="md:sticky md:top-24">{bookingCard}</div>
          </aside>
        </div>
      </main>

      {/* Bottom tab bar on phones for signed-in users */}
      <MobileTabBar />
    </div>
  );
}
