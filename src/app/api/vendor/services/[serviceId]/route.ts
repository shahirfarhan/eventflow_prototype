import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  basePrice: z.number().min(0),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  // Verify ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  // Verify ownership
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.service.delete({
    where: { id: serviceId },
  });

  return NextResponse.json({ message: "Service deleted" });
}
