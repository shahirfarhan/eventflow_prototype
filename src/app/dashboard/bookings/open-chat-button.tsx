"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import BookingChatDialog from "./booking-chat-dialog";

/** The parts of a thread from /api/messages that we need (same route the Inbox uses). */
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
  contextVendorId: string | null;
};

/**
 * A "Message" button that re-opens the conversation you already have with this person,
 * instead of starting a fresh chat. It looks for, in order:
 *   1. the chat for this exact booking
 *   2. your direct chat with them (e.g. from before you booked)
 *   3. any other chat with them
 * and only starts a new booking chat if none exists yet.
 */
export default function OpenChatButton({
  bookingId,
  peerUserId,
  fallbackTitle,
  fallbackDescription,
  className,
  disabled,
  children,
}: {
  bookingId: string;
  /** The other person's USER id (not their vendor profile id) */
  peerUserId?: string | null;
  fallbackTitle: string;
  fallbackDescription?: string;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [finding, setFinding] = useState(false);
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);

  const openChat = async () => {
    setFinding(true);
    let found: Thread | null = null;
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const threads: Thread[] = Array.isArray(json) ? json : [];
        found =
          threads.find((t) => t.bookingId === bookingId) ??
          (peerUserId
            ? threads.find((t) => t.peerId === peerUserId && !t.bookingId) ??
              threads.find((t) => t.peerId === peerUserId)
            : undefined) ??
          null;
      }
    } catch {
      // Couldn't check: just open this booking's chat
    }
    setThread(found);
    setFinding(false);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={disabled || finding}
        onClick={() => void openChat()}
      >
        {finding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </button>

      {open && (
        <BookingChatDialog
          // Existing chat → open it as it is; none → this booking's chat
          bookingId={thread ? thread.bookingId ?? undefined : bookingId}
          peerId={thread?.peerId ?? peerUserId ?? undefined}
          directPeerName={thread?.peerName}
          open={open}
          onOpenChange={(next) => {
            if (!next) setOpen(false);
          }}
          trigger={<span />}
          title={thread?.peerName ?? fallbackTitle}
          description={fallbackDescription}
          contextService={
            thread?.contextServiceId
              ? {
                  id: thread.contextServiceId,
                  name: thread.contextServiceName ?? "Service",
                  description: thread.contextServiceDescription,
                  basePrice: thread.contextServicePrice,
                  vendorId: thread.contextServiceVendorId ?? thread.contextVendorId ?? "",
                  vendorBusinessName:
                    thread.contextServiceVendorBusinessName ??
                    thread.vendorBusinessName ??
                    thread.peerName,
                  vendorLocation: thread.contextServiceVendorLocation,
                  occasions: thread.contextServiceOccasions,
                }
              : undefined
          }
          contextVendorBusinessName={
            thread
              ? thread.contextServiceVendorBusinessName ?? thread.vendorBusinessName ?? thread.peerName
              : undefined
          }
        />
      )}
    </>
  );
}
