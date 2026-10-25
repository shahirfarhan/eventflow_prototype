import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetFor } from "@/lib/password-reset-token"

const schema = z.object({ email: z.string().email() })
const COOLDOWN_MS = 60 * 1000 // one reset email per minute per account

// POST /api/auth/forgot-password  { email }
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const email = parsed.data.email.trim()

  // Always answer the same way, so this can't be used to find out which
  // emails have accounts.
  const ok = NextResponse.json({ ok: true })

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordResetTokens: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  })

  if (!user) return ok

  // Quietly skip if a link was sent less than a minute ago
  const last = user.passwordResetTokens[0]?.createdAt
  if (last && Date.now() - last.getTime() < COOLDOWN_MS) return ok

  try {
    await sendPasswordResetFor({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error("Failed to send password reset email:", err)
    return NextResponse.json(
      { error: "We couldn't send the email right now. Please try again later." },
      { status: 500 },
    )
  }

  return ok
}
