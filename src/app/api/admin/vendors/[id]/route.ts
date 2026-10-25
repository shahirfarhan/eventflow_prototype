import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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
    select: { id: true, vendorStatus: true },
  })

  return NextResponse.json(updated)
}
