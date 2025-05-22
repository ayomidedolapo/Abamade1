import Link from "next/link"
import { ChevronRight, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/products/product-grid"
import { getProducts } from "@/lib/db/products"

interface ProductsPageProps {
  searchParams: {
    sort?: string
    min?: string
    max?: string
    search?: string
  }
}

export const metadata = {
  title: "All Products",
  description: "Browse our collection of premium handcrafted footwear.",
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse search params
  const sortBy = searchParams.sort as "price_asc" | "price_desc" | "newest" | "popular" | undefined
  const minPrice = searchParams.min ? Number.parseFloat(searchParams.min) : undefined
  const maxPrice = searchParams.max ? Number.parseFloat(searchParams.max) : undefined
  const search = searchParams.search

  let products = []
  try {
    products = await getProducts({
      sortBy: sortBy || "newest",
      minPrice,
      maxPrice,
      search,
      limit: 24,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">All Products</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-1 text-muted-foreground">Browse our collection of premium handcrafted footwear</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
          <select className="rounded-md border bg-background px-3 py-1 text-sm" defaultValue={sortBy || "newest"}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  )
}
