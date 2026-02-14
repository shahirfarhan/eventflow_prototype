import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Calendar, DollarSign } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch data directly since it's a server component
   const [usersCount, vendorsCount, organizersCount, bookingsCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "ORGANIZER" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: "PAID" },
      _sum: { price: true }
    })
  ]);

  const stats = [
    {
      title: "Total Users",
      value: usersCount,
      icon: Users,
      description: "Registered users on platform"
    },
    {
      title: "Active Vendors",
      value: vendorsCount,
      icon: Store,
      description: "Service providers"
    },
    {
      title: "Total Bookings",
      value: bookingsCount,
      icon: Calendar,
      description: "All time bookings"
    },
    {
      title: "Total Revenue",
      value: `$${(revenue._sum.price || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Processed payments"
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">System logs would appear here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
