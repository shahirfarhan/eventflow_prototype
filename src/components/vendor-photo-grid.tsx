"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Photo grid at the top of a vendor's page.
 *   Phones:  main photo on the left, 2 photos stacked on the right, "+N" on the 3rd.
 *   Desktop: main photo on the left, up to 4 photos (2×2) on the right, "+N" on the 5th.
 * Tap any photo to open the full-screen viewer.
 */
export function VendorPhotoGrid({ photos, name }: { photos: string[]; name: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  const list = photos.filter(Boolean)
  if (list.length === 0) return null

  const extras = list.slice(1, 5) // up to 4 tiles next to the main photo
  const mobileTiles = Math.min(2, extras.length) // phones show 2 of them
  const hiddenOnMobile = list.length - 1 - mobileTiles // shown as "+N" on phones
  const hiddenOnDesktop = list.length - 1 - extras.length // shown as "+N" on desktop

  // Single photo: just show it full width
  if (extras.length === 0) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          className="block h-64 w-full overflow-hidden rounded-2xl bg-muted sm:h-[420px]"
          aria-label={`Open photo of ${name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={list[0]} alt={name} className="h-full w-full object-cover" />
        </button>
        {openAt !== null && (
          <Viewer title={name} photos={list} startIndex={openAt} onClose={() => setOpenAt(null)} />
        )}
      </>
    )
  }

  return (
    <>
      <div className="grid h-64 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[420px] sm:grid-cols-4">
        {/* Main photo: left half, full height */}
        <Tile
          src={list[0]}
          alt={`${name}, main photo`}
          onClick={() => setOpenAt(0)}
          className="col-span-1 row-span-2 sm:col-span-2"
        />

        {extras.map((src, i) => {
          const n = i + 1 // 1–4 among the side tiles
          const isLastMobile = n === mobileTiles
          const isLastDesktop = n === extras.length

          return (
            <Tile
              key={src + i}
              src={src}
              alt={`${name}, photo ${n + 1}`}
              onClick={() => setOpenAt(n)}
              className={cn(
                // Phones: only the first 2 side tiles; one tile alone fills the column
                n > 2 && "hidden sm:block",
                mobileTiles === 1 && "row-span-2",
                // Desktop: fill the 2×2 area neatly whatever the count
                desktopSpan(extras.length, n),
              )}
            >
              {/* "+N" on phones: on the last visible side tile */}
              {isLastMobile && hiddenOnMobile > 0 && (
                <MoreOverlay count={hiddenOnMobile} className="sm:hidden" />
              )}
              {/* "+N" on desktop: on the last side tile */}
              {isLastDesktop && hiddenOnDesktop > 0 && (
                <MoreOverlay count={hiddenOnDesktop} className="hidden sm:flex" />
              )}
            </Tile>
          )
        })}
      </div>

      {openAt !== null && (
        <Viewer title={name} photos={list} startIndex={openAt} onClose={() => setOpenAt(null)} />
      )}
    </>
  )
}

/** Desktop layout of the side tiles in the 2×2 area (sm and up). */
function desktopSpan(count: number, n: number) {
  if (count === 1) return "sm:col-span-2 sm:row-span-2"
  if (count === 2) return "sm:col-span-2 sm:row-span-1"
  if (count === 3) return n === 1 ? "sm:col-span-2 sm:row-span-1" : "sm:col-span-1 sm:row-span-1"
  return "sm:col-span-1 sm:row-span-1"
}

function Tile({
  src,
  alt,
  onClick,
  className,
  children,
}: {
  src: string
  alt: string
  onClick: () => void
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("group relative min-h-0 min-w-0 overflow-hidden bg-muted", className)}
      aria-label={`Open ${alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {children}
    </button>
  )
}

function MoreOverlay({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-bold text-white sm:text-3xl",
        className,
      )}
    >
      +{count}
    </span>
  )
}

/* ================================================================
   FULL-SCREEN VIEWER
================================================================ */

function Viewer({
  title,
  photos,
  startIndex,
  onClose,
}: {
  title: string
  photos: string[]
  startIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [touchX, setTouchX] = useState<number | null>(null)
  const count = photos.length

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  // ← → to move, Esc to close, and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, prev, next])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 text-white"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="min-w-0 truncate text-sm font-semibold">
          {title} · {index + 1} / {count}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return
          const dx = e.changedTouches[0].clientX - touchX
          if (Math.abs(dx) > 40) (dx > 0 ? prev : next)()
          setTouchX(null)
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt={`${title}, photo ${index + 1}`}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
