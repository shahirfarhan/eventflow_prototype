import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { MessagesDropdown } from "./messages-dropdown";
import { UserDropdown } from "./user-dropdown";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-xl">Gaffers</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href={session?.user? "/vendors" : "/login"}>
          Vendors
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href={session?.user? "/dashboard" : "/login"}>
          Dashboard
        </Link>
        
        {session?.user ? (
          <div className="flex items-center gap-4">
            <MessagesDropdown />
              {/* <Button variant="ghost" size="sm">Dashboard</Button> */}
              {/* <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                Login

            </Link> */}
            <UserDropdown name={session.user.name ?? session.user.email ?? 'Account'} />
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
