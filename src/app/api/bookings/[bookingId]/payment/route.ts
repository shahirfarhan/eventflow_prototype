import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/bookings/:id/payment   { receiptUrl: string }
 * The planner has paid the vendor's QR and uploads the receipt.
 * ACCEPTED → PAYMENT_PENDING (the vendor then checks the receipt and verifies).
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<Record<string, string>> },
) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Works whether this folder is called [id] or [bookingId]
  const p = await params
  const bookingId = p.id ?? p.bookingId
  if (!bookingId) return NextResponse.json({ error: "Missing booking id" }, { status: 400 })

  const body = await req.json().catch(() => null)
  const receiptUrl = typeof body?.receiptUrl === "string" ? body.receiptUrl.trim() : ""
  const validLink = /^https?:\/\//i.test(receiptUrl) || receiptUrl.startsWith("/")
  if (!receiptUrl || !validLink || receiptUrl.length > 2000) {
    return NextResponse.json({ error: "Please upload your payment receipt" }, { status: 400 })
  }

  // Only the planner who owns the event can pay for it
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, event: { organizerId: userId } },
    select: { id: true, status: true },
  })
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  if (booking.status !== "ACCEPTED") {
    return NextResponse.json(
      {
        error:
          booking.status === "PAYMENT_PENDING"
            ? "You've already sent a receipt. The vendor is checking it."
            : "This booking can't be paid right now",
      },
      { status: 409 },
    )
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "PAYMENT_PENDING",
      paymentReceiptUrl: receiptUrl,
      paymentSubmittedAt: new Date(),
    },
    select: { id: true, status: true },
  })

  revalidatePath("/dashboard/bookings")
  return NextResponse.json({ ok: true, booking: updated })
}
