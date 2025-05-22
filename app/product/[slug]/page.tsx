import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Star, Truck, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/products/product-grid"
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products"
import { getProductRating, getProductReviews } from "@/lib/db/reviews"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4)
  const reviews = await getProductReviews(product.id, { limit: 3 })
  const rating = await getProductRating(product.id)

  // Find primary image or use first image
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0]

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border bg-background">
            <Image
              src={primaryImage?.url || "/placeholder.svg?height=600&width=600"}
              alt={primaryImage?.alt || product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border bg-background">
                <Image
                  src={image.url || "/placeholder.svg?height=150&width=150"}
                  alt={image.alt || `${product.name} - View`}
                  width={150}
                  height={150}
                  className="h-full w-full cursor-pointer object-cover transition-all hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            {product.is_new && <Badge className="mb-2 bg-primary hover:bg-primary">New Arrival</Badge>}
            <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating.average) ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {rating.average.toFixed(1)} ({rating.count} reviews)
              </span>
              <Link href="#reviews" className="text-sm font-medium text-primary hover:underline">
                Read reviews
              </Link>
            </div>
            {product.sale_price ? (
              <div className="mt-4 flex items-center gap-2">
                <p className="text-2xl font-semibold text-primary">${product.sale_price.toFixed(2)}</p>
                <p className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                <Badge variant="destructive" className="ml-2">
                  {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                </Badge>
              </div>
            ) : (
              <p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.variants?.map((variant) => {
                  const sizeOption = variant.options?.find((opt) => opt.name === "Size")
                  const isAvailable = variant.stock_quantity > 0

                  return (
                    <button
                      key={variant.id}
                      disabled={!isAvailable}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                        isAvailable
                          ? "hover:border-primary hover:text-primary focus:border-primary focus:text-primary"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      {sizeOption?.value || variant.name}
                    </button>
                  )
                })}
              </div>
              <Link href="/size-guide" className="mt-3 inline-block text-sm text-primary hover:underline">
                Size Guide
              </Link>
            </div>

            <div className="flex items-center gap-3">
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
              <Button className="flex-1 gap-2 rounded-full">
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>
                    {product.stock_quantity > 0 ? (
                      <>
                        <span className="font-medium text-green-600">In Stock</span> - Free shipping on orders over $100
                      </>
                    ) : (
                      <span className="font-medium text-red-600">Out of Stock</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>30-day returns policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="features" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              <ul className="grid gap-2 text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Premium quality materials
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Handcrafted by expert artisans
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Cushioned insoles for all-day comfort
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Durable construction
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Breathable materials
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Slip-resistant outsole
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">SKU</div>
                <div className="text-muted-foreground">{product.sku}</div>
                <div className="font-medium">Category</div>
                <div className="text-muted-foreground">{product.category.name}</div>
                <div className="font-medium">Material</div>
                <div className="text-muted-foreground">Premium Quality</div>
                <div className="font-medium">Care Instructions</div>
                <div className="text-muted-foreground">Clean with a soft, dry cloth. Store in a cool, dry place.</div>
                <div className="font-medium">Heel Height</div>
                <div className="text-muted-foreground">Approximately 3 inches</div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  We offer free standard shipping on all orders over $100. For orders under $100, a flat shipping rate
                  of $9.95 applies.
                </p>
                <p>
                  Standard shipping typically takes 3-5 business days. Express shipping is available at checkout for an
                  additional fee and typically takes 1-2 business days.
                </p>
                <p>
                  We currently ship to the United States and Canada. International shipping is not available at this
                  time.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section id="reviews" className="mt-16 scroll-mt-16">
        <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating.average) ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{rating.average.toFixed(1)} out of 5</span>
            </div>
            <p className="text-muted-foreground">Based on {rating.count} reviews</p>
            <div className="space-y-2">
              {Object.entries(rating.distribution)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([stars, count]) => {
                  const percentage = rating.count > 0 ? (count / rating.count) * 100 : 0
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-8 text-sm">{stars} ★</span>
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-8 text-right text-sm">{Math.round(percentage)}%</span>
                    </div>
                  )
                })}
            </div>
            <Button className="w-full rounded-full">Write a Review</Button>
          </div>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {review.user.first_name} {review.user.last_name?.charAt(0) || ""}
                      </h4>
                      {review.is_verified_purchase && (
                        <p className="text-xs text-muted-foreground">Verified Purchase</p>
                      )}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && <h5 className="mb-1 font-medium">{review.title}</h5>}
                  <p className="text-sm text-muted-foreground">{review.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
            {reviews.length > 0 && (
              <Button variant="outline" className="w-full rounded-full">
                View All Reviews
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  )
}
