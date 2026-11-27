import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  CalendarCheck,
  History,
  PieChart,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { getLocale } from "@/lib/i18n-server"
import { dateLocale, getDictionary } from "@/lib/i18n"
import VendorApprovals from "@/components/admin/vendor-approvals"
import ReviewedVendors, { type ReviewedVendor } from "@/components/admin/reviewed-vendors"
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

const formatDate = (d: Date, dl: string) =>
  d.toLocaleDateString(dl, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
  })

const todayLabel = (dl: string) =>
  new Intl.DateTimeFormat(dl, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIME_ZONE,
  }).format(new Date())

/**
 * "Users by role" and "Vendors by category" only count people who joined on or after this date
 * (27 Oct 2026, midnight Malaysia time), so earlier test accounts are left out.
 */
const ROLE_STATS_SINCE = new Date("2026-10-26T00:00:00+08:00")

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
   DOUGHNUT CHART (plain SVG, no chart library)
================================================================ */

// Full class names so Tailwind keeps them: `stroke` colours the slice, `dot` the legend
const SLICE_COLORS = [
  { stroke: "text-brand", dot: "bg-brand" },
  { stroke: "text-violet-500", dot: "bg-violet-500" },
  { stroke: "text-amber-400", dot: "bg-amber-400" },
  { stroke: "text-emerald-500", dot: "bg-emerald-500" },
  { stroke: "text-sky-500", dot: "bg-sky-500" },
  { stroke: "text-pink-500", dot: "bg-pink-500" },
  { stroke: "text-teal-700", dot: "bg-teal-700" },
]
const OTHER_COLOR = { stroke: "text-stone-300", dot: "bg-stone-300" }

