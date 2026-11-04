import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { cn } from "@/lib/utils"
import { getLocale } from "@/lib/i18n-server"
import { getDictionary } from "@/lib/i18n"
import { MessagesDropdown } from "./messages-dropdown"
import { UserDropdown } from "./user-dropdown"
import { NotificationBell } from "./notifications-bell"
import { LanguageToggle } from "./language-toggle"

export async function SiteHeader() {
  const [session, locale] = await Promise.all([auth(), getLocale()])
  const t = getDictionary(locale)

  // Signed-in vendors, planners and admins get the bottom tab bar on phones,
  // which already has a tab for the vendors page
  const hasTabBar =
    session?.user?.role === "VENDOR" ||
    session?.user?.role === "ORGANIZER" ||
    session?.user?.role === "ADMIN"

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

        <nav className="flex min-w-0 items-center gap-2 text-xs font-medium sm:gap-6 sm:text-sm">
          <Link
            href="/vendors"
            className={cn(
              "whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground",
              // Hidden on phones when the bottom tab bar is showing
              hasTabBar && "hidden md:inline"
            )}
          >
            {t.header.vendors}
          </Link>

          {/* Desktop/tablet only; on phones it's in the bottom tab bar */}
          {session?.user && (
            <Link
              href="/dashboard"
              className="hidden whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground md:inline"
            >
              {t.header.dashboard}
            </Link>
          )}

          {/* EN | BM */}
          <LanguageToggle locale={locale} />

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
              <Link href="/login">
                <Button variant="ghost" size="sm">{t.header.logIn}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t.header.getStarted}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
