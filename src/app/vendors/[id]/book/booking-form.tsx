"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, MapPin, Clock, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import BookingDatePicker from "./booking-date-picker";

interface BookingFormProps {
  vendor: any;
  selectedService: any;
  userEvents: any[];
}

export default function BookingForm({ vendor, selectedService, userEvents }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const selectedEvent = userEvents.find(
    (event) => event.id === selectedEventId
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      vendorId: vendor.id,
      serviceId: selectedService?.id,
      eventId: formData.get("eventId"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),
      guests: formData.get("guests"),
      notes: formData.get("notes"),
      price: selectedService?.basePrice,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit booking");

      toast.success("Booking request submitted successfully!");
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Booking Request Sent!</h2>
            <p className="text-muted-foreground">
              Your request has been sent to {vendor.businessName}. You can track the status in your dashboard.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/vendors">Browse More Vendors</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/bookings">Go to My Bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Tagging</CardTitle>
            <CardDescription>Which event is this booking for?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="eventId">Select Your Event</Label>
              <Select
                name="eventId"
                required
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event..." />
                </SelectTrigger>
                <SelectContent>
                  {userEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} ({new Date(event.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                  {userEvents.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground">
                      No events found. Please create an event first.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps you organize multiple events. Vendors won't see your internal event name.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>When and where is your event taking place?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <BookingDatePicker
                vendorId={vendor.id}
                defaultDate={selectedEvent?.date}
              />
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Input name="time" type="time" className="pl-10" required />
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Event Venue / Location</Label>
              <div className="relative">
                <Input name="location" placeholder="Full address or venue name" className="pl-10" defaultValue={selectedEvent?.location} required />
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
              <Input name="guests" type="number" placeholder="e.g. 100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Special Requirements / Notes</Label>
              <Textarea
                name="notes"
                placeholder="Tell the vendor about your specific needs, themes, or any questions you have."
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild type="button">
            <Link href={`/vendors/${vendor.id}`}>Cancel</Link>
          </Button>
          <Button size="lg" className="px-8" type="submit" disabled={isLoading || userEvents.length === 0}>
            {isLoading ? "Submitting..." : "Submit Booking Request"}
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
    </form>
  );
}
