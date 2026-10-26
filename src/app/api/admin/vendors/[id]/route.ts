import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendVendorApprovedEmail, sendVendorRejectedEmail } from "@/lib/mail"

const reviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().max(500).optional(),
})

// PATCH /api/admin/vendors/:id  { action: "APPROVE" | "REJECT", reason?: string }
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id } = await ctx.params

  const parsed = reviewSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const { action, reason } = parsed.data

  const vendor = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, vendorStatus: true },
  })

  if (!vendor || vendor.role !== "VENDOR") {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }
  if (vendor.vendorStatus !== "PENDING") {
    return NextResponse.json(
      { error: "This vendor has already been reviewed" },
      { status: 409 },
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data:
      action === "APPROVE"
        ? { vendorStatus: "APPROVED", rejectionReason: null, reviewedAt: new Date() }
        : {
            vendorStatus: "REJECTED",
            rejectionReason: reason?.trim() || null,
            reviewedAt: new Date(),
          },
    // name + email are for the email below
    select: { id: true, vendorStatus: true, name: true, email: true, rejectionReason: true },
  })

  // Let the vendor know. If the email fails, the decision still stands.
  let emailSent = false
  if (updated.email) {
    try {
      if (updated.vendorStatus === "APPROVED") {
        await sendVendorApprovedEmail({
          to: updated.email,
          name: null, // the account name is the business name, so greet with a plain "Hi,"
          businessName: updated.name,
        })
      } else {
        await sendVendorRejectedEmail({
          to: updated.email,
          name: null,
          businessName: updated.name,
          reason: updated.rejectionReason,
        })
      }
      emailSent = true
    } catch (err) {
      console.error(`[PATCH /api/admin/vendors/${id}] Failed to send status email:`, err)
    }
  }

  return NextResponse.json({ id: updated.id, vendorStatus: updated.vendorStatus, emailSent })
}
