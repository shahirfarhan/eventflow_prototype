'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function ResendVerificationButton({
  email,
  variant = 'outline',
  className,
}: {
  email: string
  variant?: 'outline' | 'default' | 'secondary' | 'ghost' | 'link'
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const resend = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Could not send email')
      setSent(true)
      toast.success('Verification email sent. Check your inbox (and spam folder).')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading || sent}
      onClick={resend}
    >
      {loading ? 'Sending…' : sent ? 'Email sent' : 'Resend verification email'}
    </Button>
  )
}
