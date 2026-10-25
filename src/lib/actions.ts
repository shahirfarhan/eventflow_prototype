"use server"

import { signIn } from "@/auth"
import { AuthError, CredentialsSignin } from "next-auth"

export type LoginState =
  | { kind: "success" }
  | { kind: "unverified"; message: string; email: string }
  | { kind: "pending" | "rejected" | "error"; message: string }
  | undefined

export async function authenticate(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { kind: "error", message: "Email and password are required." }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // the browser does a full reload instead (see login form)
    })
    return { kind: "success" }
  } catch (error) {
    // Custom errors thrown from authorize() in auth.ts
    if (error instanceof CredentialsSignin) {
      if (error.code === "email_unverified") {
        return {
          kind: "unverified",
          email,
          message:
            "Please verify your email before signing in. Check your inbox for the link we sent you.",
        }
      }
      if (error.code === "vendor_pending") {
        return {
          kind: "pending",
          message:
            "Your vendor application is still being reviewed. You'll be able to sign in once our team approves it.",
        }
      }
      if (error.code === "vendor_rejected") {
        return {
          kind: "rejected",
          message:
            "Your vendor application was not approved. Please contact support if you think this is a mistake.",
        }
      }
      return { kind: "error", message: "Invalid email or password." }
    }

    if (error instanceof AuthError) {
      return { kind: "error", message: "Something went wrong." }
    }

    throw error
  }
}
