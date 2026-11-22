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
    .transform((items) => Array.from(new Set(items))); // drop duplicates

// Every field is optional: anything the form doesn't send is left unchanged
const serviceSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    description: z.string().max(5000).nullish(),
    basePrice: z.coerce.number().min(0, "Price can't be negative"),
    occasions: z.string().max(1000, "Occasions too long").nullish(),
    pricingModel: z.string().trim().min(1).max(30),
    locationsCovered: stringList(50),
    includedItems: stringList(50),
    minGuests: optionalCount,
    maxGuests: optionalCount,
    // Photo links in display order (first = cover)
    images: z.array(z.string().trim().min(1).max(2000)).max(20),
  })
  .partial()
  .refine(
    (d) => d.minGuests == null || d.maxGuests == null || d.minGuests <= d.maxGuests,
    { message: "Minimum guests can't be more than maximum guests", path: ["minGuests"] }
  );

async function findOwnedService(serviceId: string, userId: string) {
  return prisma.service.findFirst({
    where: { id: serviceId, vendor: { userId } },
    select: { id: true },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;
  if (!(await findOwnedService(serviceId, session.user.id))) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  const parsed = serviceSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid details", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { images, ...data } = parsed.data;

  try {
    const updatedService = await prisma.$transaction(async (tx) => {
      const updated = await tx.service.update({
        where: { id: serviceId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description || null }),
          ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
          ...(data.occasions !== undefined && { occasions: data.occasions || null }),
          ...(data.pricingModel !== undefined && { pricingModel: data.pricingModel }),
          ...(data.locationsCovered !== undefined && { locationsCovered: data.locationsCovered }),
          ...(data.includedItems !== undefined && { includedItems: data.includedItems }),
          ...(data.minGuests !== undefined && { minGuests: data.minGuests }),
          ...(data.maxGuests !== undefined && { maxGuests: data.maxGuests }),
        },
      });

      // Photos: replace the set, keeping the vendor's order (the edit page sorts by createdAt)
      if (images !== undefined) {
        await tx.serviceImage.deleteMany({ where: { serviceId } });
        const base = Date.now();
        for (const [i, url] of images.entries()) {
          await tx.serviceImage.create({
            data: { serviceId, url, createdAt: new Date(base + i) },
          });
        }
      }

      return updated;
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Failed to update service", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;
  if (!(await findOwnedService(serviceId, session.user.id))) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id: serviceId } });
  return NextResponse.json({ message: "Service deleted" });
}
