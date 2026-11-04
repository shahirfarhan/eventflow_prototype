"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LOCALES, LOCALE_COOKIE, getDictionary, type Locale } from "@/lib/i18n"

/** EN | BM switch for the navbar. Saves the choice for a year and reloads the text. */
export function LanguageToggle({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const t = getDictionary(locale)

  const choose = (next: Locale) => {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    startTransition(() => router.refresh())
  }

  return (
    <div
      role="group"
      aria-label={t.language.switchTo}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold",
        pending && "opacity-60",
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale
        return (
          <button
            key={l}
            type="button"
            onClick={() => choose(l)}
            aria-pressed={active}
            lang={l}
            title={l === "en" ? "English" : "Bahasa Melayu"}
            className={cn(
              "h-7 min-w-9 rounded-full px-2 transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.language[l]}
          </button>
        )
      })}
    </div>
  )
}
