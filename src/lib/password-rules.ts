import { z } from "zod"

/**
 * One place for the password rules, used by the sign-up and reset-password forms
 * (live checklist) and by the API routes (so the rules can't be skipped).
 * Add, remove or reword a rule here and every form and route follows.
 */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number (0–9)", test: (p: string) => /\d/.test(p) },
  {
    id: "symbol",
    label: "One special character (e.g. ! @ # $ %)",
    test: (p: string) => /[^A-Za-z0-9\s]/.test(p),
  },
] as const

export const PASSWORD_MAX_LENGTH = 128

/** The first rule the password breaks, or null if it passes them all. */
export function passwordProblem(password: string): string | null {
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`
  }
  const failed = PASSWORD_RULES.find((rule) => !rule.test(password))
  return failed ? `Password needs: ${failed.label.toLowerCase()}` : null
}

/** zod version, for react-hook-form and API routes. */
export const passwordSchema = z.string().superRefine((value, ctx) => {
  const problem = passwordProblem(value)
  if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem })
})
