"use client"

import { useState, useTransition } from "react"
import { Bookmark } from "lucide-react"
import { toggleSavedVendor } from "@/lib/saved-vendors"
import { cn } from "@/lib/utils"

interface SaveVendorButtonProps {
  vendorId: string
  initialSaved: boolean
  /** "icon" = round overlay button for cards, "button" = labelled button */
  variant?: "icon" | "button"
  className?: string
}

export function SaveVendorButton({
  vendorId,
  initialSaved,
  variant = "icon",
  className,
}: SaveVendorButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function handleClick(e: React.MouseEvent) {
    // Cards are wrapped in links — don't navigate when toggling
    e.preventDefault()
    e.stopPropagation()

    const previous = saved
    setSaved(!previous) // optimistic

    startTransition(async () => {
      const res = await toggleSavedVendor(vendorId)
      if (!res.ok) {
        setSaved(previous)
        console.error(res.error)
      } else {
        setSaved(res.saved)
      }
    })
  }

  const label = saved ? "Remove from saved vendors" : "Save vendor"

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={saved}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-60",
          className
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current text-brand")} />
        {saved ? "Saved" : "Save vendor"}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background disabled:opacity-60",
        className
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current text-brand")} />
    </button>
  )
}
