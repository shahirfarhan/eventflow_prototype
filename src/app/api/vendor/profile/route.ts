import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendVerificationFor } from "@/lib/verification-token"
import {
  SOCIAL_KEYS,
  normalizeSocialLink,
  normalizeWebsite,
  type SocialKey,
} from "@/lib/social-links"

// 8 photos in total: 1 main photo (imageUrl) + up to 7 more (galleryImages)
const MAX_GALLERY = 7

// Uploaded images come back from /api/upload as full links (or site paths)
const imageUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), "Invalid image link")

const optionalText = (max: number) =>
  z.string().trim().max(max).nullish().transform((v) => (v ? v : null))

const schema = z.object({
  businessName: z.string().trim().min(2, "Business name must be at least 2 characters").max(100),
  category: z.string().trim().min(1, "Choose a category").max(60),
  location: z.string().trim().min(1, "Enter your location").max(120),
  description: optionalText(3000),
  occasions: optionalText(400),
  phoneNumber: z
    .string()
    .trim()
    .max(25)
    .nullish()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^\+?[\d\s()-]{6,24}$/.test(v), "Enter a valid phone number"),
  website: z.string().max(300).nullish(),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  currentPassword: z.string().max(200).optional(),
  imageUrl: imageUrl.nullish().transform((v) => (v ? v : null)),
  // The payment QR picture (uploaded via /api/upload); empty = no QR
  paymentQrUrl: imageUrl.nullish().transform((v) => (v ? v : null)),
  galleryImages: z
    .array(imageUrl)
    .max(MAX_GALLERY, `You can add up to ${MAX_GALLERY + 1} photos`)
    .default([]),
  socials: z.record(z.string(), z.string().max(300).nullish()).default({}),
})

async function requireVendor() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId || session.user.role !== "VENDOR") return null
  return userId
}

// GET /api/vendor/profile — the signed-in vendor's editable profile
export async function GET() {
  const userId = await requireVendor()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, name: true } } },
  })
  if (!profile) return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })

  return NextResponse.json(profile)
}

// PATCH /api/vendor/profile — save the settings form
export async function PATCH(req: Request) {
  const userId = await requireVendor()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Invalid details" }, { status: 400 })
  }
  const data = parsed.data

  // Links: turn handles into full links and reject links to the wrong site
  let website: string | null
  const socials = {} as Record<SocialKey, string | null>
  try {
    website = normalizeWebsite(data.website)
    for (const key of SOCIAL_KEYS) {
      socials[key] = normalizeSocialLink(key, data.socials[key])
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      vendorProfile: { select: { id: true } },
    },
  })
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  // Changing the sign-in email needs the current password and a new verification
  const emailChanged = data.email !== user.email.toLowerCase()
  if (emailChanged) {
    if (!data.currentPassword) {
      return NextResponse.json(
        { error: "Enter your current password to change your email" },
        { status: 400 }
      )
    }
    const ok = await bcrypt.compare(data.currentPassword, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }
    const taken = await prisma.user.findFirst({
      where: { email: { equals: data.email, mode: "insensitive" }, NOT: { id: userId } },
      select: { id: true },
    })
    if (taken) {
      return NextResponse.json(
        { error: "That email is already used by another account" },
        { status: 409 }
      )
    }
  }

  const profileData = {
    businessName: data.businessName,
    category: data.category,
    location: data.location,
    description: data.description,
    occasions: data.occasions,
    phoneNumber: data.phoneNumber,
    website,
    imageUrl: data.imageUrl,
    paymentQrUrl: data.paymentQrUrl,
    galleryImages: Array.from(new Set(data.galleryImages)),
    ...socials,
  }

  const [, profile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: emailChanged ? { email: data.email, emailVerified: null } : {},
    }),
    // Creates the profile the first time ("Complete Profile"), updates it after that
    prisma.vendorProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    }),
  ])

  let emailSent = false
  if (emailChanged) {
    try {
      await sendVerificationFor({ id: user.id, email: data.email, name: user.name })
      emailSent = true
    } catch (err) {
      console.error("Failed to send verification email after email change", err)
    }
  }

  revalidatePath(`/vendors/${profile.id}`)
  revalidatePath("/vendors")

  return NextResponse.json({ ok: true, profile, emailChanged, emailSent })
}
