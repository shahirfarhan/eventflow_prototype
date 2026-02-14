'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const profileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData: {
    businessName: string
    description?: string | null
    category: string
    location: string
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: initialData.businessName,
      description: initialData.description || '',
      category: initialData.category,
      location: initialData.location,
    }
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/vendor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>
          Manage your public business profile information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" {...register('businessName')} />
            {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="e.g. Photography, Catering" />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} placeholder="e.g. New York, NY" />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Describe your services..." />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
