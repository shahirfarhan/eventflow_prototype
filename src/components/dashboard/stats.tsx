import { CalendarClock, CalendarDays, HandshakeIcon, Store } from "lucide-react"
import { daysUntil, events } from "@/lib/events"

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

export function Stats() {
  const upcoming = events.filter((e) => daysUntil(e.date) >= 0)
  const totalVendors = events.reduce((sum, e) => sum + e.vendors, 0)
  const next = upcoming[0]
  const nextDays = next ? daysUntil(next.date) : null

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
        label="Booked vendors"
        value={totalVendors}
        hint="Confirmed for your events"
      />
      <Stat icon={Store} label="Saved vendors" value={12} hint="In your shortlist" />
    </div>
  )
}