'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import ServiceDialog from './service-dialog'
import { toast } from 'sonner'
import Link from "next/link";
import { Plus } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  occasions: string | null;
  pricingModel: string;
  locationsCovered: string[];
  includedItems: string[];
  minGuests: number | null;
  maxGuests: number | null;
}

interface ServicesListProps {
  services: Service[]
}

export default function ServicesList({ services }: ServicesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

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
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new service.
        </p>
        <div className="mt-6">
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/services/new">
                Add Service
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {services.map((service) => (
        <Card key={service.id} className="flex h-full min-h-[280px] flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription className="font-semibold text-primary">
                RM {service.basePrice.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {service.pricingModel === "PER_HOUR"
                    ? "/ hour"
                    : service.pricingModel === "PER_PAX"
                      ? "/ pax"
                      : service.pricingModel === "PER_DAY"
                        ? "/ day"
                        : ""}
                </span>
              </CardDescription>
            </div>
            <DropdownMenu
              open={menuOpenId === service.id}
              onOpenChange={(open) => {
                setMenuOpenId(open ? service.id : null)
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/services/${service.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
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

            <ServiceDialog
              service={service}
              open={editingId === service.id}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingId(null)
                }
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 line-clamp-3">
              {service.description || 'No description provided.'}
            </p>
            {service.occasions ? (
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Suitable for
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {service.occasions
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((occasion) => (
                      <Badge
                        key={occasion}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {occasion}
                      </Badge>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No suitable events selected.
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add new service card */}
      <Card className="flex h-full min-h-[280px] w-full flex-col items-center justify-center border-dashed transition-colors hover:bg-muted/50">
        <Button asChild variant="ghost" className="flex h-full w-full flex-col gap-2">
          <Link href="/dashboard/services/new">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span>Add New Service</span>
          </Link>
        </Button>
      </Card>
    </div>
  )
}
