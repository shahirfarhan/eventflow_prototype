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
  Globe,
  Phone,
  Star,
  Calendar,
  Mail,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import VendorServices from "@/components/vendor-services";
import { SaveVendorButton } from "@/components/save-vendor-button";
import { SocialLinksRow } from "@/components/social-links";
import { websiteHref, websiteLabel } from "@/lib/social-links";
import { VendorPhotoGrid } from "@/components/vendor-photo-grid";
import { MobileTabBar } from "@/components/dashboard/mobile-tab-bar";

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

  // Main photo first, then the rest (max 8)
  const photos = [vendor.imageUrl, ...vendor.galleryImages]
    .filter((u): u is string => !!u)
    .slice(0, 8);

  // Shown in the sidebar on desktop, and right after "About" on phones
  const contactCard = (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* WEBSITE */}
        {vendor.website && (
          <a
            href={websiteHref(vendor.website)}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 break-all text-blue-600">
              {websiteLabel(vendor.website)}
            </span>
          </a>
        )}

        {/* PHONE: tap to call on phones */}
        {vendor.phoneNumber && (
          <a
            href={`tel:${vendor.phoneNumber.replace(/[^\d+]/g, "")}`}
            className="-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0">{vendor.phoneNumber}</span>
          </a>
        )}

        {/* EMAIL */}
        {vendor.user.email && (
          <a
            href={`mailto:${vendor.user.email}`}
            className="-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 break-all text-blue-600">{vendor.user.email}</span>
          </a>
        )}

        {!vendor.website && !vendor.phoneNumber && !vendor.user.email && (
          <p className="text-sm text-muted-foreground">No contact details yet.</p>
        )}

        {/* LOGIN */}
        {!session?.user && (
          <div className="mt-4 border-t pt-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Login to view full details and book services.
            </p>
            <Button asChild className="h-11 w-full">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {vendor.businessName}
            </h1>

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
                    ({vendor.reviews.length} review{vendor.reviews.length === 1 ? "" : "s"})
                  </span>
                </a>
              )}
            </div>
          </div>

          {(canSave || isOwner) && (
            <div className="flex shrink-0 gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
              {canSave && (
                <SaveVendorButton
                  vendorId={vendor.id}
                  initialSaved={isSaved}
                  variant="button"
                />
              )}

              {isOwner && (
                <Button asChild variant="outline" className="h-11 sm:h-10">
                  <Link href="/dashboard/profile">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit profile
                  </Link>
                </Button>
              )}
            </div>
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

            {/* CONTACT: phones only (desktop has it in the sidebar) */}
            <div className="md:hidden">{contactCard}</div>

            {/* SERVICES */}
            <section className="min-w-0">
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
                {vendor.reviews.length > 0 && (
                  <span className="ml-2 text-base font-medium text-muted-foreground">
                    ({vendor.reviews.length})
                  </span>
                )}
              </h2>

              {vendor.reviews.length > 0 ? (
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
              RIGHT / CONTACT COLUMN (desktop)
          ==================================================== */}

          <aside className="hidden min-w-0 md:block">
            <div className="space-y-6 md:sticky md:top-24">{contactCard}</div>
          </aside>
        </div>
      </main>

      {/* Bottom tab bar on phones for signed-in users */}
      <MobileTabBar />
    </div>
  );
}
