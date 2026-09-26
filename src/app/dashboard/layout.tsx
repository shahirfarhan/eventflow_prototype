// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import DashboardNav from "./dashboard-nav";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   const role = session.user.role;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <aside className="w-64 bg-white shadow-md hidden md:block">
//         {/* <div className="p-6 border-b">
//           <div className="text-xl font-bold">EventFlow</div>
//           <div className="text-sm text-gray-500 mt-1 capitalize">{role.toLowerCase()}</div>
//         </div> */}
//         {/* <DashboardNav role={role} /> */}
//       </aside>
//       <main className="flex-1 overflow-y-auto p-8">
//         {children}
//       </main>
//     </div>
//   );
// }
//----


// import type { Metadata, Viewport } from 'next'
// import '../globals.css'

// export const metadata: Metadata = {
//   title: 'Gaffers — Event Dashboard',
//   description: 'Plan your events and book vendors with Gaffers.',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   colorScheme: 'light dark',
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: 'white' },
//     { media: '(prefers-color-scheme: dark)', color: 'black' },
//   ],
// }

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className="antialiased">
//         {children}
//         {process.env.NODE_ENV === 'production'}
//       </body>
//     </html>
//   )
// }

// --------------


import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Gaffers — Event Dashboard",
  description: "Plan your events and book vendors with Gaffers.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
