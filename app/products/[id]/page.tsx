import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeaturedProducts } from "@/components/featured-products"

// Sample product data - in a real app, this would come from a database or API
const product = {
  id: 1,
  name: "Elegance Stiletto Heels",
  price: 189.99,
  description:
    "Elevate your style with our Elegance Stiletto Heels. Crafted from premium Italian leather, these heels feature a sleek 4-inch stiletto heel, cushioned insole for all-day comfort, and a timeless pointed toe design. Perfect for both formal occasions and adding sophistication to your everyday look.",
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  category: "Heels",
  colors: [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Nude", value: "#e8cfc0" },
  ],
  sizes: [
    { value: "5", label: "US 5 / EU 35", available: true },
    { value: "6", label: "US 6 / EU 36", available: true },
    { value: "7", label: "US 7 / EU 37", available: true },
    { value: "8", label: "US 8 / EU 38", available: true },
    { value: "9", label: "US 9 / EU 39", available: true },
    { value: "10", label: "US 10 / EU 40", available: false },
  ],
  features: [
    "Premium Italian leather",
    "4-inch stiletto heel",
    "Cushioned insole",
    "Leather sole",
    "Pointed toe",
    "Handcrafted in Italy",
  ],
  rating: 4.8,
  reviewCount: 124,
  sku: "EL-STL-BLK-001",
  inStock: true,
  deliveryEstimate: "3-5 business days",
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight">Luxe Steps</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/categories/heels" className="text-sm font-medium transition-colors hover:text-primary">
                Heels
              </Link>
              <Link href="/categories/flats" className="text-sm font-medium transition-colors hover:text-primary">
                Flats
              </Link>
              <Link href="/categories/boots" className="text-sm font-medium transition-colors hover:text-primary">
                Boots
              </Link>
              <Link href="/categories/sandals" className="text-sm font-medium transition-colors hover:text-primary">
                Sandals
              </Link>
              <Link href="/categories/sneakers" className="text-sm font-medium transition-colors hover:text-primary">
                Sneakers
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="sm">
                Account
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="mx-1 h-4 w-4" />
            <Link href="/categories/heels" className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-md">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - View ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-full w-full cursor-pointer object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Color</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className="relative h-8 w-8 rounded-full border p-1"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        <span className="sr-only">{color.name}</span>
                        <span className="absolute inset-0 rounded-full border-2 border-primary opacity-0 hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Size</h3>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {product.sizes.map((size) => (
                      <button
                        key={size.value}
                        disabled={!size.available}
                        className={`rounded-md border px-3 py-2 text-sm ${
                          size.available ? "hover:border-primary hover:text-primary" : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        {size.value}
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/size-guide"
                    className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground"
                  >
                    Size Guide
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-md border">
                    <Button variant="ghost" size="icon" className="rounded-r-none">
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-12 text-center">1</span>
                    <Button variant="ghost" size="icon" className="rounded-l-none">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                  <Button className="flex-1 gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {product.inStock ? (
                        <>
                          <span className="font-medium text-green-600">In Stock</span> - Estimated delivery:{" "}
                          {product.deliveryEstimate}
                        </>
                      ) : (
                        <span className="font-medium text-red-600">Out of Stock</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="text-muted-foreground">{product.description}</p>
                </TabsContent>
                <TabsContent value="features" className="pt-4">
                  <ul className="grid gap-2 text-muted-foreground sm:grid-cols-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">SKU</div>
                    <div className="text-muted-foreground">{product.sku}</div>
                    <div className="font-medium">Category</div>
                    <div className="text-muted-foreground">{product.category}</div>
                    <div className="font-medium">Material</div>
                    <div className="text-muted-foreground">Premium Italian Leather</div>
                    <div className="font-medium">Heel Height</div>
                    <div className="text-muted-foreground">4 inches</div>
                    <div className="font-medium">Care Instructions</div>
                    <div className="text-muted-foreground">
                      Clean with a soft, dry cloth. Store in the provided dust bag.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <section className="mt-16">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2 className="text-2xl font-bold">You May Also Like</h2>
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <FeaturedProducts />
          </section>

          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating} out of 5</span>
                </div>
                <p className="text-muted-foreground">Based on {product.reviewCount} reviews</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-sm">5 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="w-8 text-right text-sm">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-sm">4 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-2 w-[10%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="w-8 text-right text-sm">10%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-sm">3 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-2 w-[3%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="w-8 text-right text-sm">3%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-sm">2 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-2 w-[1%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="w-8 text-right text-sm">1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-sm">1 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-2 w-[1%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="w-8 text-right text-sm">1%</span>
                  </div>
                </div>
                <Button className="w-full">Write a Review</Button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src="/placeholder.svg?height=100&width=100"
                              alt="Reviewer"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">Sarah J.</h4>
                            <p className="text-xs text-muted-foreground">Verified Purchase</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <h5 className="mb-1 font-medium">Perfect for special occasions!</h5>
                      <p className="text-sm text-muted-foreground">
                        These heels are absolutely stunning and surprisingly comfortable. I wore them to a wedding and
                        received so many compliments. The quality is exceptional and they fit true to size.
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">Posted on May 12, 2023</div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Luxe Steps</h3>
              <p className="text-sm text-muted-foreground">
                Premium footwear for the modern woman, crafted with passion and precision.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/categories/heels" className="text-muted-foreground hover:text-foreground">
                    Heels
                  </Link>
                </li>
                <li>
                  <Link href="/categories/flats" className="text-muted-foreground hover:text-foreground">
                    Flats
                  </Link>
                </li>
                <li>
                  <Link href="/categories/boots" className="text-muted-foreground hover:text-foreground">
                    Boots
                  </Link>
                </li>
                <li>
                  <Link href="/categories/sandals" className="text-muted-foreground hover:text-foreground">
                    Sandals
                  </Link>
                </li>
                <li>
                  <Link href="/categories/sneakers" className="text-muted-foreground hover:text-foreground">
                    Sneakers
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="text-muted-foreground hover:text-foreground">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-muted-foreground hover:text-foreground">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-muted-foreground hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-muted-foreground hover:text-foreground">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="text-muted-foreground hover:text-foreground">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Luxe Steps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
