'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const bookingSchema = z.object({
  eventId: z.string().min(1, 'Please select an event'),
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

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          serviceId: service.id,
          eventId: data.eventId,
          notes: data.notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking request')
      }

      toast.success('Booking request sent successfully!')
      setOpen(false)
      reset()
      router.push('/dashboard/bookings')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request to Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Booking</DialogTitle>
          <DialogDescription>
            Send a request to book <strong>{service.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event">Select Event</Label>
              <Select onValueChange={(val) => setValue('eventId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.length === 0 ? (
                    <SelectItem value="none" disabled>No events created yet</SelectItem>
                  ) : (
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} ({new Date(event.date).toLocaleDateString()})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.eventId && <p className="text-red-500 text-sm">{errors.eventId.message}</p>}
              {events.length === 0 && (
                <p className="text-xs text-yellow-600">
                  You need to create an event first.
                </p>
              )}
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
            <Button type="submit" disabled={isLoading || events.length === 0}>
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
