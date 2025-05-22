"use client"

import { useState } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/db/products"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  isInWishlist?: boolean
  onWishlistToggle?: (productId: string) => void
}

export function ProductCard({
  product,
  isInWishlist = false,
  onWishlistToggle,
  className,
  ...props
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Find primary image or use first image or fallback
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]
  const secondaryImage = product.images?.[1] || primaryImage

  const productImage =
    primaryImage?.url || "/placeholder.svg?height=400&width=400&text=" + encodeURIComponent(product.name)
  const secondaryProductImage =
    secondaryImage?.url || "/placeholder.svg?height=400&width=400&text=" + encodeURIComponent(product.name)
  const productImageAlt = primaryImage?.alt || product.name

  // Calculate discount percentage if there's a sale price
  const discountPercentage = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className={cn(
          "overflow-hidden group border-none shadow-sm hover:shadow-md transition-all duration-300",
          className,
        )}
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Link href={`/product/${product.slug}`}>
            <div className="aspect-square overflow-hidden bg-muted/30">
              <div className="relative h-full w-full">
                <Image
                  src={productImage || "/placeholder.svg"}
                  alt={productImageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-opacity duration-500",
                    isHovered ? "opacity-0" : "opacity-100",
                  )}
                />
                <Image
                  src={secondaryProductImage || "/placeholder.svg"}
                  alt={`${productImageAlt} - alternate view`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-opacity duration-500",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            </div>
          </Link>

          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => onWishlistToggle?.(product.id)}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              asChild
            >
              <Link href={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Quick view</span>
              </Link>
            </Button>
          </div>

          {product.is_new && <Badge className="absolute left-2 top-2 bg-primary hover:bg-primary">New</Badge>}

          {product.sale_price && (
            <Badge variant="destructive" className="absolute left-2 bottom-2">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-1">
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{product.category?.name || "Footwear"}</p>
            <div className="flex items-center justify-between pt-1">
              {product.sale_price ? (
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary">${product.sale_price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                </div>
              ) : (
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
            size="sm"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
