import type { ReactNode } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  APP_TIME_ZONE,
  DateBlock,
  EmptyState,
  Panel,
  PanelHeader,
  StatusBadge,
  formatRM,
} from "@/components/dashboard/ui"
import BookingChatDialog from "../../app/dashboard/bookings/booking-chat-dialog"

/** The fields the vendor overview reads from a booking (with organizer, service, event). */
export type VendorBooking = {
  id: string
  status: string
  price: unknown
  date: Date
  startTime: string | null
  endTime: string | null
  location: string | null
  guests: number | null
  organizer: { id: string; name: string | null } | null
  service: { name: string } | null
  event: { title: string } | null
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function plannerName(b: VendorBooking) {
  return b.organizer?.name ?? "Planner"
}

function timeRange(b: VendorBooking) {
  if (!b.startTime && !b.endTime) return null
  return `${b.startTime ?? "?"}${b.endTime ? `–${b.endTime}` : ""}`
}

function chatDescription(b: VendorBooking) {
  return (
    [
      b.event?.title ? `Event: ${b.event.title}` : null,
      b.service?.name ? `Booking: ${b.service.name}` : null,
    ]
      .filter(Boolean)
      .join(" • ") || undefined
  )
}

/** Small grey heading used above each section on phones (hidden on bigger screens). */
export function MobileSectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden">
      {children}
    </h2>
  )
}

/* ================================================================
   NEEDS YOUR ATTENTION
================================================================ */

export type AttentionItem = {
  href: string
  icon: LucideIcon
  tone: "brand" | "blue" | "green" | "neutral"
  title: string
  detail: string
  chip?: string
}

const attentionTones: Record<AttentionItem["tone"], string> = {
  brand: "bg-brand-muted text-brand-strong",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  neutral: "bg-muted text-muted-foreground",
}

