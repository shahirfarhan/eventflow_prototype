// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "@/components/ui/sonner";
// import { Navbar } from "@/components/navbar";
// import { SessionProvider } from "@/components/session-provider";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Gaffers",
//   description: "One-stop platform for event planning",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <SessionProvider>
//           <Navbar />
//           {children}
//           <Toaster />
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }








import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteHeader } from "@/components/site-header"
import { SessionProvider } from "@/components/session-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <SiteHeader />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}