import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import {
  EmailNotVerifiedError,
  VendorPendingError,
  VendorRejectedError,
} from "@/lib/auth-errors"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            // 1. Email must be verified first
            if (!user.emailVerified) throw new EmailNotVerifiedError();

            // 2. Vendors must be approved by an admin
            if (user.role === "VENDOR") {
              if (user.vendorStatus === "PENDING") throw new VendorPendingError();
              if (user.vendorStatus === "REJECTED") throw new VendorRejectedError();
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
})
