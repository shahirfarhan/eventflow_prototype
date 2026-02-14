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
        organizerId: session.user.id
      }
    };
  } else if (role === "VENDOR") {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id }
    });
    
    if (!vendorProfile) {
      return <div>Vendor profile not found.</div>;
    }

    where = {
      vendorId: vendorProfile.id
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      event: true,
      service: true,
      vendor: {
        select: {
          businessName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          Manage your booking requests and payments.
        </p>
      </div>

      <BookingsList bookings={bookings as any} userRole={role} />
    </div>
  );
}
