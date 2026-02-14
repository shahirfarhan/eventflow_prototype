'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Check, X, CreditCard, Ban } from 'lucide-react'

interface Booking {
  id: string
  status: string
  price: number
  event: {
    title: string
    date: string
  }
  service: {
    name: string
  }
  vendor: {
    businessName: string
  }
}

interface BookingsListProps {
  bookings: Booking[]
  userRole: string
}

export default function BookingsList({ bookings, userRole }: BookingsListProps) {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)

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
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {booking.service.name}
                  {userRole === 'ORGANIZER' && <span className="text-gray-500 font-normal"> with {booking.vendor.businessName}</span>}
                  {userRole === 'VENDOR' && <span className="text-gray-500 font-normal"> for {booking.event.title}</span>}
                </CardTitle>
                <CardDescription>
                  {format(new Date(booking.event.date), 'PPP')} • ${booking.price}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(booking.status)} variant="secondary">
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Additional details could go here */}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
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
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate(booking.id, 'PAID')}
                disabled={!!processingId}
              >
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now (Stub)
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
