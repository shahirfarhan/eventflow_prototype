"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, RefreshCw, BellOff } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  differenceInMinutes,
  differenceInHours,
  isToday,
  isYesterday,
  differenceInCalendarDays,
  format,
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

/** Same compact time labels as the messages dropdown: "now", "5m", "3h", "Yesterday", "Mon", "12 Oct". */
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

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setLoadedOnce(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const interval = setInterval(() => void loadNotifications(), 10000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const markAsRead = async (notification: Notification) => {
    if (!notification.readAt) {
      // Update the list straight away, then tell the server
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      );
      try {
        await fetch(`/api/notifications/${notification.id}`, { method: "POST" });
      } catch {
        /* ignore */
      }
    }

    if (notification.bookingId) {
      window.location.href = `/dashboard/bookings`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-primary font-semibold leading-none text-primary-foreground ring-2 ring-background"
              style={{ height: 16, minWidth: 16, padding: "0 4px", fontSize: 10 }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="overflow-hidden p-0"
        // Same size as the messages dropdown, set inline so it holds in every browser
        style={{ width: "min(380px, calc(100vw - 1.5rem))", maxWidth: "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => void loadNotifications()}
            disabled={loading}
            aria-label="Refresh notifications"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>

        {/* List */}
        <div
          className="overflow-y-auto overscroll-contain"
          style={{ maxHeight: "min(440px, 70vh)" }}
        >
          {!loadedOnce && notifications.length === 0 ? (
            <ul aria-hidden className="divide-y">
              {[0, 1, 2].map((i) => (
                <li key={i} className="space-y-2 px-4 py-3">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                </li>
              ))}
            </ul>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BellOff className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-medium">You&apos;re all caught up</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground" style={{ maxWidth: 260 }}>
                Booking updates, payments and quotation replies will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => {
                const unread = !n.readAt;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => markAsRead(n)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                        unread && "bg-primary/[0.04]"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn("mt-1.5 shrink-0 rounded-full", unread ? "bg-primary" : "bg-transparent")}
                        style={{ width: 8, height: 8 }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>
                            {n.title}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 whitespace-nowrap tabular-nums",
                              unread ? "font-medium text-primary" : "text-muted-foreground"
                            )}
                            style={{ fontSize: 11 }}
                          >
                            {shortTime(n.createdAt)}
                          </span>
                        </div>
                        <p
                          className={cn("mt-0.5 line-clamp-2", unread ? "text-foreground" : "text-muted-foreground")}
                          style={{ fontSize: 13 }}
                        >
                          {n.message}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
