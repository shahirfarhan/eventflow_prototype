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
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import VendorServices from "@/components/vendor-services";

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
        },
      },
      services: {
        include: {
          images: true,
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

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ======================================================
            BACK TO VENDORS
        ====================================================== */}

        <div className="mb-6">
          <Link
            href="/vendors"
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Link>
        </div>

        {/* ======================================================
            VENDOR HERO
        ====================================================== */}

        {vendor.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border">
            <img
              src={vendor.imageUrl}
              alt={vendor.businessName}
              className="h-64 w-full object-cover sm:h-80 lg:h-96"
            />
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {vendor.businessName}
              </h1>

              <Badge variant="secondary">
                {vendor.category}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {vendor.location}
              </div>

              {vendor.rating > 0 && (
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />

                  <span className="font-medium text-foreground">
                    {vendor.rating.toFixed(1)}
                  </span>

                  <span className="ml-1">
                    ({vendor.reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-10 grid gap-8 md:grid-cols-3">

          {/* ====================================================
              LEFT / MAIN COLUMN
          ==================================================== */}

          <div className="space-y-8 md:col-span-2">

            {/* ABOUT */}

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {vendor.description || "No description provided."}
                </p>

                {vendor.occasions && (
                  <div className="border-t pt-5">
                    <h3 className="mb-3 flex items-center text-sm font-semibold">
                      <Calendar className="mr-2 h-4 w-4" />
                      Perfect for Occasions
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {vendor.occasions.split(",").map((occ, i) => (
                        <Badge key={i} variant="secondary">
                          {occ.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SERVICES */}

            <div>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
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
            </div>

            {/* REVIEWS */}

            <div>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
                Reviews
              </h2>

              {vendor.reviews.length > 0 ? (
                <div className="grid gap-4">
                  {vendor.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-semibold">
                            {review.author.name}
                          </div>

                          <div className="flex shrink-0">
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
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>

          {/* ====================================================
              RIGHT / CONTACT COLUMN
          ==================================================== */}

          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {/* WEBSITE */}

                {vendor.website && (
                  <div className="flex items-start text-sm">
                    <Globe className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <a
                      href={`http://${vendor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {vendor.website}
                    </a>
                  </div>
                )}

                {/* PHONE */}

                {vendor.phoneNumber && (
                  <div className="flex items-center text-sm">
                    <Phone className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span>{vendor.phoneNumber}</span>
                  </div>
                )}

                {/* EMAIL */}

                {vendor.user.email && (
                  <div className="flex items-start text-sm">
                    <Mail className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <a
                      href={`mailto:${vendor.user.email}`}
                      className="break-all text-blue-600 hover:underline"
                    >
                      {vendor.user.email}
                    </a>
                  </div>
                )}

                {/* LOGIN */}

                {!session?.user && (
                  <div className="mt-5 border-t pt-5">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Login to view full details and book services.
                    </p>

                    <Link href="/login" className="block">
                      <Button className="w-full">
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
