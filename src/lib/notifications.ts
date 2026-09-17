import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "NEW_BOOKING"
  | "PAYMENT_MADE"
  | "BOOKING_CANCELLED_PLANNER"
  | "BOOKING_ACCEPTED_VENDOR"
  | "BOOKING_REJECTED_VENDOR"
  | "QUOTATION_SENT"
  | "QUOTATION_ACCEPTED"
  | "QUOTATION_REJECTED";

type CreateNotificationParams = {
  userId: string;
  type: NotificationType | (string & {});
  title: string;
  message: string;
  bookingId?: string;
};

export async function createNotification({
  userId,
  type,
  title,
  message,
  bookingId,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      bookingId,
    },
  });
}

export type BookingContext = {
  bookingId: string;
  organizerName?: string | null;
  vendorBusinessName?: string | null;
  serviceName?: string | null;
  packageName?: string | null;
  eventTitle?: string | null;
  price?: number | null;
};

function bookingSummary(ctx: BookingContext) {
  const serviceOrPackage = ctx.serviceName ?? ctx.packageName ?? "Service";
  const event = ctx.eventTitle ? ` for ${ctx.eventTitle}` : "";
  const withPrice =
    typeof ctx.price === "number"
      ? ` (RM ${ctx.price.toLocaleString()})`
      : "";
  return `${serviceOrPackage}${event}${withPrice}`;
}

export async function notifyVendorNewBooking(
  vendorUserId: string,
  ctx: BookingContext
) {
  const byline = ctx.organizerName
    ? ` from ${ctx.organizerName}`
    : "";
  return createNotification({
    userId: vendorUserId,
    type: "NEW_BOOKING",
    title: "New booking request",
    message: `You received a new booking request${byline}: ${bookingSummary(ctx)}.`,
    bookingId: ctx.bookingId,
  });
}

export async function notifyVendorPaymentMade(
  vendorUserId: string,
  ctx: BookingContext
) {
  return createNotification({
    userId: vendorUserId,
    type: "PAYMENT_MADE",
    title: "Payment received",
    message: `A payment has been made by the planner: ${bookingSummary(ctx)}.`,
    bookingId: ctx.bookingId,
  });
}

export async function notifyVendorBookingCancelledByPlanner(
  vendorUserId: string,
  ctx: BookingContext
) {
  const byline = ctx.organizerName
    ? ` by ${ctx.organizerName}`
    : "";
  return createNotification({
    userId: vendorUserId,
    type: "BOOKING_CANCELLED_PLANNER",
    title: "Booking cancelled by planner",
    message: `The booking has been cancelled${byline}: ${bookingSummary(ctx)}.`,
    bookingId: ctx.bookingId,
  });
}

export async function notifyPlannerBookingAccepted(
  organizerUserId: string,
  ctx: BookingContext
) {
  const byline = ctx.vendorBusinessName
    ? ` from ${ctx.vendorBusinessName}`
    : "";
  return createNotification({
    userId: organizerUserId,
    type: "BOOKING_ACCEPTED_VENDOR",
    title: "Booking accepted",
    message: `Your booking has been accepted${byline}: ${bookingSummary(ctx)}.`,
    bookingId: ctx.bookingId,
  });
}

export async function notifyPlannerBookingRejected(
  organizerUserId: string,
  ctx: BookingContext
) {
  const byline = ctx.vendorBusinessName
    ? ` from ${ctx.vendorBusinessName}`
    : "";
  return createNotification({
    userId: organizerUserId,
    type: "BOOKING_REJECTED_VENDOR",
    title: "Booking rejected",
    message: `Your booking has been rejected${byline}: ${bookingSummary(ctx)}.`,
    bookingId: ctx.bookingId,
  });
}

export type QuotationContext = {
  quotationId: string;
  organizerName?: string | null;
  vendorBusinessName?: string | null;
  serviceName?: string | null;
  packageName?: string | null;
  eventTitle?: string | null;
  bookingId?: string | null;
  price?: number | null;
  dateIso?: string | null;
  time?: string | null;
};

function quotationSummary(ctx: QuotationContext) {
  const serviceOrPackage = ctx.serviceName ?? ctx.packageName ?? "Quotation";
  const event = ctx.eventTitle ? ` for ${ctx.eventTitle}` : "";
  const price =
    typeof ctx.price === "number"
      ? ` (RM ${ctx.price.toLocaleString()})`
      : "";
  return `${serviceOrPackage}${event}${price}`;
}

export async function notifyPlannerQuotationSent(
  organizerUserId: string,
  ctx: QuotationContext
) {
  const byline = ctx.vendorBusinessName
    ? ` from ${ctx.vendorBusinessName}`
    : "";
  return createNotification({
    userId: organizerUserId,
    type: "QUOTATION_SENT",
    title: "New price quotation",
    message: `You received a new price quotation${byline}: ${quotationSummary(ctx)}.`,
    bookingId: ctx.bookingId ?? undefined,
  });
}

export async function notifyVendorQuotationAccepted(
  vendorUserId: string,
  ctx: QuotationContext
) {
  const byline = ctx.organizerName
    ? ` by ${ctx.organizerName}`
    : "";
  return createNotification({
    userId: vendorUserId,
    type: "QUOTATION_ACCEPTED",
    title: "Quotation accepted",
    message: `Your price quotation has been accepted${byline}: ${quotationSummary(ctx)}.`,
    bookingId: ctx.bookingId ?? undefined,
  });
}

export async function notifyVendorQuotationRejected(
  vendorUserId: string,
  ctx: QuotationContext
) {
  const byline = ctx.organizerName
    ? ` by ${ctx.organizerName}`
    : "";
  return createNotification({
    userId: vendorUserId,
    type: "QUOTATION_REJECTED",
    title: "Quotation rejected",
    message: `Your price quotation has been rejected${byline}: ${quotationSummary(ctx)}.`,
    bookingId: ctx.bookingId ?? undefined,
  });
}

