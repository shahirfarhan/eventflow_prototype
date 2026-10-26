"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  POLICIES_COMPANY,
  POLICIES_EFFECTIVE_DATE,
  POLICY_PARTS,
  type PolicyBlock,
} from "@/lib/policies"

/**
 * Pop-up with the full Platform Policies, scrollable, with quick links to each part.
 * "I agree" calls onAgree (used to tick the checkbox on the sign-up form).
 */
export function TermsDialog({
  open,
  onClose,
  onAgree,
}: {
  open: boolean
  onClose: () => void
  onAgree?: () => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePart, setActivePart] = useState(POLICY_PARTS[0]?.id)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Esc to close, and stop the page behind from scrolling
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    scrollRef.current?.scrollTo({ top: 0 })
    setActivePart(POLICY_PARTS[0]?.id)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  // Highlight the part you're reading in the quick links
  const onScroll = () => {
    const box = scrollRef.current
    if (!box) return
    const top = box.getBoundingClientRect().top
    let current = POLICY_PARTS[0]?.id
    for (const part of POLICY_PARTS) {
      const el = document.getElementById(`policy-${part.id}`)
      if (el && el.getBoundingClientRect().top - top < 80) current = part.id
    }
    setActivePart(current)
  }

  const jumpTo = (id: string) => {
    const box = scrollRef.current
    const el = document.getElementById(`policy-${id}`)
    if (!box || !el) return
    box.scrollTo({
      top: el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 8,
      behavior: "smooth",
    })
  }

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-card text-card-foreground shadow-2xl sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#000000]/10 text-[#000000]">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 id="terms-title" className="text-lg font-semibold tracking-tight">
                  Gaffers Platform Policies
                </h2>
                <p className="text-xs text-muted-foreground">
                  Effective {POLICIES_EFFECTIVE_DATE} · {POLICIES_COMPANY}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick links to each part */}
          <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6">
            {POLICY_PARTS.map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => jumpTo(part.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activePart === part.id
                    ? "border-[#000000] bg-[#000000]/10 text-[#000000]"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {part.title}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable policy text */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
        >
          <div className="space-y-10 text-sm leading-relaxed text-foreground/90">
            {POLICY_PARTS.map((part) => (
              <section key={part.id} id={`policy-${part.id}`} className="scroll-mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#000000]">
                  {part.part}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground sm:text-lg">
                  {part.title}
                </h3>
                {part.intro && <Blocks blocks={part.intro} />}

                <div className="mt-4 space-y-5">
                  {part.sections.map((s) => (
                    <div key={s.number}>
                      <h4 className="font-semibold text-foreground">
                        <span className="mr-1.5 tabular-nums text-muted-foreground">{s.number}</span>
                        {s.title}
                      </h4>
                      <Blocks blocks={s.blocks} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col-reverse gap-2 border-t border-border px-5 pt-3 sm:flex-row sm:justify-end sm:px-6"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Close
          </button>
          {onAgree && (
            <button
              type="button"
              onClick={() => {
                onAgree()
                onClose()
              }}
              className="h-11 rounded-xl bg-[#000000] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b8331a]"
            >
              I agree
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="mt-2 space-y-2.5">
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{b.text}</p>

        if (b.type === "ul" || b.type === "ol") {
          const List = b.type === "ol" ? "ol" : "ul"
          return (
            <List
              key={i}
              className={cn("space-y-1.5 pl-5", b.type === "ol" ? "list-decimal" : "list-disc")}
            >
              {b.items.map((item, j) => (
                <li key={j} className="pl-1 marker:text-muted-foreground">
                  {item}
                </li>
              ))}
            </List>
          )
        }

        return (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {b.head.map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {b.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className={cn("px-3 py-2 align-top", c === 0 && "whitespace-nowrap font-medium")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
