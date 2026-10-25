import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  History,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  XCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import VendorApprovals from "@/components/admin/vendor-approvals"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import {
  APP_TIME_ZONE,
  DashboardHeader,
  DateBlock,
  EmptyState,
  Panel,
  PanelHeader,
  StatusBadge,
  formatRM,
} from "@/components/dashboard/ui"

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
  })

const todayLabel = () =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIME_ZONE,
  }).format(new Date())

const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`

/* ================================================================
   STAT TILE (compact on phones, roomier on desktop)
================================================================ */

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  tone: string
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-3.5 sm:p-5">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl",
          tone,
        )}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
      <p className="mt-3 truncate text-xs text-muted-foreground sm:mt-4 sm:text-sm">{label}</p>
      <p className="truncate font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] font-semibold text-muted-foreground sm:text-xs">
        {hint}
      </p>
    </div>
  )
}

/* ================================================================
   PAGE
================================================================ */

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    usersCount,
    vendorsCount,
    organizersCount,
    eventsCount,
    bookingsCount,
    revenue,
    newUsersThisMonth,
    bookingsThisMonth,
    upcomingEvents,
    recentBookings,
    pendingVendors,
    recentlyReviewed,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "ORGANIZER" } }),
    prisma.event.count(),
    prisma.booking.count(),
    // A booking stays paid after the vendor marks it COMPLETED, so count both
    prisma.booking.aggregate({
      where: { status: { in: ["PAID", "COMPLETED"] } },
      _sum: { price: true },
      _count: { _all: true },
    }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.event.count({ where: { date: { gte: now } } }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        event: { select: { title: true } },
        vendor: { select: { businessName: true } },
        organizer: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "VENDOR", vendorStatus: "PENDING" },
      orderBy: { createdAt: "asc" }, // oldest first, so nobody waits forever
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        location: true,
        createdAt: true,
        vendorProfile: {
          select: {
            businessName: true,
            category: true,
            description: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        role: "VENDOR",
        vendorStatus: { in: ["APPROVED", "REJECTED"] },
        reviewedAt: { not: null }, // skips vendors bulk-approved before this feature
      },
      orderBy: { reviewedAt: "desc" },
      take: 8,
      select: {
        id: true,
        name: true,
        vendorStatus: true,
        rejectionReason: true,
        reviewedAt: true,
        vendorProfile: {
          select: { businessName: true, category: true },
        },
      },
    }),
  ])

  const totalRevenue = Number(revenue._sum.price ?? 0)
  const paidCount = revenue._count._all

  const others = Math.max(usersCount - vendorsCount - organizersCount, 0)
  const pct = (n: number) => (usersCount ? (n / usersCount) * 100 : 0)
  const roles = [
    { label: "Vendors", count: vendorsCount, bar: "bg-brand" },
    { label: "Planners", count: organizersCount, bar: "bg-violet-500" },
    { label: "Admins & other", count: others, bar: "bg-muted-foreground/40" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 sm:px-6 md:space-y-8 md:pt-10 lg:px-8">
        {/* ========================================================
            HEADER
        ======================================================== */}
        <DashboardHeader
          eyebrow={todayLabel()}
          title="Admin dashboard"
          description="A snapshot of users, events and bookings across Gaffers."
          actions={
            pendingVendors.length > 0 ? (
              <a
                href="#vendor-approvals"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-amber-50 px-4 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
              >
                <UserCheck className="h-4 w-4" />
                {plural(pendingVendors.length, "vendor")} awaiting approval
              </a>
            ) : undefined
          }
        />

        {/* Top tabs on desktop · bottom tab bar on phones */}
        <DashboardNav isAdmin />

        {/* ========================================================
            STATS
            Phones: big revenue card, then 3 small tiles in a row
            Desktop: revenue card + 3 tiles across one row
        ======================================================== */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {/* Revenue: the headline number, dark like the "Up next" card */}
          <div className="col-span-3 flex flex-col justify-between gap-6 rounded-2xl bg-foreground p-5 text-background sm:p-6 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-background/70">
                Total revenue
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Wallet className="h-5 w-5" />
              </span>
            </div>
            <div>
              <p className="font-display text-4xl font-extrabold tracking-tight">
                {formatRM(totalRevenue)}
              </p>
              <p className="mt-1 text-sm text-background/70">
                From {plural(paidCount, "paid booking")}
              </p>
            </div>
          </div>

          <StatTile
            label="Users"
            value={usersCount.toLocaleString()}
            hint={`+${newUsersThisMonth.toLocaleString()} this month`}
            icon={Users}
            tone="bg-blue-50 text-blue-700"
          />
          <StatTile
            label="Events"
            value={eventsCount.toLocaleString()}
            hint={`${upcomingEvents.toLocaleString()} upcoming`}
            icon={CalendarCheck}
            tone="bg-violet-50 text-violet-700"
          />
          <StatTile
            label="Bookings"
            value={bookingsCount.toLocaleString()}
            hint={`+${bookingsThisMonth.toLocaleString()} this month`}
            icon={Ticket}
            tone="bg-brand-muted text-brand-strong"
          />
        </div>

        {/* ========================================================
            VENDOR APPROVALS + RECENTLY REVIEWED
        ======================================================== */}
        <div className="grid grid-cols-1 items-start gap-6 md:gap-5 lg:grid-cols-3">
          <div id="vendor-approvals" className="min-w-0 scroll-mt-24 lg:col-span-2">
            <VendorApprovals
              vendors={pendingVendors.map((v) => ({
                id: v.id,
                name: v.vendorProfile?.businessName ?? v.name,
                email: v.email,
                phoneNumber: v.phoneNumber,
                location: v.location,
                category: v.vendorProfile?.category ?? null,
                description: v.vendorProfile?.description ?? null,
                createdAt: v.createdAt.toISOString(),
              }))}
            />
          </div>

          <Panel className="min-w-0 overflow-hidden">
            <PanelHeader
              title={
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Recently reviewed
                </span>
              }
              description="Latest vendor approval decisions"
            />

            {recentlyReviewed.length === 0 ? (
              <p className="border-t border-border px-5 py-6 text-sm text-muted-foreground sm:px-6">
                No decisions yet. Approved and rejected vendors will show up here.
              </p>
            ) : (
              <ul>
                {recentlyReviewed.map((v) => {
                  const approved = v.vendorStatus === "APPROVED"
                  return (
                    <li
                      key={v.id}
                      className="flex items-start gap-3 border-t border-border px-5 py-4 sm:px-6"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          approved ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                        )}
                      >
                        {approved ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {v.vendorProfile?.businessName ?? v.name ?? "Unnamed business"}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
                              approved
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700",
                            )}
                          >
                            {approved ? "Approved" : "Rejected"}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {v.vendorProfile?.category ?? "No category"}
                          {v.reviewedAt && <> · {formatDate(v.reviewedAt)}</>}
                        </p>
                        {!approved && v.rejectionReason && (
                          <p className="mt-1.5 line-clamp-2 text-xs italic text-muted-foreground">
                            &ldquo;{v.rejectionReason}&rdquo;
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        {/* ========================================================
            RECENT BOOKINGS + USERS BY ROLE
        ======================================================== */}
        <div className="grid grid-cols-1 items-start gap-6 md:gap-5 lg:grid-cols-3">
          <Panel className="min-w-0 overflow-hidden lg:col-span-2">
            <PanelHeader
              title="Recent bookings"
              description={`The latest ${recentBookings.length} bookings made`}
              action={
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />

            {recentBookings.length === 0 ? (
              <div className="border-t border-border">
                <EmptyState
                  icon={<Ticket className="h-5 w-5" />}
                  title="No bookings yet"
                  description="They'll appear here as vendors get booked."
                />
              </div>
            ) : (
              <ul>
                {recentBookings.map((b) => (
                  <li key={b.id} className="border-t border-border">
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-6"
                    >
                      <DateBlock date={b.date} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">
                          {b.event?.title ?? "Untitled event"}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {b.organizer?.name ?? "Planner"} → {b.vendor?.businessName ?? "Vendor"}
                        </p>
                      </div>
                      {/* Price and status stack on phones, sit side by side on desktop */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          {formatRM(Number(b.price ?? 0))}
                        </span>
                        <StatusBadge status={b.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel className="min-w-0">
            <PanelHeader
              title="Users by role"
              description={`${usersCount.toLocaleString()} users in total`}
            />

            <div className="space-y-5 border-t border-border px-5 py-5 sm:px-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                {roles.map((r) => (
                  <div key={r.label} className={r.bar} style={{ width: `${pct(r.count)}%` }} />
                ))}
              </div>
              <ul className="space-y-3">
                {roles.map((r) => (
                  <li key={r.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className={cn("h-2.5 w-2.5 rounded-full", r.bar)} />
                      {r.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {r.count.toLocaleString()}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        {pct(r.count).toFixed(0)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />+{newUsersThisMonth.toLocaleString()} new
                this month
              </p>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  )
}
