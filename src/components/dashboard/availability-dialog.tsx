"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
  formatKey,
  monthCells,
  monthLabel,
  monthsFrom,
  todayKey,
  weekdayOf,
} from "@/lib/date-keys"
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui"

type BookedDay = { date: string; bookingId: string; title: string; who: string; status: string }

type Calendar = {
  from: string
  to: string
  blocked: string[]
  closedWeekdays: number[]
  booked: BookedDay[]
}

const STATUS_LABEL: Record<string, string> = {
  ACCEPTED: "Accepted · unpaid",
  PAYMENT_PENDING: "Payment verification pending",
  PAID: "Paid",
}

const STRIPES: React.CSSProperties = {
  backgroundImage: "repeating-linear-gradient(135deg, #ECE8E2 0 6px, #F5F2EE 6px 12px)",
}

/**
 * "Availability" button for the vendor dashboard. Opens a calendar where the vendor
 * blocks days off. Bookings are shown for reference but don't block the day,
 * since a vendor can take more than one booking on the same date.
 */
export function AvailabilityButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn(buttonSecondary, className)}>
        <CalendarDays className="h-4 w-4" />
        Availability
      </button>
      {open && <AvailabilityDialog onClose={() => setOpen(false)} />}
    </>
  )
}

function AvailabilityDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<Calendar | null>(null)

  const [blocked, setBlocked] = useState<Set<string>>(new Set())
  const [closed, setClosed] = useState<Set<number>>(new Set())
  const [monthIndex, setMonthIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  const today = todayKey()
  const months = useMemo(() => monthsFrom(today, 13), [today])

  useEffect(() => setMounted(true), [])

  // Load the vendor's calendar
  useEffect(() => {
    let cancelled = false
    fetch("/api/vendor/blocked-dates", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null)
        if (!res.ok) throw new Error(json?.error || "Could not load your calendar")
        return json as Calendar
      })
      .then((cal) => {
        if (cancelled) return
        setSaved(cal)
        setBlocked(new Set(cal.blocked))
        setClosed(new Set(cal.closedWeekdays))
      })
      .catch((err) => {
        toast.error((err as Error).message)
        onClose()
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [onClose])

  const bookedByDate = useMemo(() => {
    const map = new Map<string, BookedDay[]>()
    for (const b of saved?.booked ?? []) map.set(b.date, [...(map.get(b.date) ?? []), b])
    return map
  }, [saved])

  const dirty = useMemo(() => {
    if (!saved) return false
    const a = [...blocked].sort().join(",")
    const b = [...saved.blocked].sort().join(",")
    const c = [...closed].sort().join(",")
    const d = [...saved.closedWeekdays].sort().join(",")
    return a !== b || c !== d
  }, [blocked, closed, saved])

  const requestClose = useCallback(() => {
    if (saving) return
    if (dirty && !confirm("Discard your unsaved changes?")) return
    onClose()
  }, [dirty, onClose, saving])

  // Esc to close, stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [requestClose])

  // Only the vendor's own blocks decide availability; bookings are just shown
  type Status = "past" | "blocked" | "closed" | "free"
  const statusOf = (key: string): Status => {
    if (key < today) return "past"
    if (blocked.has(key)) return "blocked"
    if (closed.has(weekdayOf(key))) return "closed"
    return "free"
  }
  const bookingsOn = (key: string) => bookedByDate.get(key) ?? []

  const tapDay = (key: string) => {
    const s = statusOf(key)
    setSelected(key)
    if (s === "closed" || s === "past") return
    setBlocked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleWeekday = (i: number) =>
    setClosed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  async function save() {
    setSaving(true)
    try {
      const res = await fetch("/api/vendor/blocked-dates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: [...blocked], closedWeekdays: [...closed] }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error || "Could not save your availability")
      toast.success("Availability saved")
      onClose()
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const { year, month } = months[monthIndex]
  const cells = monthCells(year, month)
  const inMonth = cells.filter((c): c is string => !!c)
  const bookedCount = inMonth.filter((k) => k >= today && bookingsOn(k).length > 0).length
  const blockedCount = inMonth.filter((k) => {
    const s = statusOf(k)
    return s === "blocked" || s === "closed"
  }).length

  /* ---------- Selected date panel ---------- */
  const sel = selected ? statusOf(selected) : null
  const selInfo = (() => {
    if (!selected || !sel) {
      return { dot: "bg-border", title: "Pick a date", detail: "Tap any future date in the calendar." }
    }
    if (sel === "blocked") {
      return {
        dot: "bg-muted-foreground",
        title: "Blocked by you",
        detail: "Planners see this date as unavailable. Tap it again to unblock.",
      }
    }
    if (sel === "closed") {
      return {
        dot: "bg-muted-foreground",
        title: `Closed every ${WEEKDAYS_LONG[weekdayOf(selected)]}`,
        detail: 'Turn this day off under "Closed every" to open it again.',
      }
    }
    if (sel === "past") return { dot: "bg-border", title: "In the past", detail: "Past dates can't be changed." }
    return {
      dot: "bg-emerald-600",
      title: "Available",
      detail: "Planners can request this date. Tap again to block it.",
    }
  })()

  // Bookings on the selected date (shown under its status, whatever it is)
  const selBookings = selected ? bookingsOn(selected) : []

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-title"
        className="flex h-[100dvh] w-full flex-col overflow-hidden bg-card text-card-foreground shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 border-b border-border px-5 pb-4 sm:px-7 sm:pt-6"
          style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
        >
          <div className="min-w-0">
            <h2 id="availability-title" className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
              Your availability
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a date to block it. Planners can&apos;t request blocked dates. Bookings
              are shown here but don&apos;t block the day, so you can take more than one.
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-border"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex min-h-[420px] flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">
              {/* Calendar */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
                      disabled={monthIndex === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="min-w-[150px] text-center text-base font-bold">{monthLabel(year, month)}</p>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
                      disabled={monthIndex === months.length - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{bookedCount}</span> with bookings ·{" "}
                    <span className="font-semibold text-foreground">{blockedCount}</span> blocked
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground sm:gap-1.5">
                  {WEEKDAYS_SHORT.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-1.5">
                  {cells.map((key, i) => {
                    if (!key) return <span key={`blank-${i}`} aria-hidden="true" />
                    const s = statusOf(key)
                    const day = Number(key.slice(8))
                    const count = key >= today ? bookingsOn(key).length : 0
                    const caption =
                      s === "blocked" ? "Blocked" : s === "closed" ? "Closed" : key === today ? "Today" : ""
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => tapDay(key)}
                        disabled={s === "past"}
                        aria-label={`${formatKey(key)}${caption ? `, ${caption.toLowerCase()}` : ", available"}${count ? `, ${count} booking${count === 1 ? "" : "s"}` : ""}`}
                        aria-pressed={s === "blocked"}
                        style={s === "blocked" || s === "closed" ? STRIPES : undefined}
                        className={cn(
                          "flex h-12 flex-col items-start justify-between rounded-lg border px-1.5 py-1 text-left transition-colors sm:h-16 sm:rounded-xl sm:px-2.5 sm:py-2",
                          s === "free" && "border-border bg-card text-foreground hover:border-foreground/40",
                          s === "past" && "cursor-default border-transparent bg-transparent text-muted-foreground/50",
                          (s === "blocked" || s === "closed") && "border-[#D6D0C8] text-foreground/80",
                          selected === key && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                        )}
                      >
                        <span className="flex w-full items-center justify-between gap-1">
                          <span className="text-sm font-bold leading-none sm:text-[15px]">{day}</span>
                          {/* Booking count: a small red badge (doesn't block the day) */}
                          {count > 0 && (
                            <span
                              aria-hidden="true"
                              className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white"
                            >
                              {count}
                            </span>
                          )}
                        </span>
                        {caption && (
                          <span className="hidden text-[11px] font-semibold leading-tight sm:block">{caption}</span>
                        )}
                        {/* Phones: a small dot instead of the caption */}
                        {caption && caption !== "Today" && (
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground/50 sm:hidden" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Side panel */}
              <div className="flex w-full shrink-0 flex-col gap-5 lg:w-72">
                {/* Selected date */}
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Selected date
                  </p>
                  <p className="mt-1 font-semibold">{selected ? formatKey(selected) : "None yet"}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <span className={cn("h-2.5 w-2.5 rounded-full", selInfo.dot)} />
                    {selInfo.title}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{selInfo.detail}</p>

                  {selBookings.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                        {selBookings.length} booking{selBookings.length === 1 ? "" : "s"} this day
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {selBookings.map((b) => (
                          <li key={b.bookingId}>
                            {b.title} · {b.who} · {STATUS_LABEL[b.status] ?? b.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Closed every */}
                <div>
                  <p className="font-semibold">Closed every</p>
                  <p className="text-sm text-muted-foreground">Block a day of the week, every week.</p>
                  <div className="mt-2.5 grid grid-cols-7 gap-1">
                    {WEEKDAYS_SHORT.map((label, i) => {
                      const on = closed.has(i)
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleWeekday(i)}
                          aria-pressed={on}
                          aria-label={`Closed every ${WEEKDAYS_LONG[i]}`}
                          className={cn(
                            "h-10 rounded-lg border text-xs font-bold transition-colors",
                            on
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-card text-foreground hover:bg-muted",
                          )}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-border bg-card" /> Available
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-[#D6D0C8]" style={STRIPES} /> Blocked by you
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">1</span>
                    Bookings that day (date stays open)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex flex-col-reverse gap-3 border-t border-border px-5 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <p className="hidden text-sm text-muted-foreground sm:block">
            Block a date if you&apos;re fully booked or not working that day.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={requestClose} disabled={saving} className={cn(buttonSecondary, "flex-1 sm:flex-none")}>
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={loading || saving || !dirty}
              className={cn(buttonPrimary, "flex-1 disabled:opacity-50 sm:flex-none")}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Save availability"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
