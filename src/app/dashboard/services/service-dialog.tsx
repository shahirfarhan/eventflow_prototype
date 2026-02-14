'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(0, 'Price must be positive'),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceDialogProps {
  service?: {
    id: string
    name: string
    description: string | null
    basePrice: number
  }
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ServiceDialog({ service, trigger, open, onOpenChange }: ServiceDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const isEditing = !!service
  const effectiveOpen = open !== undefined ? open : dialogOpen
  const setEffectiveOpen = onOpenChange || setDialogOpen

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      basePrice: service?.basePrice || 0,
    }
  })

  const onSubmit = async (data: ServiceFormValues) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/vendor/services/${service.id}` : '/api/vendor/services'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save service')
      }

      toast.success(`Service ${isEditing ? 'updated' : 'created'} successfully`)
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
          <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your service here.' : 'Add a new service to your profile.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Wedding Photography" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Base Price ($)</Label>
              <Input id="basePrice" type="number" {...register('basePrice')} placeholder="1000" />
              {errors.basePrice && <p className="text-red-500 text-sm">{errors.basePrice.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Describe what's included..." />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
