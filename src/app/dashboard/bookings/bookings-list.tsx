'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Check, X, CreditCard, Ban, CalendarCheck, MessageSquare, MapPin, Users, AlertTriangle } from 'lucide-react'
import BookingChatDialog from './booking-chat-dialog'
import Link from 'next/link'

interface Booking {
  id: string
  status: string
  price: number
  date: string
  location: string | null
  guests: number | null
  specialRequests: string | null
  vendorProvidedAt: string | null
  organizerDisputedAt: string | null
  event: {
    id: string
    title: string
    date: string
  }
  service: {
    name: string
  } | null
  package: {
    name: string
  } | null
  vendor: {
    businessName: string
    id: string
  }
  organizer?: {
    id: string
    name: string | null
    email: string
  }
}

interface BookingsListProps {
  bookings: Booking[]
  userRole: string
  events: {id: string, title:string}[]
}

export default function BookingsList({ bookings, userRole, events }: BookingsListProps) {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string>("all")

  const filtered = selectedEventId === "all" ? bookings : bookings.filter(b => b.event.id === selectedEventId)
  
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return

    setProcessingId(id)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      toast.success(`Booking marked as ${newStatus}`)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'REJECTED': return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'PAID': return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      case 'CANCELLED': return 'bg-red-100 text-red-800 hover:bg-red-100'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBookingName = (booking: Booking) => {
    if (booking.service?.name) return booking.service.name
    if (booking.package?.name) return booking.package.name
    return 'Untitled Booking'
  }

  const isEventDay = (booking: Booking) => {
    const d = new Date(booking.date)
    const today = new Date()
    const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    return a === b
  }

  const markProvided = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/provided`, { method: 'POST' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to mark provided')
      }
      toast.success('Marked as provided')
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setProcessingId(null)
    }
  }

  const dispute = async (bookingId: string) => {
    if (!confirm('Are you sure you want to dispute this booking?')) return
    setProcessingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/dispute`, { method: 'POST' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to dispute')
      }
      toast.success('Dispute opened')
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setProcessingId(null)
    }
  }

  const askProvided = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Has the service been provided today?' }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to send message')
      }
      toast.success('Message sent to vendor')
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setProcessingId(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed">
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {userRole === 'ORGANIZER' ? "You haven't made any booking requests yet." : "You haven't received any booking requests yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {userRole === 'ORGANIZER' && events.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarCheck className="h-4 w-4 text-primary" />
            Filter by Event
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEventId === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedEventId("all")}
              className="rounded-full px-4"
            >
              All Events
            </Button>
            {events.map((event) => (
              <Button
                key={event.id}
                variant={selectedEventId === event.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEventId(event.id)}
                className="rounded-full px-4"
              >
                {event.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <p className="text-sm text-gray-500">No bookings found for the selected event.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1 items-start">
                    <CardTitle className="text-lg text-left">
                      {getBookingName(booking)}
                      {/* {userRole === 'ORGANIZER' && <span className="text-gray-500 font-normal ml-1">with {booking.vendor?.businessName ?? 'Unknown Vendor'}</span>} */}
                      {userRole === 'ORGANIZER' && (
                        <span className="text-gray-500 font-normal ml-1">
                          with{" "}
                          <Link
                            href={`/vendors/${booking.vendor?.id}`}
                            className="text-primary hover:underline"
                          >
                            {booking.vendor?.businessName ?? 'Unknown Vendor'}
                          </Link>
                        </span>
                      )}
                      {userRole === 'VENDOR' && <span className="text-gray-500 font-normal ml-1">for {booking.organizer?.name ?? 'Unknown Event'}</span>}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-gray-900">RM {booking.price.toLocaleString()}</span>
                      <span>•</span>
                      <span>{format(new Date(booking.date), 'PPP')}</span>
                    </div>
                    {userRole === 'ORGANIZER' && (
                      <Badge variant="outline" className="mt-1 font-normal text-xs bg-gray-50 border-gray-200">
                        Event: {booking.event?.title ?? 'Unknown'}
                      </Badge>
                    )}
                  </div>
                  <Badge className={getStatusColor(booking.status)} variant="secondary">
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {booking.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                  {typeof booking.guests === 'number' && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{booking.guests} pax</span>
                    </div>
                  )}
                  {booking.specialRequests && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <span className="whitespace-pre-wrap">{booking.specialRequests}</span>
                    </div>
                  )}
                  {booking.organizerDisputedAt && (
                    <div className="text-red-700 font-medium">
                      Disputed
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                {userRole === 'VENDOR' && (
                  <BookingChatDialog
                    bookingId={booking.id}
                    peerId={booking.organizer?.id}
                    title={
                      booking.organizer?.name
                        ? `Planner — ${booking.organizer.name}`
                        : 'Contact Planner'
                    }
                    description={
                      [
                        booking.event?.title ? `Event: ${booking.event.title}` : null,
                        getBookingName(booking) ? `Booking: ${getBookingName(booking)}` : null,
                      ]
                        .filter(Boolean)
                        .join(' • ') || undefined
                    }
                    trigger={
                      <Button size="sm" variant="outline" disabled={!!processingId}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Planner
                      </Button>
                    }
                  />
                )}

                {userRole === 'ORGANIZER' && (
                  <BookingChatDialog
                    bookingId={booking.id}
                    peerId={booking.vendor.id}
                    title={`${booking.vendor.businessName}`}
                    description={
                      [
                        booking.event?.title ? `Event: ${booking.event.title}` : null,
                        getBookingName(booking) ? `Booking: ${getBookingName(booking)}` : null,
                      ]
                        .filter(Boolean)
                        .join(' • ') || undefined
                    }
                    trigger={
                      <Button size="sm" variant="outline" disabled={!!processingId}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Vendor
                      </Button>
                    }
                  />
                )}

                {userRole === 'VENDOR' && booking.status === 'PENDING' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                      disabled={!!processingId}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                      disabled={!!processingId}
                    >
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                  </>
                )}

                {userRole === 'ORGANIZER' && booking.status === 'ACCEPTED' && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate(booking.id, 'PAID')}
                    disabled={!!processingId}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </Button>
                )}

                {userRole === 'ORGANIZER' && booking.status === 'PENDING' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                    disabled={!!processingId}
                  >
                    <Ban className="mr-2 h-4 w-4" /> Cancel Request
                  </Button>
                )}

                {userRole === 'VENDOR' && booking.status === 'PAID' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                    disabled={!!processingId}
                  >
                    <Check className="mr-2 h-4 w-4" /> Mark Complete
                  </Button>
                )}

                {userRole === 'VENDOR' &&
                  (booking.status === 'ACCEPTED' || booking.status === 'PAID') &&
                  isEventDay(booking) &&
                  !booking.vendorProvidedAt && (
                    <Button
                      size="sm"
                      onClick={() => markProvided(booking.id)}
                      disabled={!!processingId}
                    >
                      <Check className="mr-2 h-4 w-4" /> The service has been provided
                    </Button>
                  )}

                {userRole === 'ORGANIZER' &&
                  (booking.status === 'ACCEPTED' || booking.status === 'PAID') &&
                  isEventDay(booking) &&
                  !booking.vendorProvidedAt && (
                    <Button
                      size="sm"
                      onClick={() => askProvided(booking.id)}
                      disabled={!!processingId}
                    >
                      Has the service been provided?
                    </Button>
                  )}

                {userRole === 'ORGANIZER' &&
                  (booking.status === 'ACCEPTED' || booking.status === 'PAID') &&
                  isEventDay(booking) &&
                  booking.vendorProvidedAt &&
                  !booking.organizerDisputedAt && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => dispute(booking.id)}
                      disabled={!!processingId}
                    >
                      <Ban className="mr-2 h-4 w-4" /> Dispute
                    </Button>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
