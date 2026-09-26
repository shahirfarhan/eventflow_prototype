"use client"

import { useState } from "react"
import { Search, MessageSquare, CalendarDays, TrendingUp, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type Feature = {
  icon: typeof Search
  title: string
  body: string
}

const plannerFeatures: Feature[] = [
  {
    icon: Search,
    title: "Discover & compare vendors",
    body: "Browse photographers, caterers, venues, and more by category, location, budget, and rating — all in one search.",
  },
  {
    icon: MessageSquare,
    title: "Message & book in-app",
    body: "Chat with vendors, request quotes, and confirm bookings without leaving the platform. No more scattered emails.",
  },
  {
    icon: CalendarDays,
    title: "Manage your whole event",
    body: "Track every vendor, contract, and payment tied to your event from a single dashboard, from planning to the big day.",
  },
]

const vendorFeatures: Feature[] = [
  {
    icon: Users,
    title: "Reach ready-to-book clients",
    body: "Get discovered by planners actively searching your category and location — no cold outreach required.",
  },
  {
    icon: TrendingUp,
    title: "Grow with a real profile",
    body: "Showcase your portfolio, collect verified reviews, and climb the rankings as you close more bookings.",
  },
  {
    icon: ShieldCheck,
    title: "Get paid securely",
    body: "Send quotes, sign contracts, and receive payments through one protected system with no chasing invoices.",
  },
]

export function Features() {
  const [tab, setTab] = useState<"planners" | "vendors">("planners")
  const features = tab === "planners" ? plannerFeatures : vendorFeatures

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          — Built for both sides of the event —
        </p>

        {/* Audience toggle */}
        <div
          role="tablist"
          aria-label="Choose your role"
          className="mx-auto mt-6 grid w-full max-w-xl grid-cols-2 gap-1 rounded-full border border-border bg-card p-1.5 shadow-sm"
        >
          {(
            [
              { id: "planners", label: "Event Planners", sub: "For planning your event" },
              { id: "vendors", label: "Vendors", sub: "For growing your business" },
            ] as const
          ).map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-6 py-3 text-center transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block font-bold">{t.label}</span>
                <span className={`block text-sm ${active ? "text-primary-foreground/80" : ""}`}>{t.sub}</span>
              </button>
            )
          })}
        </div>

        <h2 className="mx-auto mt-12 max-w-3xl text-balance text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {tab === "planners"
            ? "One place to find every vendor for your event."
            : "One place to win more bookings for your business."}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-lg text-muted-foreground">
          {tab === "planners"
            ? "Stop juggling spreadsheets, DMs, and phone calls. Gaffers brings every category of vendor you need into a single, searchable marketplace."
            : "List your services once and let planners come to you. Gaffers turns your profile into a steady pipeline of qualified event leads."}
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card p-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" className="px-8 font-semibold">
            {tab === "planners" ? "Start Planning Your Event" : "List Your Business"}
          </Button>
        </div>
      </div>
    </section>
  )
}