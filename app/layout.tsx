import type { Metadata } from "next"

import "./globals.css"

import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { interFont } from "@/lib/font"

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
    <html lang="en" className={interFont.className} suppressHydrationWarning>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link
            href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
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
