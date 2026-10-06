// import { auth, signOut } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { Calendar, DollarSign, Package } from "lucide-react";
// import AdminDashboardPage from "./admin/page";

// export default async function DashboardPage() {
//   const session = await auth();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   const getDaysUntilEvent = (eventDate: string | Date) => {
//         const today = new Date()
//         const event = new Date(eventDate)

//         // Remove the time portion so we're comparing dates only
//         today.setHours(0, 0, 0, 0)
//         event.setHours(0, 0, 0, 0)

//         const difference = event.getTime() - today.getTime()
//         return Math.ceil(difference / (1000 * 60 * 60 * 24))
//     }

//   const role = session.user.role;

//   if (role === 'ADMIN') {
//     return <AdminDashboardPage />;
//   }

//   // Vendor Overview
//   if (role === 'VENDOR') {
//     const vendor = await prisma.vendorProfile.findUnique({
//         where: { userId: session.user.id },
//         include: { services: true }
//     });

//     if (!vendor) return <div>Complete your profile</div>;

//     const bookings = await prisma.booking.count({
//         where: { vendorId: vendor.id }
//     });

//     const revenue = await prisma.booking.aggregate({
//         where: { vendorId: vendor.id, status: 'PAID' },
//         _sum: { price: true }
//     });

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
//             <div className="grid gap-4 md:grid-cols-3">
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Services</CardTitle>
//                         <Package className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{vendor.services.length}</div>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{bookings}</div>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                         <DollarSign className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">RM{revenue._sum.price || 0}</div>
//                     </CardContent>
//                 </Card>
//             </div>
//              <div className="flex gap-4">
//                 <Link href="/dashboard/bookings">
//                     <Button>View Bookings</Button>
//                 </Link>
//                 <Link href="/dashboard/services">
//                     <Button variant="outline">Manage Services</Button>
//                 </Link>
//             </div>
//         </div>
//     );
//   }

//   // Organizer Overview
//   if (role === 'ORGANIZER') {
//      const events = await prisma.event.findMany({
//         where: { organizerId: session.user.id },
//         orderBy: { date: 'asc' }
//      });

//      return (
//         <div className="space-y-8">
//              <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
             
//              <Card>
//                 <CardHeader>
//                     <CardTitle>Upcoming Events</CardTitle>
//                     <CardDescription>Your next {events.length} events</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {events.length > 0 ? (
//                         <div className="space-y-4">
//                             {events.map(event => (
//                                 <div key={event.id} className="flex justify-between items-center border-b pb-2 last:border-0">
//                                     {/* <div>
//                                         <p className="font-medium">{event.title}</p>
//                                         <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
//                                     </div> */}
//                                 <div>
//                                     <div className="flex items-center gap-2">
//                                         <p className="font-medium">{event.title}</p>
//                                         <span className="text-xs font-normal text-muted-foreground">
//                                             in {getDaysUntilEvent(event.date)} days
//                                         </span>
//                                     </div>

//                                     <p className="text-sm text-muted-foreground">
//                                         {new Date(event.date).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                                     <Button variant="ghost" size="sm" asChild>
//                                         <Link href="/dashboard/events">View</Link>
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-sm text-muted-foreground">No upcoming events.</p>
//                     )}
//                 </CardContent>
//              </Card>

//              <div className="flex gap-4">
//                 <Link href="/dashboard/events">
//                     <Button>Manage Events</Button>
//                 </Link>
//                 <Link href="/dashboard/vendors">
//                     <Button variant="outline">Find Vendors</Button>
//                 </Link>
//             </div>
//         </div>
//      );
//   }

//   return <div>Unknown role</div>;
// }

//-----------------------

// import { CalendarPlus, Search } from "lucide-react"
// import { DashboardNav } from "@/components/dashboard/dashboard-nav"
// import { Stats } from "@/components/dashboard/stats"
// import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
// import { redirect } from "next/navigation";
// import { auth, signOut } from "@/auth";

// export default async function Page() {
//     const session = await auth();

//     if (!session?.user) {
//       redirect("/login");
//     }
//   return (
//     <div className="min-h-screen bg-background">
//       <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <p className="text-sm font-medium text-brand">Overview</p>
//             <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
//               Welcome back, {session.user.name}
//             </h1>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Here&apos;s what&apos;s happening with your events.
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
//             >
//               <CalendarPlus className="h-4 w-4" />
//               Manage Events
//             </button>
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
//             >
//               <Search className="h-4 w-4" />
//               Find Vendors
//             </button>
//           </div>
//         </div>

//         <div className="mt-8">
//           <DashboardNav />
//         </div>

//         <div className="mt-8 space-y-8">
//           <Stats />
//           <UpcomingEvents />
//         </div>
//       </main>
//     </div>
//   )
// }

//----------------------------

