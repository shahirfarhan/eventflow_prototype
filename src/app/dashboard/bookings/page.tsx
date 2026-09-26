import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BookingsList from "./bookings-list";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/dashboard");
  }

  const role = session.user.role;

  let where: any = {};

  if (role === "ORGANIZER") {
    where = {
      event: {
        organizerId: session.user.id,
      },
    };
  } else if (role === "VENDOR") {
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
              <h2 className="text-lg font-semibold">
                Vendor profile not found
              </h2>

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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const events = Array.from(
    new Map(
      bookings.map((booking) => [
        booking.eventId,
        booking.event,
      ])
    ).values()
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">
              {role === "VENDOR" ? "Vendor Dashboard" : "Event Dashboard"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Bookings
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your booking requests and payments.
            </p>
          </div>
        </div>

        {/* Booking List */}
        <div className="mt-8">
          <BookingsList
            bookings={bookings as any}
            userRole={role}
            events={events}
          />
        </div>

      </main>
    </div>
  );
}

