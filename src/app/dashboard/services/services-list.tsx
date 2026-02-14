'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import ServiceDialog from './service-dialog'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  description: string | null
  basePrice: number
}

interface ServicesListProps {
  services: Service[]
}

export default function ServicesList({ services }: ServicesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/vendor/services/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete service')
      }

      toast.success('Service deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed">
        <h3 className="text-lg font-medium text-gray-900">No services yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new service.</p>
        <div className="mt-6">
          <ServiceDialog 
            trigger={<Button>Add Service</Button>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription className="font-semibold text-primary">
                ${service.basePrice.toLocaleString()}
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
                <ServiceDialog 
                   service={service}
                   trigger={
                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                       <Pencil className="mr-2 h-4 w-4" /> Edit
                     </DropdownMenuItem>
                   }
                />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                >
                  <Trash className="mr-2 h-4 w-4" /> 
                  {deletingId === service.id ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 line-clamp-3">
              {service.description || "No description provided."}
            </p>
          </CardContent>
        </Card>
      ))}
      
      {/* Add new card */}
      <Card className="flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-gray-50 transition-colors min-h-[200px]">
         <ServiceDialog 
            trigger={
              <Button variant="ghost" className="h-full w-full flex flex-col gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-light text-primary">+</span>
                </div>
                <span>Add New Service</span>
              </Button>
            }
         />
      </Card>
    </div>
  )
}
