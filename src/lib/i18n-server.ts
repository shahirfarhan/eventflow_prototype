import { cookies } from "next/headers"
import { DEFAULT_LOCALE, LOCALE_COOKIE, getDictionary, isLocale, type Locale } from "@/lib/i18n"

/** The visitor's chosen language (from the cookie set by the navbar toggle). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** The text for the visitor's language, for server components: const t = await getT() */
export async function getT() {
  return getDictionary(await getLocale())
}
