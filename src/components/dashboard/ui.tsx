import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ================================================================
   Shared dashboard building blocks (matches the redesign mockup)
================================================================ */

export const APP_TIME_ZONE = "Asia/Kuala_Lumpur"

export const buttonPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"

export const buttonSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"

/** "RM 4,200" — shows cents only when there are any. */
export function formatRM(value: unknown) {
  const n = Number(value ?? 0)
  return `RM ${n.toLocaleString("en-MY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/* ---------------- Page header ---------------- */

export function DashboardHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/* ---------------- Card shell ---------------- */

export function Panel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {children}
    </section>
  )
}

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ---------------- Date block (DEC / 12) ---------------- */

const dateBlockTones = {
  soft: "bg-brand-muted text-brand-strong",
  brand: "bg-brand text-brand-foreground",
  muted: "bg-muted text-muted-foreground",
} as const

export function DateBlock({
  date,
  tone = "soft",
  size = "md",
  className,
}: {
  date: Date | string
  tone?: keyof typeof dateBlockTones
  size?: "md" | "lg"
  className?: string
}) {
  const d = new Date(date)
  const month = new Intl.DateTimeFormat("en-MY", {
    month: "short",
    timeZone: APP_TIME_ZONE,
  })
    .format(d)
    .toUpperCase()
  const day = new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    timeZone: APP_TIME_ZONE,
  }).format(d)

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-xl leading-none",
        size === "lg" ? "h-16 w-14" : "h-13 w-12",
        dateBlockTones[tone],
        className,
      )}
    >
      <span className="text-[10px] font-bold tracking-wider">{month}</span>
      <span
        className={cn(
          "font-display font-extrabold",
          size === "lg" ? "mt-1 text-2xl" : "mt-0.5 text-xl",
        )}
      >
        {day}
      </span>
    </div>
  )
}

/* ---------------- Status badge ---------------- */

const statusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-800" },
  ACCEPTED: { label: "Accepted · unpaid", className: "bg-blue-50 text-blue-700" },
  PAYMENT_PENDING: { label: "Payment verification pending", className: "bg-amber-50 text-amber-800" },
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700" },
  COMPLETED: { label: "Completed", className: "bg-muted text-muted-foreground" },
  REJECTED: { label: "Declined", className: "bg-red-50 text-red-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700" },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = statusStyles[status] ?? {
    label: status.charAt(0) + status.slice(1).toLowerCase(),
    className: "bg-muted text-muted-foreground",
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  )
}

/* ---------------- Stat card ---------------- */

const hintTones = {
  muted: "text-muted-foreground",
  positive: "text-emerald-700",
  warning: "text-amber-800",
} as const

export function StatCard({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: keyof typeof hintTones
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {hint && (
        <p className={cn("mt-1 text-xs font-semibold", hintTones[tone])}>{hint}</p>
      )}
    </div>
  )
}

/* ---------------- Empty state ---------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="px-6 py-12 text-center">
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
