import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { Toaster } from "@/components/ui/sonner"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CogniWeave - Cognitive Accessibility Engine",
  description: "Transform complex text into clear, personalized content tailored to your unique cognitive needs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>{children}</main>
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
