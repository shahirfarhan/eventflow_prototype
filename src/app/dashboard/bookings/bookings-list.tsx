"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Check,
  X,
  CreditCard,
  Ban,
  CalendarCheck,
  MessageSquare,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  Banknote,
  Home,
  Sun,
  LockKeyhole,
  Building2,
} from "lucide-react";

import BookingChatDialog from "./booking-chat-dialog";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  price: number;
  date: string;
  location: string | null;
  guests: number | null;
  startTime: string | null;
  endTime: string | null;
  minAge: number | null;
  maxAge: number | null;
  venueType: string | null;
  venueAccess: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  specialRequests: string | null;
  vendorProvidedAt: string | null;
  organizerDisputedAt: string | null;

  event: {
    id: string;
    title: string;
    date: string;
  };

  service: {
    name: string;
  } | null;

  package: {
    name: string;
  } | null;

  vendor: {
    businessName: string;
    id: string;
  };

  organizer?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface BookingsListProps {
  bookings: Booking[];
  userRole: string;
  events: {
    id: string;
    title: string;
  }[];
}

export default function BookingsList({
  bookings,
  userRole,
  events,
}: BookingsListProps) {
  const router = useRouter();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] =
    useState<string>("all");
  const [selectedStatus, setSelectedStatus] =
    useState<string>("all");

  const statusOptions = Array.from(
    new Set(bookings.map((booking) => booking.status))
  ).sort();

  const filtered = bookings.filter((booking) => {
    const matchesEvent =
      selectedEventId === "all" ||
      booking.event.id === selectedEventId;

    const matchesStatus =
      selectedStatus === "all" ||
      booking.status === selectedStatus;

    return matchesEvent && matchesStatus;
  });

  /* ============================================================
     STATUS UPDATE
  ============================================================ */

  const handleStatusUpdate = async (
    id: string,
    newStatus: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to mark this booking as ${newStatus}?`
      )
    ) {
      return;
    }

    setProcessingId(id);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      toast.success(`Booking marked as ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     STATUS COLOR
  ============================================================ */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";

      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";

      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100";

      case "PAID":
        return "bg-green-100 text-green-800 hover:bg-green-100";

      case "COMPLETED":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";

      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ============================================================
     BOOKING NAME
  ============================================================ */

  const getBookingName = (booking: Booking) => {
    if (booking.service?.name) {
      return booking.service.name;
    }

    if (booking.package?.name) {
      return booking.package.name;
    }

    return "Untitled Booking";
  };

  /* ============================================================
     EVENT DAY
  ============================================================ */

  const isEventDay = (booking: Booking) => {
    const d = new Date(booking.date);
    const today = new Date();

    const a = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();

    const b = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return a === b;
  };

  /* ============================================================
     MARK SERVICE PROVIDED
  ============================================================ */

  const markProvided = async (bookingId: string) => {
    setProcessingId(bookingId);

    try {
      const res = await fetch(
        `/api/bookings/${bookingId}/provided`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Failed to mark provided"
        );
      }

      toast.success("Marked as provided");
      router.refresh();
    } catch (e: any) {
      toast.error(
        e?.message || "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     DISPUTE
  ============================================================ */

  const dispute = async (bookingId: string) => {
    if (
      !confirm(
        "Are you sure you want to dispute this booking?"
      )
    ) {
      return;
    }

    setProcessingId(bookingId);

    try {
      const res = await fetch(
        `/api/bookings/${bookingId}/dispute`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Failed to dispute"
        );
      }

      toast.success("Dispute opened");
      router.refresh();
    } catch (e: any) {
      toast.error(
        e?.message || "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     ASK VENDOR IF SERVICE PROVIDED
  ============================================================ */

  const askProvided = async (bookingId: string) => {
    setProcessingId(bookingId);

    try {
      const res = await fetch(
        `/api/bookings/${bookingId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content:
              "Has the service been provided today?",
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Failed to send message"
        );
      }

      toast.success("Message sent to vendor");
    } catch (e: any) {
      toast.error(
        e?.message || "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CalendarCheck className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No bookings found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {userRole === "ORGANIZER"
            ? "You haven't made any booking requests yet."
            : "You haven't received any booking requests yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ==========================================================
          FILTERS
      ========================================================== */}

      {userRole === "ORGANIZER" && events.length > 0 && (
        <div className="space-y-6">

          {/* Event Filter */}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarCheck className="h-4 w-4 text-brand" />
              Filter by Event
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  selectedEventId === "all"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedEventId("all")
                }
                className="rounded-full px-4"
              >
                All Events
              </Button>

              {events.map((event) => (
                <Button
                  key={event.id}
                  variant={
                    selectedEventId === event.id
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedEventId(event.id)
                  }
                  className="rounded-full px-4"
                >
                  {event.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-brand" />
              Filter by Status
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  selectedStatus === "all"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedStatus("all")
                }
                className="rounded-full px-4"
              >
                All Statuses
              </Button>

              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={
                    selectedStatus === status
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedStatus(status)
                  }
                  className="rounded-full px-4"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          NO FILTER RESULTS
      ========================================================== */}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No bookings found for the selected event.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* ======================================================
              BOOKING CARDS
          ====================================================== */}

          {filtered.map((booking) => (
            <Card
              key={booking.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >

              {/* --------------------------------------------------
                  HEADER
              -------------------------------------------------- */}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <CardTitle className="text-lg">
                      {getBookingName(booking)}

                      {userRole === "ORGANIZER" && (
                        <span className="ml-1 font-normal text-muted-foreground">
                          with{" "}
                          <Link
                            href={`/vendors/${booking.vendor?.id}`}
                            className="text-primary hover:underline"
                          >
                            {booking.vendor?.businessName ??
                              "Unknown Vendor"}
                          </Link>
                        </span>
                      )}

                      {userRole === "VENDOR" && (
                        <span className="ml-1 font-normal text-muted-foreground">
                          for{" "}
                          {booking.organizer?.name ??
                            "Unknown Event"}
                        </span>
                      )}
                    </CardTitle>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        RM {booking.price.toLocaleString()}
                      </span>

                      <span>•</span>

                      <span>
                        {format(
                          new Date(booking.date),
                          "PPP"
                        )}
                      </span>
                    </div>

                    {userRole === "ORGANIZER" && (
                      <Badge
                        variant="outline"
                        className="mt-2 bg-muted/50 text-xs font-normal"
                      >
                        Event:{" "}
                        {booking.event?.title ??
                          "Unknown"}
                      </Badge>
                    )}
                  </div>

                  <Badge
                    className={getStatusColor(
                      booking.status
                    )}
                    variant="secondary"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>

              {/* --------------------------------------------------
                  BOOKING DETAILS
              -------------------------------------------------- */}

              <CardContent className="pt-2 pb-5">
                <div className="grid gap-3.5 text-sm">

                  {/* Location */}

                  {booking.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="text-foreground/80">
                        {booking.location}
                      </span>
                    </div>
                  )}

                  {/* Guests */}

                  {typeof booking.guests ===
                    "number" && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="text-foreground/80">
                        <span className="font-medium">
                          {booking.guests}
                        </span>{" "}
                        pax
                      </span>
                    </div>
                  )}

                  {/* Time */}

                  {(booking.startTime ||
                    booking.endTime) && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="font-medium tabular-nums text-foreground/80">
                        {booking.startTime || "?"}

                        {booking.endTime
                          ? ` – ${booking.endTime}`
                          : booking.startTime
                            ? "+"
                            : ""}
                      </span>
                    </div>
                  )}

                  {/* Venue */}

                  {(booking.venueType ||
                    booking.venueAccess) && (
                    <div className="flex flex-wrap items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <div className="flex flex-wrap gap-2">

                        {booking.venueType ===
                          "INDOOR" && (
                          <span className="inline-flex h-6 items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700">
                            <Home className="h-3 w-3" />
                            Indoor
                          </span>
                        )}

                        {booking.venueType ===
                          "OUTDOOR" && (
                          <span className="inline-flex h-6 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700">
                            <Sun className="h-3 w-3" />
                            Outdoor
                          </span>
                        )}

                        {booking.venueAccess ===
                          "PRIVATE" && (
                          <span className="inline-flex h-6 items-center gap-1 rounded-full border border-violet-200/60 bg-violet-50 px-3 text-xs font-semibold text-violet-700">
                            <LockKeyhole className="h-3 w-3" />
                            Private
                          </span>
                        )}

                        {booking.venueAccess ===
                          "PUBLIC" && (
                          <span className="inline-flex h-6 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-700">
                            <Building2 className="h-3 w-3" />
                            Public
                          </span>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Budget */}

                  {(booking.budgetMin !== null ||
                    booking.budgetMax !== null) && (
                    <div className="flex items-center gap-3">
                      <Banknote className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="font-medium tabular-nums text-foreground/80">
                        {booking.budgetMin !== null &&
                        booking.budgetMax !== null
                          ? `RM ${booking.budgetMin.toLocaleString()} – RM ${booking.budgetMax.toLocaleString()}`
                          : booking.budgetMin !==
                              null
                            ? `RM ≥ ${booking.budgetMin.toLocaleString()}`
                            : `RM ≤ ${booking.budgetMax!.toLocaleString()}`}
                      </span>
                    </div>
                  )}

                  {/* Age */}

                  {(booking.minAge !== null ||
                    booking.maxAge !== null) && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="font-medium tabular-nums text-foreground/80">
                        {booking.minAge !== null &&
                        booking.maxAge !== null
                          ? `Ages ${booking.minAge} – ${booking.maxAge}`
                          : booking.minAge !==
                              null
                            ? `Ages ${booking.minAge}+`
                            : `Ages ≤ ${booking.maxAge}`}
                      </span>
                    </div>
                  )}

                  {/* Special Requests */}

                  {booking.specialRequests && (
                    <div className="mt-1 flex items-start gap-3 border-t border-border pt-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                          Special Requests
                        </span>

                        <span className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                          {booking.specialRequests}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dispute */}

                  {booking.organizerDisputedAt && (
                    <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      Disputed
                    </div>
                  )}
                </div>
              </CardContent>

              {/* --------------------------------------------------
                  ACTIONS
              -------------------------------------------------- */}

              <CardFooter className="flex flex-wrap justify-end gap-2 border-t border-border/50 pt-4">

                {/* Vendor → Contact Planner */}

                {userRole === "VENDOR" && (
                  <BookingChatDialog
                    bookingId={booking.id}
                    peerId={booking.organizer?.id}
                    title={
                      booking.organizer?.name
                        ? `Planner — ${booking.organizer.name}`
                        : "Contact Planner"
                    }
                    description={[
                      booking.event?.title
                        ? `Event: ${booking.event.title}`
                        : null,
                      getBookingName(booking)
                        ? `Booking: ${getBookingName(
                            booking
                          )}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" • ") || undefined}
                    trigger={
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!!processingId}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Planner
                      </Button>
                    }
                  />
                )}

                {/* Organizer → Contact Vendor */}

                {userRole === "ORGANIZER" && (
                  <BookingChatDialog
                    bookingId={booking.id}
                    peerId={booking.vendor.id}
                    title={`${booking.vendor.businessName}`}
                    description={[
                      booking.event?.title
                        ? `Event: ${booking.event.title}`
                        : null,
                      getBookingName(booking)
                        ? `Booking: ${getBookingName(
                            booking
                          )}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" • ") || undefined}
                    trigger={
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!!processingId}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Vendor
                      </Button>
                    }
                  />
                )}

                {/* Vendor → Reject / Accept */}

                {userRole === "VENDOR" &&
                  booking.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          handleStatusUpdate(
                            booking.id,
                            "REJECTED"
                          )
                        }
                        disabled={!!processingId}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(
                            booking.id,
                            "ACCEPTED"
                          )
                        }
                        disabled={!!processingId}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </>
                  )}

                {/* Organizer → Pay */}

                {userRole === "ORGANIZER" &&
                  booking.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() =>
                        handleStatusUpdate(
                          booking.id,
                          "PAID"
                        )
                      }
                      disabled={!!processingId}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}

                {/* Organizer → Cancel */}

                {userRole === "ORGANIZER" &&
                  booking.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() =>
                        handleStatusUpdate(
                          booking.id,
                          "CANCELLED"
                        )
                      }
                      disabled={!!processingId}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancel Request
                    </Button>
                  )}

                {/* Vendor → Complete */}

                {userRole === "VENDOR" &&
                  booking.status === "PAID" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(
                          booking.id,
                          "COMPLETED"
                        )
                      }
                      disabled={!!processingId}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}

                {/* Vendor → Service Provided */}

                {userRole === "VENDOR" &&
                  (booking.status === "ACCEPTED" ||
                    booking.status === "PAID") &&
                  isEventDay(booking) &&
                  !booking.vendorProvidedAt && (
                    <Button
                      size="sm"
                      onClick={() =>
                        markProvided(booking.id)
                      }
                      disabled={!!processingId}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      The service has been provided
                    </Button>
                  )}

                {/* Organizer → Ask Vendor */}

                {userRole === "ORGANIZER" &&
                  (booking.status === "ACCEPTED" ||
                    booking.status === "PAID") &&
                  isEventDay(booking) &&
                  !booking.vendorProvidedAt && (
                    <Button
                      size="sm"
                      onClick={() =>
                        askProvided(booking.id)
                      }
                      disabled={!!processingId}
                    >
                      Has the service been provided?
                    </Button>
                  )}

                {/* Organizer → Dispute */}

                {userRole === "ORGANIZER" &&
                  (booking.status === "ACCEPTED" ||
                    booking.status === "PAID") &&
                  isEventDay(booking) &&
                  booking.vendorProvidedAt &&
                  !booking.organizerDisputedAt && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() =>
                        dispute(booking.id)
                      }
                      disabled={!!processingId}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Dispute
                    </Button>
                  )}

              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
