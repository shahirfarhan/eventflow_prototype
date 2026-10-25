/**
 * Keeps every unread-message badge (bottom tab bar, inbox, navbar icon) in sync.
 *
 * - notifyUnreadChanged(5)  → "the total is now 5", badges update instantly
 * - notifyUnreadChanged()   → "something changed", badges re-check the server
 */
export const UNREAD_EVENT = "gaffers:unread-changed"

export function notifyUnreadChanged(total?: number) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent<number | undefined>(UNREAD_EVENT, { detail: total }))
}

/** Total unread messages, using the same numbers the Inbox shows. */
export async function fetchUnreadTotal(): Promise<number | null> {
  try {
    const res = await fetch("/api/messages", { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json()
    if (!Array.isArray(json)) return null
    return json.reduce(
      (sum: number, t: { unreadCount?: number }) => sum + (t.unreadCount || 0),
      0,
    )
  } catch {
    return null
  }
}
