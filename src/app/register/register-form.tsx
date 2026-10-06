// 'use client'

// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import Link from 'next/link'
// import { toast } from 'sonner'

// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   role: z.enum(['ORGANIZER', 'VENDOR']),
// })

// type RegisterFormValues = z.infer<typeof registerSchema>

// export default function RegisterForm() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       role: 'ORGANIZER',
//     }
//   })

//   const onSubmit = async (data: RegisterFormValues) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         const result = await response.json()
//         throw new Error(result.error || 'Registration failed')
//       }

//       toast.success('Account created successfully')
//       router.push('/login')
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message)
//       } else {
//         toast.error('Something went wrong')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Create an account</CardTitle>
//         <CardDescription>
//           Enter your information to create an account
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input id="name" {...register('name')} placeholder="John Doe" />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" {...register('email')} placeholder="m@example.com" />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" {...register('password')} />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//           </div>
//           <div className="grid gap-2 pb-4">
//             <Label htmlFor="role">I am a...</Label>
//             <select 
//               id="role" 
//               className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               {...register('role')}
//             >
//               <option value="ORGANIZER">Event Organizer</option>
//               <option value="VENDOR">Service Provider</option>
//             </select>
//              {/* Using native select for simplicity or I need to install Select component */}
//              {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
//           </div>
//         </CardContent>
//         <CardFooter className="flex flex-col gap-4">
//           <Button className="w-full" disabled={isLoading}>
//             {isLoading ? 'Creating account...' : 'Create account'}
//           </Button>
//           <div className="text-center text-sm">
//             Already have an account?{" "}
//             <Link href="/login" className="underline">
//               Sign in
//             </Link>
//           </div>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }

// -----------------------

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { CalendarHeart, Store } from 'lucide-react'

const MALAYSIAN_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
  'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya',
]

const BUSINESS_TYPES = [
  'Photography', 'Venues', 'Food Catering', 'Decorations & Venue Setup',
  'Entertainment', 'Logistics', 'Guest Management', 'Attire & Styling',
]

const registerSchema = z
  .object({
    role: z.enum(['ORGANIZER', 'VENDOR']),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phoneNumber: z
      .string()
      .min(8, 'Phone number is required')
      .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
    location: z.string().min(1, 'Please select an operating location'),
    description: z.string().optional(),
    category: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'VENDOR') {
      if (!data.category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['category'],
          message: 'Please select your business type',
        })
      }
      if (!data.description || data.description.trim().length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['description'],
          message: 'Please write at least 20 characters describing your business',
        })
      }
    }
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const roleOptions = [
  {
    value: 'ORGANIZER' as const,
    label: 'Event Planner',
    sub: "I'm organizing an event",
    icon: CalendarHeart,
  },
  {
    value: 'VENDOR' as const,
    label: 'Service Provider',
    sub: 'I offer event services',
    icon: Store,
  },
]

const selectClass =
  'flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'ORGANIZER',
      location: '',
      category: '',
      description: '',
    },
  })

  const selectedRole = watch('role')
  const isVendor = selectedRole === 'VENDOR'

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Registration failed')
      }

      toast.success('Account created successfully')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl">Create an account</CardTitle>
        <CardDescription className="text-base">
          Tell us who you are and we&apos;ll set up the right workspace for you.
        </CardDescription>
      </CardHeader>

      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <form onSubmit={handleSubmit(onSubmit, (errs) => console.log("Validation errors:", errs))}>
        <CardContent className="grid gap-6">
          {/* Role pill toggle */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium">I am a...</Label>
            <div className="inline-flex w-full rounded-full border border-border bg-muted/40 p-1">
              {roleOptions.map((opt) => {
                const isActive = selectedRole === opt.value
                const Icon = opt.icon
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      setValue('role', opt.value, { shouldValidate: false })
                      clearErrors(['category', 'description'])
                    }}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-4 w-4" />
                        {opt.label}
                      </span>
                      <span
                        className={`text-[11px] font-normal opacity-80 sm:text-xs ${
                          isActive ? 'text-primary-foreground/90' : ''
                        }`}
                      >
                        {opt.sub}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <input type="hidden" {...register('role')} />
          </div>

          <div className="h-px w-full bg-border/70" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {isVendor ? 'Business Name' : 'Full Name'}
              </Label>
              <Input
                id="name"
                className="h-11"
                {...register('name')}
                placeholder={isVendor ? 'e.g. Lens & Light Studio' : 'e.g. Nur Aisyah'}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                {isVendor ? 'Business Email' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                className="h-11"
                {...register('email')}
                placeholder="m@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                className="h-11"
                {...register('phoneNumber')}
                placeholder="e.g. 012-345 6789"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Operating Location</Label>
              <select id="location" className={selectClass} {...register('location')}>
                <option value="">Select a state</option>
                {MALAYSIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location.message}</p>
              )}
            </div>

            {isVendor && (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="category">Business Type</Label>
                <select id="category" className={selectClass} {...register('category')}>
                  <option value="">Select your industry</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
              </div>
            )}

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="h-11"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {isVendor && (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Tell planners what you offer, your style, and what makes you a good fit for their event…"
                  className="min-h-[120px] resize-y leading-relaxed"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">Sign in</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}