// app/dashboard/events/[eventId]/page.tsx
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Users,
  Wallet,
  Building2,
  StickyNote,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type EventDetailsPageProps = {
  params: Promise<{ eventId: string }>
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatRange(min: unknown, max: unknown, single?: unknown) {
  const fmt = (v: unknown) => `RM ${Number(v).toLocaleString("en-MY")}`
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`
  if (single != null) return fmt(single)
  return null
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ORGANIZER") redirect("/dashboard")

  const { eventId } = await params

  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId: session.user.id },
    include: { _count: { select: { bookings: true } } },
  })

  if (!event) notFound()

  const time =
    event.startTime && event.endTime
      ? `${event.startTime} – ${event.endTime}`
      : event.startTime ?? null

  const age =
    event.minAge != null && event.maxAge != null
      ? `${event.minAge} – ${event.maxAge} years`
      : null

  const budget = formatRange(event.budgetMin, event.budgetMax, event.budget)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-brand-muted px-2.5 py-0.5 text-xs font-medium capitalize text-brand">
              {event.type.toLowerCase()}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="mt-1 text-muted-foreground">{formatDate(event.date)}</p>
          </div>
          <Link
            href={`/dashboard/events/${event.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            <Pencil className="h-4 w-4" />
            Edit event
          </Link>
        </header>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold tracking-tight">Event details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail icon={CalendarDays} label="Date" value={formatDate(event.date)} />
            <Detail icon={Clock} label="Time" value={time} />
            <Detail icon={MapPin} label="Location" value={event.location} />
            <Detail
              icon={Users}
              label="Expected guests"
              value={event.headcount ? `${event.headcount} guests` : null}
            />
            <Detail icon={Users} label="Age range" value={age} />
            <Detail icon={Wallet} label="Budget" value={budget} />
            <Detail icon={Building2} label="Venue type" value={event.venueType} />
            <Detail icon={Building2} label="Venue access" value={event.venueAccess} />
          </div>
        </section>

        {event.notes && (
          <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              Notes
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {event.notes}
            </p>
          </section>
        )}

        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">Vendors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {event._count.bookings === 0
              ? "No vendors booked yet."
              : `${event._count.bookings} vendor${event._count.bookings === 1 ? "" : "s"} booked.`}
          </p>
        </section>
      </div>
    </div>
  )
}
