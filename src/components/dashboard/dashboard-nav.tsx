"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  House,
  LayoutGrid,
  MessageSquare,
  Search,
  Ticket,
  UserRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { UNREAD_EVENT, fetchUnreadTotal } from "@/lib/unread"

/**
 * The unread count from the server is only a starting point. This keeps it live:
 * it updates the moment a chat is opened/read anywhere on the page, and re-checks
 * every 30 seconds in case new messages arrive.
 */
function useLiveUnread(initial: number, enabled: boolean) {
  const [count, setCount] = useState(initial)

  useEffect(() => setCount(initial), [initial])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const refresh = async () => {
      const total = await fetchUnreadTotal()
      if (!cancelled && total !== null) setCount(total)
    }
    const onChange = (e: Event) => {
      const total = (e as CustomEvent<number | undefined>).detail
      if (typeof total === "number") setCount(total)
      else void refresh()
    }

    window.addEventListener(UNREAD_EVENT, onChange)
    void refresh()
    const id = window.setInterval(refresh, 30000)
    return () => {
      cancelled = true
      window.removeEventListener(UNREAD_EVENT, onChange)
      window.clearInterval(id)
    }
  }, [enabled])

  return count
}

type NavItem = {
  label: string
  icon: LucideIcon
  href: string
  /** Items that live on /dashboard?tab=… */
  tab?: string
  badge?: number
  /** Custom rule for when this tab is highlighted */
  match?: (pathname: string, tab: string) => boolean
}

/**
 * Where a planner's "Profile" tab goes on phones. Planners don't have a separate
 * profile page yet, so it opens their dashboard (events, saved vendors).
 * Change this if you add one, e.g. "/dashboard/account".
 */
const ORGANIZER_PROFILE_HREF = "/dashboard"

interface DashboardNavProps {
  isVendor?: boolean
  isOrganizer?: boolean
  /** Admins: Vendors · Dashboard · Bookings · Services (they see everyone's) */
  isAdmin?: boolean
  /** Shown as a red count on the Bookings tab */
  pendingCount?: number
  /** Shown as a red count on the Inbox tab (phones only) */
  unreadCount?: number
  /** Where the Inbox tab goes on phones. Change this if your messages page lives elsewhere. */
  inboxHref?: string
  /** Only render the bottom tab bar (for pages outside the dashboard, e.g. /vendors) */
  mobileOnly?: boolean
}

