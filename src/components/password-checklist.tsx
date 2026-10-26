"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PASSWORD_RULES } from "@/lib/password-rules"

/** Live list of the password rules, ticking each one off as the user types. */
export function PasswordChecklist({ password, className }: { password: string; className?: string }) {
  return (
    <ul className={cn("grid gap-1.5 text-xs sm:grid-cols-2", className)} aria-live="polite">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password)
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 transition-colors",
              ok ? "text-emerald-700" : "text-muted-foreground",
            )}
          >
            {ok ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="h-3 w-3 shrink-0" aria-hidden="true" />
            )}
            <span>
              {rule.label}
              <span className="sr-only">{ok ? " (done)" : " (not yet)"}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
