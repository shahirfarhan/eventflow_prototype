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
import { Button } from '@/components/ui/button'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'

interface UserDropdownProps {
  name: string
}

export function UserDropdown({ name }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <span className="max-w-[90px] truncate sm:max-w-none">{name}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Mobile only: on sm+ the Dashboard link is in the navbar */}
        <DropdownMenuItem asChild className="cursor-pointer sm:hidden">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}