'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  date: z.date({
    required_error: "A date of event is required.",
  } as any),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(2, 'Type is required'),
  budget: z.coerce.number().min(0, 'Budget must be positive'),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventDialogProps {
  event?: {
    id: string
    title: string
    date: string | Date
    location: string
    type: string
    budget: number
  }
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function EventDialog({ event, trigger, open, onOpenChange }: EventDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const isEditing = !!event
  const effectiveOpen = open !== undefined ? open : dialogOpen
  const setEffectiveOpen = onOpenChange || setDialogOpen

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: event?.title || '',
      date: event?.date ? new Date(event.date) : undefined,
      location: event?.location || '',
      type: event?.type || '',
      budget: event?.budget || 0,
    }
  })

  const date = watch("date")

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/organizer/events/${event.id}` : '/api/organizer/events'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save event')
      }

      toast.success(`Event ${isEditing ? 'updated' : 'created'} successfully`)
      setEffectiveOpen(false)
      reset()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={setEffectiveOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your event details.' : 'Enter the details for your new event.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" {...register('title')} placeholder="e.g. Birthday Party" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue("date", date as Date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} placeholder="e.g. Central Park" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Input id="type" {...register('type')} placeholder="e.g. Wedding, Birthday" />
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input id="budget" type="number" {...register('budget')} placeholder="5000" />
              {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
