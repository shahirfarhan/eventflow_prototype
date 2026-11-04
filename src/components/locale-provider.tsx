"use client"

import { createContext, useContext, type ReactNode } from "react"
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n"

/**
 * Gives client components ("use client") the current language.
 * The root layout reads the cookie on the server and passes it in here;
 * the EN | BM toggle refreshes the page, so this updates with it.
 */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

/** "en" or "ms" */
export function useLocale() {
  return useContext(LocaleContext)
}

/** The text for the current language, e.g. const t = useT(); t.nav.home */
export function useT() {
  return getDictionary(useLocale())
}
