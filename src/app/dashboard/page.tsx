import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, DollarSign, Package } from "lucide-react";
import AdminDashboardPage from "./admin/page";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === 'ADMIN') {
    return <AdminDashboardPage />;
  }

  // Vendor Overview
  if (role === 'VENDOR') {
    const vendor = await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id },
        include: { services: true }
    });

    if (!vendor) return <div>Complete your profile</div>;

    const bookings = await prisma.booking.count({
        where: { vendorId: vendor.id }
    });

    const revenue = await prisma.booking.aggregate({
        where: { vendorId: vendor.id, status: 'PAID' },
        _sum: { price: true }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendor.services.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${revenue._sum.price || 0}</div>
                    </CardContent>
                </Card>
            </div>
             <div className="flex gap-4">
                <Link href="/dashboard/bookings">
                    <Button>View Bookings</Button>
                </Link>
                <Link href="/dashboard/services">
                    <Button variant="outline">Manage Services</Button>
                </Link>
            </div>
        </div>
    );
  }

  // Organizer Overview
  if (role === 'ORGANIZER') {
     const events = await prisma.event.findMany({
        where: { organizerId: session.user.id },
        orderBy: { date: 'asc' },
        take: 3
     });

     return (
        <div className="space-y-8">
             <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
             
             <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your next 3 events</CardDescription>
                </CardHeader>
                <CardContent>
                    {events.length > 0 ? (
                        <div className="space-y-4">
                            {events.map(event => (
                                <div key={event.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/dashboard/events">View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No upcoming events.</p>
                    )}
                </CardContent>
             </Card>

             <div className="flex gap-4">
                <Link href="/dashboard/events">
                    <Button>Manage Events</Button>
                </Link>
                <Link href="/dashboard/vendors">
                    <Button variant="outline">Find Vendors</Button>
                </Link>
            </div>
        </div>
     );
  }

  return <div>Unknown role</div>;
}
