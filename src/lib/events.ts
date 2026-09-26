export type EventCategory = "wedding" | "birthday" | "party" | "other"

export type GafferEvent = {
  id: string
  name: string
  date: string // ISO date
  category: EventCategory
  location: string
  vendors: number
}

export const events: GafferEvent[] = [
  {
    id: "1",
    name: "last minute bday party",
    date: "2026-08-02",
    category: "birthday",
    location: "Kuala Lumpur",
    vendors: 2,
  },
  {
    id: "2",
    name: "wedding",
    date: "2026-08-05",
    category: "wedding",
    location: "Putrajaya",
    vendors: 6,
  },
  {
    id: "3",
    name: "girls night",
    date: "2026-08-08",
    category: "party",
    location: "Bangsar",
    vendors: 3,
  },
  {
    id: "4",
    name: "Bespoke Bachelor party",
    date: "2026-08-27",
    category: "party",
    location: "Genting Highlands",
    vendors: 4,
  },
  {
    id: "5",
    name: "Ali's birthday party",
    date: "2026-08-29",
    category: "birthday",
    location: "Petaling Jaya",
    vendors: 2,
  },
  {
    id: "6",
    name: "Ahmad's wedding",
    date: "2026-09-30",
    category: "wedding",
    location: "Shah Alam",
    vendors: 8,
  },
  {
    id: "7",
    name: "THE LATEST EVENT edited",
    date: "2026-10-03",
    category: "other",
    location: "Cyberjaya",
    vendors: 1,
  },
  {
    id: "8",
    name: "Ali's Wedding",
    date: "2026-11-30",
    category: "wedding",
    location: "Melaka",
    vendors: 7,
  },
]

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function daysUntil(dateIso: string, now: Date = new Date()): number {
  const target = new Date(dateIso + "T00:00:00")
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}

export function relativeLabel(days: number): string {
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days === -1) return "Yesterday"
  if (days > 1) return `in ${days} days`
  return `${Math.abs(days)} days ago`
}

export function formatDate(dateIso: string): string {
  return new Date(dateIso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}