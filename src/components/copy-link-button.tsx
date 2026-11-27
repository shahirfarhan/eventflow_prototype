"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Link2 } from "lucide-react"
import { toast } from "sonner"

/** Copies text, with a fallback for older Safari and non-https pages (e.g. testing on 192.168.x.x). */
async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the old method
  }

  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.position = "fixed"
  ta.style.top = "-1000px"
  ta.style.opacity = "0"
  document.body.appendChild(ta)
  ta.select()
  ta.setSelectionRange(0, text.length) // iOS
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

/**
 * "Copy profile link" button. `path` is the page path (e.g. /vendors/abc123);
 * the site address is added in the browser, so it works on localhost and gaffersapp.com.
 */
export function CopyLinkButton({
  path,
  label = "Copy profile link",
  copiedLabel = "Link copied",
  failedLabel = "Couldn't copy the link",
  className,
}: {
  path: string
  label?: string
  copiedLabel?: string
  failedLabel?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function onClick() {
    const url = new URL(path, window.location.origin).toString()
    const ok = await copyText(url)

    if (ok) {
      toast.success(copiedLabel)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } else {
      // Last resort: show the link so it can be copied by hand
      toast.error(failedLabel, { description: url })
    }
  }

  const Icon = copied ? Check : Link2

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={
        "border border-border bg-card text-foreground transition-colors hover:bg-muted " +
        (className ?? "")
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 40,
        padding: "0 14px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden />
      <span className="copy-link-text">{copied ? copiedLabel : label}</span>
      {/* Icon-only on narrow phones so the name keeps its space */}
      <style>{`@media (max-width: 420px) { .copy-link-text { display: none; } }`}</style>
    </button>
  )
}
