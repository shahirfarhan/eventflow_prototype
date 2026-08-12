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
    const data = createSchema.parse(body);

    const created = await prisma.packageImage.create({
      data: {
        packageId,
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
    const data = deleteSchema.parse(body);

    const deleted = await prisma.packageImage.deleteMany({
      where: {
        id: data.imageId,
        packageId,
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
