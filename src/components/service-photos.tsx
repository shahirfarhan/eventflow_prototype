"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";

type ServiceWithPhotos = {
  id: string;
  name: string;
  images: { id?: string; url: string }[];
};

/**
 * One row of photos per service (swipe sideways on phones), tap any photo to open it
 * full screen. Services without photos are skipped.
 */
export function ServicePhotos({ services }: { services: ServiceWithPhotos[] }) {
  const withPhotos = services.filter((s) => s.images.length > 0);
  const [viewer, setViewer] = useState<{ service: ServiceWithPhotos; index: number } | null>(null);

  if (withPhotos.length === 0) return null;

  return (
    <div className="space-y-6">
      {withPhotos.map((service) => (
        <div key={service.id} className="min-w-0">
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <h3 className="truncate font-semibold text-foreground">{service.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" />
              {service.images.length} photo{service.images.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Horizontal strip: swipe on phones, scroll on desktop */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {service.images.map((img, i) => (
              <button
                key={img.id ?? img.url}
                type="button"
                onClick={() => setViewer({ service, index: i })}
                className="group relative aspect-[4/3] w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-muted sm:w-52"
                aria-label={`Open photo ${i + 1} of ${service.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={`${service.name}, photo ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      ))}

      {viewer && (
        <PhotoViewer
          title={viewer.service.name}
          photos={viewer.service.images.map((i) => i.url)}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   ONE SERVICE'S PHOTOS — drop inside a service card
================================================================ */

/**
 * Compact photo row for a single service, made to sit inside its card.
 * Swipe sideways on phones; tap a photo to open it full screen.
 * Renders nothing if the service has no photos.
 */
export function ServicePhotoStrip({
  name,
  images,
}: {
  name: string;
  images: { id?: string; url: string }[];
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
        {images.map((img, i) => (
          <button
            key={img.id ?? img.url}
            type="button"
            onClick={() => setOpenAt(i)}
            className="group relative aspect-[4/3] w-36 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-muted sm:w-44"
            aria-label={`Open photo ${i + 1} of ${name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`${name}, photo ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {i === 0 && images.length > 1 && (
              <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
                {images.length} photos
              </span>
            )}
          </button>
        ))}
      </div>

      {openAt !== null && (
        <PhotoViewer
          title={name}
          photos={images.map((i) => i.url)}
          startIndex={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}

/* ================================================================
   FULL-SCREEN VIEWER
================================================================ */

function PhotoViewer({
  title,
  photos,
  startIndex,
  onClose,
}: {
  title: string;
  photos: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const count = photos.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  // Keyboard: ← → to move, Esc to close. Also stop the page scrolling behind it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  // Simple swipe on phones
  const [touchX, setTouchX] = useState<number | null>(null);

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
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 40) (dx > 0 ? prev : next)();
          setTouchX(null);
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
  );
}
