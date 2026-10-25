import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import ServicesList from "./services-list";
import Link from "next/link";
import { DashboardHeader, buttonPrimary } from "@/components/dashboard/ui";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

const serviceInclude = {
  images: true,
  packages: {
    include: {
      images: true,
    },
  },
  // Only the status, for the "requests" and "booked" counts on each card
  bookings: {
    select: { status: true },
  },
} as const;

export default async function VendorServicesPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user || (role !== "VENDOR" && role !== "ADMIN")) {
    redirect("/dashboard");
  }

  /* ============================================================
     ADMIN: every vendor's services, read-only
  ============================================================ */

  if (role === "ADMIN") {
    const services = await prisma.service.findMany({
      include: {
        ...serviceInclude,
        vendor: { select: { id: true, businessName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <DashboardHeader
            title="All services"
            description="Every service listed by vendors on Gaffers."
          />

          <DashboardNav isAdmin />

          <ServicesList services={services} adminView />
        </main>
      </div>
    );
  }

  /* ============================================================
     VENDOR: your own services
  ============================================================ */

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold">Vendor profile not found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please complete your vendor profile before adding services.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const [services, pendingCount] = await Promise.all([
    prisma.service.findMany({
      where: { vendorId: vendor.id },
      include: serviceInclude,
      orderBy: { createdAt: "desc" },
    }),
    // Keeps the red badge on the Bookings tab, same as the other dashboard pages
    prisma.booking.count({
      where: { vendorId: vendor.id, status: "PENDING" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <DashboardHeader
          title="Services"
          description="What planners can book from you."
          actions={
            <Link href="/dashboard/services/new" className={buttonPrimary}>
              <Plus className="h-4 w-4" />
              New service
            </Link>
          }
        />

        <DashboardNav isVendor pendingCount={pendingCount} />

        <ServicesList services={services} />
      </main>
    </div>
  );
}
