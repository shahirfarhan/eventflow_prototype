import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { findValidResetToken } from "@/lib/password-reset-token"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// POST /api/auth/reset-password  { token, password }
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    )
  }

  const { token, password } = parsed.data
  const record = await findValidResetToken(token)

  if (!record) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 },
    )
  }

  const passwordHash = await hash(password, 12) // same cost as the register route

  const user = await prisma.user.findUnique({
    where: { id: record.userId },
    select: { emailVerified: true },
  })

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
        // Opening the link proves they own the inbox, so count it as verified
        ...(user && !user.emailVerified && { emailVerified: new Date() }),
      },
    }),
    // Each link works only once
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ])

  return NextResponse.json({ ok: true })
}
