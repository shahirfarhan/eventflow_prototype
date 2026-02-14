import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="text-xl font-bold">EventFlow</Link>
          <div className="text-sm text-gray-500 mt-1 capitalize">{role.toLowerCase()}</div>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
            Overview
          </Link>
          
          {role === 'VENDOR' && (
            <>
              <Link href="/dashboard/profile" className="block px-4 py-2 rounded hover:bg-gray-100">
                Profile
              </Link>
              <Link href="/dashboard/services" className="block px-4 py-2 rounded hover:bg-gray-100">
                Services & Packages
              </Link>
              <Link href="/dashboard/bookings" className="block px-4 py-2 rounded hover:bg-gray-100">
                Bookings
              </Link>
              <Link href="/dashboard/calendar" className="block px-4 py-2 rounded hover:bg-gray-100">
                Calendar
              </Link>
            </>
          )}

          {role === 'ORGANIZER' && (
            <>
              <Link href="/dashboard/events" className="block px-4 py-2 rounded hover:bg-gray-100">
                My Events
              </Link>
              <Link href="/dashboard/vendors" className="block px-4 py-2 rounded hover:bg-gray-100">
                Find Vendors
              </Link>
              <Link href="/dashboard/bookings" className="block px-4 py-2 rounded hover:bg-gray-100">
                Bookings
              </Link>
            </>
          )}

           {role === 'ADMIN' && (
            <>
              <Link href="/dashboard/users" className="block px-4 py-2 rounded hover:bg-gray-100">
                Users
              </Link>
              <Link href="/dashboard/reports" className="block px-4 py-2 rounded hover:bg-gray-100">
                Reports
              </Link>
            </>
          )}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
