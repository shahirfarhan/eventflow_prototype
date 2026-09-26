"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  MapPin,
  Info,
  CheckCircle2,
  Sparkles,
  Tag,
  Banknote,
  AlignLeft,
  ArrowRight,
  PartyPopper,
  Users,
  Home,
  Sun,
  LockKeyhole,
  Building2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EventFormProps {
  defaultReturnTo?: string | null
  event?: {
    id: string
    title: string
    date: string
    location: string
    type: string
    budget: number
    startTime?: string | null
    endTime?: string | null
    budgetMin?: number | null
    budgetMax?: number | null
    headcount?: number | null
    minAge?: number | null
    maxAge?: number | null
    venueType?: string | null
    venueAccess?: string | null
    notes?: string | null
  }
}

const AGE_MIN = 0;
const AGE_MAX = 100;

const toNum = (v: number | string): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const fmtRM = (v: number | string | null | undefined) => {
  const n = toNum(v as any);
  if (n === null) return "Not set";
  return `RM ${n.toLocaleString()}`;
};

export default function EventForm({
  defaultReturnTo,
  event,
}: EventFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo =
    defaultReturnTo || searchParams.get("returnTo") || "/dashboard/events";
  const eventNamePrefill = searchParams.get("prefillName") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const isEditing = Boolean(event)

  const [title, setTitle] = useState(event?.title ?? eventNamePrefill)
  const [location, setLocation] = useState(event?.location ?? "")
  const [eventType, setEventType] = useState(event?.type ?? "")
  const [budget, setBudget] = useState<number | string>(event?.budget ?? "")
  const [budgetMin, setBudgetMin] = useState<number | string>(event?.budgetMin ?? "")
  const [budgetMax, setBudgetMax] = useState<number | string>(event?.budgetMax ?? "")
  const [headcount, setHeadcount] = useState<number | string>(event?.headcount ?? "")
  const [minAge, setMinAge] = useState<number | string>(event?.minAge ?? 18)
  const [maxAge, setMaxAge] = useState<number | string>(event?.maxAge ?? 60)

  const [venueType, setVenueType] = useState<"" | "INDOOR" | "OUTDOOR">(
    event?.venueType === "INDOOR" || event?.venueType === "OUTDOOR"
      ? event.venueType
      : ""
  )

  const [venueAccess, setVenueAccess] = useState<"" | "PUBLIC" | "PRIVATE">(
    event?.venueAccess === "PUBLIC" || event?.venueAccess === "PRIVATE"
      ? event.venueAccess
      : ""
  )

  const [notes, setNotes] = useState(event?.notes ?? "")
  const [date, setDate] = useState<Date | undefined>(
    event?.date ? new Date(event.date) : undefined
  )
  const [startTime, setStartTime] = useState(event?.startTime ?? "10:00")
  const [endTime, setEndTime] = useState(event?.endTime ?? "")


  const [errors, setErrors] = useState<Record<string, string>>({});

  const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 2)
      e.title = "Event name must be at least 2 characters";
    if (!date) e.date = "Please pick a date for the event";
    if (startTime && !TIME_RE.test(startTime))
      e.startTime = "Use HH:MM 24-hour format";
    if (endTime && !TIME_RE.test(endTime))
      e.endTime = "Use HH:MM 24-hour format";
    if (startTime && endTime && startTime > endTime)
      e.endTime = "End time must be after start time";
    if (!location.trim() || location.trim().length < 2)
      e.location = "Location is required";
    if (!eventType.trim() || eventType.trim().length < 2)
      e.eventType = "Event type is required";

    const bud = toNum(budget);
    if (bud !== null && bud < 0) e.budget = "Total budget must be ≥ 0";
    const bn = toNum(budgetMin);
    const bx = toNum(budgetMax);
    if (bn !== null && bn < 0) e.budgetMin = "Min budget must be ≥ 0";
    if (bx !== null && bx < 0) e.budgetMax = "Max budget must be ≥ 0";
    if (bn !== null && bx !== null && bx < bn)
      e.budgetMax = "Max budget must be ≥ min budget";

    const hc = toNum(headcount);
    if (hc !== null && (hc < 0 || !Number.isInteger(hc)))
      e.headcount = "Headcount must be a positive whole number";

    const mn = toNum(minAge);
    const mx = toNum(maxAge);
    if (mn !== null && (mn < AGE_MIN || mn > AGE_MAX))
      e.minAge = `Min age must be ${AGE_MIN}–${AGE_MAX}`;
    if (mx !== null && (mx < AGE_MIN || mx > AGE_MAX))
      e.maxAge = `Max age must be ${AGE_MIN}–${AGE_MAX}`;
    if (mn !== null && mx !== null && mx - mn < 2)
      e.maxAge = "Age range must span at least 2 years";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    setIsLoading(true);

    const budNum = budget === "" ? 0 : Number(budget);

    try {
      const res = await fetch(
        event?.id
          ? `/api/organizer/events/${event.id}`
          : "/api/organizer/events",
        {
          method: event?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            date,
            startTime: startTime || null,
            endTime: endTime || null,
            location: location.trim(),
            type: eventType.trim(),
            budget: budNum,
            budgetMin: budgetMin === "" ? null : Number(budgetMin),
            budgetMax: budgetMax === "" ? null : Number(budgetMax),
            headcount: headcount === "" ? null : Number(headcount),
            minAge: minAge === "" ? null : Number(minAge),
            maxAge: maxAge === "" ? null : Number(maxAge),
            venueType: venueType || null,
            venueAccess: venueAccess || null,
            notes,
          }),
        });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create event");
      }
      const created = await res.json();
      setCreatedEventId(created?.id || null);
      toast.success("Event created successfully");
      setIsSuccess(true);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    const bookParams = new URLSearchParams();
    if (createdEventId) bookParams.set("eventId", createdEventId);
    const bookQuery = bookParams.toString();
    const returnHref =
      bookQuery && returnTo.includes("/book")
        ? `${returnTo}${returnTo.includes("?") ? "&" : "?"}${bookQuery}`
        : returnTo;

    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Event Created!</h2>
            <p className="text-muted-foreground">
              &ldquo;{title}&rdquo; has been saved. You can now tag it on bookings and keep track of all details.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button asChild variant="outline" className="h-11 px-6">
              <Link href="/dashboard/events">Back to My Events</Link>
            </Button>
            <Button asChild className="h-11 px-6">
              <Link href={returnHref}>
                {returnTo.includes("/book") ? "Continue Booking" : "Go Back"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const eventTypes = [
    "Wedding",
    "Birthday",
    "Corporate",
    "Conference",
    "Concert",
    "Exhibition",
    "Dinner",
    "Baby Shower",
    "Engagement",
    "Graduation",
    "Festival",
    "Other",
  ];

  const minAgeVal = Math.min(Math.max(Number(minAge ?? 0) || 0, AGE_MIN), AGE_MAX);
  const maxAgeVal = Math.min(Math.max(Number(maxAge ?? AGE_MAX) || AGE_MAX, AGE_MIN), AGE_MAX);
  const ageStartPct = ((minAgeVal - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;
  const ageEndPct = ((maxAgeVal - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Event Name
            </CardTitle>
            <CardDescription>Give your event a memorable title.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium">
                What&apos;s the event called?
              </Label>
              <div className="relative">
                <PartyPopper className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aisyah &amp; Amir — Wedding Reception"
                  className="pl-10 h-11"
                />
              </div>
              <div className="space-y-1 min-h-[20px]">
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use something descriptive so you can easily tell events apart later. Vendors
                won&apos;t see this name.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Event Details</CardTitle>
            <CardDescription>All the key information for planning the day.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-8">
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Date & Time
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => setDate(d as Date | undefined)}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="space-y-1 min-h-[20px]">
                  {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Start / End Time</Label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative w-full">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      name="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="relative w-full">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="End"
                      className="pl-10"
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
                <Label className="text-sm font-medium">Venue / Place</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Grand Oak Ballroom, Subang Jaya"
                    className="pl-10 h-11"
                  />
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Event Type
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">What kind of event is it?</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="e.g. Wedding, Birthday, Conference"
                      className="pl-10 h-11"
                      list="event-type-options"
                    />
                    <datalist id="event-type-options">
                      {eventTypes.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {eventTypes.slice(0, 8).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={eventType === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEventType(t)}
                      className="h-9 rounded-full px-3"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.eventType && (
                    <p className="text-red-500 text-sm">{errors.eventType}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Guests
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Total Headcount</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 250"
                    className="pl-10 h-11"
                    value={headcount}
                    onChange={(e) =>
                      setHeadcount(
                        e.target.value === ""
                          ? ""
                          : e.target.valueAsNumber ?? e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.headcount && (
                    <p className="text-red-500 text-sm">{errors.headcount}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Optional — estimated total guests including plus-ones. Helps vendors give more accurate quotations.
                </p>
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
                      className="h-11 w-full gap-2 px-4"
                      onClick={() =>
                        setVenueType(venueType === "INDOOR" ? "" : "INDOOR")
                      }
                    >
                      <Home className="h-4 w-4" />
                      Indoor
                    </Button>
                    <Button
                      type="button"
                      variant={venueType === "OUTDOOR" ? "default" : "outline"}
                      className="h-11 w-full gap-2 px-4"
                      onClick={() =>
                        setVenueType(venueType === "OUTDOOR" ? "" : "OUTDOOR")
                      }
                    >
                      <Sun className="h-4 w-4" />
                      Outdoor
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Venue Access</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={venueAccess === "PUBLIC" ? "default" : "outline"}
                      className="h-11 w-full gap-2 px-4"
                      onClick={() =>
                        setVenueAccess(venueAccess === "PUBLIC" ? "" : "PUBLIC")
                      }
                    >
                      <Building2 className="h-4 w-4" />
                      Public
                    </Button>
                    <Button
                      type="button"
                      variant={venueAccess === "PRIVATE" ? "default" : "outline"}
                      className="h-11 w-full gap-2 px-4"
                      onClick={() =>
                        setVenueAccess(venueAccess === "PRIVATE" ? "" : "PRIVATE")
                      }
                    >
                      <LockKeyhole className="h-4 w-4" />
                      Private
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    <span className="font-semibold text-foreground">Public</span> venues (parks, malls, beaches) may need permits.{" "}
                    <span className="font-semibold text-foreground">Private</span> venues are booked exclusively for your event.
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Budget
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Total / Target Budget (RM)</Label>
                  <div className="flex h-11 items-center rounded-md border border-input bg-background">
                    <div className="flex shrink-0 items-center gap-1 border-r px-3 text-muted-foreground">
                      <Banknote className="h-4 w-4" />
                      <span className="text-sm font-medium">RM</span>
                    </div>

                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="e.g. 15000"
                      className="h-full flex-1 rounded-none border-0 px-3 shadow-none focus-visible:ring-0"
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          e.target.value === ""
                            ? ""
                            : e.target.valueAsNumber ?? e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1 min-h-[20px]">
                    {errors.budget && (
                      <p className="text-red-500 text-sm">{errors.budget}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Budget Range (Min / Max)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">
                          RM
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step={100}
                          placeholder="Min"
                          className="pl-10 h-11"
                          value={budgetMin}
                          onChange={(e) =>
                            setBudgetMin(
                              e.target.value === ""
                                ? ""
                                : e.target.valueAsNumber ?? e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 min-h-[20px]">
                        {errors.budgetMin && (
                          <p className="text-red-500 text-sm">{errors.budgetMin}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">
                          RM
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step={100}
                          placeholder="Max"
                          className="pl-10 h-11"
                          value={budgetMax}
                          onChange={(e) =>
                            setBudgetMax(
                              e.target.value === ""
                                ? ""
                                : e.target.valueAsNumber ?? e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 min-h-[20px]">
                        {errors.budgetMax && (
                          <p className="text-red-500 text-sm">{errors.budgetMax}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Audience
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Age Range</Label>
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-muted/70 text-muted-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                          Min
                        </span>
                        <Input
                          type="number"
                          className="w-28 h-11"
                          min={AGE_MIN}
                          max={AGE_MAX}
                          step={1}
                          value={minAge}
                          onChange={(e) =>
                            setMinAge(
                              e.target.value === ""
                                ? ""
                                : e.target.valueAsNumber ?? e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 min-h-[20px]">
                        {errors.minAge && (
                          <p className="text-red-500 text-sm">{errors.minAge}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground font-semibold pt-2">—</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-muted/70 text-muted-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                          Max
                        </span>
                        <Input
                          type="number"
                          className="w-28 h-11"
                          min={AGE_MIN}
                          max={AGE_MAX}
                          step={1}
                          value={maxAge}
                          onChange={(e) =>
                            setMaxAge(
                              e.target.value === ""
                                ? ""
                                : e.target.valueAsNumber ?? e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1 min-h-[20px]">
                        {errors.maxAge && (
                          <p className="text-red-500 text-sm">{errors.maxAge}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-2.5 rounded-full bg-muted overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-primary/70 via-primary to-emerald-400"
                      style={{
                        left: `${ageStartPct}%`,
                        width: `${Math.max(ageEndPct - ageStartPct, 1)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-0.5 tabular-nums">
                    <span>{AGE_MIN}</span>
                    <span className="text-primary font-semibold">
                      {minAgeVal} – {maxAgeVal}
                    </span>
                    <span>{AGE_MAX}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Used when evaluating vendor suitability — e.g. bouncy castles suit kids, gala dinners suit adults.
                </p>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Notes
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Theme ideas, guest VIPs, dietary restrictions, timeline preferences, setup instructions, or anything else you want to remember about this event…"
                  className="min-h-[140px] resize-y leading-relaxed pt-3"
                />
                <div className="relative flex items-start gap-2">
                  <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0 mt-1.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Only you (and your team) will see these notes. Use them to keep vendor briefs, checklists, or inspiration reminders.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-2">
          <Button variant="outline" asChild type="button" className="h-11 px-6">
            <Link href={returnTo}>Cancel</Link>
          </Button>
          <Button size="lg" className="h-11 px-10" type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? "Saving…"
                : "Creating…"
              : isEditing
                ? "Save Event"
                : "Create Event"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6 overflow-hidden">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Event Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pb-8">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <PartyPopper className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Name
                  </p>
                  <p className="font-medium truncate mt-0.5">
                    {title || "Untitled Event"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Date
                  </p>
                  <div className="mt-0.5 space-y-0.5">
                    <p className="font-medium">{date ? format(date, "PPP") : "Not set"}</p>
                    {(startTime || endTime) && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {startTime || "–"} – {endTime || "–"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Location
                  </p>
                  <p className="font-medium mt-0.5 truncate">
                    {location || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Type
                  </p>
                  <p className="font-medium mt-0.5">{eventType || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Guests
                  </p>
                  <p className="font-medium mt-0.5 tabular-nums">
                    {headcount === "" || headcount === null
                      ? "Not set"
                      : `${Number(headcount).toLocaleString()} pax`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Budget
                  </p>
                  <div className="mt-0.5 space-y-0.5">
                    <p className="font-semibold tabular-nums">{fmtRM(budget)}</p>
                    {(budgetMin !== "" || budgetMax !== "") && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {fmtRM(budgetMin)} – {fmtRM(budgetMax)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {(venueType || venueAccess) && (
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                      Venue
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {venueType && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            venueType === "INDOOR"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          )}
                        >
                          {venueType === "INDOOR" ? (
                            <Home className="h-3 w-3" />
                          ) : (
                            <Sun className="h-3 w-3" />
                          )}
                          {venueType === "INDOOR" ? "Indoor" : "Outdoor"}
                        </span>
                      )}
                      {venueAccess && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            venueAccess === "PUBLIC"
                              ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                              : "bg-violet-50 text-violet-700 border border-violet-200/60"
                          )}
                        >
                          {venueAccess === "PUBLIC" ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <LockKeyhole className="h-3 w-3" />
                          )}
                          {venueAccess === "PUBLIC" ? "Public" : "Private"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground/70">
                    Age Range
                  </p>
                  <p className="font-medium mt-0.5 tabular-nums">
                    {minAgeVal === 0 && maxAgeVal === 0
                      ? "Not set"
                      : `${minAgeVal} – ${maxAgeVal} years`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/60 p-4 rounded-xl flex gap-3 text-xs text-muted-foreground leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <p>
                Create the event first, then add bookings to it. You can always edit these details later from{" "}
                <Link
                  href="/dashboard/events"
                  className="text-primary font-medium hover:underline"
                >
                  My Events
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
