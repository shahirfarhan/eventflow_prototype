// import nodemailer from "nodemailer"

// // Gmail SMTP. Needs these in .env:
// //   SMTP_USER=youraddress@gmail.com
// //   SMTP_PASS=your 16-character Google app password (not your normal password)
// //   APP_NAME=YourAppName          (optional, shown as the sender name)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// const escapeHtml = (s: string) =>
//   s.replace(/[&<>"']/g, (c) =>
//     ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
//   )

// export async function sendPasswordResetEmail({
//   to,
//   name,
//   url,
// }: {
//   to: string
//   name: string | null
//   url: string
// }) {
//   const appName = process.env.APP_NAME ?? "our platform"
//   const greeting = name ? `Hi ${name},` : "Hi,"

//   await transporter.sendMail({
//     from: `"${appName}" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `Reset your ${appName} password`,
//     text: `${greeting}

// We received a request to reset your password. Open this link to choose a new one:

// ${url}

// The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
//         <p>${escapeHtml(greeting)}</p>
//         <p>We received a request to reset your ${escapeHtml(appName)} password. Click the button below to choose a new one.</p>
//         <p style="margin: 28px 0;">
//           <a href="${url}"
//              style="background: #111; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
//             Reset password
//           </a>
//         </p>
//         <p style="font-size: 13px; color: #555;">Or paste this link into your browser:<br>
//           <a href="${url}" style="color: #555; word-break: break-all;">${url}</a>
//         </p>
//         <p style="font-size: 13px; color: #555;">The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.</p>
//       </div>
//     `,
//   })
// }

// export async function sendVerificationEmail({
//   to,
//   name,
//   url,
// }: {
//   to: string
//   name: string | null
//   url: string
// }) {
//   const appName = process.env.APP_NAME ?? "our platform"
//   const greeting = name ? `Hi ${name},` : "Hi,"

//   await transporter.sendMail({
//     from: `"${appName}" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `Verify your email for ${appName}`,
//     text: `${greeting}

// Thanks for signing up. Please confirm your email address by opening this link:

// ${url}

// The link expires in 24 hours. If you didn't create an account, you can ignore this email.`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
//         <p>${escapeHtml(greeting)}</p>
//         <p>Thanks for signing up for ${escapeHtml(appName)}. Please confirm your email address to activate your account.</p>
//         <p style="margin: 28px 0;">
//           <a href="${url}"
//              style="background: #111; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
//             Verify email
//           </a>
//         </p>
//         <p style="font-size: 13px; color: #555;">Or paste this link into your browser:<br>
//           <a href="${url}" style="color: #555; word-break: break-all;">${url}</a>
//         </p>
//         <p style="font-size: 13px; color: #555;">The link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
//       </div>
//     `,
//   })
// }


import nodemailer from "nodemailer"

// Gmail SMTP. Needs these (in .env locally, as Cloudflare secrets in production):
//   SMTP_USER=youraddress@gmail.com
//   SMTP_PASS=your 16-character Google app password (not your normal password)
//   APP_NAME=Gaffers              (optional, shown as the sender name)
//   APP_URL=https://gaffersapp.com (used for the login link in vendor emails)

// Created when sending (not at import) so it always picks up the current settings
function getTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error("SMTP_USER / SMTP_PASS are not set on this server")
  }
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } })
}

const appName = () => process.env.APP_NAME ?? "Gaffers"
const appUrl = () => (process.env.APP_URL ?? "https://gaffersapp.com").replace(/\/$/, "")
const fromAddress = () => `"${appName()}" <${process.env.SMTP_USER}>`

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )

