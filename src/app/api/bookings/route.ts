import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      vendorId,
      serviceId,
      eventId,
      date,
      time,
      location,
      guests,
      notes,
      price,
    } = body;

    if (!vendorId || !eventId || !date || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Combine date and time
    const bookingDate = new Date(`${date}T${time || "00:00"}:00`);

    const booking = await prisma.booking.create({
      data: {
        vendorId,
        serviceId,
        eventId,
        organizerId: session.user.id,
        date: bookingDate,
        price: parseFloat(price),
        location: location || null,
        guests: guests ? parseInt(guests, 10) : null,
        specialRequests: notes || null,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKING_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
