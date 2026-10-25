'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bookmark, LogOut, Settings } from 'lucide-react'

interface UserDropdownProps {
  name: string
  /** Optional: shows "Vendor" / "Planner" and the email under the name */
  role?: string | null
  email?: string | null
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().substring(0, 2).toUpperCase() || '?'
}

const itemClass = 'cursor-pointer gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium'

const roleLabel: Record<string, string> = {
  VENDOR: 'Vendor',
  ORGANIZER: 'Planner',
  ADMIN: 'Admin',
}

export function UserDropdown({ name, role, email }: UserDropdownProps) {
  const initials = initialsFor(name)
  const subtitle =
    [role ? roleLabel[role] ?? null : null, email].filter(Boolean).join(' · ') || 'Signed in'

  return (
    <DropdownMenu>
      {/* Just the initials circle */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account: ${name}`}
          title={name}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs font-bold text-brand-strong ring-offset-2 ring-offset-background transition-shadow hover:ring-2 hover:ring-brand/30 data-[state=open]:ring-2 data-[state=open]:ring-brand/40"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl p-1.5">
        {/* Who's signed in */}
        <div className="flex items-center gap-3 px-2.5 pb-3 pt-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-muted text-sm font-bold text-brand-strong">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="mx-1" />

        {role === 'VENDOR' && (
          <DropdownMenuItem asChild className={itemClass}>
            <Link href="/dashboard/profile">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Profile settings
            </Link>
          </DropdownMenuItem>
        )}

        {role === 'ORGANIZER' && (
          <DropdownMenuItem asChild className={itemClass}>
            <Link href="/dashboard?tab=saved">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              Saved vendors
            </Link>
          </DropdownMenuItem>
        )}

        {(role === 'VENDOR' || role === 'ORGANIZER') && <DropdownMenuSeparator className="mx-1" />}

        <DropdownMenuItem
          className="cursor-pointer gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
