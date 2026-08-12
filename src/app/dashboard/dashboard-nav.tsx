'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Role = 'ORGANIZER' | 'VENDOR' | 'ADMIN' | string

function isActive(currentPath: string, href: string) {
  if (href === '/dashboard') {
    return currentPath === '/dashboard'
  }
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

function navLinkClass(isActiveMatch: boolean) {
  return `block px-4 py-2 rounded transition-colors ${
    isActiveMatch
      ? 'bg-gray-100 text-gray-900 font-medium'
      : 'hover:bg-gray-100 text-gray-700'
  }`
}

export default function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const currentPath = pathname ?? '/dashboard'

  return (
    <nav className="p-4 space-y-2">
      <Link href="/dashboard" className={navLinkClass(isActive(currentPath, '/dashboard'))}>
        Overview
      </Link>

      {role === 'VENDOR' && (
        <>
          <Link
            href="/dashboard/profile"
            className={navLinkClass(isActive(currentPath, '/dashboard/profile'))}
          >
            Profile
          </Link>
          <Link
            href="/dashboard/services"
            className={navLinkClass(isActive(currentPath, '/dashboard/services'))}
          >
            Services &amp; Packages
          </Link>
          <Link
            href="/dashboard/bookings"
            className={navLinkClass(isActive(currentPath, '/dashboard/bookings'))}
          >
            Bookings
          </Link>
          <Link
            href="/dashboard/calendar"
            className={navLinkClass(isActive(currentPath, '/dashboard/calendar'))}
          >
            Calendar
          </Link>
        </>
      )}

      {role === 'ORGANIZER' && (
        <>
          <Link
            href="/dashboard/events"
            className={navLinkClass(isActive(currentPath, '/dashboard/events'))}
          >
            My Events
          </Link>
          <Link
            href="/vendors"
            className={navLinkClass(isActive(currentPath, '/vendors'))}
          >
            Find Vendors
          </Link>
          <Link
            href="/dashboard/bookings"
            className={navLinkClass(isActive(currentPath, '/dashboard/bookings'))}
          >
            Bookings
          </Link>
        </>
      )}

      {role === 'ADMIN' && (
        <>
          <Link
            href="/dashboard/users"
            className={navLinkClass(isActive(currentPath, '/dashboard/users'))}
          >
            Users
          </Link>
          <Link
            href="/dashboard/reports"
            className={navLinkClass(isActive(currentPath, '/dashboard/reports'))}
          >
            Reports
          </Link>
        </>
      )}
    </nav>
  )
}
