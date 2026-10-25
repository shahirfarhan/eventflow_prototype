import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { findValidResetToken } from "@/lib/password-reset-token"
import ResetPasswordForm from "./reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const record = await findValidResetToken(token)

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      {record && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Card className="w-full max-w-sm text-center">
          <CardContent className="space-y-5 py-10">
            <div className="flex justify-center">
              <Clock className="h-14 w-14 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Link expired or invalid</h1>
              <p className="text-sm text-muted-foreground">
                Reset links work once and expire after 1 hour. Request a new one to continue.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a new link</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
