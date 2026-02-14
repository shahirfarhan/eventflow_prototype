import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  vendorId: z.string(),
  serviceId: z.string(),
  eventId: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event || event.organizerId !== session.user.id) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    // Get Service details for price
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId: data.eventId,
        vendorId: data.vendorId, // VendorProfile ID
        serviceId: data.serviceId,
        organizerId: session.user.id,
        status: "PENDING",
        price: service.basePrice,
        date: event.date, // Default to event date
        notes: data.notes,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  let where: any = {};

  if (role === "ORGANIZER") {
    // Organizers see bookings for their events
    where = {
      organizerId: session.user.id
    };
  } else if (role === "VENDOR") {
    // Vendors see bookings for their profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id }
    });
    
    if (!vendorProfile) {
      return NextResponse.json([]);
    }

    where = {
      vendorId: vendorProfile.id
    };
  } else if (role === "ADMIN") {
    // Admin sees all
    where = {};
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      event: true,
      service: true,
      vendor: {
        select: {
          businessName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(bookings);
}
