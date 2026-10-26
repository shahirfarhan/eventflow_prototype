import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/bookings/:id/payment/verify   { action: "verify" | "reject" }
 * The vendor checks the planner's receipt against their bank account.
 *   verify: PAYMENT_PENDING → PAID
 *   reject: PAYMENT_PENDING → ACCEPTED (receipt cleared, planner can pay again)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<Record<string, string>> },
) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Works whether this folder is called [id] or [bookingId]
  const p = await params
  const bookingId = p.id ?? p.bookingId
  if (!bookingId) return NextResponse.json({ error: "Missing booking id" }, { status: 400 })

  const body = await req.json().catch(() => null)
  const action = body?.action === "reject" ? "reject" : body?.action === "verify" ? "verify" : null
  if (!action) return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  // Only the vendor on this booking can verify it
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, vendor: { userId } },
    select: { id: true, status: true },
  })
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  if (booking.status !== "PAYMENT_PENDING") {
    return NextResponse.json(
      { error: "There's no payment waiting to be verified on this booking" },
      { status: 409 },
    )
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data:
      action === "verify"
        ? { status: "PAID", paymentVerifiedAt: new Date() }
        : {
            status: "ACCEPTED",
            paymentReceiptUrl: null,
            paymentSubmittedAt: null,
            paymentVerifiedAt: null,
          },
    select: { id: true, status: true },
  })

  revalidatePath("/dashboard/bookings")
  revalidatePath("/dashboard")
  return NextResponse.json({ ok: true, booking: updated })
}
