"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    google: typeof google
  }
}

type MalaysiaPlaceAutocompleteProps = {
  value: string
  onChange: (value: string) => void
}

export default function MalaysiaPlaceAutocomplete({
  value,
  onChange,
}: MalaysiaPlaceAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteRef = useRef<any>(null)

  const initialiseAutocomplete = async () => {
    if (!containerRef.current || autocompleteRef.current || !window.google) return

    const { PlaceAutocompleteElement } =
      await window.google.maps.importLibrary("places")

    const autocomplete = new PlaceAutocompleteElement()
    autocomplete.placeholder = "Search for a venue or address in Malaysia"
    autocomplete.includedRegionCodes = ["my"]

    autocomplete.addEventListener("gmp-select", async (event: any) => {
      const place = event.placePrediction.toPlace()

      await place.fetchFields({
        fields: ["displayName"],
      })

      onChange(place.displayName || "")
    })

    containerRef.current.appendChild(autocomplete)
    autocompleteRef.current = autocomplete
  }

  useEffect(() => {
    initialiseAutocomplete()

    return () => {
      autocompleteRef.current?.remove()
      autocompleteRef.current = null
    }
  }, [])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
        strategy="afterInteractive"
        onLoad={initialiseAutocomplete}
      />

      <div
        ref={containerRef}
        className="w-full rounded-md border border-input bg-background"
      />

      {/* Keeps the selected address visible for form submission/debugging */}
      {value && (
        <p className="mt-1 text-xs text-muted-foreground">
          Selected: {value}
        </p>
      )}
    </>
  )
}