export function AttentionCard({ items }: { items: AttentionItem[] }) {
  return (
    <div className="min-w-0 lg:col-span-2">
      <MobileSectionLabel>Needs your attention</MobileSectionLabel>

      <Panel className="flex flex-col overflow-hidden md:h-full">
        {/* Card header: desktop only (phones use the label above) */}
        <div className="hidden items-center justify-between px-6 pb-4 pt-5 md:flex">
          <h2 className="text-base font-semibold text-foreground">Needs your attention</h2>
          {items.length > 0 && (
            <span className="rounded-full bg-brand-muted px-2.5 py-1 text-xs font-bold text-brand-strong">
              {items.length} to do
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center md:border-t md:border-border">
            <EmptyState
              icon={<CalendarCheck className="h-5 w-5" />}
              title="You're all caught up"
              description="New booking requests and anything that needs your reply will show up here."
            />
          </div>
        ) : (
          // Centred in whatever height the card ends up with
          <ul className="flex flex-1 flex-col justify-center md:border-t md:border-border">
            {items.map((item, i) => (
              <li
                key={item.title}
                className={cn(i > 0 && "border-t border-border")}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50 md:px-6"
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      attentionTones[item.tone],
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground md:text-sm">
                      {item.title}
                    </span>
                    <span className="hidden truncate text-sm text-muted-foreground md:block">
                      {item.detail}
                    </span>
                  </span>
                  {item.chip && (
                    <span className="shrink-0 text-xs font-bold text-amber-800 md:rounded-full md:bg-amber-50 md:px-2.5 md:py-1">
                      {item.chip}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

/* ================================================================
   UP NEXT (dark card)
================================================================ */

export function UpNextCard({ booking }: { booking?: VendorBooking }) {
  if (!booking) {
    return (
      <div className="flex min-w-0 flex-col pt-2 md:pt-0">
        <MobileSectionLabel>Up next</MobileSectionLabel>
        <section className="flex flex-1 flex-col rounded-2xl bg-foreground p-6 text-background">
          <p className="hidden text-xs font-bold tracking-wider text-background/70 md:block">
            UP NEXT
          </p>
          <p className="text-lg font-semibold md:mt-4">No confirmed bookings yet</p>
          <p className="mt-1 text-sm text-background/70">
            Once you accept a request, your next event shows up here so you can prep for the day.
          </p>
          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-background text-sm font-semibold text-foreground transition-opacity hover:opacity-90 lg:mt-auto"
          >
            View requests
          </Link>
        </section>
      </div>
    )
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const eventDay = new Date(booking.date)
  eventDay.setHours(0, 0, 0, 0)
  const days = Math.round((eventDay.getTime() - startOfToday.getTime()) / MS_PER_DAY)
  const when = days <= 0 ? "TODAY" : days === 1 ? "TOMORROW" : `IN ${days} DAYS`

  const name = plannerName(booking)
  const time = timeRange(booking)
  const title = booking.service?.name ?? booking.event?.title ?? "Booking"
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(booking.date))

  const chat = (trigger: ReactNode) =>
    booking.organizer ? (
      <BookingChatDialog
        bookingId={booking.id}
        peerId={booking.organizer.id}
        title={`Planner — ${name}`}
        description={chatDescription(booking)}
        trigger={trigger}
      />
    ) : null

  return (
    <div className="flex min-w-0 flex-col pt-2 md:pt-0">
      <MobileSectionLabel>Up next · {when.toLowerCase()}</MobileSectionLabel>

      {/* ---------- Phones: compact card ---------- */}
      <section className="flex items-center gap-4 rounded-2xl bg-foreground p-4 text-background md:hidden">
        <Link href={`/dashboard/bookings/${booking.id}`} className="flex min-w-0 flex-1 items-center gap-4">
          <DateBlock date={booking.date} tone="brand" size="lg" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{title}</p>
            <p className="truncate text-sm text-background/70">
              {name} · {weekday}
              {time && `, ${time}`}
            </p>
            {(booking.location || booking.guests) && (
              <p className="truncate text-sm text-background/70">
                {[booking.location, booking.guests ? `${booking.guests} pax` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </Link>
        {chat(
          <button
            type="button"
            aria-label={`Message ${name}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-background transition-colors hover:bg-white/15"
          >
            <MessageSquare className="h-5 w-5" />
          </button>,
        )}
      </section>

      {/* ---------- Tablet / desktop: full card ---------- */}
      <section className="hidden flex-1 flex-col gap-5 rounded-2xl bg-foreground p-6 text-background md:flex">
        <p className="text-xs font-bold tracking-wider text-background/70">UP NEXT · {when}</p>

        <div className="flex items-center gap-4">
          <DateBlock date={booking.date} tone="brand" size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{title}</p>
            <p className="truncate text-sm text-background/70">
              {name}
              {time && ` · ${time}`}
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-background/80">
          {booking.location && (
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{booking.location}</span>
            </li>
          )}
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            {booking.guests ? `${booking.guests} guests · ` : ""}
            {booking.status === "PAID" ? "Paid" : "Awaiting payment"}
          </li>
        </ul>

        <div className="mt-auto grid grid-cols-2 gap-2">
          {chat(
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-semibold text-background transition-colors hover:bg-white/15"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </button>,
          ) ?? <span />}
          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-background text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            View booking
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ================================================================
   PHONE STATS (3 small tiles)
================================================================ */

/** Splits money into a small "RM" and a short number, e.g. { prefix: "RM", value: "13.5k" }. */
function compactRM(input: unknown) {
  const n = Number(input ?? 0)
  const value =
    n < 1000
      ? n.toLocaleString("en-MY", { maximumFractionDigits: 0 })
      : new Intl.NumberFormat("en-MY", { notation: "compact", maximumFractionDigits: 1 })
          .format(n)
          .toLowerCase()
  return { prefix: "RM", value }
}

export function MobileStats({
  bookingsThisMonth,
  earned,
  awaiting,
}: {
  bookingsThisMonth: number
  earned: unknown
  awaiting: unknown
}) {
  const tiles = [
    { label: "Bookings", sub: "this month", prefix: null, value: String(bookingsThisMonth) },
    { label: "Earned", sub: "all time", ...compactRM(earned) },
    { label: "Unpaid", sub: "accepted", ...compactRM(awaiting) },
  ]

  return (
    <div className="md:hidden">
      <MobileSectionLabel>At a glance</MobileSectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map((t) => (
          <div key={t.label} className="min-w-0 rounded-2xl border border-border bg-card px-3 py-3.5">
            <p className="truncate text-xs text-muted-foreground">{t.label}</p>
            <p className="mt-1 truncate font-display text-xl font-extrabold leading-tight tracking-tight text-foreground">
              {t.prefix && <span className="mr-0.5 text-xs font-bold">{t.prefix}</span>}
              {t.value}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">{t.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   UPCOMING BOOKINGS
   Phones: simple list · Tablet/desktop: table
================================================================ */

export function UpcomingBookingsTable({ bookings }: { bookings: VendorBooking[] }) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between md:hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Upcoming
        </h2>
        <Link href="/dashboard/bookings" className="text-sm font-semibold text-foreground">
          View all
        </Link>
      </div>

      <Panel className="overflow-hidden">
        <div className="hidden md:block">
          <PanelHeader
            title="Upcoming bookings"
            action={
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>

        {bookings.length === 0 ? (
          <div className="md:border-t md:border-border">
            <EmptyState
              icon={<CalendarDays className="h-5 w-5" />}
              title="No upcoming bookings"
              description="Requests and confirmed bookings for future dates will appear here."
            />
          </div>
        ) : (
          <>
            {/* ---------- Phones ---------- */}
            <ul className="md:hidden">
              {bookings.map((b, i) => (
                <li key={b.id} className={cn(i > 0 && "border-t border-border")}>
                  <Link
                    href={`/dashboard/bookings/${b.id}`}
                    className="flex items-center gap-4 px-4 py-4"
                  >
                    <DateBlock date={b.date} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {b.event?.title ?? "Event"}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {plannerName(b)}
                        {b.guests ? ` · ${b.guests} pax` : ""}
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                    <p className="shrink-0 self-start font-semibold text-foreground">
                      {formatRM(b.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ---------- Tablet / desktop ---------- */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-t border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
                    <th scope="col" className="w-[88px] py-3 pl-6 pr-4 font-semibold">Date</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Event</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Value</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="w-[76px] py-3 pl-4 pr-6">
                      <span className="sr-only">Message</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => {
                    const name = plannerName(b)
                    return (
                      <tr key={b.id} className="border-t border-border transition-colors hover:bg-muted/40">
                        <td className="py-4 pl-6 pr-4 align-middle">
                          <DateBlock date={b.date} />
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <Link
                            href={`/dashboard/bookings/${b.id}`}
                            className="block font-semibold text-foreground hover:text-brand"
                          >
                            {b.event?.title ?? "Event"}
                          </Link>
                          <span className="text-muted-foreground">
                            {name}
                            {b.guests ? ` · ${b.guests} pax` : ""}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-middle text-foreground">
                          {b.service?.name ?? "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 align-middle font-semibold text-foreground">
                          {formatRM(b.price)}
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <StatusBadge status={b.status} />
                        </td>

                        <td className="py-4 pl-4 pr-6 text-right align-middle">
                          {b.organizer ? (
                            <BookingChatDialog
                              bookingId={b.id}
                              peerId={b.organizer.id}
                              title={`Planner — ${name}`}
                              description={chatDescription(b)}
                              trigger={
                                <button
                                  type="button"
                                  aria-label={`Message ${name}`}
                                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </button>
                              }
                            />
                          ) : null}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  )
}
