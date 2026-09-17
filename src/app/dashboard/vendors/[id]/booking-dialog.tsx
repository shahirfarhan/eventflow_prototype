'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Calendar as CalendarIcon,
  Clock,
  Banknote,
  Home,
  Sun,
  Users,
  Building2,
  LockKeyhole,
  Sparkles,
  Plus,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const bookingSchema = z
  .object({
    eventId: z.string().min(1, 'Please select an event'),
    date: z.date({ message: 'Please select a date' }),
    startTime: z
      .string()
      .min(1, 'Please select a start time')
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format')
      .optional()
      .or(z.literal('')),
    budgetMin: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)))
      .refine(
        (v) => v === undefined || (!isNaN(v) && v >= 0),
        'Min budget must be ≥ 0'
      ),
    budgetMax: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)))
      .refine(
        (v) => v === undefined || (!isNaN(v) && v >= 0),
        'Max budget must be ≥ 0'
      ),
    venueType: z
      .enum(['INDOOR', 'OUTDOOR'])
      .optional()
      .or(z.literal('')),
    venueAccess: z
      .enum(['PUBLIC', 'PRIVATE'])
      .optional()
      .or(z.literal('')),
    minAge: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)))
      .refine(
        (v) => v === undefined || (!isNaN(v) && Number.isInteger(v) && v >= 0 && v <= 100),
        'Min age must be an integer 0–100'
      ),
    maxAge: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)))
      .refine(
        (v) => v === undefined || (!isNaN(v) && Number.isInteger(v) && v >= 0 && v <= 100),
        'Max age must be an integer 0–100'
      ),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.endTime && data.startTime && data.endTime <= data.startTime)
        return false
      return true
    },
    { message: 'End time must be after start time', path: ['endTime'] }
  )
  .refine(
    (data) => {
      if (
        typeof data.budgetMin === 'number' &&
        typeof data.budgetMax === 'number' &&
        data.budgetMax < data.budgetMin
      )
        return false
      return true
    },
    { message: 'Max budget must be ≥ min budget', path: ['budgetMax'] }
  )
  .refine(
    (data) => {
      if (
        typeof data.minAge === 'number' &&
        typeof data.maxAge === 'number' &&
        data.maxAge < data.minAge + 2
      )
        return false
      return true
    },
    {
      message: 'Max age must be at least 2 years greater than min age',
      path: ['maxAge'],
    }
  )

type BookingFormValues = {
  eventId: string
  date: Date
  startTime: string
  endTime?: string
  budgetMin?: number
  budgetMax?: number
  venueType?: '' | 'INDOOR' | 'OUTDOOR'
  venueAccess?: '' | 'PUBLIC' | 'PRIVATE'
  minAge?: number
  maxAge?: number
  notes?: string
}

interface Service {
  id: string
  name: string
  basePrice: number
}

interface Event {
  id: string
  title: string
  date: Date
  startTime?: string | null
  endTime?: string | null
  location?: string | null
  headcount?: number | null
  budgetMin?: number | null
  budgetMax?: number | null
  minAge?: number | null
  maxAge?: number | null
  venueType?: string | null
  venueAccess?: string | null
}

interface BookingDialogProps {
  vendorId: string
  service: Service
  events: Event[]
}