import Link from "next/link"
import {
  CalendarPlus,
  Search,
  BriefcaseBusiness,
  CalendarDays,
  DollarSign,
  ArrowRight,
  UserRound,
} from "lucide-react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Stats } from "@/components/dashboard/stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import AdminDashboardPage from "./admin/page"
import EventsList from "./events/events-list"
import BookingsList from "./bookings/bookings-list"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role
  const { tab } = await searchParams
  const activeTab = tab ?? "overview"

  
  

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  if (role === "ADMIN") {
    return <AdminDashboardPage />
  }

  // ============================================================
  // VENDOR DASHBOARD
  // ============================================================

  if (role === "VENDOR") {
    const vendor = await prisma.vendorProfile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        services: true,
      },
    })

    // Vendor has not completed their profile
    if (!vendor) {
      return (
        <div className="min-h-screen bg-background">
          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-brand">Vendor Dashboard</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Welcome back, {session.user.name}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Complete your vendor profile to start receiving bookings.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mx-auto max-w-lg text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <UserRound className="h-7 w-7 text-muted-foreground" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  Complete your vendor profile
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Add your business information, services, pricing and photos
                  so event planners can discover and book you.
                </p>

                <Link
                  href="/dashboard/profile"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      )
    }

    // ============================================================
    // VENDOR DATA
    // ============================================================

    const [bookings, totalBookings, revenue] = await Promise.all([
      prisma.booking.findMany({
        where: {
          vendorId: vendor.id,
        },
        include: {
          organizer: true,
          service: true,
          event: true,
        },
        orderBy: {
          event: {
            date: "asc",
          },
        },
        take: 5,
      }),

      prisma.booking.count({
        where: {
          vendorId: vendor.id,
        },
      }),

      prisma.booking.aggregate({
        where: {
          vendorId: vendor.id,
          status: "PAID",
        },
        _sum: {
          price: true,
        },
      }),
    ])

    const totalRevenue = revenue._sum.price ?? 0

    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand">
                Vendor Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Welcome back, {session.user.name}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Here&apos;s what&apos;s happening with your business.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/services"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Manage Services
              </Link>

              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <CalendarDays className="h-4 w-4" />
                View Bookings
              </Link>
            </div>
          </div>

          {/* ======================================================
              NAVIGATION
          ====================================================== */}

          <div className="mt-8">
            <DashboardNav isVendor={role === "VENDOR"} />
          </div>

          {/* ======================================================
              VENDOR STATS
          ====================================================== */}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            {/* Services */}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Services
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {vendor.services.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Link
                href="/dashboard/services"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                Manage services
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Bookings */}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {totalBookings}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Link
                href="/dashboard/bookings"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                View bookings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Revenue */}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    RM{" "}
                    {Number(totalRevenue).toLocaleString("en-MY", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Revenue from paid bookings
              </p>
            </div>
          </div>

          {/* ======================================================
              BOOKINGS
          ====================================================== */}

          <section className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Upcoming Bookings
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest event bookings and upcoming work.
                </p>
              </div>

              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No bookings yet
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your upcoming bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bookings.map((booking) => {
                  const eventDate = booking.event?.date
                    ? new Date(booking.event.date)
                    : null

                  return (
                    <div
                      key={booking.id}
                      className="flex flex-col gap-4 p-6 transition-colors hover:bg-muted/40 md:flex-row md:items-center md:justify-between"
                    >
                      {/* LEFT */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {booking.event?.title ?? "Event"}
                          </h3>

                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>
                            Client:{" "}
                            <span className="font-medium text-foreground">
                              {booking.organizer?.name ?? "Unknown organizer"}
                            </span>
                          </p>

                          <p>
                            Service:{" "}
                            <span className="font-medium text-foreground">
                              {booking.service?.name ?? "Service"}
                            </span>
                          </p>

                          {eventDate && (
                            <p>
                              Event date:{" "}
                              <span className="font-medium text-foreground">
                                {eventDate.toLocaleDateString("en-MY", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div className="flex items-center justify-between gap-6 md:justify-end">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-muted-foreground">
                            Booking value
                          </p>

                          <p className="mt-1 font-semibold">
                            RM{" "}
                            {Number(booking.price).toLocaleString("en-MY", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <Link
                          href={`/dashboard/bookings/${booking.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    )
  }

  // ============================================================
  // ORGANIZER DASHBOARD
  // ============================================================

  // Get organizer events for the My Events tab
  const events =
  activeTab === "overview" || activeTab === "events" || activeTab === "bookings"
    ? await prisma.event.findMany({
        where: { organizerId: session.user.id },
        orderBy: { date: "asc" },
        include: { _count: { select: { bookings: true } } },
      })
    : []

  const bookings =
    activeTab === "bookings"
      ? await prisma.booking.findMany({
          where: {
            organizerId: session.user.id,
          },
          include: {
            organizer: true,
            service: true,
            event: true,
            vendor: true,
          },
          orderBy: {
            event: {
              date: "asc",
            },
          },
        })
      : []

      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const upcoming = events.filter(e => e.date >= startOfToday).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">
              {activeTab === "events"
                ? "Events"
                : activeTab === "bookings"
                  ? "Bookings"
                  : activeTab === "vendors"
                    ? "Vendors"
                    : "Overview"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome back, {session.user.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === "events"
                ? "Manage your upcoming events and plan details."
                : activeTab === "bookings"
                  ? "Manage your vendor bookings."
                  : activeTab === "vendors"
                    ? "Find vendors for your events."
                    : "Here's what's happening with your events."}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-8">
          <DashboardNav />
        </div>

        {/* CONTENT */}
        <div className="mt-8">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <Stats
                events={events}
              />
              <UpcomingEvents events={upcoming}/>
            </div>
          )}

          {/* MY EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-8">

              {/* Events header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand">
                    Events
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    My Events
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your upcoming events and plan details.
                  </p>
                </div>

                <Link href="/dashboard/events/new">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90">
                    <CalendarPlus className="h-4 w-4" />
                    Create Event
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              <EventsList events={events} />

            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-8">

              {/* Bookings Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand">
                    Bookings
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    My Bookings
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your booking requests and payments.
                  </p>
                </div>
              </div>

              {/* Booking List */}
              <div>
                <BookingsList
                  bookings={bookings as any}
                  userRole={role}
                  events={events}
                />
              </div>

            </div>
          )}

          {/* FIND VENDORS */}
          {activeTab === "vendors" && (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-xl font-semibold">
                Find Vendors
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Find the right vendors for your event.
              </p>

              <Link
                href="/vendors"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                Browse Vendors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

        </div>

      </main>
    </div>
  )

}