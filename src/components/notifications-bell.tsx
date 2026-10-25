"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  MessageSquare,
  ReceiptText,
  RefreshCw,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
} from "date-fns";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  bookingId: string | null;
  readAt: string | null;
  createdAt: string;
};

const POLL_MS = 15000;

/** Where tapping a booking notification goes. /dashboard/bookings works for vendors and planners. */
const BOOKINGS_HREF = "/dashboard/bookings";

/* ================================================================
   HELPERS
================================================================ */

/** "now", "5m", "3h", "Yesterday", "Mon", "12 Oct" */
function shortTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const mins = differenceInMinutes(now, d);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (isToday(d)) return `${differenceInHours(now, d)}h`;
  if (isYesterday(d)) return "Yesterday";
  if (differenceInCalendarDays(now, d) < 7) return format(d, "EEE");
  if (d.getFullYear() === now.getFullYear()) return format(d, "d MMM");
  return format(d, "d MMM yy");
}

/** Picks an icon + colour from the notification's type/title, same tints as the dashboard. */
function lookFor(n: Notification): { icon: LucideIcon; tone: string } {
  const text = `${n.type} ${n.title}`.toLowerCase();
  if (/(reject|declin|cancel|disput)/.test(text))
    return { icon: XCircle, tone: "bg-red-50 text-red-700" };
  if (/(paid|payment|pay)/.test(text)) return { icon: Wallet, tone: "bg-blue-50 text-blue-700" };
  if (/(quot)/.test(text)) return { icon: ReceiptText, tone: "bg-emerald-50 text-emerald-700" };
  if (/(accept|confirm|complet|provided)/.test(text))
    return { icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" };
  if (/(message|chat|repl)/.test(text)) return { icon: MessageSquare, tone: "bg-blue-50 text-blue-700" };
  if (/(booking|request)/.test(text))
    return { icon: CalendarDays, tone: "bg-brand-muted text-brand-strong" };
  return { icon: Bell, tone: "bg-muted text-muted-foreground" };
}

/* ================================================================
   BELL
================================================================ */

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setLoadedOnce(true);
    } catch {
      // Background check failed (offline, server restarting…): keep the last list, try again later
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const id = setInterval(() => {
      // Don't poll while the tab is in the background
      if (document.visibilityState === "visible") void loadNotifications();
    }, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void loadNotifications();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadNotifications]);

  const unread = notifications.filter((n) => !n.readAt);
  const unreadCount = unread.length;

  const markRead = async (ids: string[]) => {
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    setNotifications((current) =>
      current.map((n) => (ids.includes(n.id) ? { ...n, readAt: now } : n)),
    );
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/notifications/${id}`, { method: "POST" }).catch(() => undefined),
      ),
    );
  };

  const openNotification = (n: Notification) => {
    if (!n.readAt) void markRead([n.id]);
    if (n.bookingId) {
      setOpen(false);
      router.push(BOOKINGS_HREF);
    }
  };

  // Split into "New" and "Earlier" so fresh things stand out
  const fresh = notifications.filter((n) => !n.readAt);
  const earlier = notifications.filter((n) => n.readAt);

  const renderItem = (n: Notification) => {
    const isUnread = !n.readAt;
    const { icon: Icon, tone } = lookFor(n);
    return (
      <li key={n.id}>
        <button
          type="button"
          onClick={() => openNotification(n)}
          className={cn(
            "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
            isUnread && "bg-brand-muted/30",
          )}
        >
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tone)}>
            <Icon className="h-[18px] w-[18px]" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  "truncate text-sm text-foreground",
                  isUnread ? "font-bold" : "font-semibold",
                )}
              >
                {n.title}
              </span>
              <span
                className={cn(
                  "shrink-0 whitespace-nowrap text-[11px] tabular-nums",
                  isUnread ? "font-bold text-brand-strong" : "text-muted-foreground",
                )}
              >
                {shortTime(n.createdAt)}
              </span>
            </span>
            <span
              className={cn(
                "mt-0.5 line-clamp-2 block text-[13px] leading-snug",
                isUnread ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {n.message}
            </span>
          </span>

          {isUnread && (
            <span aria-label="Unread" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
          )}
        </button>
      </li>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted data-[state=open]:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-brand px-1 text-[10px] font-bold leading-none text-brand-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        collisionPadding={12}
        className="overflow-hidden rounded-2xl border-border p-0 shadow-xl"
        // Fills the phone width (minus a small margin), 400px on bigger screens
        style={{ width: "min(400px, calc(100vw - 1.5rem))", maxWidth: "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs font-bold text-brand-strong">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markRead(unread.map((n) => n.id))}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden min-[380px]:inline">Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => void loadNotifications()}
              disabled={loading}
              aria-label="Refresh notifications"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: "min(460px, 65vh)" }}>
          {!loadedOnce && notifications.length === 0 ? (
            <ul aria-hidden>
              {[0, 1, 2].map((i) => (
                <li key={i} className={cn("flex gap-3 px-4 py-3.5", i > 0 && "border-t border-border")}>
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                  </div>
                </li>
              ))}
            </ul>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BellOff className="h-5 w-5" />
              </span>
              <p className="mt-4 font-semibold text-foreground">You&apos;re all caught up</p>
              <p className="mx-auto mt-1 max-w-[260px] text-sm text-muted-foreground">
                Booking updates, payments and quotation replies will show up here.
              </p>
            </div>
          ) : (
            <>
              {fresh.length > 0 && (
                <>
                  <p className="bg-muted/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    New
                  </p>
                  <ul className="divide-y divide-border">{fresh.map(renderItem)}</ul>
                </>
              )}
              {earlier.length > 0 && (
                <>
                  <p
                    className={cn(
                      "bg-muted/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                      fresh.length > 0 && "border-t border-border",
                    )}
                  >
                    Earlier
                  </p>
                  <ul className="divide-y divide-border">{earlier.map(renderItem)}</ul>
                </>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
