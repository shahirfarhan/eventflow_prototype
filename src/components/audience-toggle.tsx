"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MessageSquare, Calendar, Megaphone, LineChart, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type Audience = "planners" | "vendors"

const content = {
  planners: {
    tabLabel: "Event Planners",
    tabSub: "For planning your event",
    heading: "One place to find every vendor for your event.",
    subheading:
      "Stop juggling spreadsheets, DMs, and phone calls. Gaffers brings every category of vendor you need into a single, searchable marketplace.",
    features: [
      {
        icon: Search,
        title: "Discover & compare vendors",
        desc: "Browse photographers, caterers, venues, and more by category, location, budget, and rating — all in one search.",
      },
      {
        icon: MessageSquare,
        title: "Message & book in-app",
        desc: "Chat with vendors, request quotes, and confirm bookings without leaving the platform. No more scattered emails.",
      },
      {
        icon: Calendar,
        title: "Manage your whole event",
        desc: "Track every vendor, contract, and payment tied to your event from a single dashboard, from planning to the big day.",
      },
    ],
    cta: { label: "Start Planning Your Event", href: "/vendors" },
  },
  vendors: {
    tabLabel: "Vendors",
    tabSub: "For growing your business",
    heading: "Get discovered by people actively planning events.",
    subheading:
      "List your services where organizers are already searching, and turn inquiries into booked jobs — faster.",
    features: [
      {
        icon: Megaphone,
        title: "Showcase your work",
        desc: "Build a profile with photos, packages, and pricing so organizers can see exactly what you offer before they even message you.",
      },
      {
        icon: LineChart,
        title: "Grow your bookings",
        desc: "Appear in category and search results to reach organizers who are ready to book, not just browsing.",
      },
      {
        icon: ShieldCheck,
        title: "Manage everything in one place",
        desc: "Handle inquiries, quotes, and reviews from a single dashboard — no more losing leads across different channels.",
      },
    ],
    cta: { label: "List Your Business", href: "/register" },
  },
} as const

export default function AudienceToggle() {
  const [tab, setTab] = useState<Audience>("planners")
  const active = content[tab]

  return (
    <section className="w-full py-16 md:py-28 lg:py-36 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">
          — Built for both sides of the event —
        </span>

        {/* Pill toggle — bigger, consistent padding and click area */}
        <div className="inline-flex rounded-full border border-border bg-white dark:bg-gray-900 p-1.5 mb-14 shadow-sm w-full sm:w-auto">
          {(Object.keys(content) as Audience[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 sm:flex-none sm:w-96 px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-200 ${
                tab === key
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.01]"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              <div className="flex flex-col items-center gap-1 justify-center">
                <span>{content[key].tabLabel}</span>
                <span
                  className={`text-xs sm:text-sm font-normal opacity-80 ${
                    tab === key ? "text-primary-foreground/90" : ""
                  }`}
                >
                  {content[key].tabSub}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Hero copy — bigger vertical breathing room */}
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {active.heading}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl leading-relaxed">
            {active.subheading}
          </p>
        </div>

        {/* Features combined into ONE row / single combined card */}
        <div className="w-full max-w-5xl mb-14">
          <div className="rounded-2xl border border-border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="grid gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {active.features.map((f) => (
                <div key={f.title} className="flex flex-col items-start text-left p-8">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="h-12 px-10 text-base font-semibold"
          render={<Link href={active.cta.href} />}
        >
          {active.cta.label}
        </Button>
      </div>
    </section>
  )
}
