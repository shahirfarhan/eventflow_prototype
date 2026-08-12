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

const packageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  features: z.string().optional(),
})

type PackageFormValues = z.infer<typeof packageSchema>

export default function PackageDialog({
  serviceId,
  pkg,
  trigger,
}: {
  serviceId: string
  pkg?: {
    id: string
    name: string
    description: string | null
    price: number
    features: string | null
  }
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const isEditing = !!pkg

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as any,
    defaultValues: {
      name: pkg?.name || '',
      description: pkg?.description || '',
      price: pkg?.price || 0,
      features: pkg?.features || '',
    },
  })

  const onSubmit = async (data: PackageFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch(isEditing ? `/api/vendor/packages/${pkg!.id}` : '/api/vendor/packages', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? data : { ...data, serviceId }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || 'Failed to save package')
      }

      toast.success(`Package ${isEditing ? 'updated' : 'created'} successfully`)
      setOpen(false)
      reset()
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Package' : 'Add Package'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your package details.' : 'Create a new package under this service.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Full Day Coverage" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input id="price" type="number" {...register('price')} placeholder="3000" />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="What’s included..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="features">Features</Label>
              <Textarea id="features" {...register('features')} placeholder="Comma separated list or any text..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

