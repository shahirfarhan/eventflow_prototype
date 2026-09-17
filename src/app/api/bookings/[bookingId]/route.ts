import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  notifyPlannerBookingAccepted,
  notifyPlannerBookingRejected,
  notifyVendorBookingCancelledByPlanner,
  notifyVendorPaymentMade,
} from "@/lib/notifications";

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "REJECTED",
    "PAID",
    "COMPLETED",
    "CANCELLED",
    "DISPUTED",
  ]),
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
        event: {
          include: {
            organizer: { select: { id: true, name: true, email: true } },
          },
        },
        vendor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        service: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify permissions
    let isAuthorized = false;
    let actorIsOrganizer = false;
    let actorIsVendor = false;
    if (role === "ORGANIZER" && booking.event.organizerId === session.user.id) {
      isAuthorized = true;
      actorIsOrganizer = true;
    } else if (role === "VENDOR" && booking.vendor.userId === session.user.id) {
      isAuthorized = true;
      actorIsVendor = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const data = parsed.data;

    const previousStatus = booking.status;
    const statusChanged = previousStatus !== data.status;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: data.status },
    });

    if (data.status === "PAID" && statusChanged) {
      await prisma.payment.create({
        data: {
          bookingId: bookingId,
          amount: booking.price,
          status: "COMPLETED",
          method: "card_stub",
          transactionId: `stub_${Date.now()}`,
        },
      });
    }

    if (statusChanged) {
      const notifCtx = {
        bookingId,
        organizerName: booking.event.organizer.name ?? booking.event.organizer.email ?? null,
        vendorBusinessName: booking.vendor.businessName ?? null,
        serviceName: booking.service?.name ?? null,
        packageName: booking.package?.name ?? null,
        eventTitle: booking.event.title ?? null,
        price: booking.price,
      };

      switch (data.status) {
        case "PAID":
          if (actorIsOrganizer) {
            void notifyVendorPaymentMade(booking.vendor.userId, notifCtx).catch((e) =>
              console.error("[NOTIFY_PAYMENT_VENDOR]", e)
            );
          }
          break;
        case "ACCEPTED":
          if (actorIsVendor) {
            void notifyPlannerBookingAccepted(booking.event.organizerId, notifCtx).catch(
              (e) => console.error("[NOTIFY_ACCEPT_PLANNER]", e)
            );
          }
          break;
        case "REJECTED":
          if (actorIsVendor) {
            void notifyPlannerBookingRejected(booking.event.organizerId, notifCtx).catch(
              (e) => console.error("[NOTIFY_REJECT_PLANNER]", e)
            );
          }
          break;
        case "CANCELLED":
          if (actorIsOrganizer) {
            void notifyVendorBookingCancelledByPlanner(booking.vendor.userId, notifCtx).catch(
              (e) => console.error("[NOTIFY_CANCEL_VENDOR]", e)
            );
          }
          break;
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[BOOKING_PUT]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
