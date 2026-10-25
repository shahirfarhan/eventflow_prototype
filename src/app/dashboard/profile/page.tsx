import { redirect } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import VendorProfileForm from "./vendor-profile-form"
import { DashboardHeader, buttonSecondary } from "@/components/dashboard/ui"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

const DEFAULT_CATEGORIES = [
  "Venue",
  "Catering",
  "Photography",
  "Videography",
  "Decoration",
  "Florist",
  "Music & DJ",
  "Makeup & Hair",
  "Attire",
  "Cake & Desserts",
  "Event Planning",
  "Entertainment",
  "Rentals",
  "Transport",
]

export default async function VendorProfileSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  if (session.user.role !== "VENDOR") redirect("/dashboard")

  const [user, categoryRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, vendorProfile: true },
    }),
    prisma.vendorProfile.findMany({
      select: { category: true },
      distinct: ["category"],
    }),
  ])

  if (!user) redirect("/login")

  // null = vendor hasn't created a profile yet; the form creates it on first save
  const profile = user.vendorProfile
  const isNew = !profile

  // Keeps the red badge on the Bookings tab, same as the other dashboard pages
  const pendingCount = profile
    ? await prisma.booking.count({
        where: { vendorId: profile.id, status: "PENDING" },
      })
    : 0

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categoryRows.map((r) => r.category).filter(Boolean)])
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-32 pt-10 sm:px-6 lg:px-8">
        <DashboardHeader
          title={isNew ? "Complete your profile" : "Profile"}
          description={
            isNew
              ? "Add your business details so planners can find and book you."
              : "Update the details planners see on your public page."
          }
          actions={
            profile && (
              <Link href={`/vendors/${profile.id}`} target="_blank" className={buttonSecondary}>
                View public page
                <ExternalLink className="h-4 w-4" />
              </Link>
            )
          }
        />

        <DashboardNav isVendor pendingCount={pendingCount} />

        {/* Form stays at a comfortable reading width */}
        <div style={{ maxWidth: 860 }}>
          <VendorProfileForm
            categories={categories}
            initial={{
              businessName: profile?.businessName ?? "",
              category: profile?.category ?? "",
              location: profile?.location ?? "",
              description: profile?.description ?? "",
              occasions: profile?.occasions ?? "",
              phoneNumber: profile?.phoneNumber ?? "",
              website: profile?.website ?? "",
              email: user.email,
              // Main photo first, then the rest (max 8 in total)
              photos: [profile?.imageUrl, ...(profile?.galleryImages ?? [])]
                .filter((u): u is string => !!u)
                .slice(0, 8),
              socials: {
                instagram: profile?.instagram ?? "",
                facebook: profile?.facebook ?? "",
                tiktok: profile?.tiktok ?? "",
                youtube: profile?.youtube ?? "",
                twitter: profile?.twitter ?? "",
                linkedin: profile?.linkedin ?? "",
              },
            }}
          />
        </div>
      </main>
    </div>
  )
}
