import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { ProductGrid } from "@/components/products/product-grid"
import { getNewArrivals } from "@/lib/db/products"

export async function NewArrivalsSection() {
  let products = []
  try {
    products = await getNewArrivals(4)
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    // Products will be an empty array, and the ProductGrid component
    // should handle this gracefully
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">New Arrivals</h2>
            <p className="max-w-[600px] text-muted-foreground">The latest additions to our collection</p>
          </div>
          <Link href="/category/new-arrivals" className="flex items-center gap-1 text-sm font-medium">
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
