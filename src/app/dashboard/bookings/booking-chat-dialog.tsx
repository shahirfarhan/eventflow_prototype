'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import {
  Paperclip,
  Loader2,
  X,
  Tag,
  MapPin,
  ReceiptText,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SendHorizontal,
  CreditCard,
  RefreshCw,
  MessagesSquare,
  Star,
  ChevronDown,
  Check,
} from 'lucide-react'

type VendorRating = { average: number | null; count: number }

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

const POLL_MS = 6000

/**
 * Where "Pay now" takes the planner. Change this to match your payment flow,
 * e.g. a checkout page, or a booking page that already has a pay button.
 */
function payUrlFor(q: ChatQuotationPayload) {
  return q.bookingId
    ? `/dashboard/bookings/${q.bookingId}?pay=1&quotationId=${q.id}`
    : `/checkout/quotation/${q.id}`
}
const GROUP_GAP_MS = 5 * 60 * 1000 // messages within 5 min from the same person are grouped

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function initialsFor(name: string | null | undefined) {
  const base = (name || '').trim()
  if (!base) return '?'
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.substring(0, 2).toUpperCase()
}

function dayLabel(d: Date) {
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  if (d.getFullYear() === new Date().getFullYear()) return format(d, 'EEEE, d MMMM')
  return format(d, 'd MMMM yyyy')
}

/** Hide the auto-generated text that accompanies attachments and quotations. */
function visibleText(m: Msg) {
  if (!m.content || m.content === '📎') return ''
  if (m.quotation && m.content.startsWith('📄 Price quotation:')) return ''
  return m.content
}

/* ------------------------------------------------------------------ */
/* Quotation card                                                     */
/* ------------------------------------------------------------------ */

function QuotationStatusBadge({ status }: { status: string }) {
  if (status === 'PAID')
    return (
      <Badge className="border-0 bg-emerald-600 text-white hover:bg-emerald-600">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
      </Badge>
    )
  if (status === 'ACCEPTED')
    return (
      <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Accepted
      </Badge>
    )
  if (status === 'REJECTED')
    return (
      <Badge className="border-0 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300">
        <XCircle className="mr-1 h-3 w-3" /> Declined
      </Badge>
    )
  return (
    <Badge className="border-0 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300">
      <AlertCircle className="mr-1 h-3 w-3" /> Awaiting response
    </Badge>
  )
}

