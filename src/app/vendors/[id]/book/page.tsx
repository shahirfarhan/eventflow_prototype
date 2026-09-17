import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import BookingForm from "./booking-form";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const { id } = await params;
  const { serviceId } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/vendors/${id}/book`);
  }

  const [vendor, userEvents] = await Promise.all([
    prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        services: {
          where: serviceId ? { id: serviceId } : undefined,
        },
      },
    }),
    prisma.event.findMany({
      where: { organizerId: session.user.id },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        title: true,
        date: true,
        startTime: true,
        endTime: true,
        location: true,
        headcount: true,
        budgetMin: true,
        budgetMax: true,
        minAge: true,
        maxAge: true,
        venueType: true,
        venueAccess: true,
      },
    }),
  ]);

  if (!vendor) notFound();

  const selectedService = vendor.services[0];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Booking</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to request a booking with {vendor.businessName}.
          </p>
        </div>

        <BookingForm 
          vendor={vendor} 
          selectedService={selectedService} 
          userEvents={userEvents} 
        />
      </div>
    </div>
  );
}
