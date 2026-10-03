

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Info, CheckCircle2, Banknote, Home, Sun, LockKeyhole, Building2, Sparkles, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import BookingDatePicker from "./booking-date-picker";
import MalaysiaPlaceAutocomplete from "@/components/address-autocomplete";

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
  const [location, setLocation] = useState("");
  const [venueType, setVenueType] = useState<"" | "INDOOR" | "OUTDOOR">("");
  const [venueAccess, setVenueAccess] = useState<"" | "PUBLIC" | "PRIVATE">("");
  const [minAge, setMinAge] = useState<number | string>(18);
  const [maxAge, setMaxAge] = useState<number | string>(60);
  const [budgetMin, setBudgetMin] = useState<number | string>("");
  const [budgetMax, setBudgetMax] = useState<number | string>("");
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("");
  const [guests, setGuests] = useState<number | string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedEvent = userEvents.find(
    (event) => event.id === selectedEventId
  );

  const totalAmount =
  selectedService?.pricingModel === "PER_PAX" && guests !== ""
    ? selectedService.basePrice * Number(guests)
    : null;

  const applyEventToForm = (ev: any) => {
    if (!ev) return;
    if (ev.location !== undefined && ev.location !== null) setLocation(String(ev.location));
    if (typeof ev.startTime === "string") setStartTime(ev.startTime);
    if (typeof ev.endTime === "string") setEndTime(ev.endTime);
    if (ev.venueType === "INDOOR" || ev.venueType === "OUTDOOR") setVenueType(ev.venueType);
    else setVenueType("");
    if (ev.venueAccess === "PUBLIC" || ev.venueAccess === "PRIVATE") setVenueAccess(ev.venueAccess);
    else setVenueAccess("");
    if (ev.minAge !== undefined && ev.minAge !== null) setMinAge(Number(ev.minAge));
    if (ev.maxAge !== undefined && ev.maxAge !== null) setMaxAge(Number(ev.maxAge));
    if (ev.budgetMin !== undefined && ev.budgetMin !== null) setBudgetMin(Number(ev.budgetMin));
    else setBudgetMin("");
    if (ev.budgetMax !== undefined && ev.budgetMax !== null) setBudgetMax(Number(ev.budgetMax));
    else setBudgetMax("");
    if (ev.headcount !== undefined && ev.headcount !== null) setGuests(Number(ev.headcount));
    else setGuests("");
  };

  const ageMinPct = typeof minAge === "number" ? Math.min(100, Math.max(0, minAge)) : Number(minAge) || 0;
  const ageMaxPct = typeof maxAge === "number" ? Math.min(100, Math.max(0, maxAge)) : Number(maxAge) || 100;

  const validate = () => {
    const e: Record<string, string> = {};
    const bMin = budgetMin === "" ? null : Number(budgetMin);
    const bMax = budgetMax === "" ? null : Number(budgetMax);
    const aMin = minAge === "" ? null : Number(minAge);
    const aMax = maxAge === "" ? null : Number(maxAge);

    if (!startTime) e.startTime = "Please select a start time";
    if (startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) e.startTime = "Invalid time format";
    if (endTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) e.endTime = "Invalid time format";
    if (startTime && endTime && endTime <= startTime) e.endTime = "End time must be after start time";
    if (bMin !== null && (isNaN(bMin) || bMin < 0)) e.budgetMin = "Min budget must be ≥ 0";
    if (bMax !== null && (isNaN(bMax) || bMax < 0)) e.budgetMax = "Max budget must be ≥ 0";
    if (bMin !== null && bMax !== null && bMax < bMin) e.budgetMax = "Max budget must be ≥ min budget";
    if (aMin !== null && (isNaN(aMin) || !Number.isInteger(aMin) || aMin < 0 || aMin > 100)) e.minAge = "Min age must be 0–100";
    if (aMax !== null && (isNaN(aMax) || !Number.isInteger(aMax) || aMax < 0 || aMax > 100)) e.maxAge = "Max age must be 0–100";
    if (aMin !== null && aMax !== null && aMax < aMin + 2) e.maxAge = "Max age must be at least 2 years greater than min age";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const aMin = minAge === "" ? null : Number(minAge);
    const aMax = maxAge === "" ? null : Number(maxAge);
    const bMin = budgetMin === "" ? null : Number(budgetMin);
    const bMax = budgetMax === "" ? null : Number(budgetMax);

    const data = {
      vendorId: vendor.id,
      serviceId: selectedService?.id,
      eventId: formData.get("eventId"),
      date: formData.get("date"),
      time: startTime,
      startTime,
      endTime: endTime || undefined,
      location: formData.get("location"),
      guests: formData.get("guests"),
      budgetMin: bMin,
      budgetMax: bMax,
      venueType: venueType || null,
      venueAccess: venueAccess || null,
      minAge: isNaN(aMin as number) ? null : aMin,
      maxAge: isNaN(aMax as number) ? null : aMax,
      notes: formData.get("notes"),
      price: totalAmount ?? selectedService?.basePrice
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
    <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Event Tagging</CardTitle>
            <CardDescription>Which event is this booking for?</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="eventId" className="text-sm font-medium">
                  Select Your Event
                </Label>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-dashed gap-1.5 px-3"
                >
                  <Link
                    href={{
                      pathname: "/dashboard/events/new",
                      query: {
                        returnTo:
                          typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
                      },
                    }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="leading-none">New Event</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </Link>
                </Button>
              </div>
              <Select
                name="eventId"
                required
                value={selectedEventId}
                onValueChange={(id) => {
                  setSelectedEventId(id);
                  const ev = userEvents.find((e) => e.id === id);
                  applyEventToForm(ev);
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose an event..." />
                </SelectTrigger>
                <SelectContent>
                  {userEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} ({new Date(event.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                  {userEvents.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">
                      No events yet. Click <span className="font-semibold text-primary">+ New Event</span> above to create one.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This helps you organize multiple events. Vendors won&apos;t see your internal event name.
              </p>
              {userEvents.length === 0 && (
                <div className="bg-muted/60 p-4 rounded-xl flex gap-3 text-xs text-muted-foreground leading-relaxed">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <p>
                    Before you can submit a booking request, you need at least one event to attach it to. Create one now and you&apos;ll be brought right back here.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Event Details</CardTitle>
            <CardDescription>When and where is your event taking place?</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-8">
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Date &amp; Time
              </div>
              <div className="space-y-3">
                  <BookingDatePicker
                    vendorId={vendor.id}
                    defaultDate={selectedEvent?.date}
                  />
              </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Start / End Time</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative w-full">
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        name="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>

                    <div className="relative w-full">
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="endTime"
                        type="time"
                        placeholder="End"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 min-h-[20px]">
                    {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
                    {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                  </div>
                </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Location
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Venue Location</Label>
                <MalaysiaPlaceAutocomplete
                  value={location}
                  onChange={setLocation}
                />
                <input type="hidden" name="location" value={location} />
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Budget
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Budget Range (RM)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">RM</span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Minimum"
                      className="pl-10 h-11"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value === "" ? "" : e.target.valueAsNumber ?? e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">RM</span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Maximum"
                      className="pl-10 h-11"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value === "" ? "" : e.target.valueAsNumber ?? e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.budgetMin && <p className="text-red-500 text-sm">{errors.budgetMin}</p>}
                  {errors.budgetMax && <p className="text-red-500 text-sm">{errors.budgetMax}</p>}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Venue
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Venue Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={venueType === "INDOOR" ? "default" : "outline"}
                      onClick={() => setVenueType((p) => (p === "INDOOR" ? "" : "INDOOR"))}
                      className="h-11 justify-start px-4"
                    >
                      <Home className="mr-2 h-4 w-4" /> Indoor
                    </Button>
                    <Button
                      type="button"
                      variant={venueType === "OUTDOOR" ? "default" : "outline"}
                      onClick={() => setVenueType((p) => (p === "OUTDOOR" ? "" : "OUTDOOR"))}
                      className="h-11 justify-start px-4"
                    >
                      <Sun className="mr-2 h-4 w-4" /> Outdoor
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Venue Access</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={venueAccess === "PRIVATE" ? "default" : "outline"}
                      onClick={() => setVenueAccess((p) => (p === "PRIVATE" ? "" : "PRIVATE"))}
                      className="h-11 justify-start px-4"
                    >
                      <LockKeyhole className="mr-2 h-4 w-4" /> Private
                    </Button>
                    <Button
                      type="button"
                      variant={venueAccess === "PUBLIC" ? "default" : "outline"}
                      onClick={() => setVenueAccess((p) => (p === "PUBLIC" ? "" : "PUBLIC"))}
                      className="h-11 justify-start px-4"
                    >
                      <Building2 className="mr-2 h-4 w-4" /> Public
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium">Private:</span> home, private estate, by-invite hall ·{" "}
                    <span className="font-medium">Public:</span> park, open space, ticketed / walk-in
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Additional Information</CardTitle>
            <CardDescription>Help the vendor understand your requirements better.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-8">
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Audience
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium m-0">
                    <Sparkles className="mr-1.5 h-4 w-4 inline -translate-y-[1px] text-primary/80" />
                    Age Range
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-full">
                    {minAge === "" ? 0 : minAge} – {maxAge === "" ? 100 : maxAge} yrs
                  </span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-28 text-center h-11"
                    value={minAge}
                    onChange={(e) =>
                      setMinAge(e.target.value === "" ? "" : e.target.valueAsNumber ?? e.target.value)
                    }
                  />
                  <div className="relative h-2.5 w-full rounded-full bg-muted">
                    <div
                      className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-primary shadow-[0_0_0_1px_rgba(0,0,0,0.04)_inset]"
                      style={{
                        left: `${ageMinPct}%`,
                        width: `${Math.max(0, ageMaxPct - ageMinPct)}%`,
                      }}
                    />
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-28 text-center h-11"
                    value={maxAge}
                    onChange={(e) =>
                      setMaxAge(e.target.value === "" ? "" : e.target.valueAsNumber ?? e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.minAge && <p className="text-red-500 text-sm">{errors.minAge}</p>}
                  {errors.maxAge && <p className="text-red-500 text-sm">{errors.maxAge}</p>}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="guests" className="text-sm font-medium">Estimated Guest Count</Label>
                <Input
                  name="guests"
                  id="guests"
                  type="number"
                  min={1}
                  step={1}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value === "" ? "" : e.target.valueAsNumber ?? e.target.value)}
                  placeholder="e.g. 100 guests"
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium">Special Requirements / Notes</Label>
                <Textarea
                  name="notes"
                  placeholder="Tell the vendor about your specific needs, themes, dietary restrictions, setup preferences, or any questions you have."
                  className="min-h-[140px] resize-y leading-relaxed"
                />
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-2">
          <Button variant="outline" asChild type="button" className="h-11 px-6">
            <Link href={`/vendors/${vendor.id}`}>Cancel</Link>
          </Button>
          <Button size="lg" className="h-11 px-10" type="submit" disabled={isLoading || userEvents.length === 0}>
            {isLoading ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6 overflow-hidden">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pb-8">
            <div className="pb-5 border-b">
              <p className="font-medium text-base">{vendor.businessName}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{vendor.category}</p>
            </div>

            {selectedService && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-right max-w-[60%]">{selectedService.name}</span>
                </div>
                <div className="pt-5 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedService.pricingModel === "PER_PAX"
                        ? "Price per guest:"
                        : "Base Price:"}
                    </span>

                    <span className="font-medium">
                      RM {selectedService.basePrice.toLocaleString()}
                    </span>
                  </div>

                  {selectedService.pricingModel === "PER_PAX" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated guests:
                        </span>

                        <span className="font-medium">
                          {guests === "" ? "—" : Number(guests).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-bold pt-3 border-t">
                        <span>Total Amount:</span>

                        <span className="text-primary">
                          {totalAmount !== null
                            ? `RM ${totalAmount.toLocaleString()}`
                            : "—"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-muted/60 p-4 rounded-xl flex gap-3 text-xs text-muted-foreground leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
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

