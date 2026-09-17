"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  bookingId: string | null;
  readAt: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await res.json();

      setNotifications(data.notifications ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.readAt
  ).length;

  const markAsRead = async (notification: Notification) => {
    if (!notification.readAt) {
      await fetch(`/api/notifications/${notification.id}`, {
        method: "POST",
      });
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, readAt: new Date().toISOString() }
          : item
      )
    );

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
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] text-[9px] font-semibold leading-none rounded-full bg-primary text-white ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0"
        align="end"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">
            Notifications
          </h3>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={loadNotifications}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>

        <ScrollArea className="h-80">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification)}
                className={cn(
                  "w-full text-left p-4 border-b hover:bg-muted transition-colors",
                  !notification.readAt && "bg-muted/50"
                )}
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.readAt && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground mt-2">
                  {formatDistanceToNow(
                    new Date(notification.createdAt),
                    { addSuffix: true }
                  )}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}