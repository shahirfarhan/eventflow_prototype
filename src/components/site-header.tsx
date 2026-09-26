import { MessageSquare, Bell, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { MessagesDropdown } from "./messages-dropdown";
import { UserDropdown } from "./user-dropdown";
import { NotificationBell } from "./notifications-bell";

function Logo() {
  return (
    <svg
      aria-hidden="true"
      width={30}
      height={30}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground"
    >
      <path d="M16.4 8.1C16.4 4.6 11.6 3.7 9 5.8C6.3 8 6.9 12.7 10.5 13C13.5 13.2 16.4 11.4 16.4 8.1Z" />
      <path d="M16.4 8V17.4C16.4 21.2 12.6 22.6 9.4 20.7" />
    </svg>
  )
}

export async function SiteHeader() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/gaffers_logo.png"
            alt="Gaffers"
            className="h-7 w-7 object-contain"
          />
          <span className="text-xl font-bold tracking-tight">Gaffers</span>
        </a>

        <nav className="flex items-center gap-5 text-sm font-medium sm:gap-7">
          <Link
              href="/vendors"
              className="hidden text-foreground/80 transition-colors hover:text-foreground sm:inline"
            >
              Vendors
          </Link>
          <Link
            href="/dashboard"
            className="hidden text-foreground/80 transition-colors hover:text-foreground sm:inline"
          >
            Dashboard
          </Link>
          {/* <button
            type="button"
            aria-label="Messages"
            className="rounded-md p-1.5 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <MessageSquare className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-md p-1.5 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" />
          </button>
          <button type="button" className="flex items-center gap-1 text-foreground">
            <span className="hidden sm:inline">shahir</span>
            <ChevronDown className="size-4" aria-hidden="true" />
          </button> */}

           {session?.user ? (
              <div className="flex items-center gap-4">
                <MessagesDropdown />
                  {/* <Button variant="ghost" size="sm">Dashboard</Button> */}
                  {/* <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                    Login

                </Link> */}
                <NotificationBell />
                <UserDropdown name={session.user.name ?? session.user.email ?? 'Account'} />
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