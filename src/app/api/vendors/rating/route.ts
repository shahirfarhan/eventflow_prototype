import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/vendors/rating?vendorId=...  or  ?userId=...
// Returns { vendorId, average, count } for a vendor, or null if that person
// isn't a vendor (e.g. the other side of the chat is an organizer).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const vendorId = searchParams.get("vendorId")
  const userId = searchParams.get("userId")

  if (!vendorId && !userId) {
    return NextResponse.json({ error: "vendorId or userId is required" }, { status: 400 })
  }

  const vendor = vendorId
    ? await prisma.vendorProfile.findUnique({ where: { id: vendorId }, select: { id: true } })
    : await prisma.vendorProfile.findUnique({ where: { userId: userId! }, select: { id: true } })

  if (!vendor) return NextResponse.json(null)

  // Assumes a `Review` model with an Int `rating` (1–5) and a `vendorId`
  // pointing at VendorProfile. Adjust the names if yours differ.
  const stats = await prisma.review.aggregate({
    where: { vendorId: vendor.id },
    _avg: { rating: true },
    _count: { _all: true },
  })

  return NextResponse.json(
    {
      vendorId: vendor.id,
      average: stats._avg.rating ?? null,
      count: stats._count._all,
    },
    { headers: { "Cache-Control": "private, max-age=60" } },
  )
}