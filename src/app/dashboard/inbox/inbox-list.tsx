"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessagesSquare, RefreshCw, Search } from "lucide-react";
import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
} from "date-fns";

import BookingChatDialog from "@/app/dashboard/bookings/booking-chat-dialog";
import { cn } from "@/lib/utils";
import { notifyUnreadChanged } from "@/lib/unread";

/* Same shape your /api/messages route already returns (see MessagesDropdown) */
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

type Filter = "all" | "unread";

const POLL_MS = 15000;

/* ================================================================
   HELPERS
================================================================ */

function initialsFor(name: string) {
  const base = (name || "").trim();
  if (!base) return "?";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.substring(0, 2).toUpperCase();
}

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

function contextLine(t: Thread) {
  return [t.eventTitle, t.serviceName ?? t.contextServiceName].filter(Boolean).join(" · ");
}

function chatDescriptionFor(t: Thread) {
  const pieces: string[] = [];
  if (t.eventTitle) pieces.push(t.eventTitle);
  if (t.serviceName) pieces.push(t.serviceName);
  if (!pieces.length && t.contextServiceName) pieces.push(t.contextServiceName);
  return pieces.join(", ");
}

/** Soft avatar colours, picked from the name so each person keeps theirs. */
const avatarTones = [
  "bg-brand-muted text-brand-strong",
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-800",
  "bg-violet-50 text-violet-700",
];
function toneFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return avatarTones[h % avatarTones.length];
}

/* ================================================================
   MAIN
================================================================ */

export default function InboxList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store", signal });
      if (!res.ok) throw new Error("Failed to load messages");
      const json = await res.json();
      setThreads(Array.isArray(json) ? json : []);
      setLoadedOnce(true);
    } catch {
      // Background refresh: keep showing the last list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    const id = setInterval(() => void load(), POLL_MS);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [load]);

  const unreadThreads = threads.filter((t) => t.unread || t.unreadCount > 0).length;

  // Keep the Inbox badge in the bottom bar matching this list
  useEffect(() => {
    if (!loadedOnce) return;
    notifyUnreadChanged(threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0));
  }, [threads, loadedOnce]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter((t) => {
      if (filter === "unread" && !(t.unread || t.unreadCount > 0)) return false;
      if (!q) return true;
      return [t.peerName, t.eventTitle, t.serviceName, t.contextServiceName, t.lastMessage]
        .filter(Boolean)
        .some((text) => text!.toLowerCase().includes(q));
    });
  }, [threads, filter, query]);

  const openThread = async (t: Thread) => {
    setActiveThread(t);
    // Clear the unread dot straight away
    setThreads((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, unread: false, unreadCount: 0 } : x)),
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
  };

  return (
    <div className="space-y-4">
      {/* ---------- Search + filters ---------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {(
            [
              { id: "all", label: `All · ${threads.length}` },
              { id: "unread", label: `Unread · ${unreadThreads}` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "inline-flex h-10 items-center rounded-full px-4 text-sm transition-colors",
                filter === f.id
                  ? "bg-foreground font-semibold text-background"
                  : "border border-border bg-card font-medium text-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            aria-label="Refresh"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted sm:ml-0"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>

        <label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 sm:w-72">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or event"
            // 16px on phones stops iPhone from zooming in when you tap it
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
          />
        </label>
      </div>

      {/* ---------- List ---------- */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        {!loadedOnce ? (
          <ul aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={cn("flex items-center gap-3 px-4 py-4", i > 0 && "border-t border-border")}>
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                </div>
              </li>
            ))}
          </ul>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold text-foreground">
              {threads.length === 0
                ? "No conversations yet"
                : filter === "unread" && !query
                  ? "You're all caught up"
                  : "No matches"}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              {threads.length === 0
                ? "When a planner or vendor messages you about a booking or service, it shows up here."
                : filter === "unread" && !query
                  ? "No unread messages right now."
                  : "Try a different name or event."}
            </p>
          </div>
        ) : (
          <ul>
            {visible.map((t, i) => {
              const unread = t.unread || t.unreadCount > 0;
              const ctx = contextLine(t);
              return (
                <li key={t.id} className={cn(i > 0 && "border-t border-border")}>
                  <button
                    type="button"
                    onClick={() => void openThread(t)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 sm:px-5",
                      unread && "bg-brand-muted/30",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        toneFor(t.peerName),
                      )}
                    >
                      {initialsFor(t.peerName)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={cn(
                            "truncate text-foreground",
                            unread ? "font-bold" : "font-semibold",
                          )}
                        >
                          {t.peerName}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-xs tabular-nums",
                            unread ? "font-bold text-brand-strong" : "text-muted-foreground",
                          )}
                        >
                          {shortTime(t.lastMessageAt)}
                        </span>
                      </span>

                      {ctx && (
                        <span className="block truncate text-xs font-medium text-muted-foreground">
                          {ctx}
                        </span>
                      )}

                      <span className="mt-0.5 flex items-center gap-2">
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm",
                            unread ? "font-medium text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {t.lastMessage || "Sent an attachment"}
                        </span>
                        {t.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-foreground">
                            {t.unreadCount > 99 ? "99+" : t.unreadCount}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------- Chat (full screen on phones) ---------- */}
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
                    activeThread.contextServiceVendorId ?? activeThread.contextVendorId ?? "",
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
    </div>
  );
}
