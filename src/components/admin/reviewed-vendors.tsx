"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  XCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SocialLinksRow } from "@/components/social-links"
import { dateLocale, getDictionary, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type ReviewedVendor = {
  id: string
  /** VendorProfile id, for the public page link (null if no profile) */
  profileId: string | null
  businessName: string | null
  contactName: string | null
  email: string
  phoneNumber: string | null
  location: string | null
  category: string | null
  description: string | null
  occasions: string | null
  website: string | null
  socials: {
    instagram: string | null
    facebook: string | null
    tiktok: string | null
    youtube: string | null
    twitter: string | null
    linkedin: string | null
  }
  status: "APPROVED" | "REJECTED"
  rejectionReason: string | null
  reviewedAt: string | null
  createdAt: string
}

const VISIBLE = 5
const TIME_ZONE = "Asia/Kuala_Lumpur"

const dialogStyle: React.CSSProperties = {
  width: "min(560px, calc(100vw - 1.5rem))",
  maxWidth: "min(560px, calc(100vw - 1.5rem))",
  maxHeight: "85vh",
  overflowY: "auto",
}

/* ================================================================
   LIST: latest 5 + "Show all", each opens a details popup
================================================================ */

export default function ReviewedVendors({
  vendors,
  locale = "en",
}: {
  vendors: ReviewedVendor[]
  locale?: Locale
}) {
  const t = getDictionary(locale).admin
  const dl = dateLocale(locale)

  const [selected, setSelected] = useState<ReviewedVendor | null>(null)
  const [allOpen, setAllOpen] = useState(false)
  // Inside "Show all": the vendor being viewed (null = the list)
  const [allSelected, setAllSelected] = useState<ReviewedVendor | null>(null)

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(dl, {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: TIME_ZONE,
        })
      : ""

  return (
    // Goes inside the existing "Recently reviewed" panel, under its header
    <>
      {vendors.length === 0 ? (
        <p className="border-t border-border px-5 py-6 text-sm text-muted-foreground sm:px-6">
          {t.noDecisions}
        </p>
      ) : (
        <>
          <ul>
            {vendors.slice(0, VISIBLE).map((v) => (
              <li key={v.id} className="border-t border-border">
                <VendorRow vendor={v} t={t} formatDate={formatDate} onOpen={() => setSelected(v)} />
              </li>
            ))}
          </ul>

          {vendors.length > VISIBLE && (
            <button
              type="button"
              onClick={() => {
                setAllSelected(null)
                setAllOpen(true)
              }}
              className="flex w-full items-center justify-center gap-1 border-t border-border px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
            >
              {t.showAll(vendors.length)}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </>
      )}

      {/* Details popup (from the panel list) */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent style={dialogStyle}>
          {selected && (
            <VendorDetails vendor={selected} t={t} formatDate={formatDate} />
          )}
        </DialogContent>
      </Dialog>

      {/* "Show all" popup: list → tap a vendor → details → back */}
      <Dialog
        open={allOpen}
        onOpenChange={(open) => {
          setAllOpen(open)
          if (!open) setAllSelected(null)
        }}
      >
        <DialogContent style={dialogStyle}>
          {allSelected ? (
            <>
              <button
                type="button"
                onClick={() => setAllSelected(null)}
                className="-ml-1 inline-flex w-fit items-center gap-1.5 rounded-lg px-1 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToList}
              </button>
              <VendorDetails vendor={allSelected} t={t} formatDate={formatDate} />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t.allReviewedTitle}</DialogTitle>
                <DialogDescription>{t.allReviewedDesc(vendors.length)}</DialogDescription>
              </DialogHeader>
              <ul className="-mx-6 border-b border-border">
                {vendors.map((v) => (
                  <li key={v.id} className="border-t border-border">
                    <VendorRow
                      vendor={v}
                      t={t}
                      formatDate={formatDate}
                      onOpen={() => setAllSelected(v)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ================================================================
   ONE ROW (same look as before, now a button)
================================================================ */

type AdminText = ReturnType<typeof getDictionary>["admin"]

function VendorRow({
  vendor: v,
  t,
  formatDate,
  onOpen,
}: {
  vendor: ReviewedVendor
  t: AdminText
  formatDate: (iso: string | null) => string
  onOpen: () => void
}) {
  const approved = v.status === "APPROVED"
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50 sm:px-6"
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          approved ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
        )}
      >
        {approved ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground underline-offset-4 group-hover:underline">
            {v.businessName ?? v.contactName ?? t.unnamedBusiness}
          </span>
          <StatusPill approved={approved} t={t} />
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {v.category ?? t.noCategory}
          {v.reviewedAt && <> · {formatDate(v.reviewedAt)}</>}
        </span>
        {!approved && v.rejectionReason && (
          <span className="mt-1.5 block line-clamp-2 text-xs italic text-muted-foreground">
            &ldquo;{v.rejectionReason}&rdquo;
          </span>
        )}
      </span>
    </button>
  )
}

function StatusPill({ approved, t }: { approved: boolean; t: AdminText }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
        approved ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
      )}
    >
      {approved ? t.approved : t.rejected}
    </span>
  )
}

/* ================================================================
   DETAILS (inside the popup)
================================================================ */

function VendorDetails({
  vendor: v,
  t,
  formatDate,
}: {
  vendor: ReviewedVendor
  t: AdminText
  formatDate: (iso: string | null) => string
}) {
  const approved = v.status === "APPROVED"
  const hasSocials = Object.values(v.socials).some(Boolean)
  const name = v.businessName ?? v.contactName ?? t.unnamedBusiness

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t.contactName, value: v.contactName },
    {
      label: t.email,
      value: (
        <a href={`mailto:${v.email}`} className="break-all text-primary hover:underline">
          {v.email}
        </a>
      ),
    },
    {
      label: t.phone,
      value: v.phoneNumber ? (
        <a href={`tel:${v.phoneNumber.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">
          {v.phoneNumber}
        </a>
      ) : null,
    },
    { label: t.businessType, value: v.category },
    { label: t.operatingLocation, value: v.location },
    { label: t.occasions, value: v.occasions },
    {
      label: t.website,
      value: v.website ? (
        <a
          href={/^https?:\/\//i.test(v.website) ? v.website : `https://${v.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary hover:underline"
        >
          {v.website.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
        </a>
      ) : null,
    },
    { label: t.signedUp, value: formatDate(v.createdAt) },
    { label: t.reviewedOn, value: formatDate(v.reviewedAt) || null },
  ]

  return (
    <div className="min-w-0 space-y-5">
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <DialogTitle className="break-words">{name}</DialogTitle>
          <StatusPill approved={approved} t={t} />
        </div>
        <DialogDescription>{t.vendorDetails}</DialogDescription>
      </DialogHeader>

      {!approved && v.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">{t.rejectionReason}</p>
          <p className="mt-0.5 italic">&ldquo;{v.rejectionReason}&rdquo;</p>
        </div>
      )}

      <dl className="divide-y divide-border rounded-xl border border-border">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-4 px-4 py-2.5 text-sm">
            <dt className="w-32 shrink-0 text-muted-foreground">{r.label}</dt>
            <dd className="min-w-0 flex-1 break-words text-foreground">
              {r.value || <span className="text-muted-foreground">{t.notProvided}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-foreground">{t.businessDescription}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
          {v.description || t.noDescription}
        </p>
      </div>

      {hasSocials && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">{t.socialMedia}</p>
          <SocialLinksRow links={v.socials} businessName={name} />
        </div>
      )}

      {v.profileId && (
        <Link
          href={`/vendors/${v.profileId}`}
          target="_blank"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t.viewPublicPage}
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
