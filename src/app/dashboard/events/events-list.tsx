'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash, Calendar as CalendarIcon, MapPin, DollarSign } from 'lucide-react'
import EventDialog from './event-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  date: string | Date
  location: string
  type: string
  budget: number
}

interface EventsListProps {
  events: Event[]
}

export default function EventsList({ events }: EventsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/organizer/events/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      toast.success('Event deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed">
        <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
        <div className="mt-6">
          <EventDialog 
            trigger={<Button>Create Event</Button>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="font-semibold text-primary">
                {event.type}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EventDialog 
                   event={event}
                   trigger={
                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                       <Pencil className="mr-2 h-4 w-4" /> Edit
                     </DropdownMenuItem>
                   }
                />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                >
                  <Trash className="mr-2 h-4 w-4" /> 
                  {deletingId === event.id ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {format(new Date(event.date), 'PPP')}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 opacity-70" />
              {event.location}
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 opacity-70" />
              Budget: ${event.budget.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Add new card */}
      <Card className="flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-gray-50 transition-colors min-h-[200px]">
         <EventDialog 
            trigger={
              <Button variant="ghost" className="h-full w-full flex flex-col gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-light text-primary">+</span>
                </div>
                <span>Create New Event</span>
              </Button>
            }
         />
      </Card>
    </div>
  )
}
