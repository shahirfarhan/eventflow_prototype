"use client"

import { useId, useState } from "react"
import { Check, ChevronDown, Users } from "lucide-react"

/**
 * Service name on the public vendor page. Clicking it shows "What's included"
 * (and guest capacity when set). Services with nothing to show stay plain text.
 *
 * Put the price line ("Starting at RM ...") inside as children so it stays
 * right under the name.
 */
export type ServiceTitleLabels = {
  whatsIncluded: string
  seeWhatsIncluded: string
  guestsRange: (min: number, max: number) => string
  guestsFrom: (min: number) => string
  guestsUpTo: (max: number) => string
}

const EN: ServiceTitleLabels = {
  whatsIncluded: "What's included",
  seeWhatsIncluded: "See what's included",
  guestsRange: (min, max) => `${min}–${max} guests`,
  guestsFrom: (min) => `From ${min} guests`,
  guestsUpTo: (max) => `Up to ${max} guests`,
}

export function ServiceTitle({
  name,
  includedItems,
  minGuests,
  maxGuests,
  labels,
  children,
}: {
  name: string
  /** Optional translations (English by default) */
  labels?: Partial<ServiceTitleLabels>
  includedItems?: string[]
  minGuests?: number | null
  maxGuests?: number | null
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const t = { ...EN, ...labels }

  const capacity =
    minGuests && maxGuests
      ? t.guestsRange(minGuests, maxGuests)
      : minGuests
        ? t.guestsFrom(minGuests)
        : maxGuests
          ? t.guestsUpTo(maxGuests)
          : null

  const items = (includedItems ?? []).filter(Boolean)
  const hasDetails = items.length > 0 || !!capacity

  const titleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.35,
    overflowWrap: "anywhere",
    letterSpacing: "-0.01em",
  }

  return (
    <div style={{ minWidth: 0 }}>
      {hasDetails ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="text-foreground transition-colors hover:text-primary"
          style={{
            ...titleStyle,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {name}
          <ChevronDown
            aria-hidden
            style={{
              width: 18,
              height: 18,
              flexShrink: 0,
              opacity: 0.6,
              transition: "transform .2s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </button>
      ) : (
        <h3 className="text-foreground" style={{ ...titleStyle, margin: 0 }}>
          {name}
        </h3>
      )}

      {children && <div style={{ marginTop: 4 }}>{children}</div>}

      {hasDetails && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          style={{
            marginTop: 6,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 13,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {t.seeWhatsIncluded}
        </button>
      )}

      {hasDetails && open && (
        <div
          id={panelId}
          className="border border-border bg-muted/40"
          style={{ marginTop: 14, borderRadius: 12, padding: "14px 16px" }}
        >
          {items.length > 0 && (
            <>
              <p className="text-foreground" style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                {t.whatsIncluded}
              </p>
              <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 8 }}>
                {items.map((item) => (
                  <li
                    key={item}
                    className="text-foreground"
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, lineHeight: 1.45 }}
                  >
                    <Check
                      aria-hidden
                      className="text-primary"
                      style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {capacity && (
            <p
              className="text-muted-foreground"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                margin: items.length > 0 ? "12px 0 0" : 0,
              }}
            >
              <Users aria-hidden style={{ width: 15, height: 15, flexShrink: 0 }} />
              {capacity}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
