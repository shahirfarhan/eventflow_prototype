import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "PAID", "COMPLETED", "CANCELLED"]),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;
  const role = session.user.role;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        vendor: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify permissions
    let isAuthorized = false;
    if (role === "ORGANIZER" && booking.event.organizerId === session.user.id) {
      isAuthorized = true;
    } else if (role === "VENDOR" && booking.vendor.userId === session.user.id) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = statusSchema.parse(body);

    // State transition logic validation could go here
    // For MVP, allow transitions.

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: data.status },
    });

    if (data.status === "PAID" && updatedBooking.status === "PAID") {
      // Create payment record stub
      await prisma.payment.create({
        data: {
          bookingId: bookingId,
          amount: booking.price,
          status: "COMPLETED",
          method: "card_stub", // Stub
          transactionId: `stub_${Date.now()}`,
        }
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
     if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
