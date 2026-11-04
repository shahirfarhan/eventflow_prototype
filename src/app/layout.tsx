import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteHeader } from "@/components/site-header"
import { SessionProvider } from "@/components/session-provider"
import { LocaleProvider } from "@/components/locale-provider"
import { getLocale } from "@/lib/i18n-server"

export const metadata: Metadata = {
  title: 'Gaffers — Find every vendor for your event',
  description:
    'Gaffers brings photographers, venues, caterers, and every other event vendor into one searchable marketplace. Discover, message, book, and manage your whole event in one app.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body className="antialiased">
        <LocaleProvider locale={locale}>
          <SessionProvider>
            <SiteHeader />
            {children}
          </SessionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}