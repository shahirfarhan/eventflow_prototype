'use client'

import { useActionState, useEffect } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Hourglass, XCircle, AlertCircle, MailWarning } from 'lucide-react'
import { cn } from '@/lib/utils'
import ResendVerificationButton from '@/components/resend-verification-button'

const NOTICE = {
  unverified: {
    title: 'Verify your email',
    icon: MailWarning,
    tone: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  pending: {
    title: 'Application pending',
    icon: Hourglass,
    tone: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  rejected: {
    title: 'Application not approved',
    icon: XCircle,
    tone: 'border-red-200 bg-red-50 text-red-800',
  },
} as const

export default function LoginForm() {
  const [state, dispatch, isPending] = useActionState(authenticate, undefined)

  useEffect(() => {
    if (state?.kind === 'success') {
      // Full page load so every part of the app picks up the new login
      window.location.href = '/'
    }
  }, [state])

  const notice =
    state && state.kind !== 'error' && state.kind !== 'success' ? NOTICE[state.kind] : null

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="grid gap-4">
          {state && notice && (
            <div
              role="alert"
              className={cn('flex gap-3 rounded-lg border p-3 text-sm', notice.tone)}
            >
              <notice.icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">{notice.title}</p>
                <p className="mt-0.5 leading-relaxed">{state.message}</p>
                {state.kind === 'unverified' && (
                  <ResendVerificationButton
                    email={state.email}
                    className="mt-3 h-9 bg-background"
                  />
                )}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2 pb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>

          {state?.kind === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || state?.kind === 'success'}
          >
            {isPending || state?.kind === 'success' ? "Logging in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
