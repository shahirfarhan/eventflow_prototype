import Link from "next/link"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { hashToken } from "@/lib/verification-token"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ResendVerificationButton from "@/components/resend-verification-button"

type Result =
  | { status: "success"; isVendor: boolean }
  | { status: "expired"; email: string }
  | { status: "invalid" }

async function verify(token: string | undefined): Promise<Result> {
  if (!token) return { status: "invalid" }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, role: true } } },
  })

  if (!record) return { status: "invalid" }

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { id: record.id } })
    return { status: "expired", email: record.user.email }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
  ])

  return { status: "success", isVendor: record.user.role === "VENDOR" }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = await verify(token)

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center">
        <CardContent className="space-y-6 py-12">
          {result.status === "success" && (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Email verified</h1>
                <p className="text-muted-foreground">
                  {result.isVendor
                    ? "Thanks! Your application is now with our team for review. You'll be able to sign in once it's approved."
                    : "Thanks! Your account is ready — you can sign in now."}
                </p>
              </div>
              <Button asChild className="h-11 px-6">
                <Link href="/login">Go to login</Link>
              </Button>
            </>
          )}

          {result.status === "expired" && (
            <>
              <div className="flex justify-center">
                <Clock className="h-16 w-16 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Link expired</h1>
                <p className="text-muted-foreground">
                  This verification link is more than 24 hours old. We can send you a new one.
                </p>
              </div>
              <ResendVerificationButton email={result.email} variant="default" className="h-11 px-6" />
            </>
          )}

          {result.status === "invalid" && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Invalid link</h1>
                <p className="text-muted-foreground">
                  This link isn&apos;t valid or has already been used. If your email is already
                  verified, just sign in. Otherwise, try signing in to get a new link.
                </p>
              </div>
              <Button asChild variant="outline" className="h-11 px-6">
                <Link href="/login">Go to login</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
