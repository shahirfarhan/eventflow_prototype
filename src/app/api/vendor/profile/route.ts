// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// const profileSchema = z.object({
//   businessName: z.string().min(2),
//   description: z.string().optional(),
//   category: z.string().min(2),
//   location: z.string().min(2),
// });

// export async function GET(req: Request) {
//   const session = await auth();

//   if (!session?.user || session.user.role !== "VENDOR") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const profile = await prisma.vendorProfile.findUnique({
//     where: { userId: session.user.id },
//   });

//   if (!profile) {
//     return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//   }

//   return NextResponse.json(profile);
// }

// export async function PUT(req: Request) {
//   const session = await auth();

//   if (!session?.user || session.user.role !== "VENDOR") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();
//     const data = profileSchema.parse(body);

//     const profile = await prisma.vendorProfile.update({
//       where: { userId: session.user.id },
//       data: {
//         businessName: data.businessName,
//         description: data.description,
//         category: data.category,
//         location: data.location,
//       },
//     });

//     return NextResponse.json(profile);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: error.issues }, { status: 400 });
//     }
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


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

const MAX_GALLERY = 12

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
  galleryImages: z
    .array(imageUrl)
    .max(MAX_GALLERY, `You can add up to ${MAX_GALLERY} gallery photos`)
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
  if (!user?.vendorProfile) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
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

  const gallery = Array.from(new Set(data.galleryImages))

  const [, profile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: emailChanged ? { email: data.email, emailVerified: null } : {},
    }),
    prisma.vendorProfile.update({
      where: { userId },
      data: {
        businessName: data.businessName,
        category: data.category,
        location: data.location,
        description: data.description,
        occasions: data.occasions,
        phoneNumber: data.phoneNumber,
        website,
        imageUrl: data.imageUrl,
        galleryImages: gallery,
        ...socials,
      },
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
