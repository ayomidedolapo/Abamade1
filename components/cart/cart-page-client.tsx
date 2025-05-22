"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FeaturedProducts } from "@/components/featured-products"
import { useCart } from "@/components/cart/cart-context"
import { formatCurrency } from "@/lib/utils"

export default function CartPageClient() {
  const { items, subtotal, isLoading, updateItemQuantity, removeItem } = useCart()
  const [processingItems, setProcessingItems] = useState<Record<string, boolean>>({})

  // Calculate cart totals
  const shipping = items.length > 0 ? 12.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setProcessingItems((prev) => ({ ...prev, [itemId]: true }))
    await updateItemQuantity(itemId, newQuantity)
    setProcessingItems((prev) => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId: string) => {
    setProcessingItems((prev) => ({ ...prev, [itemId]: true }))
    await removeItem(itemId)
    setProcessingItems((prev) => ({ ...prev, [itemId]: false }))
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border">
              <div className="hidden p-4 sm:grid sm:grid-cols-6">
                <div className="col-span-3 font-medium">Product</div>
                <div className="text-center font-medium">Quantity</div>
                <div className="text-center font-medium">Price</div>
                <div className="text-right font-medium">Total</div>
              </div>
              <Separator />
              {items.map((item) => {
                const isProcessing = processingItems[item.id] || false
                const price = item.variant?.price || item.product.sale_price || item.product.price
                const imageUrl = item.product.images?.[0]?.url || "/placeholder.svg?height=200&width=200"

                return (
                  <div key={item.id} className="p-4">
                    <div className="grid gap-4 sm:grid-cols-6 sm:items-center">
                      <div className="col-span-3 flex gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/product/${item.product.slug}`} className="hover:underline">
                              {item.product.name}
                            </Link>
                          </h3>
                          {item.variant && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              <p>{item.variant.name}</p>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-auto p-0 text-sm text-red-500 hover:text-red-600 sm:hidden"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="mr-1 h-3 w-3" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isProcessing || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {isProcessing ? <Loader2 className="mx-auto h-3 w-3 animate-spin" /> : item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isProcessing || item.quantity >= (item.product.stock_quantity || 10)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </div>
                      <div className="text-center text-sm">{formatCurrency(price)}</div>
                      <div className="flex items-center justify-between sm:justify-end">
                        <span className="font-medium sm:text-right">{formatCurrency(price * item.quantity)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 hidden h-8 w-8 text-muted-foreground hover:text-red-500 sm:inline-flex"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Button className="mt-6 w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Promo Code</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" className="flex-1" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Shipping Estimate</h3>
                  <Input placeholder="Enter your zip code" />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Free shipping on orders over $200</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}

      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
        <FeaturedProducts />
      </section>
    </div>
  )
}
