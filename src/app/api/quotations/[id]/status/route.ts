import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  notifyVendorQuotationAccepted,
  notifyVendorQuotationRejected,
} from "@/lib/notifications";

const statusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { id: quotationId } = await params;

    const quotation = await prisma.chatQuotation.findUnique({
      where: { id: quotationId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        booking: {
          include: {
            event: { select: { title: true } },
            vendor: { select: { userId: true, businessName: true } },
            organizer: { select: { id: true, name: true, email: true } },
            service: { select: { id: true, name: true } },
            package: { select: { id: true, name: true } },
          },
        },
        vendor: { select: { id: true, userId: true, businessName: true } },
        service: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
      },
    });
    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const raw = await req.json().catch(() => ({}));
    const parsed = statusSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }
    const nextStatus = parsed.data.status;

    // Planner (receiver) only can accept / reject; vendor can only revert back to PENDING
    const isReceiver = quotation.receiverId === userId;
    const isSender = quotation.senderId === userId;

    if (nextStatus === "ACCEPTED" || nextStatus === "REJECTED") {
      if (!isReceiver) {
        return NextResponse.json(
          { error: "Only the recipient planner can accept or reject the quotation" },
          { status: 403 }
        );
      }
    } else {
      // PENDING: sender/vendor can reset a rejected/accepted back to PENDING, but shouldn't abuse
      if (!isSender && !isReceiver) {
        return NextResponse.json(
          { error: "Not authorized to modify this quotation" },
          { status: 403 }
        );
      }
    }

    const previousStatus = quotation.status;
    const statusChanged = previousStatus !== nextStatus;

    const updatePayload: any = {
      data: { status: nextStatus },
      where: { id: quotationId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        vendor: { select: { id: true, userId: true, businessName: true } },
        service: { select: { id: true, name: true } },
        package: { select: { id: true, name: true } },
        booking: {
          include: {
            event: { select: { title: true } },
            service: { select: { id: true, name: true } },
            package: { select: { id: true, name: true } },
            vendor: { select: { businessName: true } },
          },
        },
      },
    };

    if (statusChanged) {
      const now = new Date();
      if (nextStatus === "ACCEPTED") updatePayload.data.acceptedAt = now;
      if (nextStatus === "REJECTED") updatePayload.data.rejectedAt = now;
      if (nextStatus === "PENDING") {
        updatePayload.data.acceptedAt = null;
        updatePayload.data.rejectedAt = null;
      }
    }
    const updated = await prisma.chatQuotation.update(updatePayload);

    // Write a system reply message in the chat so both sides see the accept/reject event.
    if (statusChanged && quotation.bookingId) {
      const chatSender = quotation.receiverId; // planner's userId is writing the reply
      const chatReceiver = quotation.senderId;
      let reply = "";
      if (nextStatus === "ACCEPTED") reply = `✅ Accepted your price quotation (RM ${quotation.price.toLocaleString()}).`;
      else if (nextStatus === "REJECTED") reply = `❌ Declined your price quotation (RM ${quotation.price.toLocaleString()}).`;
      else if (nextStatus === "PENDING") reply = `🔄 Reopened the price quotation.`;
      if (reply) {
        try {
          await prisma.message.create({
            data: {
              senderId: chatSender,
              receiverId: chatReceiver,
              bookingId: quotation.bookingId,
              quotationId,
              content: reply,
            },
          });
        } catch (msgErr) {
          console.error("[QUOTATION_STATUS_MESSAGE] unable to write reply message:", msgErr);
        }
      }
    }

    if (statusChanged) {
      const notifCtx = {
        quotationId: quotation.id,
        bookingId: quotation.bookingId ?? null,
        organizerName:
          quotation.receiver.name ?? quotation.receiver.email ?? null,
        vendorBusinessName:
          quotation.vendor?.businessName ??
          quotation.booking?.vendor?.businessName ??
          null,
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
      const vendorUserId = quotation.vendor?.userId ?? quotation.senderId;

      if (nextStatus === "ACCEPTED" && vendorUserId) {
        void notifyVendorQuotationAccepted(vendorUserId, notifCtx).catch((e) =>
          console.error("[NOTIFY_QUOTATION_ACCEPTED]", e)
        );
      }
      if (nextStatus === "REJECTED" && vendorUserId) {
        void notifyVendorQuotationRejected(vendorUserId, notifCtx).catch(
          (e) => console.error("[NOTIFY_QUOTATION_REJECTED]", e)
        );
      }
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[POST /api/quotations/:id/status] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
