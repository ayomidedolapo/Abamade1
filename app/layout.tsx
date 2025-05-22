import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProviderWrapper } from "@/components/cart/cart-provider-wrapper"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AbaMade Footwear | Handcrafted Quality Shoes",
    template: "%s | AbaMade Footwear",
  },
  description: "Premium handcrafted footwear made in Aba, Nigeria.",
  keywords: ["footwear", "shoes", "handcrafted", "Nigerian", "Aba", "quality", "leather"],
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProviderWrapper>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
          </CartProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
