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
import Link from 'next/link'
import { toast } from 'sonner'
import { CalendarHeart, Store, MailCheck, ChevronDown } from 'lucide-react'
import ResendVerificationButton from '@/components/resend-verification-button'


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
    location: z.string().min(1, 'Please select a location'),
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
  'h-11 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-10 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

/** Wraps a <select> so our own arrow sits neatly inside the box (the browser's one is hidden). */
function SelectBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState<{
    name: string
    email: string
    isVendor: boolean
    emailSent: boolean
  } | null>(null)

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

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || 'Registration failed')
      }

      // Every new account must verify its email; vendors also wait for admin approval
      setSubmitted({
        name: data.name,
        email: data.email,
        isVendor: Boolean(result?.pendingApproval),
        emailSent: result?.emailSent !== false,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl text-center">
        <CardContent className="space-y-6 py-12">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <MailCheck className="h-8 w-8" />
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Check your email</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              {submitted.emailSent ? (
                <>
                  Thanks, {submitted.name}! We sent a verification link to{' '}
                  <span className="font-medium text-foreground">{submitted.email}</span>.
                  Click it to activate your account.
                </>
              ) : (
                <>
                  Thanks, {submitted.name}! Your account was created, but we couldn&apos;t
                  send the verification email. Use the button below to try again.
                </>
              )}
            </p>
            {submitted.isVendor && (
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                After you verify, our team will review your business details. You&apos;ll be
                able to sign in once your application is approved.
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <ResendVerificationButton email={submitted.email} className="h-11 px-6" />
            <Button asChild className="h-11 px-6">
              <Link href="/login">Go to login</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Can&apos;t find it? Check your spam or promotions folder.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl">Create an account</CardTitle>
        <CardDescription className="text-base">
          Tell us who you are and we&apos;ll set up the right workspace for you.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            {isVendor && (
              <p className="text-xs text-muted-foreground">
                Service provider accounts are reviewed by our team before they go live.
              </p>
            )}
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
              <Label htmlFor="location">Location</Label>
              <SelectBox>
                <select id="location" className={selectClass} {...register('location')}>
                  <option value="">Select a state</option>
                  {MALAYSIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </SelectBox>
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location.message}</p>
              )}
            </div>

            {isVendor && (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="category">Business Type</Label>
                <SelectBox>
                  <select id="category" className={selectClass} {...register('category')}>
                    <option value="">Select your industry</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </SelectBox>
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
            {isLoading
              ? 'Creating account...'
              : isVendor
                ? 'Submit for approval'
                : 'Create account'}
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
