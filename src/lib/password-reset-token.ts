import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/mail"
import { hashToken } from "@/lib/verification-token"

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

/** Creates a fresh reset token (replacing any old ones) and emails the link. */
export async function sendPasswordResetFor(user: {
  id: string
  email: string
  name: string | null
}) {
  const token = crypto.randomBytes(32).toString("hex")

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ])

  const baseUrl = process.env.APP_URL ?? "http://localhost:3000"
  const url = `${baseUrl}/reset-password?token=${token}`

  await sendPasswordResetEmail({ to: user.email, name: user.name, url })
}

/** Returns the token record if the token exists and hasn't expired, otherwise null. */
export async function findValidResetToken(token: string | undefined) {
  if (!token) return null

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  })

  if (!record || record.expiresAt < new Date()) return null
  return record
}
