import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BookingsList from "./bookings-list";
import { DashboardHeader } from "@/components/dashboard/ui";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/dashboard");
  }

  const role = session.user.role;
  const isVendor = role === "VENDOR";
  const isAdmin = role === "ADMIN";

  let where: any = {};

  if (role === "ORGANIZER") {
    where = {
      event: {
        organizerId: session.user.id,
      },
    };
  } else if (isVendor) {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!vendorProfile) {
      return (
        <div className="min-h-screen bg-background">
          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <h2 className="text-lg font-semibold">Vendor profile not found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please complete your vendor profile before viewing bookings.
              </p>
            </div>
          </main>
        </div>
      );
    }

    where = {
      vendorId: vendorProfile.id,
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      event: true,
      service: true,
      package: true,
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      vendor: {
        select: {
          businessName: true,
          id: true,
          userId: true, // so "Message vendor" can find your existing chat
          paymentQrUrl: true, // shown in the "Pay now" pop-up
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const events = Array.from(
    new Map(bookings.map((booking) => [booking.eventId, booking.event])).values(),
  );

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-28 pt-10 sm:px-6 md:pb-10 lg:px-8">
        <DashboardHeader
          title={isAdmin ? "All bookings" : "Bookings"}
          description={
            isAdmin
              ? "Every booking between planners and vendors on Gaffers."
              : isVendor
                ? "Respond to requests and keep track of every event."
                : "Track your requests, payments and vendors for every event."
          }
        />

        <DashboardNav
          isVendor={isVendor}
          isOrganizer={role === "ORGANIZER"}
          isAdmin={isAdmin}
          pendingCount={isVendor ? pendingCount : 0}
        />

        <BookingsList bookings={bookings as any} userRole={role} events={events} />
      </main>
    </div>
  );
}
