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
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'

const bookingSchema = z.object({
  eventId: z.string().min(1, 'Please select an event'),
  date: z.date({ message: 'Please select a date' }),
  time: z.string().min(1, 'Please select a start time'),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface Service {
  id: string
  name: string
  basePrice: number
}

interface Event {
  id: string
  title: string
  date: Date
}

interface BookingDialogProps {
  vendorId: string
  service: Service
  events: Event[]
}

export default function BookingDialog({ vendorId, service, events }: BookingDialogProps) {
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
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      time: '10:00',
    },
  })

  const selectedDate = watch('date')

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
          time: data.time,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Booking</DialogTitle>
          <DialogDescription>
            Send a request to book <strong>{service.name}</strong>. Base price:{' '}
            <span className="font-semibold text-primary">
              RM {service.basePrice.toLocaleString()}
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event">Select Event</Label>
              <Select
                onValueChange={(val) => setValue('eventId', val, { shouldValidate: true })}
              >
                <SelectTrigger>
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
                <p className="text-xs text-yellow-600">
                  You need to create an event first.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
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
                      onSelect={(d) => setValue('date', d!, { shouldValidate: true })}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message as string}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    {...register('time')}
                  />
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes for Vendor</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Describe your requirements, timing preferences, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || events.length === 0}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
