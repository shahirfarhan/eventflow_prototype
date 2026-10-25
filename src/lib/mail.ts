import nodemailer from "nodemailer"

// Gmail SMTP. Needs these in .env:
//   SMTP_USER=youraddress@gmail.com
//   SMTP_PASS=your 16-character Google app password (not your normal password)
//   APP_NAME=YourAppName          (optional, shown as the sender name)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )

export async function sendPasswordResetEmail({
  to,
  name,
  url,
}: {
  to: string
  name: string | null
  url: string
}) {
  const appName = process.env.APP_NAME ?? "our platform"
  const greeting = name ? `Hi ${name},` : "Hi,"

  await transporter.sendMail({
    from: `"${appName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reset your ${appName} password`,
    text: `${greeting}

We received a request to reset your password. Open this link to choose a new one:

${url}

The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p>${escapeHtml(greeting)}</p>
        <p>We received a request to reset your ${escapeHtml(appName)} password. Click the button below to choose a new one.</p>
        <p style="margin: 28px 0;">
          <a href="${url}"
             style="background: #111; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reset password
          </a>
        </p>
        <p style="font-size: 13px; color: #555;">Or paste this link into your browser:<br>
          <a href="${url}" style="color: #555; word-break: break-all;">${url}</a>
        </p>
        <p style="font-size: 13px; color: #555;">The link expires in 1 hour. If you didn't ask to reset your password, you can ignore this email and your password will stay the same.</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail({
  to,
  name,
  url,
}: {
  to: string
  name: string | null
  url: string
}) {
  const appName = process.env.APP_NAME ?? "our platform"
  const greeting = name ? `Hi ${name},` : "Hi,"

  await transporter.sendMail({
    from: `"${appName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Verify your email for ${appName}`,
    text: `${greeting}

Thanks for signing up. Please confirm your email address by opening this link:

${url}

The link expires in 24 hours. If you didn't create an account, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p>${escapeHtml(greeting)}</p>
        <p>Thanks for signing up for ${escapeHtml(appName)}. Please confirm your email address to activate your account.</p>
        <p style="margin: 28px 0;">
          <a href="${url}"
             style="background: #111; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Verify email
          </a>
        </p>
        <p style="font-size: 13px; color: #555;">Or paste this link into your browser:<br>
          <a href="${url}" style="color: #555; word-break: break-all;">${url}</a>
        </p>
        <p style="font-size: 13px; color: #555;">The link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  })
}
