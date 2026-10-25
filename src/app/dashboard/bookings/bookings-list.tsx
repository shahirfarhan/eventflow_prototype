"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

import {
  AlertTriangle,
  Ban,
  CalendarCheck,
  Check,
  ChevronDown,
  CreditCard,
  MessageSquare,
  Search,
  X,
} from "lucide-react";

import OpenChatButton from "./open-chat-button";
import { cn } from "@/lib/utils";
import {
  APP_TIME_ZONE,
  DateBlock,
  EmptyState,
  StatusBadge,
  buttonPrimary,
  buttonSecondary,
  formatRM,
} from "@/components/dashboard/ui";

interface Booking {
  id: string;
  status: string;
  price: number;
  date: string;
  createdAt?: string | Date;
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
    /** The vendor's user account id, needed to find your existing chat with them */
    userId?: string | null;
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

type Tab = "requests" | "upcoming" | "past";

/* ================================================================
   HELPERS
================================================================ */

/** "2026-12-30" in Malaysia time, so dates compare by calendar day. */
const dayKey = (value: string | Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

const getBookingName = (booking: Booking) =>
  booking.service?.name ?? booking.package?.name ?? "Untitled booking";

const plannerName = (booking: Booking) => booking.organizer?.name ?? "Planner";

const timeRange = (booking: Booking) => {
  if (!booking.startTime && !booking.endTime) return null;
  return `${booking.startTime || "?"}${booking.endTime ? ` – ${booking.endTime}` : ""}`;
};

function tabFor(booking: Booking, today: string): Tab {
  const isFuture = dayKey(booking.date) >= today;
  if (booking.status === "PENDING" && isFuture) return "requests";
  if ((booking.status === "ACCEPTED" || booking.status === "PAID") && isFuture) return "upcoming";
  return "past";
}

/* ================================================================
   MAIN
================================================================ */

export default function BookingsList({ bookings, userRole, events }: BookingsListProps) {
  const router = useRouter();
  const isVendor = userRole === "VENDOR";
  // Admins see every booking but can't act on them
  const isAdmin = userRole === "ADMIN";
  const today = dayKey(new Date());

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Phones: which card is opened as a drop-down (null = all closed)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ---------- Split into tabs ---------- */

  const grouped = useMemo(() => {
    const groups: Record<Tab, Booking[]> = { requests: [], upcoming: [], past: [] };
    for (const b of bookings) groups[tabFor(b, today)].push(b);

    const byDate = (a: Booking, b: Booking) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();
    groups.requests.sort(byDate);
    groups.upcoming.sort(byDate);
    groups.past.sort((a, b) => byDate(b, a));
    return groups;
  }, [bookings, today]);

  const [tab, setTab] = useState<Tab>(() =>
    grouped.requests.length > 0 ? "requests" : grouped.upcoming.length > 0 ? "upcoming" : "past",
  );

  /* ---------- Search + event filter ---------- */

  const visible = grouped[tab].filter((b) => {
    if (selectedEventId !== "all" && b.event?.id !== selectedEventId) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [b.event?.title, b.organizer?.name, b.vendor?.businessName, getBookingName(b)]
      .filter(Boolean)
      .some((text) => text!.toLowerCase().includes(q));
  });

  const selected = visible.find((b) => b.id === selectedId) ?? visible[0];

  const selectBooking = (id: string) => {
    setSelectedId(id);
    // Tapping the open card again closes its drop-down
    setExpandedId((current) => (current === id ? null : id));
  };

  /* ============================================================
     ACTIONS (unchanged logic)
  ============================================================ */

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    setProcessingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update booking");

      toast.success(`Booking marked as ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const isEventDay = (booking: Booking) => dayKey(booking.date) === today;

  const markProvided = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/provided`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to mark provided");
      }
      toast.success("Marked as provided");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const dispute = async (bookingId: string) => {
    if (!confirm("Are you sure you want to dispute this booking?")) return;

    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/dispute`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to dispute");
      }
      toast.success("Dispute opened");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const askProvided = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Has the service been provided today?" }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to send message");
      }
      toast.success("Message sent to vendor");
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     EMPTY (no bookings at all)
  ============================================================ */

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card">
        <EmptyState
          icon={<CalendarCheck className="h-5 w-5" />}
          title="No bookings yet"
          description={
            isVendor
              ? "When planners request your services, they'll show up here."
              : "You haven't made any booking requests yet."
          }
        />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "requests", label: "Requests" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  return (
    <div className="space-y-6">
      {/* ==========================================================
          TOOLBAR: tabs · event filter · search
      ========================================================== */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" className="inline-flex min-w-max gap-1 rounded-xl bg-border p-1">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(t.id);
                    setSelectedId(null);
                    setExpandedId(null);
                  }}
                  className={cn(
                    "inline-flex h-10 items-center rounded-lg px-5 text-sm transition-colors",
                    active
                      ? "bg-card font-semibold text-foreground shadow-sm"
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label} · {grouped[t.id].length}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {!isVendor && events.length > 1 && (
            <div className="relative sm:w-56">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                aria-label="Filter by event"
                // appearance-none hides the browser's own arrow so ours sits neatly inside
                className="h-11 w-full appearance-none truncate rounded-xl border border-border bg-card pl-3 pr-10 text-base font-medium text-foreground outline-none focus-visible:border-foreground sm:text-sm"
              >
                <option value="all">All events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}

          <label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 sm:w-72">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAdmin
                  ? "Search planner, vendor or event"
                  : isVendor
                    ? "Search planner or event"
                    : "Search vendor or event"
              }
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>

      {/* ==========================================================
          LIST + DETAIL
      ========================================================== */}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<CalendarCheck className="h-5 w-5" />}
            title={query || selectedEventId !== "all" ? "No matches" : `No ${tab} bookings`}
            description={
              query || selectedEventId !== "all"
                ? "Try a different search or event."
                : tab === "requests"
                  ? "New booking requests will appear here."
                  : tab === "upcoming"
                    ? "Accepted bookings for future dates will appear here."
                    : "Finished, declined and cancelled bookings will appear here."
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          {/* ---------- LIST ---------- */}
          <div className="min-w-0 space-y-3 lg:col-span-2">
            {visible.map((b) => {
              // Desktop highlights the card shown on the right; phones highlight the opened one
              const activeDesktop = selected?.id === b.id;
              const expanded = expandedId === b.id;
              const counterparty = isAdmin
                ? `${plannerName(b)} → ${b.vendor?.businessName ?? "Vendor"}`
                : isVendor
                  ? plannerName(b)
                  : b.vendor?.businessName;
              return (
                <div key={b.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => selectBooking(b.id)}
                    aria-expanded={expanded}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-colors sm:gap-4 sm:p-5",
                      expanded
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-border hover:border-foreground/30",
                      activeDesktop
                        ? "lg:border-foreground lg:ring-1 lg:ring-foreground"
                        : "lg:border-border lg:ring-0",
                    )}
                  >
                    <DateBlock date={b.date} tone={tab === "past" ? "muted" : "soft"} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate font-semibold text-foreground">
                          {b.event?.title ?? "Event"}
                        </p>
                        <p className="shrink-0 font-semibold text-foreground">{formatRM(b.price)}</p>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {counterparty} · {getBookingName(b)}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {b.status === "PENDING" ? (
                          <p className="text-sm font-semibold text-amber-800">
                            {isVendor ? "Waiting for your reply" : "Waiting for vendor"}
                          </p>
                        ) : (
                          <StatusBadge status={b.status} />
                        )}
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 text-muted-foreground transition-transform lg:hidden",
                            expanded && "rotate-180",
                          )}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Phones: details drop down right under the card */}
                  {expanded && (
                    <div className="mt-2 lg:hidden">
                      <BookingDetail
                        compact
                        booking={b}
                        isEventDay={isEventDay(b)}
                isVendor={isVendor}
                readOnly={isAdmin}
                allBookings={bookings}
                busy={!!processingId}
                onStatus={handleStatusUpdate}
                onProvided={markProvided}
                onDispute={dispute}
                onAskProvided={askProvided}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {isVendor && tab === "requests" && (
              <p className="px-1 pt-1 text-sm text-muted-foreground">
                Tip: replying within a few hours helps planners lock you in before they look elsewhere.
              </p>
            )}
          </div>

          {/* ---------- DETAIL (desktop only, sits on the right) ---------- */}
          <div className="hidden min-w-0 lg:sticky lg:top-6 lg:col-span-3 lg:block">
            {selected && (
              <BookingDetail
                booking={selected}
                isEventDay={isEventDay(selected)}
                isVendor={isVendor}
                readOnly={isAdmin}
                allBookings={bookings}
                busy={!!processingId}
                onStatus={handleStatusUpdate}
                onProvided={markProvided}
                onDispute={dispute}
                onAskProvided={askProvided}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   DETAIL PANEL
================================================================ */

function BookingDetail({
  booking,
  compact = false,
  isVendor,
  readOnly = false,
  allBookings,
  busy,
  isEventDay,
  onStatus,
  onProvided,
  onDispute,
  onAskProvided,
}: {
  booking: Booking;
  /** Phones: the card above already shows the title, so skip it and tighten spacing */
  compact?: boolean;
  isVendor: boolean;
  /** Admin view: details only, no message or action buttons */
  readOnly?: boolean;
  allBookings: Booking[];
  busy: boolean;
  isEventDay: boolean;
  onStatus: (id: string, status: string) => void;
  onProvided: (id: string) => void;
  onDispute: (id: string) => void;
  onAskProvided: (id: string) => void;
}) {
  const name = getBookingName(booking);
  const planner = plannerName(booking);
  const isPending = booking.status === "PENDING";
  const live = booking.status === "ACCEPTED" || booking.status === "PAID";

  /* ---------- Vendor: is that day already taken? ---------- */
  const clash = isVendor
    ? allBookings.find(
        (other) =>
          other.id !== booking.id &&
          (other.status === "ACCEPTED" || other.status === "PAID") &&
          dayKey(other.date) === dayKey(booking.date),
      )
    : undefined;

  /* ---------- Info grid ---------- */
  const cells: { label: string; value: string; tone?: "good" | "warn" }[] = [
    { label: "Date", value: format(new Date(booking.date), compact ? "EEE, d MMM yy" : "EEE, d MMM yyyy") },
  ];
  const time = timeRange(booking);
  if (time) cells.push({ label: "Time", value: time });
  if (typeof booking.guests === "number") cells.push({ label: "Guests", value: `${booking.guests} pax` });
  if (booking.location) cells.push({ label: "Venue", value: booking.location });
  cells.push({ label: booking.package ? "Package price" : "Price", value: formatRM(booking.price) });

  const setting = [
    booking.venueType === "INDOOR" ? "Indoor" : null,
    booking.venueType === "OUTDOOR" ? "Outdoor" : null,
    booking.venueAccess === "PRIVATE" ? "Private" : null,
    booking.venueAccess === "PUBLIC" ? "Public" : null,
  ].filter(Boolean);
  if (setting.length > 0) cells.push({ label: "Setting", value: setting.join(" · ") });

  if (booking.budgetMin !== null || booking.budgetMax !== null) {
    cells.push({
      label: "Budget",
      value:
        booking.budgetMin !== null && booking.budgetMax !== null
          ? `RM ${booking.budgetMin.toLocaleString()} – ${booking.budgetMax.toLocaleString()}`
          : booking.budgetMin !== null
            ? `RM ${booking.budgetMin.toLocaleString()}+`
            : `Up to RM ${booking.budgetMax!.toLocaleString()}`,
    });
  }

  if (booking.minAge !== null || booking.maxAge !== null) {
    cells.push({
      label: "Ages",
      value:
        booking.minAge !== null && booking.maxAge !== null
          ? `${booking.minAge} – ${booking.maxAge}`
          : booking.minAge !== null
            ? `${booking.minAge}+`
            : `Up to ${booking.maxAge}`,
    });
  }

  if (isVendor && isPending) {
    cells.push(
      clash
        ? { label: "Your calendar", value: `Booked: ${clash.event?.title ?? "another event"}`, tone: "warn" }
        : { label: "Your calendar", value: "Free that day", tone: "good" },
    );
  }

  // Pad to a multiple of 6 so the 2- and 3-column grids have no gaps.
  const blanks = (6 - (cells.length % 6)) % 6;

  const chatDescription =
    [booking.event?.title ? `Event: ${booking.event.title}` : null, `Booking: ${name}`]
      .filter(Boolean)
      .join(" • ") || undefined;

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card",
        compact ? "p-4 sm:p-5" : "p-6 sm:p-8",
      )}
    >
      {/* Top row */}
      <div className={cn("flex-wrap items-center justify-between gap-3", compact ? "hidden" : "flex")}>
        {isPending ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold tracking-wider text-amber-800">
            {isVendor ? "NEW REQUEST" : "REQUEST SENT"}
          </span>
        ) : (
          <StatusBadge status={booking.status} />
        )}
        {booking.createdAt && (
          <p className="text-sm text-muted-foreground">
            {isVendor ? "Received" : "Sent"}{" "}
            {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Title */}
      <h2
        className={cn(
          "mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl",
          compact && "hidden",
        )}
      >
        {name}
      </h2>
      <p className={cn("text-muted-foreground", compact ? "text-sm" : "mt-1")}>
        {isVendor ? (
          <>
            Requested by <span className="font-semibold text-foreground">{planner}</span>
          </>
        ) : (
          <>
            With{" "}
            <Link
              href={`/vendors/${booking.vendor?.id}`}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              {booking.vendor?.businessName ?? "Unknown vendor"}
            </Link>
          </>
        )}
        {booking.event?.title && <> for {booking.event.title}</>}
        {compact && booking.createdAt && (
          <> · {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}</>
        )}
      </p>

      {/* Info grid */}
      <dl
        className={cn(
          "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3",
          compact ? "mt-4" : "mt-6",
        )}
      >
        {cells.map((c) => (
          <div key={c.label} className="min-w-0 bg-card px-3 py-2.5 sm:px-4 sm:py-3">
            <dt className="text-[11px] text-muted-foreground sm:text-xs">{c.label}</dt>
            <dd
              className={cn(
                // Smaller on phones and allowed to wrap, so nothing gets cut off
                "mt-0.5 break-words text-sm font-semibold leading-snug sm:text-base",
                c.tone === "good"
                  ? "text-emerald-700"
                  : c.tone === "warn"
                    ? "text-amber-800"
                    : "text-foreground",
              )}
            >
              {c.value}
            </dd>
          </div>
        ))}
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} aria-hidden className="bg-card" />
        ))}
      </dl>

      {/* Note */}
      {booking.specialRequests && (
        <div className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground sm:mt-5 sm:px-5 sm:py-4 sm:text-base">
          <span className="font-semibold">
            {isVendor ? `Note from ${planner}: ` : "Your note: "}
          </span>
          <span className="whitespace-pre-wrap">{booking.specialRequests}</span>
        </div>
      )}

      {booking.organizerDisputedAt && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          <AlertTriangle className="h-4 w-4" />
          Disputed
        </div>
      )}

      {/* Actions (hidden for admins, who only view) */}
      {!readOnly && (
      <>
      <div
        className={cn(
          "flex flex-col gap-2 border-t border-border sm:flex-row sm:flex-wrap sm:items-center",
          compact ? "mt-4 pt-4" : "mt-6 pt-6",
        )}
      >
        {/* Re-opens your existing conversation with them if there is one */}
        <OpenChatButton
          bookingId={booking.id}
          // Must be the other person's USER id (booking.vendor.id is the vendor profile id)
          peerUserId={isVendor ? booking.organizer?.id : booking.vendor.userId}
          fallbackTitle={isVendor ? `Planner — ${planner}` : booking.vendor.businessName}
          fallbackDescription={chatDescription}
          className={buttonSecondary}
          disabled={busy}
        >
          <MessageSquare className="h-4 w-4" />
          {isVendor ? "Message" : "Message vendor"}
        </OpenChatButton>

        <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
          {/* Vendor → Decline / Accept */}
          {isVendor && isPending && (
            <>
              <button
                type="button"
                className={cn(buttonSecondary, "text-red-700")}
                onClick={() => onStatus(booking.id, "REJECTED")}
                disabled={busy}
              >
                <X className="h-4 w-4" />
                Decline
              </button>
              <button
                type="button"
                className={buttonPrimary}
                onClick={() => onStatus(booking.id, "ACCEPTED")}
                disabled={busy}
              >
                <Check className="h-4 w-4" />
                Accept booking
              </button>
            </>
          )}

          {/* Organizer → Cancel */}
          {!isVendor && isPending && (
            <button
              type="button"
              className={cn(buttonSecondary, "text-red-700")}
              onClick={() => onStatus(booking.id, "CANCELLED")}
              disabled={busy}
            >
              <Ban className="h-4 w-4" />
              Cancel request
            </button>
          )}

          {/* Organizer → Pay */}
          {!isVendor && booking.status === "ACCEPTED" && (
            <button
              type="button"
              className={buttonPrimary}
              onClick={() => onStatus(booking.id, "PAID")}
              disabled={busy}
            >
              <CreditCard className="h-4 w-4" />
              Pay now
            </button>
          )}

          {/* Vendor → Service provided (on the day) */}
          {isVendor && live && isEventDay && !booking.vendorProvidedAt && (
            <button
              type="button"
              className={buttonPrimary}
              onClick={() => onProvided(booking.id)}
              disabled={busy}
            >
              <Check className="h-4 w-4" />
              Service provided
            </button>
          )}

          {/* Vendor → Complete */}
          {isVendor && booking.status === "PAID" && (
            <button
              type="button"
              className={buttonSecondary}
              onClick={() => onStatus(booking.id, "COMPLETED")}
              disabled={busy}
            >
              <Check className="h-4 w-4" />
              Mark complete
            </button>
          )}

          {/* Organizer → Ask vendor (on the day) */}
          {!isVendor && live && isEventDay && !booking.vendorProvidedAt && (
            <button
              type="button"
              className={buttonPrimary}
              onClick={() => onAskProvided(booking.id)}
              disabled={busy}
            >
              Has the service been provided?
            </button>
          )}

          {/* Organizer → Dispute */}
          {!isVendor && live && isEventDay && booking.vendorProvidedAt && !booking.organizerDisputedAt && (
            <button
              type="button"
              className={cn(buttonSecondary, "text-red-700")}
              onClick={() => onDispute(booking.id)}
              disabled={busy}
            >
              <Ban className="h-4 w-4" />
              Dispute
            </button>
          )}
        </div>
      </div>
      </>
      )}
    </article>
  );
}
