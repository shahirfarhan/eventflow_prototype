import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  features: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await params;

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      service: {
        include: {
          vendor: true,
        },
      },
    },
  });

  if (!pkg || pkg.service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = packageSchema.parse(body);

    const updated = await prisma.package.update({
      where: { id: packageId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        features: data.features,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await params;

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      service: {
        include: {
          vendor: true,
        },
      },
    },
  });

  if (!pkg || pkg.service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.package.delete({ where: { id: packageId } });

  return NextResponse.json({ message: "Package deleted" });
}

