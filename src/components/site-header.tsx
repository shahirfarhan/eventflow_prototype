import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { cn } from "@/lib/utils"
import { MessagesDropdown } from "./messages-dropdown"
import { UserDropdown } from "./user-dropdown"
import { NotificationBell } from "./notifications-bell"

export async function SiteHeader() {
  const session = await auth()

  // Signed-in vendors and planners get the bottom tab bar on phones,
  // which already has a Home tab for the vendors page
  const hasTabBar =
    session?.user?.role === "VENDOR" || session?.user?.role === "ORGANIZER"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/gaffers_logo.png"
            alt="Gaffers"
            className="h-9 w-9 object-contain"
          />
          <span className="hidden text-xl font-bold tracking-tight min-[420px]:inline">
            Gaffers
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-2 text-xs font-medium sm:gap-7 sm:text-sm">
          <Link
            href="/vendors"
            className={cn(
              "whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground",
              // Hidden on phones when the bottom tab bar is showing
              hasTabBar && "hidden md:inline"
            )}
          >
            Vendors
          </Link>

          {/* Desktop/tablet only; on phones it's in the bottom tab bar */}
          {session?.user && (
            <Link
              href="/dashboard"
              className="hidden whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground md:inline"
            >
              Dashboard
            </Link>
          )}

          {session?.user ? (
            <div className="flex shrink-0 items-center gap-1 sm:gap-4">
              {/* Phones use the Inbox tab in the bottom bar instead */}
              <span className="hidden md:inline-flex">
                <MessagesDropdown />
              </span>
              <NotificationBell />
              <UserDropdown
                name={session.user.name ?? session.user.email ?? "Account"}
                role={session.user.role}
                email={session.user.email}
              />
            </div>
          ) : (
            <>
              <Link href="/vendors">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Vendors
                </Button>
              </Link>
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