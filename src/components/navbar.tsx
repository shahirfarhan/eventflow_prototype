import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Image from "next/image";
import { MessagesDropdown } from "./messages-dropdown";
import { UserDropdown } from "./user-dropdown";
import { NotificationBell } from "./notifications-bell";

const linkClass =
  "whitespace-nowrap text-xs font-medium underline-offset-4 hover:underline sm:text-sm";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center border-b px-3 sm:px-4 lg:px-6">
      <Link className="flex shrink-0 items-center gap-2 sm:gap-4" href="/">
        <Image
          src="/gaffers_logo.png"
          alt="Gaffers logo"
          width={28}
          height={28}
          className="object-contain"
        />
        <span className="hidden text-xl font-bold min-[420px]:inline">Gaffers</span>
      </Link>

      <nav className="ml-auto flex min-w-0 items-center gap-2 sm:gap-6">
        {session?.user && (
          <>
            <Link className={linkClass} href="/vendors">
              Vendors
            </Link>
            {/* Desktop/tablet only; on mobile it lives in the user dropdown */}
            <Link className={`hidden sm:inline ${linkClass}`} href="/dashboard">
              Dashboard
            </Link>
          </>
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
    </header>
  );
}