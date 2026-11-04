import Link from "next/link"
import { ArrowRight, CalendarPlus, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DateBlock,
  EmptyState,
  Panel,
  PanelHeader,
  buttonPrimary,
} from "@/components/dashboard/ui"
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n"

type T = Dictionary["upcomingEvents"]

const MS_PER_DAY = 1000 * 60 * 60 * 24

function daysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}

function relativeLabel(days: number, t: T): string {
  if (days === 0) return t.today
  if (days === 1) return t.tomorrow
  if (days === -1) return t.yesterday
  if (days > 1) return t.inDays(days)
  return t.daysAgo(Math.abs(days))
}

function WhenBadge({ days, t }: { days: number; t: T }) {
  const soon = days >= 0 && days <= 14
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold",
        days < 0 && "bg-muted text-muted-foreground",
        soon && "bg-brand-muted text-brand-strong",
        days > 14 && "bg-muted text-foreground",
      )}
    >
      {relativeLabel(days, t)}
    </span>
  )
}

type EventItem = {
  id: string
  title: string
  date: Date
  location: string
  type: string
  _count: { bookings: number }
}

export function UpcomingEvents({ events, locale = "en" }: { events: EventItem[]; locale?: Locale }) {
  const t = getDictionary(locale).upcomingEvents
  const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        title={t.title}
        description={sorted.length > 0 ? t.yourNext(sorted.length) : undefined}
        action={
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard?tab=events"
              className="hidden items-center gap-1 text-sm font-semibold text-foreground hover:text-brand sm:inline-flex"
            >
              {t.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/events/new" className={cn(buttonPrimary, "h-10 px-4")}>
              <CalendarPlus className="h-4 w-4" />
              {t.createEvent}
            </Link>
          </div>
        }
      />

      {sorted.length === 0 ? (
        <div className="border-t border-border">
          <EmptyState
            icon={<CalendarPlus className="h-5 w-5" />}
            title={t.emptyTitle}
            description={t.emptyText}
          />
        </div>
      ) : (
        <>
          <ul>
            {sorted.map((event) => {
              const days = daysUntil(event.date)
              const type = event.type.toLowerCase()
              return (
                <li key={event.id} className="border-t border-border">
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 sm:px-6"
                  >
                    <DateBlock date={event.date} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
                        <WhenBadge days={days} t={t} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                        <span className="capitalize">{t.types[type] ?? type}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {t.vendorsCount(event._count.bookings)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Phones: "View all" at the bottom (the header link is hidden to save space) */}
          <Link
            href="/dashboard?tab=events"
            className="flex items-center justify-center gap-1.5 border-t border-border px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 sm:hidden"
          >
            {t.viewAllEvents}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </Panel>
  )
}
