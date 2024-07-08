import type { Metadata } from "next"

import "./globals.css"

import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaaStart | Auth0 by Okta",
  description:
    "SaaStart is a reference B2B SaaS application built using Next.js and Auth0 by Okta.",
  metadataBase: new URL("https://saastart.vercel.app"),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <script src="/vendor/audit-log-viewer.js"></script>
          <script src="/vendor/store-file-viewer.js"></script>
          <script src="/vendor/init.js"></script>

      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
