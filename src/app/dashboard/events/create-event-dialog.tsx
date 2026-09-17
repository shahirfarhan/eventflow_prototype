'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  date: z.date({
    required_error: 'A date of event is required.',
  } as any),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(2, 'Type is required'),
  budget: z.coerce.number().min(0, 'Budget must be positive'),
})

type EventFormValues = z.infer<typeof eventSchema>

export interface CreatedEvent {
  id: string
  title: string
  date: string
  location?: string
  type?: string
  budget?: number
}

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (event: CreatedEvent) => void
  defaultDate?: string | Date
}

export default function CreateEventDialog({
  open,
  onOpenChange,
  onCreated,
  defaultDate,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: '',
      date: defaultDate ? new Date(defaultDate) : undefined,
      location: '',
      type: '',
      budget: 0,
    },
  })

  const date = watch('date')

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to create event')
      }

      const created = (await response.json()) as CreatedEvent
      toast.success('Event created successfully')
      onCreated(created)
      onOpenChange(false)
      reset({
        title: '',
        date: defaultDate ? new Date(defaultDate) : undefined,
        location: '',
        type: '',
        budget: 0,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Save this event so you can tag it on this booking and future bookings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                className="h-11"
                {...register('title')}
                placeholder="e.g. Birthday Party"
              />
              <div className="min-h-[20px]">
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-11',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => setValue('date', d as Date, { shouldValidate: true })}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="min-h-[20px]">
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                className="h-11"
                {...register('location')}
                placeholder="e.g. Central Park"
              />
              <div className="min-h-[20px]">
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Input
                id="type"
                className="h-11"
                {...register('type')}
                placeholder="e.g. Wedding, Birthday"
              />
              <div className="min-h-[20px]">
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (RM)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-sm font-medium text-muted-foreground pointer-events-none select-none">
                  RM
                </span>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step={100}
                  className="h-11 pl-10"
                  {...register('budget')}
                  placeholder="5000"
                />
              </div>
              <div className="min-h-[20px]">
                {errors.budget && (
                  <p className="text-red-500 text-sm">{errors.budget.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
