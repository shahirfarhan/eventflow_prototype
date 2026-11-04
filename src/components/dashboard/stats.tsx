import { StatCard, formatRM } from "@/components/dashboard/ui"
import { getDictionary, type Locale } from "@/lib/i18n"

type StatEvent = {
  date: Date
  budget: number
  _count: { bookings: number }
}

export function Stats({ events, locale = "en" }: { events: StatEvent[]; locale?: Locale }) {
  const t = getDictionary(locale).plannerStats

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const upcoming = events
    .filter((e) => e.date >= startOfToday)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const totalBookings = events.reduce((sum, e) => sum + e._count.bookings, 0)
  const totalBudget = events.reduce((sum, e) => sum + e.budget, 0)

  const next = upcoming[0]
  const nextDays = next
    ? Math.ceil((next.date.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label={t.totalEvents} value={events.length} hint={t.acrossAllTime} />
      <StatCard
        label={t.upcoming}
        value={upcoming.length}
        hint={
          nextDays === null
            ? t.nothingScheduled
            : nextDays === 0
              ? t.nextToday
              : t.nextIn(nextDays)
        }
        tone={nextDays !== null ? "positive" : "muted"}
      />
      <StatCard label={t.vendorBookings} value={totalBookings} hint={t.acrossEvents} />
      <StatCard label={t.totalBudget} value={formatRM(totalBudget)} hint={t.combinedBudgets} />
    </div>
  )
}
