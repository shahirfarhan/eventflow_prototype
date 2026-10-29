import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DATE_KEY_RE, getVendorCalendar, rangeEndKey, todayKey } from "@/lib/availability"

async function requireVendorProfile() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "VENDOR") return null
  return prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
}

/**
 * GET /api/vendor/blocked-dates
 * The signed-in vendor's calendar: blocked dates, closed weekdays and booked days.
 */
export async function GET() {
  const vendor = await requireVendorProfile()
  if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  return NextResponse.json(await getVendorCalendar(vendor.id))
}

/**
 * PUT /api/vendor/blocked-dates   { blocked: string[], closedWeekdays: number[] }
 * Replaces the vendor's FUTURE blocked dates with this list (past ones are kept as history)
 * and sets the weekdays they're closed every week (0 = Monday … 6 = Sunday).
 */
export async function PUT(req: Request) {
  const vendor = await requireVendorProfile()
  if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const today = todayKey()
  const lastDay = rangeEndKey()

  if (!Array.isArray(body?.blocked) || !Array.isArray(body?.closedWeekdays)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Only real future dates inside the calendar's range
  const blocked: string[] = Array.from(
    new Set<string>(
      body.blocked.filter(
        (d: unknown): d is string =>
          typeof d === "string" && DATE_KEY_RE.test(d) && d >= today && d <= lastDay,
      ),
    ),
  )
  if (blocked.length > 400) {
    return NextResponse.json({ error: "Too many blocked dates" }, { status: 400 })
  }

  const closedWeekdays: number[] = Array.from(
    new Set<number>(
      body.closedWeekdays.filter(
        (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= 6,
      ),
    ),
  ).sort()

  await prisma.$transaction([
    // Clear future blocks, then save the new list
    prisma.vendorBlockedDate.deleteMany({
      where: { vendorId: vendor.id, date: { gte: today } },
    }),
    prisma.vendorBlockedDate.createMany({
      data: blocked.map((date) => ({ vendorId: vendor.id, date })),
      skipDuplicates: true,
    }),
    prisma.vendorProfile.update({
      where: { id: vendor.id },
      data: { closedWeekdays },
    }),
  ])

  revalidatePath(`/vendors/${vendor.id}`)
  return NextResponse.json(await getVendorCalendar(vendor.id))
}
