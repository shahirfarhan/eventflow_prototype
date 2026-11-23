import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Empty box ("") or null → null; otherwise a whole number ≥ 0
const optionalCount = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.coerce.number().int("Must be a whole number").min(0, "Can't be negative").nullable()
);

const stringList = (max: number) =>
  z
    .array(z.string().trim().min(1).max(200))
    .max(max)
    .default([])
    .transform((items) => Array.from(new Set(items))); // drop duplicates

const serviceSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    basePrice: z.coerce.number().min(0, "Price can't be negative"),
    pricingModel: z.enum(["FIXED", "PER_HOUR", "PER_PAX", "PER_DAY", "CUSTOM"]),
    occasions: z.string().max(1000, "Occasions too long").optional(),
    // Package details (these were missing, so new services lost them)
    locationsCovered: stringList(50),
    includedItems: stringList(50),
    minGuests: optionalCount.optional(),
    maxGuests: optionalCount.optional(),
  })
  .refine(
    (d) => d.minGuests == null || d.maxGuests == null || d.minGuests <= d.maxGuests,
    { message: "Minimum guests can't be more than maximum guests", path: ["minGuests"] }
  );

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const services = await prisma.service.findMany({
    where: { vendorId: vendor.id },
    include: {
      images: true,
      packages: {
        include: {
          images: true,
        },
      },
    },
  });

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        vendorId: vendor.id,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        pricingModel: data.pricingModel,
        occasions: data.occasions ?? null,
        locationsCovered: data.locationsCovered,
        includedItems: data.includedItems,
        minGuests: data.minGuests ?? null,
        maxGuests: data.maxGuests ?? null,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid details", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to create service", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}