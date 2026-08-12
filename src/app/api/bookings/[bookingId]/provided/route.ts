import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { vendor: true },
  });

  if (!booking || booking.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      vendorProvidedAt: booking.vendorProvidedAt ?? new Date(),
    },
  });

  return NextResponse.json(updated);
}

