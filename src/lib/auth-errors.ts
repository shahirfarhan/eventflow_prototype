import { CredentialsSignin } from "next-auth"

// NextAuth v5 only passes errors to the client if they extend CredentialsSignin.
// The `code` is what your authenticate() action reads to show the right message.

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_unverified"
}

export class VendorPendingError extends CredentialsSignin {
  code = "vendor_pending"
}

export class VendorRejectedError extends CredentialsSignin {
  code = "vendor_rejected"
}
