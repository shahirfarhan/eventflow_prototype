"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Check,
  X,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Tag,
  Clock,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type PendingVendor = {
  id: string
  name: string | null
  email: string | null
  phoneNumber: string | null
  location: string | null
  category: string | null
  description: string | null
  createdAt: string
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export default function VendorApprovals({ vendors }: { vendors: PendingVendor[] }) {
  const router = useRouter()
  const [items, setItems] = useState(vendors)
  const [openId, setOpenId] = useState<string | null>(vendors[0]?.id ?? null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const review = async (id: string, action: "APPROVE" | "REJECT") => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: action === "REJECT" ? reason : undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "Could not update vendor")
      }

      const vendor = items.find((v) => v.id === id)
      toast.success(
        action === "APPROVE"
          ? `${vendor?.name ?? "Vendor"} approved`
          : `${vendor?.name ?? "Vendor"} rejected`,
      )

      const remaining = items.filter((v) => v.id !== id)
      setItems(remaining)
      setOpenId(remaining[0]?.id ?? null)
      setRejectingId(null)
      setReason("")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Vendor approvals
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            New service providers waiting for review before they can sign in
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold",
            items.length
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700",
          )}
        >
          {items.length} pending
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          All caught up. New vendor sign-ups will appear here.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((v) => {
            const isOpen = openId === v.id
            const isRejecting = rejectingId === v.id
            const isBusy = busyId === v.id

            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(isOpen ? null : v.id)
                    setRejectingId(null)
                    setReason("")
                  }}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-accent/50 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {v.name ?? "Unnamed business"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {v.category ?? "No category"} · {v.location ?? "No location"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(v.createdAt)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-5 bg-muted/30 px-4 pb-5 pt-1 sm:px-6">
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <Detail icon={Mail} label="Email" value={v.email} />
                      <Detail icon={Phone} label="Phone" value={v.phoneNumber} />
                      <Detail icon={MapPin} label="Operating location" value={v.location} />
                      <Detail icon={Tag} label="Business type" value={v.category} />
                    </dl>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        Business description
                      </p>
                      <p className="mt-1.5 whitespace-pre-line rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-foreground">
                        {v.description || "No description provided."}
                      </p>
                    </div>

                    {isRejecting ? (
                      <div className="space-y-3">
                        <Textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Reason for rejection (optional) — e.g. description too vague, invalid phone number…"
                          className="min-h-[90px] resize-y bg-background"
                          maxLength={500}
                        />
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => {
                              setRejectingId(null)
                              setReason("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={isBusy}
                            onClick={() => review(v.id, "REJECT")}
                          >
                            <X className="mr-1.5 h-4 w-4" />
                            {isBusy ? "Rejecting…" : "Confirm rejection"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          disabled={isBusy}
                          onClick={() => setRejectingId(v.id)}
                        >
                          <X className="mr-1.5 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          type="button"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          disabled={isBusy}
                          onClick={() => review(v.id, "APPROVE")}
                        >
                          <Check className="mr-1.5 h-4 w-4" />
                          {isBusy ? "Approving…" : "Approve"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="break-words font-medium text-foreground">{value || "—"}</dd>
      </div>
    </div>
  )
}
