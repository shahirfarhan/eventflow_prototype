"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, RefreshCw, MessagesSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { notifyUnreadChanged } from "@/lib/unread";
import BookingChatDialog from "@/app/dashboard/bookings/booking-chat-dialog";
import {
  differenceInMinutes,
  differenceInHours,
  isToday,
  isYesterday,
  differenceInCalendarDays,
  format,
} from "date-fns";

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

const POLL_OPEN_MS = 8000;
/** The full-page inbox (opened directly on phones instead of the small popover). */
const INBOX_HREF = "/dashboard/inbox";
const POLL_CLOSED_MS = 30000;

function initialsFor(name: string) {
  const base = (name || "").trim();
  if (!base) return "?";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.substring(0, 2).toUpperCase();
}

/** Compact time label that never wraps: "now", "5m", "3h", "Yesterday", "Mon", "12 Oct". */
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

function contextLine(t: Thread) {
  return [t.eventTitle, t.serviceName ?? t.contextServiceName]
    .filter(Boolean)
    .join(", ");
}

function chatDescriptionFor(t: Thread) {
  const pieces: string[] = [];
  if (t.eventTitle) pieces.push(t.eventTitle);
  if (t.serviceName) pieces.push(t.serviceName);
  if (!pieces.length && t.contextServiceName) pieces.push(t.contextServiceName);
  return pieces.join(", ");
}

export function MessagesDropdown() {
  const router = useRouter();
  const [open, setOpenState] = useState(false);

  // Phones: skip the cramped popover and go straight to the full inbox page
  const setOpen = (next: boolean) => {
    if (
      next &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(max-width: 639px)").matches
    ) {
      router.push(INBOX_HREF);
      return;
    }
    setOpenState(next);
  };
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store", signal });
      if (!res.ok) throw new Error("Failed to load messages");
      const json = await res.json();
      const list: Thread[] = Array.isArray(json) ? json : [];
      setThreads(list);
      setLoadedOnce(true);
      notifyUnreadChanged(list.reduce((sum, t) => sum + (t.unreadCount || 0), 0));
    } catch {
      // Background refresh: keep showing the last list instead of erroring
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount so the unread badge is correct before the menu is opened,
  // then poll — faster while the menu is open.
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    const id = setInterval(() => void load(), open ? POLL_OPEN_MS : POLL_CLOSED_MS);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [open, load]);

  const totalUnread = useMemo(
    () => threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0),
    [threads]
  );

  const onOpenThread = async (t: Thread) => {
    setActiveThread(t);
    setOpen(false);

    // Optimistically clear the unread state for this thread
    setThreads((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, unread: false, unreadCount: 0 } : x))
    );

    if (t.bookingId) {
      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: t.bookingId, peerId: t.peerId }),
        });
      } catch {
        /* ignore */
      }
    }

    void load();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={totalUnread ? `Messages, ${totalUnread} unread` : "Messages"}
          >
            <MessageSquare className="h-5 w-5" />
            {totalUnread > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-primary font-semibold leading-none text-primary-foreground ring-2 ring-background"
                style={{ height: 16, minWidth: 16, padding: '0 4px', fontSize: 10 }}
              >
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="overflow-hidden p-0"
          // Fixed width set inline so it holds in every browser, including older Safari
          style={{ width: 'min(380px, calc(100vw - 1.5rem))', maxWidth: 'none' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Messages</h3>
              {totalUnread > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {totalUnread} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={INBOX_HREF}
                onClick={() => setOpenState(false)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted"
              >
                View all
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => void load()}
                disabled={loading}
                aria-label="Refresh messages"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>

          {/* List */}
          <div
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: 'min(440px, 70vh)' }}
          >
            {!loadedOnce && threads.length === 0 ? (
              <ul aria-hidden className="divide-y">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <MessagesSquare className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium">No conversations yet</p>
                <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
                  Message a vendor or planner from a service or booking and the
                  conversation will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {threads.map((t) => {
                  const ctx = contextLine(t);
                  const unread = t.unread || t.unreadCount > 0;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => onOpenThread(t)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                          unread && "bg-primary/[0.04]"
                        )}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="text-xs font-medium">
                            {initialsFor(t.peerName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p
                              className={cn(
                                "truncate text-sm",
                                unread ? "font-semibold" : "font-medium"
                              )}
                            >
                              {t.peerName}
                            </p>
                            <span
                              className={cn(
                                "shrink-0 whitespace-nowrap text-[11px] tabular-nums",
                                unread ? "font-medium text-primary" : "text-muted-foreground"
                              )}
                            >
                              {shortTime(t.lastMessageAt)}
                            </span>
                          </div>

                          {ctx && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {ctx}
                            </p>
                          )}

                          <div className="mt-1 flex items-center gap-2">
                            <p
                              className={cn(
                                "min-w-0 flex-1 truncate",
                                unread ? "text-foreground" : "text-muted-foreground"
                              )}
                              style={{
                                fontSize: 13,
                                minWidth: 0,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {t.lastMessage || "Sent an attachment"}
                            </p>
                            {t.unreadCount > 0 && (
                              <span
                                className="flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold leading-none text-primary-foreground"
                                style={{ height: 20, minWidth: 20, padding: '0 6px', fontSize: 11 }}
                              >
                                {t.unreadCount > 99 ? "99+" : t.unreadCount}
                              </span>
                            )}
                          </div>
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
          directPeerName={activeThread.peerName}
          trigger={<span />}
          title={activeThread.peerName}
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
                  vendorLocation: activeThread.contextServiceVendorLocation,
                  occasions: activeThread.contextServiceOccasions,
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
