'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ImagePlus, Paperclip, Loader2, X, Tag, MapPin, Sparkles, ReceiptText, FileText, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Send } from 'lucide-react'

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
  quotation?: null | ChatQuotationPayload
}

type ChatQuotationPayload = {
  id: string
  price: number
  currency: string
  date: string | null
  time: string | null
  location: string | null
  notes: string | null
  validUntil: string | null
  status: string
  acceptedAt: string | null
  rejectedAt: string | null
  senderId: string
  receiverId: string
  bookingId: string | null
  vendorId: string | null
  serviceId: string | null
  packageId: string | null
  service?: { id: string; name: string } | null
  package?: { id: string; name: string } | null
  vendor?: { id: string; businessName: string } | null
  booking?: { event?: { title: string } } | null
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
  vendorBusinessName,
  vendorUserId,
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
  vendorBusinessName?: string
  vendorUserId?: string
}) {
  const { data: session } = useSession()
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

  // Quotation editor state (vendor only)
  const [quotationEditorOpen, setQuotationEditorOpen] = useState(false)
  const [quotationSubmitting, setQuotationSubmitting] = useState(false)
  const [qPrice, setQPrice] = useState<string>('')
  const [qDate, setQDate] = useState<string>('')
  const [qTime, setQTime] = useState<string>('')
  const [qLocation, setQLocation] = useState<string>('')
  const [qNotes, setQNotes] = useState<string>('')
  const [qServiceId, setQServiceId] = useState<string>('')
  const [qValidUntil, setQValidUntil] = useState<string>('')
  const [qActionLoading, setQActionLoading] = useState<string | null>(null)
  const [qPax, setQPax] = useState("1");

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
      setQuotationEditorOpen(false)
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
      // Populate quotation defaults first open
      if (contextService) {
        setQServiceId(contextService.id)
        if (typeof contextService.basePrice === 'number') setQPrice(String(contextService.basePrice))
        if (contextService.vendorLocation) setQLocation(contextService.vendorLocation)
      }
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

  const currentUserId = session?.user?.id ?? null
  const currentRole = session?.user?.role ?? null
  const vendorCanSendQuotation =
    currentRole === 'VENDOR' && !!peerId && mode === 'booking'
      ? !!bookingId
      : !!peerId // Also allow in direct mode; server validates + sends attached chat message on direct/booking threads

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

  const sendQuotation = async () => {
    if (!peerId) {
      toast.error('No recipient specified for quotation')
      return
    }
    const priceNum = parseFloat(qPrice)
    if (!priceNum || priceNum <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    const serviceIdValue = qServiceId || contextService?.id || undefined
    const payload: any = {
      receiverId: peerId,
      price: priceNum,
      currency: 'MYR',
      serviceId: serviceIdValue,
      vendorId: contextService?.vendorId ?? undefined,
      packageId: undefined,
      bookingId: bookingId ?? undefined,
      notes: qNotes.trim() || undefined,
      location: qLocation.trim() || undefined,
      time: qTime || undefined,
      dateIso: qDate ? new Date(`${qDate}T00:00:00`).toISOString() : undefined,
      validUntilIso: qValidUntil ? new Date(`${qValidUntil}T23:59:59`).toISOString() : undefined,
      attachThreadBookingId: bookingId,
    }
    setQuotationSubmitting(true)
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to send quotation')
      }
      toast.success('Price quotation sent')
      setQuotationEditorOpen(false)
      setQPrice('')
      setQDate('')
      setQTime('')
      setQLocation('')
      setQNotes('')
      setQValidUntil('')
      setQServiceId('')
      await load()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send quotation')
    } finally {
      setQuotationSubmitting(false)
    }
  }

  const updateQuotationStatus = async (
    quotationId: string,
    nextStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    setQActionLoading(quotationId)
    try {
      const res = await fetch(`/api/quotations/${quotationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to respond to quotation')
      }
      toast.success(nextStatus === 'ACCEPTED' ? 'Quotation accepted' : 'Quotation rejected')
      await load()
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setQActionLoading(null)
    }
  }

  const sorted = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
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

  function QuotationStatusBadge({ status }: { status: string }) {
    if (status === 'ACCEPTED')
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Accepted
        </Badge>
      )
    if (status === 'REJECTED')
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
          <XCircle className="mr-1 h-3 w-3" /> Declined
        </Badge>
      )
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
        <AlertCircle className="mr-1 h-3 w-3" /> Pending response
      </Badge>
    )
  }

  function QuotationBubble({ q }: { q: NonNullable<Msg['quotation']> }) {
    const isPending = q.status === 'PENDING'
    const plannerSide = currentRole === 'ORGANIZER' && currentUserId && q.receiverId === currentUserId
    const showActions = isPending && plannerSide

    return (
      <Card className="mt-2 border-emerald-200 bg-emerald-50/50 max-w-[360px] w-full">
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <ReceiptText className="h-3.5 w-3.5" /> Price Quotation
            </div>
            <QuotationStatusBadge status={q.status} />
          </div>
          <div className="h-px w-full bg-emerald-200/70" />
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="font-medium leading-tight">
              {q.service?.name ?? q.package?.name ?? 'Quoted service'}
            </div>
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="font-semibold text-emerald-700 text-base leading-tight">
              {q.currency} {q.price.toLocaleString()}
            </div>
            {(q.date || q.booking?.event?.title) && (
              <>
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  {q.date
                    ? new Date(q.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                    : q.booking?.event?.title ?? 'No date set'}
                  {q.booking?.event?.title && q.date ? ` • ${q.booking.event.title}` : ''}
                </div>
              </>
            )}
            {q.time && (
              <>
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">{q.time}</div>
              </>
            )}
            {q.location && (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">{q.location}</div>
              </>
            )}
            {q.notes && (
              <>
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm whitespace-pre-wrap">{q.notes}</div>
              </>
            )}
            {q.validUntil && (
              <>
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  Valid until{' '}
                  {new Date(q.validUntil).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </>
            )}
          </div>

          {showActions && (
            <>
              <div className="h-px w-full bg-emerald-200/70" />
              <div className="flex gap-2 justify-end pt-0.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  disabled={qActionLoading === q.id}
                  onClick={() => updateQuotationStatus(q.id, 'REJECTED')}
                >
                  {qActionLoading === q.id ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-3.5 w-3.5" />
                  )}
                  Decline
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={qActionLoading === q.id}
                  onClick={() => updateQuotationStatus(q.id, 'ACCEPTED')}
                >
                  {qActionLoading === q.id ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  )}
                  Accept Quotation
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={setOpen}>
      {!isControlled && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[720px]">
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
                          <Badge
                            key={occ}
                            variant="secondary"
                            className="text-[10px] px-2 py-0"
                          >
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
                  {m.sender?.name || m.sender?.email || 'User'} •{' '}
                  {new Date(m.createdAt).toLocaleString()}
                </div>
                {m.quotation && <QuotationBubble q={m.quotation} />}
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
                {m.content && m.content !== '📎' && !(m.quotation && m.content.startsWith('📄 Price quotation:')) && (
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
                <img
                  src={pendingPreview}
                  alt=""
                  className="h-20 w-20 object-cover rounded border bg-white"
                />
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

          <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handlePickFile}
              disabled={sending || uploading}
              title="Attach image"
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Attach
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={load}
              disabled={loading || sending}
              title="Refresh messages"
            >
              Refresh
            </Button>
            {vendorCanSendQuotation && currentRole === 'VENDOR' && (
              <Popover open={quotationEditorOpen} onOpenChange={setQuotationEditorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    disabled={sending || quotationSubmitting}
                  >
                    <ReceiptText className="mr-2 h-4 w-4" />
                    Send Quotation
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-4 space-y-4">
                  <div className="space-y-1">
                    <div className="font-semibold inline-flex items-center gap-1.5 text-emerald-700">
                      <ReceiptText className="h-4 w-4" /> Create price quotation
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The planner will receive the quotation inline in this chat thread with Accept/Decline buttons.
                    </p>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="q-price">Price</Label>
                        <Input
                          id="q-price"
                          type="number"
                          value={qPrice}
                          onChange={(e) => setQPrice(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="q-pax">No. of Pax</Label>
                        <Input
                          id="q-pax"
                          type="number"
                          min={1}
                          value={qPax}
                          onChange={(e) => setQPax(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="q-date">Date</Label>
                        <Input
                          id="q-date"
                          type="date"
                          value={qDate}
                          onChange={(e) => setQDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="q-time">Time</Label>
                        <Input
                          id="q-time"
                          type="time"
                          value={qTime}
                          onChange={(e) => setQTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="q-location">Location</Label>
                      <Input
                        id="q-location"
                        type="text"
                        placeholder="e.g. Kuala Lumpur Convention Centre"
                        value={qLocation}
                        onChange={(e) => setQLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="q-valid-until">Valid until</Label>
                      <Input
                        id="q-valid-until"
                        type="date"
                        value={qValidUntil}
                        onChange={(e) => setQValidUntil(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="q-service-id">Service ID (optional)</Label>
                      <Input
                        id="q-service-id"
                        type="text"
                        placeholder={contextService?.id || 'e.g. svc_abc'}
                        value={qServiceId}
                        onChange={(e) => setQServiceId(e.target.value)}
                      />
                      {contextService?.name && (
                        <p className="text-[11px] text-muted-foreground">
                          Defaulting to <span className="font-medium">{contextService.name}</span> from enquiry context.
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="q-notes">Notes / Line items</Label>
                      <Textarea
                        id="q-notes"
                        rows={3}
                        placeholder="Optional description, add-ons, cancellation policy, etc."
                        value={qNotes}
                        onChange={(e) => setQNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <div className="flex justify-end gap-2 pt-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setQuotationEditorOpen(false)}
                      disabled={quotationSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={quotationSubmitting || !peerId || !parseFloat(qPrice)}
                      onClick={sendQuotation}
                    >
                      {quotationSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Quotation
                        </>
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              type="button"
              onClick={send}
              disabled={sending || (!content.trim() && !pendingFile)}
            >
              {sending ? (
                uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                )
              ) : (
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
