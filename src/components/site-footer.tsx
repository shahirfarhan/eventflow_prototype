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

const columns = [
  {
    heading: "Product",
    links: ["How it works", "Pricing", "For vendors", "Dashboard"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
  {
    heading: "Support",
    links: ["Help center", "Trust & safety", "Terms", "Privacy"],
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
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
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

        <p className="mt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gaffers. All rights reserved.
        </p>
      </div>
    </footer>
  )
}