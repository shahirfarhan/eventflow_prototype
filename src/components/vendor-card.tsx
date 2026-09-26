import { Star } from "lucide-react"
import type { Vendor } from "@/lib/vendors"

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={vendor.image || "/placeholder.svg"}
          alt={`${vendor.name} — ${vendor.category} in ${vendor.location}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
          {vendor.category}
        </span>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-bold leading-tight">{vendor.name}</h3>
        <p className="text-sm text-muted-foreground">{vendor.location}</p>
        <p className="flex items-center gap-1.5 pt-1 text-sm">
          <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
          <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({vendor.reviews})</span>
          <span className="sr-only">
            {vendor.rating.toFixed(1)} out of 5 stars from {vendor.reviews} reviews
          </span>
        </p>
      </div>
    </article>
  )
}