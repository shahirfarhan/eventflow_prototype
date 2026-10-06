import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { MessagesDropdown } from "./messages-dropdown"
import { UserDropdown } from "./user-dropdown"
import { NotificationBell } from "./notifications-bell"

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/gaffers_logo.png"
            alt="Gaffers"
            className="h-7 w-7 object-contain"
          />
          <span className="hidden text-xl font-bold tracking-tight min-[420px]:inline">
            Gaffers
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-2 text-xs font-medium sm:gap-7 sm:text-sm">
          <Link
            href="/vendors"
            className="whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground"
          >
            Vendors
          </Link>

          {/* Desktop/tablet only; on mobile it's in the user dropdown */}
          {session?.user && (
            <Link
              href="/dashboard"
              className="hidden whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground sm:inline"
            >
              Dashboard
            </Link>
          )}

          {session?.user ? (
            <div className="flex shrink-0 items-center gap-1 sm:gap-4">
              <MessagesDropdown />
              <NotificationBell />
              <UserDropdown name={session.user.name ?? session.user.email ?? "Account"} />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}