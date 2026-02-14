import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BookingDialog from "./booking-dialog";

export default async function VendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      services: {
        include: {
          packages: true,
        },
      },
    },
  });

  if (!vendor) {
    notFound();
  }

  // Fetch organizer's events to allow selecting which event to book for
  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { date: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/vendors" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.businessName}</h1>
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              {vendor.location}
              <Badge variant="outline" className="ml-4">
                {vendor.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">
                {vendor.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <div className="grid gap-4">
              {vendor.services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Starting at <span className="font-semibold text-primary">${service.basePrice}</span>
                        </CardDescription>
                      </div>
                      <BookingDialog 
                        vendorId={vendor.id}
                        service={service} 
                        events={events}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {service.description || "No description provided."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
               <Button className="w-full mb-2" variant="outline">Message Vendor</Button>
               <p className="text-xs text-center text-gray-400">Response time: Usually within 24h</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
