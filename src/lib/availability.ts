import { prisma } from "@/lib/prisma"

/**
 * Vendor availability, shared by the dashboard calendar, the vendor profile page
 * and the booking checks.
 *
 * Dates are handled as "YYYY-MM-DD" strings in Malaysia time, so a date never
 * shifts by a day because of time zones.
 */

import {
  DATE_KEY_RE,
  addDays,
  dayKey,
  todayKey,
  weekdayOf,
} from "@/lib/date-keys"

// Re-exported so server code can import everything from one place
export { DATE_KEY_RE, addDays, dayKey, todayKey, weekdayOf }

/** Bookings in these statuses are shown on the vendor's calendar (pending requests aren't). */
export const BLOCKING_STATUSES = ["ACCEPTED", "PAYMENT_PENDING", "PAID"] as const

/** How far ahead the calendars go */
export const AVAILABILITY_MONTHS_AHEAD = 12

/** Last day the calendars show, e.g. today + 12 months */
export function rangeEndKey() {
  const [y, m] = todayKey().split("-").map(Number)
  const end = new Date(Date.UTC(y, m - 1 + AVAILABILITY_MONTHS_AHEAD + 1, 0))
  return end.toISOString().slice(0, 10)
}

export type BookedDay = {
  date: string
  bookingId: string
  title: string
  who: string
  status: string
}

/**
 * Everything the vendor's own calendar needs: blocked days, closed weekdays,
 * and their bookings (shown for reference only; they don't block the day).
 * Only for the vendor themselves: it includes who booked what.
 */
export async function getVendorCalendar(vendorId: string) {
  const from = todayKey()
  const to = rangeEndKey()

  const [vendor, blockedRows, bookings] = await Promise.all([
    prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { closedWeekdays: true },
    }),
    prisma.vendorBlockedDate.findMany({
      where: { vendorId, date: { gte: from, lte: to } },
      select: { date: true },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        vendorId,
        status: { in: [...BLOCKING_STATUSES] },
        // a little either side, then filtered by Malaysia date below
        date: {
          gte: new Date(`${addDays(from, -1)}T00:00:00Z`),
          lte: new Date(`${addDays(to, 1)}T23:59:59Z`),
        },
      },
      select: {
        id: true,
        date: true,
        status: true,
        service: { select: { name: true } },
        package: { select: { name: true } },
        event: { select: { title: true } },
        organizer: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    }),
  ])

  const booked: BookedDay[] = bookings
    .map((b) => ({
      date: dayKey(b.date),
      bookingId: b.id,
      title: b.service?.name ?? b.package?.name ?? b.event?.title ?? "Booking",
      who: b.organizer?.name ?? "Planner",
      status: b.status,
    }))
    .filter((b) => b.date >= from && b.date <= to)

  return {
    from,
    to,
    blocked: blockedRows.map((r) => r.date),
    closedWeekdays: vendor?.closedWeekdays ?? [],
    booked,
  }
}

/**
 * What planners see: only the days the vendor blocked themselves (plus their
 * "closed every" weekdays). Bookings do NOT make a day unavailable, because a
 * vendor can take more than one booking on the same day.
 */
export async function getPublicAvailability(vendorId: string) {
  const from = todayKey()
  const to = rangeEndKey()

  const [vendor, blockedRows] = await Promise.all([
    prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { closedWeekdays: true },
    }),
    prisma.vendorBlockedDate.findMany({
      where: { vendorId, date: { gte: from, lte: to } },
      select: { date: true },
      orderBy: { date: "asc" },
    }),
  ])

  const unavailable = blockedRows.map((r) => r.date)
  const closedWeekdays = vendor?.closedWeekdays ?? []

  // First free day from today (skipping blocked days and closed weekdays)
  const taken = new Set(unavailable)
  const closed = new Set(closedWeekdays)
  let nextFree: string | null = null
  for (let key = from; key <= to; key = addDays(key, 1)) {
    if (!taken.has(key) && !closed.has(weekdayOf(key))) {
      nextFree = key
      break
    }
  }

  return { from, to, unavailable, closedWeekdays, nextFree }
}

/**
 * For booking checks: has the vendor blocked this date (or closed that weekday)?
 * Existing bookings don't count, so a vendor can take several bookings on one day.
 */
export async function isVendorUnavailable(vendorId: string, date: Date | string) {
  const key = typeof date === "string" && DATE_KEY_RE.test(date) ? date : dayKey(date)

  const [vendor, blocked] = await Promise.all([
    prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { closedWeekdays: true },
    }),
    prisma.vendorBlockedDate.findUnique({
      where: { vendorId_date: { vendorId, date: key } },
      select: { id: true },
    }),
  ])

  if (blocked) return { unavailable: true, reason: "blocked" as const }
  if (vendor?.closedWeekdays?.includes(weekdayOf(key))) {
    return { unavailable: true, reason: "closed" as const }
  }
  return { unavailable: false, reason: null }
}