export default function BookingDialog({
  vendorId,
  service,
  events,
}: BookingDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      startTime: '10:00',
      endTime: '',
      venueType: '',
      venueAccess: '',
      minAge: 18,
      maxAge: 60,
    },
  })

  const selectedDate = watch('date')
  const minAgeVal = watch('minAge')
  const maxAgeVal = watch('maxAge')
  const venueTypeVal = watch('venueType')
  const venueAccessVal = watch('venueAccess')

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true)
    try {
      const dateStr = format(data.date, 'yyyy-MM-dd')
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          serviceId: service.id,
          eventId: data.eventId,
          date: dateStr,
          time: data.startTime,
          startTime: data.startTime,
          endTime: data.endTime || undefined,
          budgetMin: data.budgetMin ?? null,
          budgetMax: data.budgetMax ?? null,
          venueType: data.venueType || null,
          venueAccess: data.venueAccess || null,
          minAge: typeof data.minAge === 'number' ? data.minAge : null,
          maxAge: typeof data.maxAge === 'number' ? data.maxAge : null,
          notes: data.notes,
          price: service.basePrice,
        }),
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Unknown error')
        throw new Error(errText || `Request failed (${response.status})`)
      }

      toast.success('Booking request sent successfully!')
      setOpen(false)
      reset()
      router.push('/dashboard/bookings')
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const ageMinPct =
    typeof minAgeVal === 'number' ? Math.min(100, Math.max(0, minAgeVal)) : 0
  const ageMaxPct =
    typeof maxAgeVal === 'number' ? Math.min(100, Math.max(0, maxAgeVal)) : 100

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>Request to Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[92vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">Request Booking</DialogTitle>
          <DialogDescription className="text-sm pt-1">
            Send a request to book <strong>{service.name}</strong>. Base price:{' '}
            <span className="font-semibold text-primary">
              RM {service.basePrice.toLocaleString()}
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-7 py-5">
            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Event
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="event" className="text-sm font-medium">Select Event</Label>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-dashed gap-1.5 px-3"
                  >
                    <Link href="/dashboard/events/new?returnTo=/dashboard/vendors">
                      <Plus className="h-4 w-4" />
                      New Event
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                  </Button>
                </div>
                <Select
                  onValueChange={(val) => {
                    setValue('eventId', val, { shouldValidate: true })
                    const ev = events.find((e) => e.id === val)
                    if (ev) {
                      const evDate = new Date(ev.date)
                      if (!Number.isNaN(evDate.getTime())) {
                        setValue('date', evDate, { shouldValidate: true })
                      }
                      if (typeof ev.startTime === 'string') {
                        setValue('startTime', ev.startTime, { shouldValidate: true })
                      }
                      if (typeof ev.endTime === 'string') {
                        setValue('endTime', ev.endTime, { shouldValidate: true })
                      }
                      if (ev.budgetMin !== null && ev.budgetMin !== undefined) {
                        setValue('budgetMin', ev.budgetMin, { shouldValidate: true })
                      }
                      if (ev.budgetMax !== null && ev.budgetMax !== undefined) {
                        setValue('budgetMax', ev.budgetMax, { shouldValidate: true })
                      }
                      if (ev.minAge !== null && ev.minAge !== undefined) {
                        setValue('minAge', Number(ev.minAge), { shouldValidate: true })
                      }
                      if (ev.maxAge !== null && ev.maxAge !== undefined) {
                        setValue('maxAge', Number(ev.maxAge), { shouldValidate: true })
                      }
                      if (ev.venueType === 'INDOOR' || ev.venueType === 'OUTDOOR') {
                        setValue('venueType', ev.venueType, { shouldValidate: true })
                      } else {
                        setValue('venueType', '', { shouldValidate: true })
                      }
                      if (ev.venueAccess === 'PUBLIC' || ev.venueAccess === 'PRIVATE') {
                        setValue('venueAccess', ev.venueAccess, { shouldValidate: true })
                      } else {
                        setValue('venueAccess', '', { shouldValidate: true })
                      }
                    }
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No events created yet
                      </SelectItem>
                    ) : (
                      events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} ({new Date(event.date).toLocaleDateString()})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.eventId && (
                  <p className="text-red-500 text-sm">{errors.eventId.message}</p>
                )}
                {events.length === 0 && (
                  <p className="text-xs text-yellow-600 leading-relaxed">
                    Use <span className="font-semibold">+ New Event</span> above to create one first, then return here to continue.
                  </p>
                )}
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                When
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-3">
                  <Label className="text-sm font-medium">Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-11"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, 'PPP')
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) =>
                          setValue('date', d!, { shouldValidate: true })
                        }
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="min-h-[20px]">
                    {errors.date && (
                      <p className="text-red-500 text-sm">
                        {errors.date.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="text-sm font-medium">Start / End Time</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        type="time"
                        className="pl-10 h-11"
                        {...register('startTime')}
                      />
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <div className="relative">
                      <Input
                        type="time"
                        className="pl-10 h-11"
                        placeholder="End"
                        {...register('endTime')}
                      />
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1 min-h-[20px]">
                    {errors.startTime && (
                      <p className="text-red-500 text-sm">{errors.startTime.message}</p>
                    )}
                    {errors.endTime && (
                      <p className="text-red-500 text-sm">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Budget
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Budget Range (RM)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">
                      RM
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Minimum"
                      className="pl-10 h-11"
                      {...register('budgetMin')}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">
                      RM
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Maximum"
                      className="pl-10 h-11"
                      {...register('budgetMax')}
                    />
                  </div>
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.budgetMin && (
                    <p className="text-red-500 text-sm">{errors.budgetMin.message as string}</p>
                  )}
                  {errors.budgetMax && (
                    <p className="text-red-500 text-sm">{errors.budgetMax.message as string}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Venue
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Venue Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={venueTypeVal === 'INDOOR' ? 'default' : 'outline'}
                      onClick={() =>
                        setValue(
                          'venueType',
                          venueTypeVal === 'INDOOR' ? '' : 'INDOOR',
                          { shouldValidate: true }
                        )
                      }
                      className="h-11 justify-start px-4"
                    >
                      <Home className="mr-2 h-4 w-4" /> Indoor
                    </Button>
                    <Button
                      type="button"
                      variant={venueTypeVal === 'OUTDOOR' ? 'default' : 'outline'}
                      onClick={() =>
                        setValue(
                          'venueType',
                          venueTypeVal === 'OUTDOOR' ? '' : 'OUTDOOR',
                          { shouldValidate: true }
                        )
                      }
                      className="h-11 justify-start px-4"
                    >
                      <Sun className="mr-2 h-4 w-4" /> Outdoor
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Venue Access</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={venueAccessVal === 'PRIVATE' ? 'default' : 'outline'}
                      onClick={() =>
                        setValue(
                          'venueAccess',
                          venueAccessVal === 'PRIVATE' ? '' : 'PRIVATE',
                          { shouldValidate: true }
                        )
                      }
                      className="h-11 justify-start px-4"
                    >
                      <LockKeyhole className="mr-2 h-4 w-4" /> Private
                    </Button>
                    <Button
                      type="button"
                      variant={venueAccessVal === 'PUBLIC' ? 'default' : 'outline'}
                      onClick={() =>
                        setValue(
                          'venueAccess',
                          venueAccessVal === 'PUBLIC' ? '' : 'PUBLIC',
                          { shouldValidate: true }
                        )
                      }
                      className="h-11 justify-start px-4"
                    >
                      <Building2 className="mr-2 h-4 w-4" /> Public
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium">Private:</span> home, private estate, by-invite hall ·{' '}
                    <span className="font-medium">Public:</span> park, open space, ticketed
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Audience
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium m-0">
                    <Sparkles className="mr-1.5 h-4 w-4 inline -translate-y-[1px] text-primary/80" />
                    Age Range
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/70 px-2.5 py-1 rounded-full">
                    {typeof minAgeVal === 'number' ? minAgeVal : 0} –{' '}
                    {typeof maxAgeVal === 'number' ? maxAgeVal : 100} yrs
                  </span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-28 text-center h-11"
                    {...register('minAge')}
                  />
                  <div className="relative h-2.5 w-full rounded-full bg-muted">
                    <div
                      className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-primary shadow-[0_0_0_1px_rgba(0,0,0,0.04)_inset]"
                      style={{
                        left: `${ageMinPct}%`,
                        width: `${Math.max(0, ageMaxPct - ageMinPct)}%`,
                      }}
                    />
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-28 text-center h-11"
                    {...register('maxAge')}
                  />
                </div>
                <div className="space-y-1 min-h-[20px]">
                  {errors.minAge && (
                    <p className="text-red-500 text-sm">{errors.minAge.message as string}</p>
                  )}
                  {errors.maxAge && (
                    <p className="text-red-500 text-sm">{errors.maxAge.message as string}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-border/70" />

            <section className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Notes
              </div>
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium">Notes for Vendor</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Setup preferences, dietary restrictions, theme details, or any questions for the vendor…"
                  className="min-h-[120px] resize-y leading-relaxed"
                />
              </div>
            </section>
          </div>
          <DialogFooter className="pt-2 pb-2">
            <Button type="submit" disabled={isLoading || events.length === 0} className="h-11 px-8">
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
