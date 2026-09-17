import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import BookingDialog from "./booking-dialog";
import BookingChatDialog, { type ChatContextService } from "@/app/dashboard/bookings/booking-chat-dialog";

export default async function VendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      services: {
        include: {
          images: true,
          packages: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!vendor || !vendor.user) {
    notFound();
  }
  const vendorUserId = vendor.user.id;
  const vendorDisplayName = vendor.user.name || vendor.businessName;

  // Fetch organizer's events to allow selecting which event to book for
  const events = await prisma.event.findMany({
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
              {vendor.services.map((service) => {
                const chatCtx: ChatContextService = {
                  id: service.id,
                  name: service.name,
                  description: service.description,
                  basePrice: service.basePrice,
                  vendorId: vendor.id,
                  vendorBusinessName: vendor.businessName,
                  vendorLocation: vendor.location,
                  occasions: service.occasions,
                };
                return (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Starting at <span className="font-semibold text-primary">RM {service.basePrice}</span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                        <BookingChatDialog
                          peerId={vendorUserId}
                          directPeerName={vendorDisplayName}
                          contextService={chatCtx}
                          title={`Vendor — ${vendorDisplayName}`}
                          description={`Vendor: ${vendor.businessName} • Enquiry: ${service.name}`}
                          trigger={
                            <Button size="sm" variant="outline">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contact Vendor
                            </Button>
                          }
                        />
                        <BookingDialog
                          vendorId={vendor.id}
                          service={service}
                          events={events}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {service.description || "No description provided."}
                    </p>

                    {service.occasions && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {service.occasions
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .slice(0, 6)
                          .map((occ) => (
                            <Badge
                              key={occ}
                              variant="secondary"
                              className="text-[11px] px-2.5 py-0.5"
                            >
                              {occ}
                            </Badge>
                          ))}
                      </div>
                    )}

                    {service.images?.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Sample Images</div>
                        <div className="flex flex-wrap gap-2">
                          {service.images.map((img: any) => (
                            <img
                              key={img.id}
                              src={img.url}
                              alt={service.name}
                              className="h-20 w-20 object-cover rounded-md border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {service.packages?.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <div className="text-sm font-medium">Packages</div>
                        <div className="space-y-3">
                          {service.packages.map((pkg: any) => (
                            <div key={pkg.id} className="rounded-md border p-3">
                              <div className="font-medium">{pkg.name}</div>
                              <div className="text-sm text-primary font-semibold">
                                RM {pkg.price.toLocaleString()}
                              </div>
                              {pkg.description && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {pkg.description}
                                </div>
                              )}
                              {pkg.images?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {pkg.images.map((img: any) => (
                                    <img
                                      key={img.id}
                                      src={img.url}
                                      alt={pkg.name}
                                      className="h-16 w-16 object-cover rounded-md border"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingChatDialog
                peerId={vendorUserId}
                directPeerName={vendorDisplayName}
                contextVendorBusinessName={vendor.businessName}
                title={`Vendor — ${vendorDisplayName}`}
                description={`Vendor: ${vendor.businessName}`}
                trigger={
                  <Button className="w-full mb-2" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Vendor
                  </Button>
                }
              />
              <p className="text-xs text-center text-gray-400">Response time: Usually within 24h</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
