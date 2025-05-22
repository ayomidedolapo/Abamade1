"use client"

import type React from "react"

import { CartProvider } from "@/components/cart/cart-context"

export function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
