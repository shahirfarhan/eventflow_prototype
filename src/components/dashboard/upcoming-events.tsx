import { ArrowUpRight, Cake, GlassWater, MapPin, PartyPopper, Sparkles, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  daysUntil,
  events,
  formatDate,
  relativeLabel,
  type EventCategory,
} from "@/lib/events"
import { cn } from "@/lib/utils"

const categoryConfig: Record<EventCategory, { icon: LucideIcon; className: string }> = {
  wedding: { icon: Sparkles, className: "bg-rose-100 text-rose-600" },
  birthday: { icon: Cake, className: "bg-amber-100 text-amber-600" },
  party: { icon: PartyPopper, className: "bg-violet-100 text-violet-600" },
  other: { icon: GlassWater, className: "bg-sky-100 text-sky-600" },
}

function Badge({ days }: { days: number }) {
  const past = days < 0
  const soon = days >= 0 && days <= 14
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        past && "bg-muted text-muted-foreground",
        soon && "bg-brand-muted text-brand",
        !past && !soon && "bg-accent text-foreground",
      )}
    >
      {relativeLabel(days)}
    </span>
  )
}

export function UpcomingEvents() {
  const sorted = [...events].sort((a, b) => daysUntil(a.date) - daysUntil(b.date))

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Upcoming Events</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your next {sorted.length} events
          </p>
        </div>
        <a
          href="#"
          className="hidden shrink-0 text-sm font-medium text-brand hover:underline sm:block"
        >
          View all
        </a>
      </div>

      <ul className="divide-y divide-border">
        {sorted.map((event) => {
          const days = daysUntil(event.date)
          const { icon: Icon, className } = categoryConfig[event.category]
          return (
            <li
              key={event.id}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-accent/50 sm:px-6"
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  className,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="truncate font-semibold text-foreground">{event.name}</p>
                  <Badge days={days} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>{formatDate(event.date)}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event.vendors} vendors
                  </span>
                </div>
              </div>

              <a
                href="#"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                View
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}