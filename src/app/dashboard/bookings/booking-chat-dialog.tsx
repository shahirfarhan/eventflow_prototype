'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ImagePlus, Paperclip, Loader2, X, Tag, MapPin, Sparkles } from 'lucide-react'

type Msg = {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  senderId: string
  contextServiceId?: string | null
  contextPackageId?: string | null
  contextVendorId?: string | null
  sender?: { id: string; name: string | null; email: string }
}

export type ChatContextService = {
  id: string
  name: string
  description?: string | null
  basePrice?: number | null
  vendorId: string
  vendorBusinessName?: string | null
  vendorLocation?: string | null
  occasions?: string | null
}

export default function BookingChatDialog({
  bookingId,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  peerId,
  directPeerName,
  contextService,
  contextServiceName,
  contextVendorBusinessName,
}: {
  bookingId?: string
  trigger?: React.ReactNode
  title: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  peerId?: string
  directPeerName?: string
  contextService?: ChatContextService
  contextServiceName?: string
  contextVendorBusinessName?: string
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === 'boolean'
  const effectiveOpen = isControlled ? open! : internalOpen
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')
  const markedOpenRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const mode: 'booking' | 'direct' = bookingId ? 'booking' : 'direct'

  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
    if (!next) {
      setPendingFile(null)
      setPendingPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setContent('')
    }
  }

  const messagesUrl = useMemo(() => {
    if (mode === 'booking') return `/api/bookings/${bookingId}/messages`
    const q = peerId ? new URLSearchParams({ peerId }).toString() : ''
    return `/api/messages/thread${q ? `?${q}` : ''}`
  }, [mode, bookingId, peerId])

  const sendUrl = useMemo(() => {
    if (mode === 'booking') return `/api/bookings/${bookingId}/messages`
    return `/api/messages/thread`
  }, [mode, bookingId])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(messagesUrl, { cache: 'no-store' })
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

  const markRead = async () => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingId || null,
          peerId,
        }),
      })
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!effectiveOpen) {
      markedOpenRef.current = false
      return
    }
    if (!markedOpenRef.current) {
      markedOpenRef.current = true
      load()
      markRead()
    }
  }, [effectiveOpen, messagesUrl, bookingId, peerId])

  useEffect(() => {
    if (!effectiveOpen) return
    const id = window.setInterval(() => load(), 6000)
    return () => window.clearInterval(id)
  }, [effectiveOpen, messagesUrl])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading, effectiveOpen])

  const handlePickFile = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(f)
    if (f) {
      setPendingPreview(URL.createObjectURL(f))
    } else {
      setPendingPreview(null)
    }
    e.target.value = ''
  }

  const clearPendingFile = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
  }

  const send = async () => {
    const body = content.trim()
    if (!body && !pendingFile) return

    setSending(true)
    try {
      let imageUrl: string | undefined
      if (pendingFile) {
        setUploading(true)
        const form = new FormData()
        form.append('file', pendingFile)
        const ures = await fetch('/api/upload', { method: 'POST', body: form })
        if (!ures.ok) {
          const text = await ures.text().catch(() => '')
          throw new Error(text || 'Failed to upload image')
        }
        const ujson = await ures.json()
        imageUrl = ujson?.url
        if (!imageUrl) throw new Error('Upload succeeded but no URL returned')
        setUploading(false)
      }

      let payloadBody: Record<string, unknown>
      if (mode === 'booking') {
        payloadBody = { content: body, imageUrl }
      } else {
        payloadBody = {
          peerId,
          content: body,
          imageUrl,
          contextServiceId: contextService?.id,
          contextVendorId: contextService?.vendorId,
        }
      }

      const res = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to send message')
      }
      setContent('')
      clearPendingFile()
      await load()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setUploading(false)
      setSending(false)
    }
  }

  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [messages])

  const threadContext = (() => {
    if (contextService) {
      return {
        title: contextService.name,
        subtitle: contextVendorBusinessName || contextService.vendorBusinessName || directPeerName,
        meta: contextService.basePrice ? `RM ${contextService.basePrice.toLocaleString()}` : null,
        location: contextService.vendorLocation,
        occasions: contextService.occasions,
        description: contextService.description,
        source: 'contextService',
      } as const
    }
    if (contextServiceName) {
      return {
        title: contextServiceName,
        subtitle: contextVendorBusinessName,
        meta: null,
        location: null,
        occasions: null,
        description: null,
        source: 'thread',
      } as const
    }
    return null
  })()

  return (
    <Dialog open={effectiveOpen} onOpenChange={setOpen}>
      {!isControlled && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {threadContext && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Enquiring about
                  </div>
                  <div className="font-semibold text-base leading-tight truncate">
                    {threadContext.title}
                  </div>
                  {(threadContext.subtitle || threadContext.meta || threadContext.location) && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {threadContext.subtitle && <span>{threadContext.subtitle}</span>}
                      {threadContext.meta && (
                        <Badge variant="outline" className="text-xs">
                          {threadContext.meta}
                        </Badge>
                      )}
                      {threadContext.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {threadContext.location}
                        </span>
                      )}
                    </div>
                  )}
                  {threadContext.occasions && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {threadContext.occasions
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((occ) => (
                          <Badge key={occ} variant="secondary" className="text-[10px] px-2 py-0">
                            {occ}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div
          ref={scrollRef}
          className="border rounded-md p-3 h-[340px] overflow-y-auto bg-muted/30 space-y-4"
        >
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {mode === 'direct' && contextService
                ? 'Ask any question about this service — the vendor will reply soon.'
                : 'No messages yet.'}
            </div>
          ) : (
            sorted.map((m) => (
              <div key={m.id} className="text-sm">
                <div className="text-xs text-muted-foreground">
                  {m.sender?.name || m.sender?.email || 'User'} • {new Date(m.createdAt).toLocaleString()}
                </div>
                {m.imageUrl && (
                  <div className="mt-2">
                    <a
                      href={m.imageUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block max-w-[280px]"
                    >
                      <img
                        src={m.imageUrl}
                        alt="Attachment"
                        className="rounded-md border bg-white object-cover max-h-[280px] w-auto cursor-zoom-in"
                      />
                    </a>
                  </div>
                )}
                {m.content && m.content !== '📎' && (
                  <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 w-full space-y-2">
            {pendingPreview && (
              <div className="relative inline-flex items-start gap-2 p-2 border rounded-md bg-muted/40 max-w-[260px]">
                <img src={pendingPreview} alt="" className="h-20 w-20 object-cover rounded border bg-white" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate text-muted-foreground">
                    {pendingFile?.name || 'Attached image'}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {pendingFile ? `${(pendingFile.size / 1024).toFixed(1)} KB` : ''}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={clearPendingFile}
                  disabled={uploading}
                  aria-label="Remove attachment"
                >
                  <X className="h-4 w-4" />
                </Button>
                {uploading && (
                  <Loader2 className="absolute bottom-2 right-2 h-4 w-4 animate-spin text-primary" />
                )}
              </div>
            )}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message…"
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault()
                  void send()
                }
              }}
            />
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-2 justify-end w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={handlePickFile} disabled={sending || uploading}>
              <Paperclip className="mr-2 h-4 w-4" />
              Attach
            </Button>
            <Button type="button" variant="outline" onClick={load} disabled={loading || sending}>
              Refresh
            </Button>
            <Button
              type="button"
              onClick={send}
              disabled={sending || (!content.trim() && !pendingFile)}
            >
              {sending ? (uploading ? 'Uploading…' : 'Sending…') : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
