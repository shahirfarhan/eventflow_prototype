import { Mail, Phone } from "lucide-react"
import { categories } from "@/lib/vendors"

function Logo() {
  return (
    <svg
      aria-hidden="true"
      width={26}
      height={26}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    >
      <path
        d="M14.2 14.2H17V6.9375C17 4.76288 15.2371 3 13.0625 3H5.8V5.8M14.2 14.2V7.79063L7.79062 14.2H14.2ZM14.2 14.2V17H6.9375C4.76288 17 3 15.2371 3 13.0625V5.8H5.8M5.8 5.8V12.2313L12.2313 5.8H5.8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Contact details shown at the bottom of every page
const CONTACT_EMAIL = "admin@gaffersapp.com"
const CONTACT_PHONE = "+60104240358" // used for the "tap to call" link
const CONTACT_PHONE_DISPLAY = "+60 10-424 0358" // how it's shown on the page

const columns = [
  {
    heading: "Product",
    links: ["How it works", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About", "Contact"],
  },
  {
    heading: "Support",
    links: ["Help center", "Terms & Privacy"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/gaffers_logo.png"
                alt="Gaffers"
                className="h-7 w-7 object-contain"
              />
              <span className="text-lg font-bold tracking-tight">Gaffers</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The single marketplace for event planners and vendors. Discover, book, and manage every vendor for your
              event in one place.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold">{col.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === "Contact" ? `mailto:${CONTACT_EMAIL}` : "#"}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
          <span className="mr-2 text-sm font-semibold">Browse:</span>
          {categories.map((category) => (
            <a
              key={category}
              href={`/vendors?category=${encodeURIComponent(category)}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {category}
            </a>
          ))}
        </div>

        {/* Bottom row: copyright on the left, contact on the right (stacked on phones) */}
        <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gaffers. All rights reserved.</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}