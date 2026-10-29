import Link from "next/link"
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  MapPin,
  Plus,
  Search,
  UserRound,
  Wallet,
} from "lucide-react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Stats } from "@/components/dashboard/stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import {
  APP_TIME_ZONE,
  DashboardHeader,
  EmptyState,
  Panel,
  StatCard,
  buttonPrimary,
  formatRM,
} from "@/components/dashboard/ui"
import { SaveVendorButton } from "@/components/save-vendor-button"
import { AvailabilityButton } from "@/components/dashboard/availability-dialog"

import AdminDashboardPage from "./admin/page"
import EventsList from "./events/events-list"
import BookingsList from "./bookings/bookings-list"
import {
  AttentionCard,
  MobileStats,
  UpNextCard,
  UpcomingBookingsTable,
  type AttentionItem,
} from "@/components/dashboard/vendor-overview"

/* ================================================================
   Helpers
================================================================ */

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: APP_TIME_ZONE,
    }).format(new Date()),
  )
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function todayLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIME_ZONE,
  }).format(new Date())
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role
  const { tab } = await searchParams
  const activeTab = tab ?? "overview"
  const firstName = session.user.name ?? "there"

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  if (role === "ADMIN") {
    // The admin page renders its own tabs (top on desktop, bottom bar on phones)
    return <AdminDashboardPage />
  }

  // ============================================================
  // VENDOR DASHBOARD
  // ============================================================

  if (role === "VENDOR") {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id },
      include: { services: true },
    })

    // Vendor has not completed their profile
    if (!vendor) {
      return (
        <div className="min-h-screen bg-background">
          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <DashboardHeader
              eyebrow={todayLabel()}
              title={`${greeting()}, ${firstName}`}
              description="Complete your vendor profile to start receiving bookings."
            />

            <Panel className="mt-8">
              <EmptyState
                icon={<UserRound className="h-6 w-6" />}
                title="Complete your vendor profile"
                description="Add your business information, services, pricing and photos so event planners can discover and book you."
                action={
                  <Link href="/dashboard/profile" className={buttonPrimary}>
                    Complete profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </Panel>
          </main>
        </div>
      )
    }

    // ============================================================
    // VENDOR DATA
    // ============================================================

    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [upcoming, earned, awaiting, thisMonthCount, lastMonthCount] = await Promise.all([
      // Only future, still-active bookings (no COMPLETED / REJECTED / CANCELLED)
      prisma.booking.findMany({
        where: {
          vendorId: vendor.id,
          status: { in: ["PENDING", "ACCEPTED", "PAYMENT_PENDING", "PAID"] },
          date: { gte: startOfToday },
        },
        include: { organizer: true, service: true, event: true },
        orderBy: { date: "asc" },
        take: 20,
      }),

      // Money in: a booking stays paid after the vendor marks it COMPLETED
      prisma.booking.aggregate({
        where: { vendorId: vendor.id, status: { in: ["PAID", "COMPLETED"] } },
        _sum: { price: true },
        _count: { _all: true },
      }),

      // Accepted by the vendor, not yet paid by the planner
      prisma.booking.aggregate({
        where: { vendorId: vendor.id, status: "ACCEPTED" },
        _sum: { price: true },
        _count: { _all: true },
      }),

      prisma.booking.count({
        where: {
          vendorId: vendor.id,
          status: { notIn: ["REJECTED", "CANCELLED"] },
          date: { gte: startOfMonth, lt: startOfNextMonth },
        },
      }),

      prisma.booking.count({
        where: {
          vendorId: vendor.id,
          status: { notIn: ["REJECTED", "CANCELLED"] },
          date: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
    ])

    const pending = upcoming.filter((b) => b.status === "PENDING")
    // Accepted, waiting for the vendor to check the receipt, or paid
    const confirmed = upcoming.filter(
      (b) => b.status === "ACCEPTED" || b.status === "PAYMENT_PENDING" || b.status === "PAID",
    )
    const unpaid = confirmed.filter((b) => b.status === "ACCEPTED")
    const dueToday = confirmed.filter(
      (b) => isSameDay(new Date(b.date), now) && !b.vendorProvidedAt,
    )

    // ---------- Needs your attention ----------
    const attention: AttentionItem[] = []

    if (pending.length > 0) {
      attention.push({
        href: "/dashboard/bookings",
        icon: CalendarDays,
        tone: "brand",
        title: `${plural(pending.length, "new booking request")}`,
        detail: pending
          .slice(0, 2)
          .map((b) => `${b.organizer?.name ?? "Planner"} · ${b.event?.title ?? b.service?.name ?? "Event"}`)
          .join(", "),
        chip: "Reply soon",
      })
    }

    if (dueToday.length > 0) {
      attention.push({
        href: "/dashboard/bookings",
        icon: CheckCircle2,
        tone: "green",
        title: `Mark ${plural(dueToday.length, "booking")} as provided`,
        detail: "Happening today. Confirm once you've delivered the service",
      })
    }

    if (unpaid.length > 0) {
      const unpaidTotal = unpaid.reduce((sum, b) => sum + Number(b.price), 0)
      attention.push({
        href: "/dashboard/bookings",
        icon: Wallet,
        tone: "blue",
        title: `${plural(unpaid.length, "booking")} awaiting payment`,
        detail: `${formatRM(unpaidTotal)} accepted, not yet paid by the planner`,
      })
    }

    if (vendor.services.length === 0) {
      attention.push({
        href: "/dashboard/services",
        icon: BriefcaseBusiness,
        tone: "neutral",
        title: "Add your first service",
        detail: "Planners can't book you until you list at least one service",
      })
    }

    // ---------- Stats ----------
    const monthDiff = thisMonthCount - lastMonthCount
    const lastMonthName = startOfLastMonth.toLocaleDateString("en-GB", { month: "long" })
    const earnedCount = earned._count._all
    const awaitingCount = awaiting._count._all

    // Unread messages, for the red count on the Inbox tab (phones)
    const unreadCount = await prisma.message.count({
      where: { receiverId: session.user.id, readAt: null },
    })

    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          {/* HEADER — phones */}
          <div className="flex items-end justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <p className="text-muted-foreground">{greeting()},</p>
              <h1 className="truncate font-display text-3xl font-extrabold tracking-tight text-foreground">
                {firstName}
              </h1>
            </div>
            <AvailabilityButton className="h-10 shrink-0 px-3" />
          </div>

          {/* HEADER — tablet / desktop */}
          <div className="hidden md:block">
            <DashboardHeader
              eyebrow={todayLabel()}
              title={`${greeting()}, ${firstName}`}
              actions={
                <div className="flex flex-wrap gap-2">
                  {/* Block days off; bookings block their dates automatically */}
                  <AvailabilityButton />
                  <Link href="/dashboard/services" className={buttonPrimary}>
                    <Plus className="h-4 w-4" />
                    New service
                  </Link>
                </div>
              }
            />
          </div>

          {/* NAVIGATION: top bar on desktop, bottom tab bar on phones */}
          <div className="md:mt-6">
            <DashboardNav isVendor pendingCount={pending.length} unreadCount={unreadCount} />
          </div>

          {/* ATTENTION + UP NEXT */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:gap-5 lg:grid-cols-3">
            <AttentionCard items={attention} />
            <UpNextCard booking={confirmed[0]} />
          </div>

          {/* STATS — phones */}
          <div className="mt-6 md:hidden">
            <MobileStats
              bookingsThisMonth={thisMonthCount}
              earned={earned._sum.price}
              awaiting={awaiting._sum.price}
            />
          </div>

          {/* STATS — tablet / desktop */}
          <div className="mt-5 hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4">
            <StatCard
              label="Bookings this month"
              value={thisMonthCount}
              hint={`${monthDiff >= 0 ? "+" : ""}${monthDiff} vs ${lastMonthName}`}
              tone={monthDiff > 0 ? "positive" : "muted"}
            />
            <StatCard
              label="Earned"
              value={formatRM(earned._sum.price)}
              hint={`From ${plural(earnedCount, "paid booking")}`}
            />
            <StatCard
              label="Awaiting payment"
              value={formatRM(awaiting._sum.price)}
              hint={awaitingCount > 0 ? `${plural(awaitingCount, "accepted booking")} unpaid` : "Nothing outstanding"}
              tone={awaitingCount > 0 ? "warning" : "muted"}
            />
            <StatCard
              label="Live services"
              value={vendor.services.length}
              hint="Listed on your profile"
            />
          </div>

          {/* UPCOMING BOOKINGS */}
          <div className="mt-6 md:mt-5">
            <UpcomingBookingsTable bookings={upcoming.slice(0, 6)} />
          </div>
        </main>
      </div>
    )
  }

  // ============================================================
  // ORGANIZER DASHBOARD
  // ============================================================

  const events =
    activeTab === "overview" || activeTab === "events" || activeTab === "bookings"
      ? await prisma.event.findMany({
          where: { organizerId: session.user.id },
          orderBy: { date: "asc" },
          include: { _count: { select: { bookings: true } } },
        })
      : []

  const bookings =
    activeTab === "bookings"
      ? await prisma.booking.findMany({
          where: { organizerId: session.user.id },
          include: { organizer: true, service: true, event: true, vendor: true },
          orderBy: { event: { date: "asc" } },
        })
      : []

  const savedVendors =
    activeTab === "saved"
      ? await prisma.savedVendor.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          include: {
            vendor: { include: { services: { select: { basePrice: true } } } },
          },
        })
      : []

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const upcoming = events.filter((e) => e.date >= startOfToday).slice(0, 5)

  const headerCopy: Record<string, { title: string; description: string }> = {
    overview: { title: `${greeting()}, ${firstName}`, description: "Here's what's happening with your events." },
    events: { title: "My events", description: "Manage your upcoming events and plan details." },
    bookings: { title: "Bookings", description: "Manage your vendor bookings and payments." },
    saved: { title: "Saved vendors", description: "Vendors you've saved for later." },
  }
  const header = headerCopy[activeTab] ?? headerCopy.overview

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* HEADER */}
        <DashboardHeader
          eyebrow={todayLabel()}
          title={header.title}
          description={header.description}
          actions={
            // Overview already has a "Create event" button in the Upcoming events card
            activeTab === "events" ? (
              <Link href="/dashboard/events/new" className={buttonPrimary}>
                <CalendarPlus className="h-4 w-4" />
                Create event
              </Link>
            ) : undefined
          }
        />

        {/* NAVIGATION */}
        <div className="mt-6">
          <DashboardNav isOrganizer={role === "ORGANIZER"} />
        </div>

        {/* CONTENT */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <Stats events={events} />
              <UpcomingEvents events={upcoming} />
            </div>
          )}

          {activeTab === "events" && <EventsList events={events} />}

          {activeTab === "bookings" && (
            <BookingsList bookings={bookings as any} userRole={role} events={events} />
          )}

          {activeTab === "vendors" && (
            <Panel>
              <EmptyState
                icon={<Search className="h-5 w-5" />}
                title="Find vendors"
                description="Browse photographers, caterers, venues and more for your event."
                action={
                  <Link href="/vendors" className={buttonPrimary}>
                    <Search className="h-4 w-4" />
                    Browse vendors
                  </Link>
                }
              />
            </Panel>
          )}

          {activeTab === "saved" &&
            (savedVendors.length === 0 ? (
              <Panel>
                <EmptyState
                  icon={<Bookmark className="h-5 w-5" />}
                  title="No saved vendors yet"
                  description="Tap the bookmark icon on any vendor to save it here."
                  action={
                    <Link href="/vendors" className={buttonPrimary}>
                      <Search className="h-4 w-4" />
                      Browse vendors
                    </Link>
                  }
                />
              </Panel>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {savedVendors.map(({ vendor }) => {
                  const minPrice =
                    vendor.services.length > 0
                      ? Math.min(...vendor.services.map((s) => s.basePrice))
                      : null

                  return (
                    <div key={vendor.id} className="relative h-full">
                      <SaveVendorButton
                        vendorId={vendor.id}
                        initialSaved
                        className="absolute left-4 top-4 z-10"
                      />
                      <Link href={`/vendors/${vendor.id}`} className="group block h-full">
                        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                            {vendor.imageUrl ? (
                              <img
                                src={vendor.imageUrl}
                                alt={`${vendor.businessName} — ${vendor.category}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-sm text-muted-foreground">No image yet</span>
                              </div>
                            )}
                            <span className="absolute right-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground">
                              {vendor.category}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col gap-2 p-5">
                            <h3 className="text-base font-semibold text-foreground">{vendor.businessName}</h3>
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="size-4 shrink-0" aria-hidden="true" />
                              {vendor.location}
                            </p>
                            {minPrice !== null && (
                              <p className="mt-auto pt-2 text-sm">
                                <span className="font-semibold text-foreground">From {formatRM(minPrice)}</span>
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </main>
    </div>
  )
}
