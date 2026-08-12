'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'

const toKey = (d: Date) => d.toISOString().slice(0, 10)
const today = () => new Date(new Date().setHours(0, 0, 0, 0))

export default function VendorCalendar() {
  const [blocked, setBlocked] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const res = await fetch('/api/vendor/availability', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      const set = new Set<string>(Array.isArray(json?.unavailable) ? json.unavailable : [])
      if (!cancelled) setBlocked(set)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const blockedDates = useMemo(() => {
    return Array.from(blocked.values()).map((s) => new Date(`${s}T00:00:00.000Z`))
  }, [blocked])

  const handleSelect = async (d: Date | undefined) => {
    if (!d) return
    const day = new Date(d)
    day.setHours(0, 0, 0, 0)
    if (day < today()) return

    const key = toKey(day)
    const nextBlocked = !blocked.has(key)

    setIsSaving(true)
    try {
      const res = await fetch('/api/vendor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: key, blocked: nextBlocked }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to update availability')
      }

      setBlocked((prev) => {
        const copy = new Set(prev)
        if (nextBlocked) copy.add(key)
        else copy.delete(key)
        return copy
      })
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="text-sm text-muted-foreground mb-3">
        Click a date to toggle availability. Blocked dates are highlighted.
      </div>
      <Calendar
        mode="single"
        selected={undefined}
        onSelect={handleSelect}
        disabled={(d) => d < today() || isSaving}
        modifiers={{
          blocked: blockedDates,
        }}
        modifiersClassNames={{
          blocked: 'bg-red-100 text-red-700',
        }}
      />
    </div>
  )
}

