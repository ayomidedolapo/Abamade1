"use client"

import { useState } from "react"
import { ShoppingBag, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import type { Product, ProductVariant } from "@/types/database.types"

interface AddToCartButtonProps {
  product: Product
  variant?: ProductVariant
  quantity?: number
  className?: string
}

export function AddToCartButton({ product, variant, quantity = 1, className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    await addItem(product, quantity, variant)
    setIsLoading(false)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading || product.stock_quantity < 1} className={className}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
      {product.stock_quantity < 1 ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
