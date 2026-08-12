import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  url: z.string().min(5),
});

const deleteSchema = z.object({
  imageId: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const created = await prisma.serviceImage.create({
      data: {
        serviceId,
        url: data.url,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = deleteSchema.parse(body);

    const deleted = await prisma.serviceImage.deleteMany({
      where: {
        id: data.imageId,
        serviceId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
