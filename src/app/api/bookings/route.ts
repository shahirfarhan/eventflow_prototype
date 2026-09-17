import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notifyVendorNewBooking } from "@/lib/notifications";

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
      packageId,
      eventId,
      date,
      time,
      location,
      guests,
      notes,
      price,
      startTime,
      endTime,
      minAge,
      maxAge,
      venueType,
      venueAccess,
      budgetMin,
      budgetMax,
    } = body;

    if (!vendorId || !eventId || !date || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Combine date and time (back-compat: prefer legacy `time`, else new startTime)
    const bookingDate = new Date(`${date}T${time || startTime || "00:00"}:00`);

    // --- Field sanitisation / coercion helpers ---
    const timeRe = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
    const cleanTime = (v: unknown): string | null => {
      if (typeof v !== "string") return null;
      return timeRe.test(v) ? v : null;
    };
    const cleanInt = (v: unknown, min: number, max: number): number | null => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : parseInt(String(v), 10);
      if (isNaN(n)) return null;
      return Math.max(min, Math.min(max, n));
    };
    const cleanEnum = <T extends string>(v: unknown, allowed: readonly T[]): T | null => {
      if (typeof v !== "string") return null;
      return allowed.includes(v as T) ? (v as T) : null;
    };
    const cleanFloat = (v: unknown, min: number): number | null => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : parseFloat(String(v));
      if (isNaN(n) || n < min) return null;
      return n;
    };

    let sTime = cleanTime(startTime);
    let eTime = cleanTime(endTime);
    // Require start < end; else drop endTime silently
    if (sTime && eTime && eTime <= sTime) eTime = null;

    let aMin = cleanInt(minAge, 0, 120);
    let aMax = cleanInt(maxAge, 0, 120);
    if (aMin !== null && aMax !== null && aMax < aMin) {
      // Swap silently so bad order doesn't fail
      [aMin, aMax] = [aMax, aMin];
    }

    const vType = cleanEnum(venueType, ["INDOOR", "OUTDOOR"] as const);
    const vAccess = cleanEnum(venueAccess, ["PUBLIC", "PRIVATE"] as const);

    let bMin = cleanFloat(budgetMin, 0);
    let bMax = cleanFloat(budgetMax, 0);
    if (bMin !== null && bMax !== null && bMax < bMin) {
      [bMin, bMax] = [bMax, bMin];
    }

    const [service, event, vendorProfile] = await Promise.all([
      serviceId
        ? prisma.service.findUnique({
            where: { id: serviceId },
            select: { id: true, name: true },
          })
        : Promise.resolve(null),
      prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          organizer: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.vendorProfile.findUnique({
        where: { id: vendorId },
        select: {
          id: true,
          userId: true,
          businessName: true,
        },
      }),
    ]);

    const pkg = packageId
      ? await prisma.package.findUnique({
          where: { id: packageId },
          select: { id: true, name: true },
        })
      : null;

    const booking = await prisma.booking.create({
      data: {
        vendorId,
        serviceId,
        packageId,
        eventId,
        organizerId: session.user.id,
        date: bookingDate,
        price: parseFloat(price),
        location: location || null,
        guests: guests ? parseInt(guests, 10) : null,
        startTime: sTime,
        endTime: eTime,
        minAge: aMin,
        maxAge: aMax,
        venueType: vType,
        venueAccess: vAccess,
        budgetMin: bMin,
        budgetMax: bMax,
        specialRequests: notes || null,
        notes: notes || null,
        status: "PENDING",
      },
    });

    if (vendorProfile?.userId) {
      await notifyVendorNewBooking(vendorProfile.userId, {
        bookingId: booking.id,
        organizerName: event?.organizer?.name ?? null,
        vendorBusinessName: vendorProfile.businessName,
        serviceName: service?.name ?? null,
        packageName: pkg?.name ?? null,
        eventTitle: event?.title ?? null,
        price: booking.price,
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKING_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