export function DashboardNav({
  isVendor = false,
  isOrganizer = false,
  isAdmin = false,
  pendingCount = 0,
  unreadCount = 0,
  inboxHref = "/dashboard/inbox",
  mobileOnly = false,
}: DashboardNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const liveUnread = useLiveUnread(unreadCount, isVendor || isOrganizer)
  const activeTab = searchParams.get("tab") ?? "overview"

  const isActive = (item: NavItem) =>
    item.match
      ? item.match(pathname, activeTab)
      : item.tab
      ? pathname === "/dashboard" && activeTab === item.tab
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  /* ---------- Desktop / tablet: segmented bar at the top ---------- */

  const topItems: NavItem[] = isAdmin
    ? [
        { label: "Overview", icon: LayoutGrid, href: "/dashboard", match: (p) => p === "/dashboard" },
        { label: "All Bookings", icon: Ticket, href: "/dashboard/bookings" },
        { label: "All Services", icon: Briefcase, href: "/dashboard/services" },
        { label: "Vendors", icon: Search, href: "/vendors" },
      ]
    : isVendor
    ? [
        { label: "Overview", icon: LayoutGrid, href: "/dashboard", tab: "overview" },
        { label: "Bookings", icon: Ticket, href: "/dashboard/bookings", badge: pendingCount },
        { label: "My Services", icon: Briefcase, href: "/dashboard/services" },
        { label: "Profile", icon: UserRound, href: "/dashboard/profile" },
      ]
    : [
        { label: "Overview", icon: LayoutGrid, href: "/dashboard", tab: "overview" },
        ...(isOrganizer
          ? [{ label: "My Events", icon: CalendarDays, href: "/dashboard?tab=events", tab: "events" }]
          : []),
        { label: "Bookings", icon: Ticket, href: "/dashboard?tab=bookings", tab: "bookings", badge: pendingCount },
        { label: "Find Vendors", icon: Search, href: "/vendors" },
        { label: "Saved Vendors", icon: Bookmark, href: "/dashboard?tab=saved", tab: "saved" },
      ]

  /* ---------- Phones: tab bar fixed to the bottom ---------- */

  const onVendorsPage = (p: string) => p === "/vendors" || p.startsWith("/vendors/")

  const bottomItems: NavItem[] = isAdmin
    ? // Admins: Vendors · Dashboard · Bookings · Services (all read across every user)
      [
        { label: "Vendors", icon: Search, href: "/vendors", match: (p) => onVendorsPage(p) },
        { label: "Dashboard", icon: LayoutGrid, href: "/dashboard", match: (p) => p === "/dashboard" },
        { label: "Bookings", icon: CalendarDays, href: "/dashboard/bookings" },
        { label: "Services", icon: Briefcase, href: "/dashboard/services" },
      ]
    : isVendor
    ? // Vendors: Home · Dashboard · Inbox · Bookings · Services (Inbox in the middle)
      [
        {
          label: "Home",
          icon: House,
          href: "/",
          // Vendors have no Vendors tab, so browsing vendors counts as Home
          match: (p) => p === "/" || onVendorsPage(p),
        },
        { label: "Dashboard", icon: LayoutGrid, href: "/dashboard", tab: "overview" },
        { label: "Inbox", icon: MessageSquare, href: inboxHref, badge: liveUnread },
        { label: "Bookings", icon: CalendarDays, href: "/dashboard/bookings", badge: pendingCount },
        { label: "Services", icon: Briefcase, href: "/dashboard/services" },
      ]
    : // Planners: Home · Vendors · Inbox · Bookings · Profile (Inbox in the middle)
      [
        { label: "Home", icon: House, href: "/", match: (p) => p === "/" },
        { label: "Vendors", icon: Search, href: "/vendors", match: (p) => onVendorsPage(p) },
        { label: "Inbox", icon: MessageSquare, href: inboxHref, badge: liveUnread },
        {
          label: "Bookings",
          icon: Ticket,
          href: "/dashboard?tab=bookings",
          badge: pendingCount,
          match: (p, tab) =>
            (p === "/dashboard" && tab === "bookings") || p.startsWith("/dashboard/bookings"),
        },
        {
          label: "Profile",
          icon: UserRound,
          href: ORGANIZER_PROFILE_HREF,
          // Lit anywhere else in the dashboard (overview, events, saved vendors…)
          match: (p, tab) =>
            p.startsWith("/dashboard") &&
            !(p === "/dashboard" && tab === "bookings") &&
            !p.startsWith("/dashboard/bookings") &&
            !p.startsWith(inboxHref),
        },
      ]

  return (
    <>
      {!mobileOnly && (
      <nav
        aria-label="Dashboard"
        className="hidden md:block md:overflow-x-auto"
      >
        <div className="inline-flex min-w-max gap-1 rounded-xl bg-border p-1">
          {topItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm transition-colors",
                  active
                    ? "bg-card font-semibold text-foreground shadow-sm"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {!!item.badge && item.badge > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
      )}

      <nav
        aria-label="Dashboard"
        className="mobile-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
        /* margin: 0 stops a parent's space-y-* from pushing the bar up off the bottom edge */
        style={{ margin: 0, paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex">
          {bottomItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 pb-2 pt-3 text-[11px]",
                  active ? "font-bold text-foreground" : "font-medium text-muted-foreground",
                )}
              >
                <span className="relative">
                  <item.icon className="h-6 w-6" strokeWidth={active ? 2.2 : 1.8} />
                  {!!item.badge && item.badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </span>
                {item.label}
                <span
                  className={cn("h-1 w-1 rounded-full", active ? "bg-brand" : "bg-transparent")}
                />
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
