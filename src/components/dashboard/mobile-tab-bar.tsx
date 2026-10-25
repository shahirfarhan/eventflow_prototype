import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

/**
 * Drop <MobileTabBar /> anywhere on a page (home page, vendor pages…)
 * to give signed-in vendors, planners and admins the bottom tab bar on phones.
 * Shows nothing for visitors who aren't logged in, and nothing on desktop.
 */
export async function MobileTabBar() {
  const session = await auth()
  const role = session?.user?.role
  const userId = session?.user?.id

  if (!userId || (role !== "VENDOR" && role !== "ORGANIZER" && role !== "ADMIN")) return null

  // Admins have no badges, so skip the counting
  if (role === "ADMIN") return <DashboardNav mobileOnly isAdmin />

  // Counts for the red badges on Bookings and Inbox
  const [pendingCount, unreadCount] = await Promise.all([
    role === "VENDOR"
      ? prisma.booking.count({ where: { vendor: { userId }, status: "PENDING" } })
      : Promise.resolve(0),
    prisma.message.count({ where: { receiverId: userId, readAt: null } }),
  ])

  // The space under the page (so the bar doesn't cover the footer) comes from
  // the body::after rule in globals.css, so this can go anywhere on the page.
  return (
    <DashboardNav
      mobileOnly
      isVendor={role === "VENDOR"}
      isOrganizer={role === "ORGANIZER"}
      pendingCount={pendingCount}
      unreadCount={unreadCount}
    />
  )
}