function Doughnut({
  slices,
  total,
  centerLabel,
}: {
  slices: { label: string; count: number; stroke: string }[]
  total: number
  centerLabel: string
}) {
  // A circle with r = 15.9155 has a circumference of 100, so each slice's
  // length is simply its percentage. Slices start at 12 o'clock.
  const R = 15.9155
  const GAP = slices.length > 1 ? 0.8 : 0
  let start = 0

  return (
    <div className="relative mx-auto" style={{ width: 176, height: 176 }}>
      <svg viewBox="0 0 42 42" width="176" height="176" role="img" aria-label={centerLabel}>
        {/* Track */}
        <circle cx="21" cy="21" r={R} fill="none" strokeWidth="6" className="text-muted" stroke="currentColor" />
        {total > 0 &&
          slices.map((s) => {
            const pct = (s.count / total) * 100
            const dash = Math.max(pct - GAP, 0.01)
            const offset = 25 - start // 25 = start at the top
            start += pct
            return (
              <circle
                key={s.label}
                cx="21"
                cy="21"
                r={R}
                fill="none"
                strokeWidth="6"
                stroke="currentColor"
                className={s.stroke}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={offset}
              >
                <title>{`${s.label}: ${s.count}`}</title>
              </circle>
            )
          })}
      </svg>
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <span className="font-display text-3xl font-extrabold tracking-tight text-foreground">
          {total.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
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

  const locale = await getLocale()
  const t = getDictionary(locale).admin
  const dl = dateLocale(locale)

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
    usersSince,
    vendorsSince,
    organizersSince,
    categoryRows,
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
      take: 10, // fills the space beside Users by role + the category chart
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
    // All reviewed vendors (panel shows 5, "Show all" shows the rest), with full details for the popup
    prisma.user.findMany({
      where: {
        role: "VENDOR",
        vendorStatus: { in: ["APPROVED", "REJECTED"] },
        reviewedAt: { not: null }, // skips vendors bulk-approved before this feature
      },
      orderBy: { reviewedAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        location: true,
        createdAt: true,
        vendorStatus: true,
        rejectionReason: true,
        reviewedAt: true,
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            category: true,
            description: true,
            occasions: true,
            location: true,
            phoneNumber: true,
            website: true,
            instagram: true,
            facebook: true,
            tiktok: true,
            youtube: true,
            twitter: true,
            linkedin: true,
          },
        },
      },
    }),
    // For "Users by role": only accounts created on or after ROLE_STATS_SINCE
    prisma.user.count({ where: { createdAt: { gte: ROLE_STATS_SINCE } } }),
    prisma.user.count({ where: { role: "VENDOR", createdAt: { gte: ROLE_STATS_SINCE } } }),
    prisma.user.count({ where: { role: "ORGANIZER", createdAt: { gte: ROLE_STATS_SINCE } } }),
    // For "Vendors by category": same cut-off as "Users by role" (by account sign-up date)
    prisma.vendorProfile.findMany({
      where: { user: { createdAt: { gte: ROLE_STATS_SINCE } } },
      select: { category: true, user: { select: { vendorStatus: true } } },
    }),
  ])

  const totalRevenue = Number(revenue._sum.price ?? 0)
  const paidCount = revenue._count._all

  // "Users by role" uses only accounts created since ROLE_STATS_SINCE
  const others = Math.max(usersSince - vendorsSince - organizersSince, 0)
  const pct = (n: number) => (usersSince ? (n / usersSince) * 100 : 0)
  const roles = [
    { label: t.roleVendors, count: vendorsSince, bar: "bg-brand" },
    { label: t.rolePlanners, count: organizersSince, bar: "bg-violet-500" },
    { label: t.roleOthers, count: others, bar: "bg-muted-foreground/40" },
  ]

  /* ---------- Recently reviewed: plain data for the popup ---------- */
  const reviewedVendors: ReviewedVendor[] = recentlyReviewed.map((v) => {
    const p = v.vendorProfile
    return {
      id: v.id,
      profileId: p?.id ?? null,
      businessName: p?.businessName ?? null,
      contactName: v.name,
      email: v.email,
      phoneNumber: p?.phoneNumber ?? v.phoneNumber,
      location: p?.location ?? v.location,
      category: p?.category ?? null,
      description: p?.description ?? null,
      occasions: p?.occasions ?? null,
      website: p?.website ?? null,
      socials: {
        instagram: p?.instagram ?? null,
        facebook: p?.facebook ?? null,
        tiktok: p?.tiktok ?? null,
        youtube: p?.youtube ?? null,
        twitter: p?.twitter ?? null,
        linkedin: p?.linkedin ?? null,
      },
      status: v.vendorStatus === "APPROVED" ? "APPROVED" : "REJECTED",
      rejectionReason: v.rejectionReason,
      reviewedAt: v.reviewedAt?.toISOString() ?? null,
      createdAt: v.createdAt.toISOString(),
    }
  })

  /* ---------- Vendors by category (rejected vendors not counted) ---------- */
  const byCategory = new Map<string, { live: number; pending: number }>()
  for (const row of categoryRows) {
    const status = row.user.vendorStatus
    if (status === "REJECTED") continue
    const key = row.category?.trim() || t.noCategory
    const entry = byCategory.get(key) ?? { live: 0, pending: 0 }
    if (status === "PENDING") entry.pending++
    else entry.live++ // APPROVED (or older vendors with no status)
    byCategory.set(key, entry)
  }
  const categoryStats = Array.from(byCategory, ([name, c]) => ({
    name,
    ...c,
    total: c.live + c.pending,
  })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
  const categoryVendorTotal = categoryStats.reduce((sum, c) => sum + c.total, 0)

  // Doughnut: biggest 7 categories get their own colour, the rest are grouped as "Other"
  const TOP_SLICES = 7
  const topCategories = categoryStats.slice(0, TOP_SLICES)
  const restCategories = categoryStats.slice(TOP_SLICES)
  const slices = [
    ...topCategories.map((c, i) => ({ label: c.name, count: c.total, ...SLICE_COLORS[i] })),
    ...(restCategories.length > 0
      ? [
          {
            label: t.otherCategories(restCategories.length),
            count: restCategories.reduce((sum, c) => sum + c.total, 0),
            ...OTHER_COLOR,
          },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 sm:px-6 md:space-y-8 md:pt-10 lg:px-8">
        {/* ========================================================
            HEADER
        ======================================================== */}
        <DashboardHeader
          eyebrow={todayLabel(dl)}
          title={t.title}
          description={t.description}
          actions={
            pendingVendors.length > 0 ? (
              <a
                href="#vendor-approvals"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-amber-50 px-4 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
              >
                <UserCheck className="h-4 w-4" />
                {t.awaitingApproval(pendingVendors.length)}
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
                {t.totalRevenue}
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
                {t.fromPaid(paidCount)}
              </p>
            </div>
          </div>

          <StatTile
            label={t.users}
            value={usersCount.toLocaleString()}
            hint={t.plusThisMonth(newUsersThisMonth)}
            icon={Users}
            tone="bg-blue-50 text-blue-700"
          />
          <StatTile
            label={t.events}
            value={eventsCount.toLocaleString()}
            hint={t.upcoming(upcomingEvents)}
            icon={CalendarCheck}
            tone="bg-violet-50 text-violet-700"
          />
          <StatTile
            label={t.bookings}
            value={bookingsCount.toLocaleString()}
            hint={t.plusThisMonth(bookingsThisMonth)}
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
                  {t.recentlyReviewed}
                </span>
              }
              description={t.recentlyReviewedDesc}
            />

            {/* Latest 5 · tap a vendor for full details · "Show all" for the rest */}
            <ReviewedVendors vendors={reviewedVendors} locale={locale} />
          </Panel>
        </div>

        {/* ========================================================
            RECENT BOOKINGS + USERS BY ROLE
        ======================================================== */}
        <div className="grid grid-cols-1 items-start gap-6 md:gap-5 lg:grid-cols-3 lg:items-stretch">
          <Panel className="min-w-0 overflow-hidden lg:col-span-2">
            <PanelHeader
              title={t.recentBookings}
              description={t.latestBookings(recentBookings.length)}
              action={
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand"
                >
                  {t.viewAll} <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />

            {recentBookings.length === 0 ? (
              <div className="border-t border-border">
                <EmptyState
                  icon={<Ticket className="h-5 w-5" />}
                  title={t.noBookings}
                  description={t.noBookingsDesc}
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
                          {b.event?.title ?? t.untitledEvent}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {b.organizer?.name ?? t.planner} → {b.vendor?.businessName ?? t.vendor}
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

          {/* Right column: Users by role, then Vendors by category */}
          <div className="flex min-w-0 flex-col gap-6 md:gap-5">
          <Panel className="min-w-0">
            <PanelHeader
              title={t.usersByRole}
              description={t.joinedSince(usersSince, formatDate(ROLE_STATS_SINCE, dl))}
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
                <TrendingUp className="h-3.5 w-3.5" />
                {t.newThisMonth(newUsersThisMonth)}
              </p>
            </div>
          </Panel>

          {/* Vendors by category (doughnut) */}
          <Panel className="min-w-0">
            <PanelHeader
              title={
                <span className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                  {t.vendorsByCategory}
                </span>
              }
              description={t.vendorsByCategoryDesc(categoryVendorTotal, categoryStats.length, formatDate(ROLE_STATS_SINCE, dl))}
            />

            {categoryStats.length === 0 ? (
              <p className="border-t border-border px-5 py-6 text-sm text-muted-foreground sm:px-6">
                {t.noVendorsYet}
              </p>
            ) : (
              <div className="space-y-5 border-t border-border px-5 py-5 sm:px-6">
                <Doughnut slices={slices} total={categoryVendorTotal} centerLabel={t.vendorsLabel} />

                <ul className="space-y-2.5">
                  {slices.map((s) => (
                    <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-foreground">
                        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.dot)} />
                        <span className="truncate">{s.label}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-foreground">
                        {s.count.toLocaleString()}
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          {((s.count / categoryVendorTotal) * 100).toFixed(0)}%
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>
          </div>
        </div>
      </main>
    </div>
  )
}
