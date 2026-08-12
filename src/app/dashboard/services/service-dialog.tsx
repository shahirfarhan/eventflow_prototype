'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const EVENT_CATEGORIES = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Anniversary',
  'Engagement',
  'Graduation',
  'Baby Shower',
  'Private Party',
  'Festival',
  'Other',
]

const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  occasions: z
    .array(z.string())
    .min(1, 'Please select at least one event category'),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceDialogProps {
  service?: {
    id: string
    name: string
    description: string | null
    basePrice: number
    occasions: string | null
  }
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ServiceDialog({
  service,
  trigger,
  open,
  onOpenChange,
}: ServiceDialogProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isEditing = !!service

  const effectiveOpen = open !== undefined ? open : dialogOpen

  const setEffectiveOpen = onOpenChange || setDialogOpen

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),

    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      basePrice: service?.basePrice || 0,

      occasions: service?.occasions
        ? service.occasions
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    },
  })

  const selectedOccasions = watch('occasions') || []

  const toggleOccasion = (occasion: string) => {
    const current = selectedOccasions

    if (current.includes(occasion)) {
      setValue(
        'occasions',
        current.filter((item) => item !== occasion),
        {
          shouldValidate: true,
        }
      )
    } else {
      setValue(
        'occasions',
        [...current, occasion],
        {
          shouldValidate: true,
        }
      )
    }
  }

  const onSubmit = async (data: ServiceFormValues) => {
    setIsLoading(true)

    try {
      const url = isEditing
        ? `/api/vendor/services/${service.id}`
        : '/api/vendor/services'

      const method = isEditing ? 'PUT' : 'POST'

      // Convert the selected occasions array into a string
      // Example:
      // ['Wedding', 'Birthday', 'Corporate']
      // becomes:
      // 'Wedding, Birthday, Corporate'
      const payload = {
        ...data,
        occasions: data.occasions.join(', '),
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save service')
      }

      toast.success(
        `Service ${isEditing ? 'updated' : 'created'} successfully`
      )

      setEffectiveOpen(false)

      reset()

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={setEffectiveOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? 'Make changes to your service here.'
              : 'Add a new service to your profile.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          {/* Service Name */}
          <div className="space-y-3">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. Wedding Photography"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Base Price */}
          <div className="space-y-3">
            <Label htmlFor="basePrice">Base Price (RM)</Label>
            <Input
              id="basePrice"
              type="number"
              {...register('basePrice', { valueAsNumber: true })}
            />
            {errors.basePrice && (
              <p className="text-sm text-red-500">{errors.basePrice.message}</p>
            )}
          </div>

          {/* Event Categories */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Suitable For</Label>
              <p className="text-sm text-muted-foreground">
                Select all event types this service can accommodate.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {EVENT_CATEGORIES.map((occasion) => {
                const selected = selectedOccasions.includes(occasion)
                return (
                  <button
                    key={occasion}
                    type="button"
                    onClick={() => toggleOccasion(occasion)}
                    className={`
                      rounded-full
                      border
                      px-4
                      py-2
                      text-sm
                      min-h-[34px]
                      transition-colors
                      ${
                        selected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background hover:bg-muted border-input'
                      }
                    `}
                  >
                    {occasion}
                  </button>
                )
              })}
            </div>

            {errors.occasions && (
              <p className="text-sm text-red-500">{errors.occasions.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe what's included..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}