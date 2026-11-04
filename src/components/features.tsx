"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Search, MessageSquare, CalendarDays, TrendingUp, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDictionary, type Locale } from "@/lib/i18n"

// Icons stay here; the words come from lib/i18n.ts (same order)
const plannerIcons = [Search, MessageSquare, CalendarDays]
const vendorIcons = [Users, TrendingUp, ShieldCheck]

export function Features({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale).features
  const [tab, setTab] = useState<"planners" | "vendors">("planners")

  const items = tab === "planners" ? t.plannerItems : t.vendorItems
  const icons = tab === "planners" ? plannerIcons : vendorIcons

  // Logged in → dashboard. Not logged in → login (planners) or sign up (new vendors).
  const { status } = useSession()
  const loggedIn = status === "authenticated"
  const ctaHref = loggedIn
    ? "/dashboard"
    : tab === "planners"
      ? "/login"
      : "/register"

  const tabs = [
    { id: "planners", label: t.plannersTab, sub: t.plannersSub },
    { id: "vendors", label: t.vendorsTab, sub: t.vendorsSub },
  ] as const

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t.eyebrow}
        </p>

        {/* Audience toggle */}
        <div
          role="tablist"
          aria-label={t.chooseRole}
          className="mx-auto mt-6 grid w-full max-w-xl grid-cols-2 gap-1 rounded-full border border-border bg-card p-1.5 shadow-sm"
        >
          {tabs.map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-6 py-3 text-center transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block font-bold">{item.label}</span>
                <span className={`block text-sm ${active ? "text-primary-foreground/80" : ""}`}>{item.sub}</span>
              </button>
            )
          })}
        </div>

        <h2 className="mx-auto mt-12 max-w-3xl text-balance text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {tab === "planners" ? t.plannersTitle : t.vendorsTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-lg text-muted-foreground">
          {tab === "planners" ? t.plannersText : t.vendorsText}
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {items.map((feature, i) => {
            const Icon = icons[i]
            return (
              <div key={feature.title} className="bg-card p-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="px-8 font-semibold">
            <Link href={ctaHref}>{tab === "planners" ? t.plannersCta : t.vendorsCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
