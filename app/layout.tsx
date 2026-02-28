import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

import { Inter, Arvo as V0_Font_Arvo } from 'next/font/google'

// Initialize fonts
const _arvo = V0_Font_Arvo({ subsets: ['latin'], weight: ["400","700"] })

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MSM COURIER - Logistics & Delivery Management",
  description: "Track and manage your shipments with MSM COURIER",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body><script id="chatway" async="true" src="https://cdn.chatway.app/widget.js?id=gpULfc55i9m4"></script>
    </html>
  )
}
