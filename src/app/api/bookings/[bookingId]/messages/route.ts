import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      event: true,
      vendor: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const role = session.user.role;
  const isAuthorized =
    (role === "ORGANIZER" && booking.event.organizerId === session.user.id) ||
    (role === "VENDOR" && booking.vendor.userId === session.user.id);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { bookingId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
      receiver: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      event: true,
      vendor: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const role = session.user.role;
  const isAuthorized =
    (role === "ORGANIZER" && booking.event.organizerId === session.user.id) ||
    (role === "VENDOR" && booking.vendor.userId === session.user.id);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const receiverId =
      role === "VENDOR" ? booking.event.organizerId : booking.vendor.userId;

    const created = await prisma.message.create({
      data: {
        bookingId,
        senderId: session.user.id,
        receiverId,
        content: data.content,
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

