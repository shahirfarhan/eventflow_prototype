"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Download, ImagePlus, Loader2, QrCode, Receipt, RefreshCw, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonPrimary, buttonSecondary, formatRM } from "@/components/dashboard/ui"

const MAX_FILE_MB = 5

async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image of your receipt")
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Images must be smaller than ${MAX_FILE_MB} MB`)
  }
  const form = new FormData()
  form.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: form })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.url) throw new Error(json?.error || "Failed to upload receipt")
  return json.url as string
}

/**
 * Pay-by-QR pop-up for planners:
 * shows the vendor's QR + amount, then the planner uploads a receipt and taps "I've paid".
 * The booking then waits for the vendor to verify the payment.
 */
export function PayDialog({
  open,
  onClose,
  bookingId,
  amount,
  bookingName,
  eventTitle,
  vendorName,
  qrUrl,
}: {
  open: boolean
  onClose: () => void
  bookingId: string
  amount: number
  bookingName: string
  eventTitle?: string | null
  vendorName: string
  qrUrl?: string | null
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => setMounted(true), [])

  // Esc to close, stop the page behind from scrolling, start fresh each time it opens
  useEffect(() => {
    if (!open) return
    setReceiptUrl(null)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function onReceiptChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      setReceiptUrl(await uploadImage(file))
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  async function submit() {
    if (!receiptUrl || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptUrl }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error || "Could not send your receipt")
      toast.success(`Receipt sent. ${vendorName} will verify your payment.`)
      onClose()
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={() => !submitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-title"
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-card text-card-foreground shadow-2xl sm:max-h-[90vh] sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id="pay-title" className="text-lg font-semibold tracking-tight">
              Pay {vendorName}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {bookingName}
              {eventTitle ? ` · ${eventTitle}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
          {/* Amount */}
          <div className="rounded-xl bg-muted px-4 py-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">Amount to pay</p>
            <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-foreground">
              {formatRM(amount)}
            </p>
          </div>

          {/* Step 1: QR */}
          <section>
            <StepTitle n={1}>Scan and pay with your banking app</StepTitle>
            {qrUrl ? (
              <div className="mt-3 flex flex-col items-center gap-2">
                <div className="aspect-square w-full max-w-[240px] rounded-xl border border-border bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt={`${vendorName} payment QR`} className="h-full w-full object-contain" />
                </div>
                {/* On a phone you can't scan your own screen, so let them save the QR */}
                <a
                  href={qrUrl}
                  download={`${vendorName.replace(/[^\w-]+/g, "-")}-payment-qr`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Save QR to scan from your gallery
                </a>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <QrCode className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {vendorName} hasn&apos;t added a payment QR yet. Message them for their payment
                  details, then upload your receipt below.
                </p>
              </div>
            )}
          </section>

          {/* Step 2: Receipt */}
          <section>
            <StepTitle n={2}>Upload your payment receipt</StepTitle>

            {uploading ? (
              <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-border bg-muted/40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : receiptUrl ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-border p-2.5">
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={receiptUrl} alt="Your receipt" className="h-full w-full object-cover" />
                </a>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Receipt added</p>
                  <p className="text-xs text-muted-foreground">Tap the picture to check it.</p>
                </div>
                <label
                  htmlFor="payment-receipt-input"
                  className={cn(buttonSecondary, "h-9 cursor-pointer px-3 text-xs")}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Change
                </label>
              </div>
            ) : (
              <label
                htmlFor="payment-receipt-input"
                className="mt-3 flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="font-medium">Upload receipt</span>
                <span className="text-xs">Screenshot or photo, up to {MAX_FILE_MB} MB</span>
              </label>
            )}

            <input
              id="payment-receipt-input"
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              onChange={onReceiptChosen}
            />
          </section>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Receipt className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {vendorName} will check the receipt against their account. Your booking shows as
            &ldquo;Payment verification pending&rdquo; until they confirm it.
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col-reverse gap-2 border-t border-border px-5 pt-3 sm:flex-row sm:justify-end"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <button type="button" onClick={onClose} disabled={submitting} className={buttonSecondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!receiptUrl || uploading || submitting}
            title={!receiptUrl ? "Upload your receipt first" : undefined}
            className={cn(buttonPrimary, "disabled:cursor-not-allowed disabled:opacity-50")}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "I've paid"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
        {n}
      </span>
      {children}
    </h3>
  )
}
