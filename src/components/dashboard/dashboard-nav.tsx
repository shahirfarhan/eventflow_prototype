"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CalendarDays,
  LayoutGrid,
  Search,
  Ticket,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: LucideIcon
  tab: string
  href?: string
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    icon: LayoutGrid,
    tab: "overview",
  },
  {
    label: "My Events",
    icon: CalendarDays,
    tab: "events",
  },
  {
    label: "Bookings",
    icon: Ticket,
    tab: "bookings",
  },
  {
    label: "Find Vendors",
    icon: Search,
    tab: "vendors",
    href: "/vendors",
  },
]

export function DashboardNav() {
  const searchParams = useSearchParams()

  const activeTab = searchParams.get("tab") ?? "overview"

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
      {navItems.map((item) => {
        const isActive = activeTab === item.tab

        return (
          <Link
            key={item.label}
            href={
              item.href ??
              (item.tab === "overview"
                ? "/dashboard"
                : `/dashboard?tab=${item.tab}`)
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}