import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyPlannerQuotationSent } from "@/lib/notifications";

const createSchema = z.object({
  receiverId: z.string().min(1),
  bookingId: z.string().min(1).optional(),
  vendorId: z.string().min(1).optional(),
  serviceId: z.string().min(1).optional(),
  packageId: z.string().min(1).optional(),
  price: z.coerce.number().positive(),
  currency: z.string().min(3).max(3).default("MYR"),
  dateIso: z
    .string()
    .min(1)
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "dateIso must be a valid ISO date",
    }),
  time: z.string().min(1).max(16).optional(),
  location: z.string().max(500).optional(),
  notes: z.string().max(5000).optional(),
  validUntilIso: z
    .string()
    .min(1)
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "validUntilIso must be a valid ISO date",
    }),
  /** Optional — if provided, sender will attach the created quotation as a chat message in this thread. */
  attachThreadBookingId: z.string().min(1).optional(),
  attachAsPeerMessage: z.boolean().default(true),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only vendors can send price quotations" },
        { status: 403 }
      );
    }
    const senderId = session.user.id;

    const raw = await req.json().catch(() => ({}));
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[POST /api/quotations] validation failed. raw=",
        JSON.stringify(raw),
        " issues=",
        JSON.stringify(parsed.error.issues)
      );
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      receiverId,
      bookingId,
      serviceId,
      packageId,
      price,
      currency,
      dateIso,
      time,
      location,
      notes,
      validUntilIso,
      attachAsPeerMessage,
      attachThreadBookingId,
    } = parsed.data;

    if (receiverId === senderId) {
      return NextResponse.json(
        { error: "Cannot send a quotation to yourself" },
        { status: 400 }
      );
    }

    // Resolve vendor
    const senderVendor = await prisma.vendorProfile.findUnique({
      where: { userId: senderId },
      select: { id: true, userId: true, businessName: true },
    });
    if (!senderVendor) {
      return NextResponse.json(
        { error: "Vendor profile not found for the current user" },
        { status: 404 }
      );
    }
    const vendorId = parsed.data.vendorId ?? senderVendor.id;
    if (vendorId !== senderVendor.id) {
      return NextResponse.json(
        { error: "Vendor profile does not match the current user" },
        { status: 400 }
      );
    }

    // Validate receiver (planner, ORGANIZER)
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, role: true, name: true, email: true },
    });
    if (!receiver) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }
    if (receiver.role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Quotations can only be sent to event organizers" },
        { status: 422 }
      );
    }

    // Validate bookingId + ensure participants match
    if (bookingId) {
      const bk = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          organizerId: true,
          vendorId: true,
          vendor: { select: { userId: true } },
          event: { select: { title: true } },
          service: { select: { id: true, name: true } },
          package: { select: { id: true, name: true } },
          price: true,
          date: true,
          location: true,
        },
      });
      if (!bk) {
        return NextResponse.json(
          { error: "Referenced booking not found" },
          { status: 400 }
        );
      }
      if (bk.organizerId !== receiverId || bk.vendorId !== vendorId) {
        return NextResponse.json(
          { error: "Booking participants do not match the quotation sender/receiver" },
          { status: 400 }
        );
      }
    }

    if (serviceId) {
      const svc = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { id: true, vendorId: true, name: true },
      });
      if (!svc || svc.vendorId !== vendorId) {
        return NextResponse.json(
          { error: "Service does not belong to this vendor" },
          { status: 400 }
        );
      }
    }

    if (packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: packageId },
        select: { id: true, service: { select: { vendorId: true } }, name: true },
      });
      if (!pkg || pkg.service.vendorId !== vendorId) {
        return NextResponse.json(
          { error: "Package does not belong to this vendor" },
          { status: 400 }
        );
      }
    }

    const quotation = await prisma.chatQuotation.create({
      data: {
        senderId,
        receiverId,
        bookingId,
        vendorId,
        serviceId,
        packageId,
        price,
        currency,
        date: dateIso ? new Date(dateIso) : null,
        time: time ?? null,
        location: location ?? null,
        notes: notes ?? null,
        validUntil: validUntilIso ? new Date(validUntilIso) : null,
        status: "PENDING",
      },
      include: {
        booking: {
          include: {
            event: { select: { title: true } },
            service: { select: { id: true, name: true } },
            package: { select: { id: true, name: true } },
            vendor: { select: { businessName: true } },
          },
        },
        service: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
        vendor: { select: { id: true, businessName: true } },
      },
    });

    // Attach the created quotation as a chat message so it renders inline in the chat scroll
    let attachedMessage: any = null;
    if (attachAsPeerMessage) {
      const quotedBookingId = attachThreadBookingId ?? quotation.bookingId;
      attachedMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          bookingId: quotedBookingId ?? null,
          quotationId: quotation.id,
          contextServiceId: quotation.serviceId,
          contextPackageId: quotation.packageId,
          contextVendorId: quotation.vendorId,
          content: notes
            ? `📄 Price quotation: RM ${price.toLocaleString()} — ${notes.slice(0, 180)}`
            : `📄 Price quotation: RM ${price.toLocaleString()}`,
        },
        include: {
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
          quotation: true,
        },
      });
    }

    const notifCtx = {
      quotationId: quotation.id,
      bookingId: quotation.bookingId ?? null,
      organizerName: receiver.name ?? receiver.email ?? null,
      vendorBusinessName:
        quotation.vendor?.businessName ?? senderVendor.businessName ?? null,
      serviceName:
        quotation.service?.name ??
        quotation.booking?.service?.name ??
        null,
      packageName:
        quotation.package?.name ??
        quotation.booking?.package?.name ??
        null,
      eventTitle: quotation.booking?.event?.title ?? null,
      price: quotation.price,
      dateIso: quotation.date?.toISOString() ?? null,
      time: quotation.time,
    };
    void notifyPlannerQuotationSent(receiverId, notifCtx).catch((e) =>
      console.error("[NOTIFY_QUOTATION_SENT]", e)
    );

    return NextResponse.json(
      { quotation, message: attachedMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/quotations] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
