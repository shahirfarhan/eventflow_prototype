import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/mail"

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex")

/** Creates a fresh token for the user (replacing any old ones) and returns the raw token. */
export async function createEmailVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex")

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ])

  return token
}

/** Creates a token and emails the verification link. Throws if sending fails. */
export async function sendVerificationFor(user: {
  id: string
  email: string
  name: string | null
}) {
  const token = await createEmailVerificationToken(user.id)
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000"
  const url = `${baseUrl}/verify-email?token=${token}`

  await sendVerificationEmail({ to: user.email, name: user.name, url })
}
