"use client"

import type { IconType } from "react-icons"
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6"
import { SOCIAL_PLATFORMS, type SocialKey, type SocialLinks } from "@/lib/social-links"

export const SOCIAL_ICONS: Record<SocialKey, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
}

export function SocialIcon({
  platform,
  size = 18,
}: {
  platform: SocialKey
  size?: number
}) {
  const Icon = SOCIAL_ICONS[platform]
  const color = SOCIAL_PLATFORMS.find((p) => p.key === platform)?.color
  return <Icon size={size} style={{ color: color ?? "currentColor", flexShrink: 0 }} aria-hidden />
}

/** Row of round logo buttons; each opens the vendor's page in a new tab. */
export function SocialLinksRow({
  links,
  businessName,
}: {
  links: Partial<SocialLinks>
  businessName: string
}) {
  const items = SOCIAL_PLATFORMS.filter((p) => links[p.key])
  if (items.length === 0) return null

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((p) => (
        <a
          key={p.key}
          href={links[p.key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${businessName} on ${p.label}`}
          title={p.label}
          className="border border-border bg-background text-foreground transition-colors hover:bg-muted"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 9999,
          }}
        >
          <SocialIcon platform={p.key} size={18} />
        </a>
      ))}
    </div>
  )
}
