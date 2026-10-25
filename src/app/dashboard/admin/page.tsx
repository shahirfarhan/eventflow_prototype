import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
  Users,
  Calendar,
  Wallet,
  CalendarCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import VendorApprovals from "@/components/admin/vendor-approvals"

const formatRM = (n: number) =>
  `RM ${n.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })

type Stat = {
  title: string
  value: string | number
  icon: LucideIcon
  description: string
  tone: string
}

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const [
    usersCount,
    vendorsCount,
    organizersCount,
    eventsCount,
    bookingsCount,
    revenue,
    recentBookings,
    pendingVendors,
    recentlyReviewed,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "ORGANIZER" } }),
    prisma.event.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: "PAID" },
      _sum: { price: true },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { event: { select: { title: true } } },
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

  const stats: Stat[] = [
    {
      title: "Total revenue",
      value: formatRM(totalRevenue),
      icon: Wallet,
      description: "From paid bookings",
      tone: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total users",
      value: usersCount.toLocaleString(),
      icon: Users,
      description: "Registered on the platform",
      tone: "bg-sky-100 text-sky-600",
    },
    {
      title: "Events",
      value: eventsCount.toLocaleString(),
      icon: CalendarCheck,
      description: "Created by organizers",
      tone: "bg-violet-100 text-violet-600",
    },
    {
      title: "Bookings",
      value: bookingsCount.toLocaleString(),
      icon: Calendar,
      description: "All time",
      tone: "bg-amber-100 text-amber-600",
    },
  ]

  const others = Math.max(usersCount - vendorsCount - organizersCount, 0)
  const pct = (n: number) => (usersCount ? (n / usersCount) * 100 : 0)
  const roles = [
    { label: "Vendors", count: vendorsCount, bar: "bg-brand" },
    { label: "Organizers", count: organizersCount, bar: "bg-violet-500" },
    { label: "Admins & other", count: others, bar: "bg-muted-foreground/40" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of users, events and bookings across the platform.
            </p>
          </div>

          {pendingVendors.length > 0 && (
            <a
              href="#vendor-approvals"
              className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200"
            >
              <UserCheck className="h-4 w-4" />
              {pendingVendors.length} vendor{pendingVendors.length === 1 ? "" : "s"} awaiting approval
            </a>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  stat.tone,
                )}
              >
                <stat.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="truncate text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor approvals + recently reviewed */}
        <div className="grid items-start gap-4 lg:grid-cols-3">
          <div id="vendor-approvals" className="scroll-mt-24 lg:col-span-2">
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

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                <History className="h-4 w-4 text-muted-foreground" />
                Recently reviewed
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Latest vendor approval decisions
              </p>
            </div>

            {recentlyReviewed.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No decisions yet. Approved and rejected vendors will show up here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentlyReviewed.map((v) => {
                  const approved = v.vendorStatus === "APPROVED"
                  return (
                    <li key={v.id} className="flex items-start gap-3 p-4 sm:px-6">
                      {approved ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {v.vendorProfile?.businessName ?? v.name ?? "Unnamed business"}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                              approved
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700",
                            )}
                          >
                            {approved ? "Approved" : "Rejected"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
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
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent bookings */}
          <section className="rounded-xl border border-border bg-card lg:col-span-2">
            <div className="border-b border-border p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Recent bookings
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                The latest {recentBookings.length} bookings made
              </p>
            </div>

            {recentBookings.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">
                No bookings yet. They will appear here as vendors get booked.
              </p>
            )}

            <ul className="divide-y divide-border">
              {recentBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/50 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {b.event?.title ?? "Untitled event"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(b.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {formatRM(Number(b.price ?? 0))}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        b.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {String(b.status).toLowerCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Users by role */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Users by role
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {usersCount.toLocaleString()} users in total
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                {roles.map((r) => (
                  <div
                    key={r.label}
                    className={r.bar}
                    style={{ width: `${pct(r.count)}%` }}
                  />
                ))}
              </div>
              <ul className="space-y-3">
                {roles.map((r) => (
                  <li key={r.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className={cn("h-2.5 w-2.5 rounded-full", r.bar)} />
                      {r.label}
                    </span>
                    <span className="font-medium text-foreground">
                      {r.count.toLocaleString()}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        {pct(r.count).toFixed(0)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
