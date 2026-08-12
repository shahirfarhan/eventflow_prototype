import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const packageSchema = z.object({
  serviceId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  features: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = packageSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { vendor: true },
    });

    if (!service || service.vendor.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const created = await prisma.package.create({
      data: {
        serviceId: data.serviceId,
        name: data.name,
        description: data.description,
        price: data.price,
        features: data.features,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

