import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock, Info } from "lucide-react";
import Link from "next/link";

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

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      services: {
        where: serviceId ? { id: serviceId } : undefined,
      },
    },
  });

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

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>When and where is your event taking place?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <div className="relative">
                      <Input id="date" type="date" className="pl-10" required />
                      <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Start Time</Label>
                    <div className="relative">
                      <Input id="time" type="time" className="pl-10" required />
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Event Venue / Location</Label>
                  <div className="relative">
                    <Input id="location" placeholder="Full address or venue name" className="pl-10" required />
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Help the vendor understand your requirements better.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Estimated Guest Count</Label>
                  <Input id="guests" type="number" placeholder="e.g. 100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requirements / Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tell the vendor about your specific needs, themes, or any questions you have."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={`/vendors/${id}`}>Cancel</Link>
              </Button>
              <Button size="lg" className="px-8">
                Submit Booking Request
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="font-medium">{vendor.businessName}</p>
                  <p className="text-sm text-muted-foreground">{vendor.category}</p>
                </div>

                {selectedService && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                      <span>Base Price:</span>
                      <span className="text-primary">RM {selectedService.basePrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="bg-muted p-3 rounded-lg flex gap-3 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />
                  <p>
                    This is a booking request. The vendor will review your details and confirm availability before payment is required.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
