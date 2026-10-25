import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import VendorProfileForm from "./vendor-profile-form"

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

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categoryRows.map((r) => r.category).filter(Boolean)])
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-background">
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px 120px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to dashboard
          </Link>

          {profile && (
            <Link
              href={`/vendors/${profile.id}`}
              target="_blank"
              className="text-sm font-medium text-primary hover:underline"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              View public page
              <ExternalLink style={{ width: 14, height: 14 }} />
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? "Complete your profile" : "Profile settings"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isNew
            ? "Add your business details so planners can find and book you."
            : "Update the details planners see on your public page."}
        </p>

        <div style={{ marginTop: 32 }}>
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
              imageUrl: profile?.imageUrl ?? null,
              galleryImages: profile?.galleryImages ?? [],
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
