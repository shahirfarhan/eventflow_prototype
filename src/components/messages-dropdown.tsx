"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import BookingChatDialog from "@/app/dashboard/bookings/booking-chat-dialog";
import { formatDistanceToNow } from "date-fns";

type Thread = {
  id: string;
  peerId: string;
  peerName: string;
  bookingId: string | null;

  eventTitle: string | null;
  serviceName: string | null;

  vendorBusinessName: string | null;

  contextServiceId: string | null;
  contextServiceName: string | null;
  contextServiceDescription: string | null;
  contextServicePrice: number | null;
  contextServiceVendorId: string | null;
  contextServiceVendorBusinessName: string | null;
  contextServiceVendorLocation: string | null;
  contextServiceOccasions: string | null;

  contextPackageId: string | null;
  contextVendorId: string | null;

  lastMessage: string;
  lastMessageAt: string;

  unread: boolean;
  unreadCount: number;
};

function fallbackFor(name: string) {
  const base = (name || "??").trim();
  if (!base) return "?";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return base.substring(0, 2).toUpperCase();
}

function chatTitleFor(t: Thread) {
  const pieces: string[] = [];
  if (t.eventTitle) pieces.push(t.eventTitle);
  if (t.serviceName) pieces.push(t.serviceName);
  return [t.peerName, pieces.join(" • ")].filter(Boolean).join(" — ");
}

function chatDescriptionFor(t: Thread) {
  const pieces: string[] = [];
  if (t.eventTitle) pieces.push(`Event: ${t.eventTitle}`);
  if (t.serviceName) pieces.push(`Service: ${t.serviceName}`);
  if (t.bookingId) pieces.push(`Booking ${t.bookingId.substring(0, 6)}…`);
  return pieces.join(" • ");
}

export function MessagesDropdown() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [activePeerId, setActivePeerId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  const load = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        cache: "no-store",
        signal,
      });
      if (!res.ok) throw new Error("Failed to load messages");
      const json = await res.json();
      setThreads(Array.isArray(json) ? json : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    load(controller.signal);
    const interval = setInterval(() => load(), 8000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [open]);

  const totalUnread = useMemo(
    () => threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0),
    [threads]
  );

  const onOpenThread = async (t: Thread) => {
  setActiveThread(t);

  // Only mark booking messages as read through the booking endpoint
  if (t.bookingId) {
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: t.bookingId,
          peerId: t.peerId,
        }),
      });
    } catch {
      /* ignore */
    }
  }

  void load();
  setOpen(false);
};

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] text-[9px] font-semibold leading-none rounded-full bg-primary text-white ring-2 ring-background">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-88 p-0" align="end">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-sm">Messages</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => load()}
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
            {loading && threads.length === 0 ? (
              <div className="p-8 text-sm text-muted-foreground text-center">
                Loading…
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-sm text-muted-foreground text-center">
                No messages yet.
                <br />
                When you contact a vendor/planner about a booking, it will
                show up here.
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onOpenThread(t)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 hover:bg-muted cursor-pointer transition-colors text-left border-b last:border-b-0",
                    t.unread && "bg-muted/50"
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback>{fallbackFor(t.peerName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none truncate">
                        {t.peerName}
                      </p>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(t.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {t.eventTitle || t.serviceName ? (
                      <p className="text-[11px] text-muted-foreground truncate">
                        {[t.eventTitle, t.serviceName]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {t.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {activeThread && (
        <BookingChatDialog
          bookingId={activeThread.bookingId ?? undefined}
          open={Boolean(activeThread)}
          onOpenChange={(next) => {
            if (!next) {
              setActiveThread(null);
              void load();
            }
          }}
          peerId={activeThread.peerId}
          trigger={<span />}
          title={chatTitleFor(activeThread)}
          description={chatDescriptionFor(activeThread)}
          contextService={
            activeThread.contextServiceId
              ? {
                  id: activeThread.contextServiceId,
                  name: activeThread.contextServiceName ?? "Service",
                  description: activeThread.contextServiceDescription,
                  basePrice: activeThread.contextServicePrice,
                  vendorId:
                    activeThread.contextServiceVendorId ??
                    activeThread.contextVendorId ??
                    "",
                  vendorBusinessName:
                    activeThread.contextServiceVendorBusinessName ??
                    activeThread.vendorBusinessName ??
                    activeThread.peerName,
                  vendorLocation:
                    activeThread.contextServiceVendorLocation,
                  occasions:
                    activeThread.contextServiceOccasions,
                }
              : undefined
          }
          contextVendorBusinessName={
            activeThread.contextServiceVendorBusinessName ??
            activeThread.vendorBusinessName ??
            activeThread.peerName
          }
        />
      )}
    </>
  );
}
