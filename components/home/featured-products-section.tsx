import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { ProductGrid } from "@/components/products/product-grid"
import { getFeaturedProducts } from "@/lib/db/products"

export async function FeaturedProductsSection() {
  let products = []
  try {
    products = await getFeaturedProducts(8)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    // Products will be an empty array, and the ProductGrid component
    // should handle this gracefully
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
            <p className="max-w-[600px] text-muted-foreground">Our selection of premium handcrafted footwear</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  )
}
