'use client'

import { useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface BookingDatePickerProps {
  vendorId: string
  defaultDate?: string | Date
}

export default function BookingDatePicker({
  vendorId,
  defaultDate,
}: BookingDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultDate ? new Date(defaultDate) : undefined
  )

  const [blocked, setBlocked] = useState<Set<string>>(new Set())

  // Update date whenever the selected event changes
  useEffect(() => {
    if (defaultDate) {
      setDate(new Date(defaultDate))
    } else {
      setDate(undefined)
    }
  }, [defaultDate])

  // Get vendor's unavailable dates
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const res = await fetch(
        `/api/vendors/${vendorId}/availability`,
        { cache: 'no-store' }
      )

      if (!res.ok) return

      const json = await res.json()

      const set = new Set<string>(
        Array.isArray(json?.blocked) ? json.blocked : []
      )

      if (!cancelled) {
        setBlocked(set)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [vendorId])

  const todayKey = useMemo(
    () => new Date(new Date().setHours(0, 0, 0, 0)),
    []
  )

  const isBlocked = (d: Date) =>
    blocked.has(d.toISOString().slice(0, 10))

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Event Date</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-11"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {date ? (
              format(date, 'PPP')
            ) : (
              <span className="text-muted-foreground">Select a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => d < todayKey || isBlocked(d)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Input
        type="hidden"
        name="date"
        value={date ? date.toISOString().slice(0, 10) : ''}
      />

      <div className="text-xs text-muted-foreground">
        Dates shown as faded are unavailable for this vendor.
      </div>
    </div>
  )
}