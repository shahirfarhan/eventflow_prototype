import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (val) => {
      if (val.startsWith("/")) return true;
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message: "imageUrl must be a root-relative path or an http(s) URL",
    }
  );

const createSchema = z.object({
  content: z.string().max(5000).default(""),
  imageUrl: z.union([
    imageUrlSchema,
    z.literal("").transform(() => undefined as undefined | string),
    z.undefined(),
  ]),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        organizerId: true,
        vendorId: true,
        event: { select: { organizerId: true } },
        vendor: { select: { userId: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const role = session.user.role;
    const isAuthorized =
      (role === "ORGANIZER" && booking.organizerId === session.user.id) ||
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
  } catch (error) {
    console.error("[GET /api/bookings/[bookingId]/messages] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        organizerId: true,
        vendorId: true,
        vendor: { select: { userId: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const role = session.user.role;
    const isAuthorized =
      (role === "ORGANIZER" && booking.organizerId === session.user.id) ||
      (role === "VENDOR" && booking.vendor.userId === session.user.id);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const raw = await req.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[POST /api/bookings/[bookingId]/messages] schema validation failed: raw payload=",
        raw,
        " issues=",
        JSON.stringify(parsed.error.issues)
      );
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }

    const bodyContent = (parsed.data.content || "").trim();
    const imageUrl = parsed.data.imageUrl || undefined;

    if (!bodyContent && !imageUrl) {
      return NextResponse.json(
        { error: "Send at least text or an image" },
        { status: 400 }
      );
    }

    const receiverId: string | undefined =
      role === "VENDOR" ? booking.organizerId : booking.vendor.userId;

    if (!receiverId) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 422 }
      );
    }

    const created = await prisma.message.create({
      data: {
        bookingId,
        senderId: session.user.id,
        receiverId,
        content: bodyContent || "📎",
        imageUrl,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/bookings/[bookingId]/messages] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
