import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendVerificationFor } from "@/lib/verification-token"

const schema = z.object({ email: z.string().email() })
const COOLDOWN_MS = 60 * 1000 // one email per minute per account

// POST /api/auth/resend-verification  { email }
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const email = parsed.data.email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      emailVerificationTokens: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  })

  // Same response whether or not the account exists, so this can't be used
  // to check which emails are registered.
  const ok = NextResponse.json({ ok: true })

  if (!user || user.emailVerified) return ok

  const last = user.emailVerificationTokens[0]?.createdAt
  if (last && Date.now() - last.getTime() < COOLDOWN_MS) {
    return NextResponse.json(
      { error: "Please wait a minute before requesting another email." },
      { status: 429 },
    )
  }

  try {
    await sendVerificationFor({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error("Failed to resend verification email:", err)
    return NextResponse.json(
      { error: "We couldn't send the email right now. Please try again later." },
      { status: 500 },
    )
  }

  return ok
}
