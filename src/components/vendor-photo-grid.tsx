"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const VISIBLE = 5 // 1 big + 4 small

/**
 * Photo collage for the public vendor page:
 * big main photo on the left, up to 4 smaller ones on the right,
 * "+N" on the last tile when there are more, and a full-screen viewer.
 */
export function VendorPhotoGrid({ photos, name }: { photos: string[]; name: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null)

  if (photos.length === 0) return null

  const shown = photos.slice(0, VISIBLE)
  const extra = photos.length - VISIBLE
  const side = shown.slice(1)

  // Right-hand side: 4 photos → 2×2 squares; 1–3 photos → stacked in one column
  const sideCols = side.length === 4 ? 2 : 1
  const sideRows = side.length === 4 ? 2 : side.length

  return (
    <>
      {/* Plain CSS so it works on older Safari too */}
      <style>{`
        .vpg { height: 440px; }
        @media (max-width: 1024px) { .vpg { height: 360px; } }
        @media (max-width: 640px)  { .vpg { height: 260px; } }
        .vpg-tile img { transition: transform .35s ease, filter .2s ease; }
        .vpg-tile:hover img { transform: scale(1.04); filter: brightness(.92); }
      `}</style>

      <div
        className="vpg"
        style={{
          display: "grid",
          gridTemplateColumns: side.length > 0 ? (sideCols === 2 ? "2fr 1fr 1fr" : "2fr 1fr") : "1fr",
          gridTemplateRows: `repeat(${Math.max(sideRows, 1)}, 1fr)`,
          gap: 8,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {shown.map((url, i) => {
          const isMain = i === 0
          const isLast = i === shown.length - 1
          const showMore = isLast && extra > 0

          return (
            <button
              key={url}
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={showMore ? `View all ${photos.length} photos` : `View photo ${i + 1}`}
              className="vpg-tile bg-muted"
              style={{
                position: "relative",
                padding: 0,
                border: "none",
                overflow: "hidden",
                cursor: "zoom-in",
                minHeight: 0,
                minWidth: 0,
                ...(isMain ? { gridRow: `1 / span ${Math.max(sideRows, 1)}` } : {}),
              }}
            >
              <img
                src={url}
                alt={isMain ? name : `${name} photo ${i + 1}`}
                loading={isMain ? "eager" : "lazy"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {showMore && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  +{extra}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {openAt !== null && (
        <PhotoViewer
          photos={photos}
          name={name}
          start={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  )
}

function PhotoViewer({
  photos,
  name,
  start,
  onClose,
}: {
  photos: string[]
  name: string
  start: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(start)
  const touchX = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const count = photos.length
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  // Keyboard: ← → to navigate, Esc to close. Also stop the page scrolling behind.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
      else if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [prev, next, onClose])

  // Keep the active thumbnail in view
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
  }, [index])

  const arrow: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 48,
    height: 48,
    borderRadius: 9999,
    border: "none",
    background: "rgba(255,255,255,0.14)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 2,
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          fontSize: 14,
        }}
      >
        <span style={{ opacity: 0.85 }}>
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ ...arrow, position: "static", transform: "none", width: 40, height: 40 }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Image + arrows */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 40) (dx > 0 ? prev : next)()
        }}
      >
        {count > 1 && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            style={{ ...arrow, left: 12 }}
          >
            <ChevronLeft style={{ width: 26, height: 26 }} />
          </button>
        )}

        <img
          key={photos[index]}
          src={photos[index]}
          alt={`${name} photo ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 8,
            userSelect: "none",
          }}
        />

        {count > 1 && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            style={{ ...arrow, right: 12 }}
          >
            <ChevronRight style={{ width: 26, height: 26 }} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div
          ref={thumbsRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 16px 18px",
            overflowX: "auto",
          }}
        >
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              style={{
                flexShrink: 0,
                width: 64,
                height: 48,
                padding: 0,
                borderRadius: 6,
                overflow: "hidden",
                cursor: "pointer",
                border: i === index ? "2px solid white" : "2px solid transparent",
                opacity: i === index ? 1 : 0.55,
                background: "transparent",
              }}
            >
              <img
                src={url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
