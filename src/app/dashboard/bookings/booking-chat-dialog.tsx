'use client'

import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

type Msg = {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender?: { id: string; name: string | null; email: string }
}

export default function BookingChatDialog({
  bookingId,
  trigger,
  title,
  description,
}: {
  bookingId: string
  trigger: React.ReactNode
  title: string
  description?: string
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, { cache: 'no-store' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to load messages')
      }
      const json = await res.json()
      setMessages(Array.isArray(json) ? json : [])
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    load()
  }, [open])

  const send = async () => {
    const body = content.trim()
    if (!body) return

    setSending(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: body }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to send message')
      }
      setContent('')
      await load()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [messages])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="border rounded-md p-3 h-[320px] overflow-y-auto bg-muted/30 space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No messages yet.</div>
          ) : (
            sorted.map((m) => (
              <div key={m.id} className="text-sm">
                <div className="text-xs text-muted-foreground">
                  {m.sender?.name || m.sender?.email || 'User'} • {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message…"
            className="min-h-[80px]"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={load} disabled={loading || sending}>
              Refresh
            </Button>
            <Button type="button" onClick={send} disabled={sending || !content.trim()}>
              {sending ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

