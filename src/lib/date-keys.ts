/**
 * Date helpers that work on "YYYY-MM-DD" keys in Malaysia time.
 * No database code here, so client components can use them too.
 */

export const APP_TIME_ZONE = "Asia/Kuala_Lumpur"
export const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/

export const WEEKDAYS_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
export const WEEKDAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

/** "2026-12-30" for a Date, in Malaysia time */
export function dayKey(value: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value))
}

export function todayKey() {
  return dayKey(new Date())
}

function toUTC(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** 0 = Monday … 6 = Sunday */
export function weekdayOf(key: string) {
  return (toUTC(key).getUTCDay() + 6) % 7
}

export function addDays(key: string, days: number) {
  const date = toUTC(key)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** "Sat, 14 Nov 2026" (pass { year: false } to drop the year) */
export function formatKey(key: string, opts: { year?: boolean } = {}) {
  return toUTC(key).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(opts.year === false ? {} : { year: "numeric" }),
  })
}

/** "November 2026" for a { year, month } (month 0–11) */
export function monthLabel(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  })
}

/** The months from the month of `fromKey`, `count` long */
export function monthsFrom(fromKey: string, count: number) {
  const [y, m] = fromKey.split("-").map(Number)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 + i, 1))
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
  })
}

/**
 * The cells of a month grid, Monday first: null for the empty slots
 * before the 1st and after the last day.
 */
export function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1))
  const offset = (first.getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: (string | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= days; d++) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    )
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
