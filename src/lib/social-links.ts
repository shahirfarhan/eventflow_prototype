// Shared by the profile settings API, the settings form and the public vendor page.

export const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    hosts: ["instagram.com"],
    handleUrl: (h: string) => `https://www.instagram.com/${h}`,
    placeholder: "@yourbusiness or instagram.com/yourbusiness",
    color: "#E4405F",
  },
  {
    key: "facebook",
    label: "Facebook",
    hosts: ["facebook.com", "fb.com", "fb.me"],
    handleUrl: (h: string) => `https://www.facebook.com/${h}`,
    placeholder: "facebook.com/yourbusiness",
    color: "#1877F2",
  },
  {
    key: "tiktok",
    label: "TikTok",
    hosts: ["tiktok.com"],
    handleUrl: (h: string) => `https://www.tiktok.com/@${h}`,
    placeholder: "@yourbusiness or tiktok.com/@yourbusiness",
    color: null, // black/white logo: follows the text colour
  },
  {
    key: "youtube",
    label: "YouTube",
    hosts: ["youtube.com", "youtu.be"],
    handleUrl: (h: string) => `https://www.youtube.com/@${h}`,
    placeholder: "@yourchannel or youtube.com/@yourchannel",
    color: "#FF0000",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    hosts: ["x.com", "twitter.com"],
    handleUrl: (h: string) => `https://x.com/${h}`,
    placeholder: "@yourbusiness or x.com/yourbusiness",
    color: null,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hosts: ["linkedin.com"],
    handleUrl: (h: string) => `https://www.linkedin.com/company/${h}`,
    placeholder: "linkedin.com/company/yourbusiness",
    color: "#0A66C2",
  },
] as const

export type SocialKey = (typeof SOCIAL_PLATFORMS)[number]["key"]
export type SocialLinks = Record<SocialKey, string | null>

export const SOCIAL_KEYS = SOCIAL_PLATFORMS.map((p) => p.key) as SocialKey[]

const HANDLE_RE = /^[A-Za-z0-9._-]{1,100}$/

function hostMatches(hostname: string, hosts: readonly string[]) {
  const h = hostname.toLowerCase()
  return hosts.some((allowed) => h === allowed || h.endsWith(`.${allowed}`))
}

/**
 * Turns whatever the vendor typed (a handle like "@shop" or a link with or
 * without https://) into a full https link on the right site.
 * Returns null for an empty value and throws an Error with a readable message
 * when the value isn't a link to that platform.
 */
export function normalizeSocialLink(key: SocialKey, raw: string | null | undefined) {
  const value = (raw ?? "").trim()
  if (!value) return null

  const platform = SOCIAL_PLATFORMS.find((p) => p.key === key)!

  // Plain handle: "@shop" or "shop"
  const handle = value.replace(/^@/, "")
  if (!value.includes("/") && !value.includes(".com") && HANDLE_RE.test(handle)) {
    return platform.handleUrl(handle)
  }

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    throw new Error(`${platform.label}: enter a username or a link`)
  }

  if (!hostMatches(url.hostname, platform.hosts)) {
    throw new Error(`${platform.label}: the link must be on ${platform.hosts[0]}`)
  }
  if (url.pathname === "/" || url.pathname === "") {
    throw new Error(`${platform.label}: the link needs your page or username`)
  }

  url.protocol = "https:"
  return url.toString()
}

/** Website: adds https:// when missing; only http(s) links are allowed. */
export function normalizeWebsite(raw: string | null | undefined) {
  const value = (raw ?? "").trim()
  if (!value) return null

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    throw new Error("Website: enter a valid link, e.g. yourbusiness.com")
  }
  if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) {
    throw new Error("Website: enter a valid link, e.g. yourbusiness.com")
  }
  return url.toString()
}

/** For showing a stored website (old rows may not have https://). */
export function websiteHref(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`
}

export function websiteLabel(website: string) {
  return website.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "")
}
