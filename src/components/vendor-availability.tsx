"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { CalendarCheck, CalendarDays, Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  WEEKDAYS_SHORT,
  formatKey,
  monthCells,
  monthLabel,
  monthsFrom,
  weekdayOf,
} from "@/lib/date-keys"

type AvailabilityProps = {
  vendorName: string
  /** Today, "YYYY-MM-DD" */
  from: string
  /** Last date shown */
  to: string
  unavailable: string[]
  closedWeekdays: number[]
  /** "Today, Tue 27 Oct" — shown before a date is picked */
  nextFreeLabel?: string | null
}

/**
 * Availability inside the vendor's booking card: a button that opens the calendar
 * in a pop-up. Once a date is picked, the card shows it.
 * Booked and blocked days both show as "Unavailable", so other bookings stay private.
 */
export function AvailabilityPicker(props: AvailabilityProps) {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <>
      {picked ? (
        // A date has been chosen
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
          <div className="flex items-start gap-2.5">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Your date</p>
              <p className="font-semibold text-foreground">{formatKey(picked)}</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                {props.vendorName} is available
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-foreground underline underline-offset-4 hover:bg-emerald-100"
            >
              Change
            </button>
          </div>
          <a
            href="#services"
            className="mt-3 flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Choose a service
          </a>
        </div>
      ) : (
        // Nothing chosen yet: open the calendar
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-colors hover:bg-muted"
        >
          <CalendarDays className="h-5 w-5 shrink-0 text-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-foreground">Check availability</span>
            {props.nextFreeLabel && (
              <span className="block text-sm text-muted-foreground">
                Next free: {props.nextFreeLabel}
              </span>
            )}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      )}

      {open && (
        <AvailabilityDialog
          {...props}
          value={picked}
          onPick={setPicked}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

/* ================================================================
   POP-UP
================================================================ */

function AvailabilityDialog({
  vendorName,
  from,
  to,
  unavailable,
  closedWeekdays,
  value,
  onPick,
  onClose,
}: AvailabilityProps & {
  value: string | null
  onPick: (key: string | null) => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const months = useMemo(() => monthsFrom(from, 13), [from])
  const taken = useMemo(() => new Set(unavailable), [unavailable])
  const closed = useMemo(() => new Set(closedWeekdays), [closedWeekdays])

  // Start on the month of the chosen date, if there is one
  const [start, setStart] = useState(() => {
    if (!value) return 0
    const i = months.findIndex((m) => value.startsWith(`${m.year}-${String(m.month + 1).padStart(2, "0")}`))
    return Math.max(0, Math.min(months.length - 2, i))
  })

  useEffect(() => setMounted(true), [])

  // Esc to close, stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const isFree = (key: string) =>
    key >= from && key <= to && !taken.has(key) && !closed.has(weekdayOf(key))

  const maxStart = months.length - 2

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-dialog-title"
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-card text-card-foreground shadow-2xl sm:max-w-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="availability-dialog-title" className="text-lg font-bold">
              Availability
            </h2>
            <p className="text-sm text-muted-foreground">Pick a date to check if {vendorName} is free.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-colors hover:bg-border"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="mb-3 flex justify-end gap-1.5">
            <button
              type="button"
              aria-label="Earlier months"
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              disabled={start === 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Later months"
              onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
              disabled={start >= maxStart}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[months[start], months[start + 1]].map((m, idx) => (
              // Phones show one month; the arrows step through them
              <div key={`${m.year}-${m.month}`} className={cn("min-w-0", idx === 1 && "hidden md:block")}>
                <p className="mb-2.5 text-center text-sm font-bold">{monthLabel(m.year, m.month)}</p>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
                  {WEEKDAYS_SHORT.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="mt-1.5 grid grid-cols-7 gap-1">
                  {monthCells(m.year, m.month).map((key, i) => {
                    if (!key) return <span key={`b-${i}`} aria-hidden="true" />
                    const past = key < from
                    const free = isFree(key)
                    const isPicked = value === key
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!free}
                        onClick={() => onPick(key)}
                        aria-label={`${formatKey(key)}, ${past ? "past" : free ? "available" : "unavailable"}`}
                        aria-pressed={isPicked}
                        className={cn(
                          "h-10 w-full rounded-full text-sm font-semibold transition-colors",
                          past && "cursor-default text-muted-foreground/40",
                          !past && !free && "cursor-not-allowed bg-muted text-muted-foreground line-through",
                          free && !isPicked && "text-foreground hover:bg-muted",
                          free && key === from && !isPicked && "ring-1 ring-inset ring-foreground",
                          isPicked && "bg-foreground text-background",
                        )}
                      >
                        {Number(key.slice(8))}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col gap-3 border-t border-border px-5 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 bg-card" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-muted" /> Unavailable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-foreground" /> Your date
            </span>
          </div>
          <div className="flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={() => onPick(null)}
                className="h-11 flex-1 rounded-xl px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex-none"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:flex-none"
            >
              {value ? `Use ${formatKey(value, { year: false })}` : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