function QuotationCard({
  q,
  canRespond,
  busy,
  onRespond,
}: {
  q: ChatQuotationPayload
  canRespond: boolean
  busy: boolean
  onRespond: (id: string, status: 'ACCEPTED' | 'REJECTED') => void
}) {
  const showActions = q.status === 'PENDING' && canRespond
  const showPay = q.status === 'ACCEPTED' && canRespond

  const rows: { icon: typeof Tag; content: React.ReactNode }[] = []
  if (q.date || q.booking?.event?.title) {
    rows.push({
      icon: Calendar,
      content: (
        <>
          {q.date
            ? new Date(q.date).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : q.booking?.event?.title}
          {q.date && q.booking?.event?.title && (
            <span className="text-muted-foreground"> for {q.booking.event.title}</span>
          )}
        </>
      ),
    })
  }
  if (q.time) rows.push({ icon: Clock, content: q.time })
  if (q.location) rows.push({ icon: MapPin, content: q.location })
  if (q.notes) rows.push({ icon: FileText, content: <span className="whitespace-pre-wrap">{q.notes}</span> })

  return (
    <div className="w-80 max-w-full overflow-hidden rounded-2xl border border-emerald-200 bg-background shadow-sm dark:border-emerald-500/30">
      <div className="flex items-center justify-between gap-2 bg-emerald-50 px-4 py-2.5 dark:bg-emerald-500/10">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ReceiptText className="h-3.5 w-3.5" /> Price quotation
        </span>
        <QuotationStatusBadge status={q.status} />
      </div>

      <div className="space-y-3 px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {q.service?.name ?? q.package?.name ?? 'Quoted service'}
          </p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
            {q.currency} {q.price.toLocaleString()}
          </p>
        </div>

        {rows.length > 0 && (
          <ul className="space-y-1.5 text-sm">
            {rows.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">{r.content}</span>
              </li>
            ))}
          </ul>
        )}

        {q.validUntil && (
          <p className="text-xs text-muted-foreground">
            Valid until{' '}
            {new Date(q.validUntil).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 border-t px-4 py-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
            disabled={busy}
            onClick={() => onRespond(q.id, 'REJECTED')}
          >
            Decline
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={busy}
            onClick={() => onRespond(q.id, 'ACCEPTED')}
          >
            {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
            Accept
          </Button>
        </div>
      )}

      {showPay && (
        <div className="space-y-2 border-t px-4 py-3">
          <a
            href={payUrlFor(q)}
            className="rounded-md bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 36,
              width: '100%',
              whiteSpace: 'nowrap',
            }}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            Pay {q.currency} {q.price.toLocaleString()}
          </a>
          <p className="text-center text-xs text-muted-foreground">
            You accepted this quotation. Pay to confirm the booking.
          </p>
        </div>
      )}

      {q.status === 'ACCEPTED' && !canRespond && (
        <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
          Accepted. Waiting for the planner to pay.
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Dialog                                                             */
/* ------------------------------------------------------------------ */

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
  vendorBusinessName?: string
  vendorUserId?: string
}) {
  const { data: session } = useSession()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === 'boolean'
  const effectiveOpen = isControlled ? open! : internalOpen

  const [messages, setMessages] = useState<Msg[]>([])
  const [initialLoading, setInitialLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')

  const markedOpenRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)
  // Only real user input (wheel, touch, keys, scrollbar drag) may unpin the view.
  // Scroll events caused by layout changes or our own scrolling are ignored.
  const userScrolledRef = useRef(false)

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
  const [qPax, setQPax] = useState('1')

  // Rating of the vendor in this chat (null = the other person isn't a vendor)
  const [vendorRating, setVendorRating] = useState<VendorRating | null>(null)

  // Vendor can change which of their services this enquiry is about
  const [serviceOverride, setServiceOverride] = useState<ChatContextService | null>(null)
  const [servicePickerOpen, setServicePickerOpen] = useState(false)
  const [myServices, setMyServices] = useState<ChatContextService[] | null>(null)
  const [myServicesLoading, setMyServicesLoading] = useState(false)
  const activeService = serviceOverride ?? contextService

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

  /**
   * `silent` = background poll: no spinner, no error toast
   * (otherwise a network blip would pop a toast every 6 seconds).
   */
  const load = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setRefreshing(true)
    try {
      const res = await fetch(messagesUrl, { cache: 'no-store' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to load messages')
      }
      const json = await res.json()
      setMessages(Array.isArray(json) ? json : [])
    } catch (e: any) {
      if (!silent) toast.error(e?.message || 'Something went wrong')
    } finally {
      setInitialLoading(false)
      if (!silent) setRefreshing(false)
    }
  }

  const markRead = async () => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingId || null, peerId }),
      })
    } catch {
      /* ignore */
    }
  }

  // First open: load + mark read + prefill quotation defaults
  useEffect(() => {
    if (!effectiveOpen) {
      markedOpenRef.current = false
      return
    }
    if (!markedOpenRef.current) {
      markedOpenRef.current = true
      stickToBottomRef.current = true
      userScrolledRef.current = false
      setMessages([])
      setServiceOverride(null)
      setInitialLoading(true)
      void load({ silent: true })
      void markRead()
      if (contextService) {
        setQServiceId(contextService.id)
        if (typeof contextService.basePrice === 'number') setQPrice(String(contextService.basePrice))
        if (contextService.vendorLocation) setQLocation(contextService.vendorLocation)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOpen, messagesUrl, bookingId, peerId])

  // Fetch the other person's vendor rating once when the chat opens.
  // Only planners see it: a vendor chatting with a planner has no rating to show,
  // and we look up the *other* person (peerId) so a vendor never sees their own rating.
  const viewerRole = session?.user?.role ?? null
  useEffect(() => {
    if (!effectiveOpen || !peerId || viewerRole === 'VENDOR') {
      setVendorRating(null)
      return
    }
    const controller = new AbortController()
    setVendorRating(null)
    fetch(`/api/vendors/rating?${new URLSearchParams({ userId: peerId })}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setVendorRating({ average: data.average ?? null, count: data.count })
        }
      })
      .catch(() => {
        /* rating is optional — just don't show it */
      })
    return () => controller.abort()
  }, [effectiveOpen, peerId, viewerRole])

  // Load the vendor's own services the first time they open the service picker
  useEffect(() => {
    if (!servicePickerOpen || myServices !== null || myServicesLoading) return
    setMyServicesLoading(true)
    fetch('/api/vendor/services', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        setMyServices(
          Array.isArray(data)
            ? data.map((s: any) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                basePrice: s.basePrice,
                occasions: s.occasions,
                vendorId: s.vendorId,
                // Your route doesn't return the vendor's name/location, so keep the current ones
                vendorBusinessName: activeService?.vendorBusinessName ?? null,
                vendorLocation: activeService?.vendorLocation ?? null,
              }))
            : []
        )
      )
      .catch(() => setMyServices([]))
      .finally(() => setMyServicesLoading(false))
  }, [servicePickerOpen, myServices, myServicesLoading])

  const chooseService = async (svc: ChatContextService) => {
    const previous = serviceOverride
    setServiceOverride(svc)
    setServicePickerOpen(false)
    // Point the quotation form at the newly chosen service
    setQServiceId(svc.id)
    if (typeof svc.basePrice === 'number') setQPrice(String(svc.basePrice))
    if (svc.vendorLocation) setQLocation(svc.vendorLocation)

    // Booking chats are tied to the booking's service, so only save for direct chats
    if (mode !== 'direct' || !peerId) {
      toast.success(`Enquiry changed to ${svc.name}`)
      return
    }

    try {
      const res = await fetch('/api/messages/thread/context', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId, serviceId: svc.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Could not save the change')
      }
      toast.success(`Enquiry changed to ${svc.name}`)
    } catch (e: any) {
      setServiceOverride(previous)
      toast.error(e?.message || 'Could not save the change')
    }
  }

  // Poll while open
  useEffect(() => {
    if (!effectiveOpen) return
    const id = window.setInterval(() => void load({ silent: true }), POLL_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOpen, messagesUrl])

  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  )

  // Keep the view pinned to the newest message — but only if the user hasn't
  // scrolled up to read older ones.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || !stickToBottomRef.current) return
    el.scrollTop = el.scrollHeight
    // Once more after the browser has painted, for late layout in Safari
    const id = requestAnimationFrame(() => {
      if (stickToBottomRef.current) el.scrollTop = el.scrollHeight
    })
    return () => cancelAnimationFrame(id)
  }, [sorted.length, initialLoading, effectiveOpen])

  // Images and quotation cards finish sizing *after* the first scroll, which
  // pushed the newest message below the fold. Watch the content's height and
  // re-pin to the bottom whenever it grows (unless the user scrolled up).
  useEffect(() => {
    if (!effectiveOpen) return
    const el = scrollRef.current
    const content = contentRef.current
    if (!el || !content || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (stickToBottomRef.current) el.scrollTop = el.scrollHeight
    })
    ro.observe(content)
    return () => ro.disconnect()
  }, [effectiveOpen, initialLoading])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el || !userScrolledRef.current) return
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }
  const markUserScroll = () => {
    userScrolledRef.current = true
  }

  // Auto-grow the composer up to ~6 lines
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [content])

  const currentUserId = session?.user?.id ?? null
  const currentRole = session?.user?.role ?? null
  const vendorCanSendQuotation =
    currentRole === 'VENDOR' && !!peerId && mode === 'booking' ? !!bookingId : !!peerId
  const showQuotationButton = vendorCanSendQuotation && currentRole === 'VENDOR'

  const handlePickFile = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(f)
    setPendingPreview(f ? URL.createObjectURL(f) : null)
    e.target.value = ''
    textareaRef.current?.focus()
  }

  const clearPendingFile = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
  }

  const send = async () => {
    const body = content.trim()
    if ((!body && !pendingFile) || sending) return

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

      const payloadBody: Record<string, unknown> =
        mode === 'booking'
          ? { content: body, imageUrl }
          : {
              peerId,
              content: body,
              imageUrl,
              contextServiceId: activeService?.id,
              contextVendorId: activeService?.vendorId,
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
      stickToBottomRef.current = true
      await load({ silent: true })
      textareaRef.current?.focus()
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
    const serviceIdValue = qServiceId || activeService?.id || undefined
    const payload: any = {
      receiverId: peerId,
      price: priceNum,
      currency: 'MYR',
      serviceId: serviceIdValue,
      vendorId: activeService?.vendorId ?? undefined,
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
      toast.success('Quotation sent')
      setQuotationEditorOpen(false)
      setQPrice('')
      setQDate('')
      setQTime('')
      setQLocation('')
      setQNotes('')
      setQValidUntil('')
      setQServiceId('')
      stickToBottomRef.current = true
      await load({ silent: true })
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
      toast.success(nextStatus === 'ACCEPTED' ? 'Quotation accepted' : 'Quotation declined')
      await load({ silent: true })
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setQActionLoading(null)
    }
  }

  const threadContext = (() => {
    if (activeService) {
      return {
        title: activeService.name,
        subtitle: contextVendorBusinessName || activeService.vendorBusinessName || directPeerName,
        price: activeService.basePrice ? `From RM ${activeService.basePrice.toLocaleString()}` : null,
        location: activeService.vendorLocation,
      }
    }
    if (contextServiceName) {
      return {
        title: contextServiceName,
        subtitle: contextVendorBusinessName,
        price: null,
        location: null,
      }
    }
    return null
  })()

  const avatarName = directPeerName || title
  const canSend = !sending && (content.trim().length > 0 || !!pendingFile)

  return (
    <Dialog open={effectiveOpen} onOpenChange={setOpen}>
      {!isControlled && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0',
          'max-w-none sm:max-w-none'
        )}
        // Fixed size, set inline so it applies in every browser (including older
        // Safari) no matter how long or short the conversation is.
        // Focus the message box instead of the first button, without scrolling anything
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          textareaRef.current?.focus({ preventScroll: true })
        }}
        style={{
          width: 'min(480px, calc(100vw - 1.5rem))',
          height: 'min(680px, 90vh)',
          maxWidth: 'none',
        }}
      >
        {/* ---------- Header ---------- */}
        <div
          className="flex shrink-0 items-center gap-3 border-b px-4 py-3"
          // Leave room on the right for the dialog's ✕ button (inline so it applies in every browser)
          style={{ paddingRight: 64 }}
        >
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="text-sm font-medium">{initialsFor(avatarName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <DialogTitle className="truncate text-base font-semibold leading-tight">
                {title}
              </DialogTitle>
              {vendorRating &&
                (vendorRating.count > 0 && vendorRating.average !== null ? (
                  <span
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                    aria-label={`Rated ${vendorRating.average.toFixed(1)} out of 5 from ${vendorRating.count} reviews`}
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums">{vendorRating.average.toFixed(1)}</span>
                    <span className="font-normal text-amber-700/80 dark:text-amber-300/70">
                      ({vendorRating.count})
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-muted-foreground">No reviews yet</span>
                ))}
            </div>
            {/* <DialogDescription className={cn('mt-0.5 truncate text-xs', !description && 'sr-only')}>
              {description || 'Conversation'}
            </DialogDescription> */}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={() => void load()}
            disabled={refreshing}
            aria-label="Refresh messages"
          >
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          </Button>
        </div>

        {/* ---------- What this chat is about ---------- */}
        {(() => {
          const isVendorViewer = currentRole === 'VENDOR'
          if (!threadContext && !isVendorViewer) return null

          const stripInner = (
            <>
              <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm">
                  <span className="text-muted-foreground">Enquiry about </span>
                  <span className="font-medium">
                    {threadContext?.title ?? 'Choose a service'}
                  </span>
                </p>
                {threadContext?.location && (
                  <p className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {threadContext.location}
                    </span>
                  </p>
                )}
              </div>
              {isVendorViewer && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                  Change
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              )}
            </>
          )

          const stripStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            flexShrink: 0,
          }

          // Planners just see the label
          if (!isVendorViewer) {
            return (
              <div className="border-b bg-muted/40 px-4 py-2.5" style={stripStyle}>
                {stripInner}
              </div>
            )
          }

          // Vendors can click it to pick a different service.
          // `modal` lets the list scroll even though it sits on top of the chat dialog.
          return (
            <Popover open={servicePickerOpen} onOpenChange={setServicePickerOpen} modal>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="border-b bg-muted/40 px-4 py-2.5 transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  style={stripStyle}
                  aria-label="Change which service this enquiry is about"
                >
                  {stripInner}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="p-0"
                style={{ width: 'min(360px, calc(100vw - 2rem))' }}
              >
                <div className="border-b px-3 py-2.5">
                  <p className="text-sm font-semibold">Which service is this about?</p>
                  <p className="text-xs text-muted-foreground">
                    Your quotations in this chat will use the service you pick.
                  </p>
                </div>
                <div className="overflow-y-auto py-1" style={{ maxHeight: 280 }}>
                  {myServicesLoading || myServices === null ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : myServices.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                      You haven&apos;t added any services yet.
                    </p>
                  ) : (
                    myServices.map((svc) => {
                      const selected = svc.id === activeService?.id
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => chooseService(svc)}
                          className={cn(
                            'w-full px-3 py-2 text-left transition-colors hover:bg-muted',
                            selected && 'bg-muted/60'
                          )}
                          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{svc.name}</span>
                            {typeof svc.basePrice === 'number' && (
                              <span className="block text-xs text-muted-foreground">
                                From RM {svc.basePrice.toLocaleString()}
                              </span>
                            )}
                          </span>
                          {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                        </button>
                      )
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )
        })()}

        {/* ---------- Messages ---------- */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onWheel={markUserScroll}
          onTouchStart={markUserScroll}
          onPointerDown={markUserScroll}
          onKeyDown={markUserScroll}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20 px-3 py-4 sm:px-5"
          // minHeight 0 lets this area scroll instead of growing with the messages
          style={{ minHeight: 0 }}
        >
          <div ref={contentRef} className="flex min-h-full flex-col" style={{ minHeight: '100%' }}>
          {initialLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
                <MessagesSquare className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-medium">Start the conversation</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                {mode === 'direct' && contextService
                  ? 'Ask about availability, pricing or anything else. The vendor will reply here.'
                  : 'Messages you send here are only visible to the two of you.'}
              </p>
            </div>
          ) : (
            <ol className="space-y-0.5">
              {sorted.map((m, i) => {
                const prev = sorted[i - 1]
                const next = sorted[i + 1]
                const at = new Date(m.createdAt)
                const mine = peerId
                  ? m.senderId !== peerId && m.sender?.id !== peerId
                  : !!currentUserId && m.senderId === currentUserId

                const newDay = !prev || !isSameDay(new Date(prev.createdAt), at)
                const startsGroup =
                  newDay ||
                  prev.senderId !== m.senderId ||
                  at.getTime() - new Date(prev.createdAt).getTime() > GROUP_GAP_MS
                const endsGroup =
                  !next ||
                  next.senderId !== m.senderId ||
                  !isSameDay(new Date(next.createdAt), at) ||
                  new Date(next.createdAt).getTime() - at.getTime() > GROUP_GAP_MS

                const text = visibleText(m)
                const senderName = m.sender?.name || m.sender?.email || 'User'

                return (
                  <li key={m.id}>
                    {newDay && (
                      <div className="my-4 flex justify-center first:mt-0">
                        <span className="rounded-full bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                          {dayLabel(at)}
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        'flex flex-col',
                        mine ? 'items-end' : 'items-start',
                        startsGroup && !newDay && 'mt-3'
                      )}
                    >
                      {!mine && startsGroup && (
                        <span className="mb-1 px-1 text-[11px] font-medium text-muted-foreground">
                          {senderName}
                        </span>
                      )}

                      <div className={cn('flex max-w-[85%] flex-col gap-1', mine ? 'items-end' : 'items-start')}>
                        {m.quotation && (
                          <QuotationCard
                            q={m.quotation}
                            canRespond={
                              currentRole !== 'VENDOR' &&
                              !!currentUserId &&
                              m.quotation.receiverId === currentUserId
                            }
                            busy={qActionLoading === m.quotation.id}
                            onRespond={updateQuotationStatus}
                          />
                        )}

                        {m.imageUrl && (
                          <a
                            href={m.imageUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="block w-fit max-w-[min(260px,100%)] overflow-hidden rounded-2xl border bg-background"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.imageUrl}
                              alt="Shared image"
                              className="block h-auto max-h-60 w-auto max-w-full cursor-zoom-in object-contain"
                            />
                          </a>
                        )}

                        {text && (
                          <div
                            className={cn(
                              'whitespace-pre-wrap break-words px-3.5 py-2 text-sm leading-relaxed',
                              mine
                                ? 'rounded-2xl bg-primary text-primary-foreground'
                                : 'rounded-2xl border bg-background text-foreground',
                              endsGroup && (mine ? 'rounded-br-md' : 'rounded-bl-md')
                            )}
                          >
                            {text}
                          </div>
                        )}
                      </div>

                      {endsGroup && (
                        <time
                          dateTime={m.createdAt}
                          className="mt-1 px-1 text-[11px] tabular-nums text-muted-foreground"
                        >
                          {format(at, 'h:mm a')}
                        </time>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
          </div>
        </div>

        {/* ---------- Composer ---------- */}
        <div className="shrink-0 border-t bg-background px-3 pb-3 pt-2.5 sm:px-4">
          {pendingPreview && (
            <div className="mb-2 flex items-center gap-3 rounded-xl border bg-muted/40 p-2 pr-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingPreview} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{pendingFile?.name || 'Image'}</p>
                <p className="text-xs text-muted-foreground">
                  {uploading
                    ? 'Uploading…'
                    : pendingFile
                      ? `${(pendingFile.size / 1024).toFixed(0)} KB`
                      : ''}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={clearPendingFile}
                disabled={uploading}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-end gap-1 rounded-2xl border bg-muted/30 p-1.5 transition-shadow focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground"
              onClick={handlePickFile}
              disabled={sending || uploading}
              aria-label="Attach an image"
              title="Attach an image"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {showQuotationButton && (
              <Popover open={quotationEditorOpen} onOpenChange={setQuotationEditorOpen} modal>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 shrink-0 gap-1.5 rounded-full px-2.5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                    disabled={sending || quotationSubmitting}
                    aria-label="Send a quotation"
                    title="Send a quotation"
                  >
                    <ReceiptText className="h-4 w-4" />
                    <span className="hidden text-sm sm:inline">Quote</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  sideOffset={10}
                  className="overflow-y-auto p-0"
                  style={{
                    width: 'min(420px, calc(100vw - 1.5rem))',
                    maxHeight: 'min(560px, 70vh)',
                    maxWidth: 'none',
                  }}
                >
                  <div className="border-b px-4 py-3">
                    <p className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300">
                      <ReceiptText className="h-4 w-4" /> New quotation
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      The planner can accept or decline it right in this chat.
                    </p>
                  </div>

                  <div className="space-y-3 px-4 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="q-price">Price (RM)</Label>
                        <Input
                          id="q-price"
                          type="number"
                          min={0}
                          inputMode="decimal"
                          value={qPrice}
                          onChange={(e) => setQPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="q-pax">No. of pax</Label>
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
                        <Input id="q-date" type="date" value={qDate} onChange={(e) => setQDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="q-time">Time</Label>
                        <Input id="q-time" type="time" value={qTime} onChange={(e) => setQTime(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="q-location">Location</Label>
                      <Input
                        id="q-location"
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
                      <Label htmlFor="q-notes">Notes</Label>
                      <Textarea
                        id="q-notes"
                        rows={3}
                        placeholder="What's included, add-ons, cancellation policy…"
                        value={qNotes}
                        onChange={(e) => setQNotes(e.target.value)}
                      />
                    </div>

                    {activeService?.name ? (
                      <p className="text-xs text-muted-foreground">
                        This quotation is for <span className="font-medium text-foreground">{activeService.name}</span>.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        <Label htmlFor="q-service-id">Service ID (optional)</Label>
                        <Input
                          id="q-service-id"
                          placeholder="e.g. svc_abc"
                          value={qServiceId}
                          onChange={(e) => setQServiceId(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 border-t px-4 py-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setQuotationEditorOpen(false)}
                      disabled={quotationSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      disabled={quotationSubmitting || !peerId || !parseFloat(qPrice)}
                      onClick={sendQuotation}
                    >
                      {quotationSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {quotationSubmitting ? 'Sending…' : 'Send quotation'}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
              className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                // Enter sends, Shift+Enter adds a new line (ignored while typing with an IME)
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void send()
                }
              }}
            />

            <Button
              type="button"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full"
              onClick={() => void send()}
              disabled={!canSend}
              aria-label={uploading ? 'Uploading' : sending ? 'Sending' : 'Send message'}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            </Button>
          </div>

          <p className="mt-1.5 hidden px-2 text-[11px] text-muted-foreground sm:block">
            Enter to send, Shift + Enter for a new line
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/heic"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
