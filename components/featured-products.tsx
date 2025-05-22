"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample product data
const products = [
  {
    id: 1,
    name: "Elegance Stiletto Heels",
    price: 189.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Heels",
    isNew: true,
    colors: ["Black", "Red", "Nude"],
    rating: 4.8,
  },
  {
    id: 2,
    name: "Comfort Leather Flats",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Flats",
    isNew: true,
    colors: ["Brown", "Black", "White"],
    rating: 4.9,
  },
  {
    id: 3,
    name: "Urban Ankle Boots",
    price: 219.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Boots",
    isNew: false,
    colors: ["Black", "Brown"],
    rating: 4.7,
  },
  {
    id: 4,
    name: "Summer Strappy Sandals",
    price: 159.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Sandals",
    isNew: true,
    colors: ["Gold", "Silver", "Rose Gold"],
    rating: 4.6,
  },
]

export function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            {product.isNew && <Badge className="absolute left-2 top-2">New</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="space-y-1">
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="font-medium">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <div className="flex items-center">
                  <span className="text-sm text-yellow-500">★</span>
                  <span className="ml-1 text-xs text-muted-foreground">{product.rating}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="h-3 w-3 rounded-full border"
                      style={{
                        backgroundColor: color.toLowerCase() === "nude" ? "#e8cfc0" : color.toLowerCase(),
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <Button className="w-full" size="sm">
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
