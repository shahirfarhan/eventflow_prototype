import { CalendarClock, CalendarDays, HandshakeIcon, Wallet } from "lucide-react"

type StatEvent = {
  date: Date
  budget: number
  _count: { bookings: number }
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof CalendarDays
  label: string
  value: string | number
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted text-brand">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function Stats({ events }: { events: StatEvent[] }) {
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Stat
        icon={CalendarDays}
        label="Total events"
        value={events.length}
        hint="Across all time"
      />
      <Stat
        icon={CalendarClock}
        label="Upcoming"
        value={upcoming.length}
        hint={nextDays !== null ? `Next in ${nextDays} days` : "Nothing scheduled"}
      />
      <Stat
        icon={HandshakeIcon}
        label="Vendor bookings"
        value={totalBookings}
        hint="Across your events"
      />
      <Stat
        icon={Wallet}
        label="Total budget"
        value={`RM ${totalBudget.toLocaleString("en-MY")}`}
        hint="Combined event budgets"
      />
    </div>
  )
}