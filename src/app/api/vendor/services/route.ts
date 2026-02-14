import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  basePrice: z.number().min(0),
});

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
    include: { packages: true },
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
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