/** Shared look for every email: greeting, paragraphs, optional button, small print */
function layout({
  greeting,
  paragraphs,
  button,
  smallPrint,
}: {
  greeting: string
  paragraphs: string[] // already-escaped HTML
  button?: { label: string; url: string }
  smallPrint?: string[] // already-escaped HTML
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <p>${escapeHtml(greeting)}</p>
      ${paragraphs.map((p) => `<p>${p}</p>`).join("\n      ")}
      ${
        button
          ? `<p style="margin: 28px 0;">
        <a href="${button.url}"
           style="background: #111; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          ${escapeHtml(button.label)}
        </a>
      </p>`
          : ""
      }
      ${(smallPrint ?? []).map((p) => `<p style="font-size: 13px; color: #555;">${p}</p>`).join("\n      ")}
    </div>
  `
}

/* ================================================================
   PASSWORD RESET
================================================================ */

export async function sendPasswordResetEmail({
  to,
  name,
  url,
}: {
  to: string
  name: string | null
  url: string
}) {
  const app = appName()
  const greeting = name ? `Hi ${name},` : "Hi,"

  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: `Reset your ${app} password`,
    text: `${greeting}

We received a request to reset your password. Open this link to choose a new one:

${url}

The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.`,
    html: layout({
      greeting,
      paragraphs: [
        `We received a request to reset your ${escapeHtml(app)} password. Click the button below to choose a new one.`,
      ],
      button: { label: "Reset password", url },
      smallPrint: [
        "The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.",
      ],
    }),
  })
}

/* ================================================================
   EMAIL VERIFICATION
================================================================ */

export async function sendVerificationEmail({
  to,
  name,
  url,
}: {
  to: string
  name: string | null
  url: string
}) {
  const app = appName()
  const greeting = name ? `Hi ${name},` : "Hi,"

  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: `Verify your email for ${app}`,
    text: `${greeting}

Thanks for signing up. Please confirm your email address by opening this link:

${url}

The link expires in 24 hours. If you didn't create an account, you can ignore this email.`,
    html: layout({
      greeting,
      paragraphs: [
        `Thanks for signing up for ${escapeHtml(app)}. Please confirm your email address to activate your account.`,
      ],
      button: { label: "Verify email", url },
      smallPrint: [
        "The link expires in 24 hours. If you didn't create an account, you can ignore this email.",
      ],
    }),
  })
}

/* ================================================================
   VENDOR APPLICATION APPROVED
================================================================ */

export async function sendVendorApprovedEmail({
  to,
  name,
  businessName,
}: {
  to: string
  name: string | null
  businessName: string | null
}) {
  const app = appName()
  const greeting = name ? `Hi ${name},` : "Hi,"
  const business = businessName || "your business"
  const loginUrl = `${appUrl()}/login`

  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: `You're approved on ${app} 🎉`,
    text: `${greeting}

Good news: ${business} has been approved as a vendor on ${app}.

You can now sign in at ${loginUrl}, add your services and photos, and start receiving booking requests from event planners.

Tip: services with a price, a description and at least 3 photos get the most attention.

Welcome aboard!
The ${app} team`,
    html: layout({
      greeting,
      paragraphs: [
        `Good news: <strong>${escapeHtml(business)}</strong> has been approved as a vendor on ${escapeHtml(app)}.`,
        "You can now sign in, add your services and photos, and start receiving booking requests from event planners.",
      ],
      button: { label: "Sign in to your dashboard", url: loginUrl },
      smallPrint: [
        "Tip: services with a price, a description and at least 3 photos get the most attention.",
        `Welcome aboard!<br>The ${escapeHtml(app)} team`,
      ],
    }),
  })
}

/* ================================================================
   VENDOR APPLICATION NOT APPROVED
================================================================ */

export async function sendVendorRejectedEmail({
  to,
  name,
  businessName,
  reason,
}: {
  to: string
  name: string | null
  businessName: string | null
  reason?: string | null
}) {
  const app = appName()
  const greeting = name ? `Hi ${name},` : "Hi,"
  const business = businessName || "your business"
  const cleanReason = reason?.trim()

  await getTransporter().sendMail({
    from: fromAddress(),
    to,
    subject: `Update on your ${app} vendor application`,
    text: `${greeting}

Thank you for applying to join ${app} with ${business}. After reviewing your application, we're not able to approve it at this time.
${cleanReason ? `\nReason: ${cleanReason}\n` : ""}
If you have questions or would like us to take another look, just reply to this email.

The ${app} team`,
    html: layout({
      greeting,
      paragraphs: [
        `Thank you for applying to join ${escapeHtml(app)} with <strong>${escapeHtml(business)}</strong>. After reviewing your application, we're not able to approve it at this time.`,
        ...(cleanReason
          ? [
              `<span style="display:block; background:#f6f6f6; border-radius:8px; padding:12px 14px;"><strong>Reason:</strong> ${escapeHtml(cleanReason)}</span>`,
            ]
          : []),
        "If you have questions or would like us to take another look, just reply to this email.",
      ],
      smallPrint: [`The ${escapeHtml(app)} team`],
    }),
  })
}
