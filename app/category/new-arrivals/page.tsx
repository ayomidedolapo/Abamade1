import Link from "next/link"
import { ChevronRight, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/products/product-grid"
import { getProducts } from "@/lib/db/products"

interface NewArrivalsPageProps {
  searchParams: {
    sort?: string
    min?: string
    max?: string
  }
}

export const metadata = {
  title: "New Arrivals",
  description: "Discover our latest collection of premium handcrafted footwear.",
}

export default async function NewArrivalsPage({ searchParams }: NewArrivalsPageProps) {
  // Parse search params
  const sortBy = searchParams.sort as "price_asc" | "price_desc" | "newest" | "popular" | undefined
  const minPrice = searchParams.min ? Number.parseFloat(searchParams.min) : undefined
  const maxPrice = searchParams.max ? Number.parseFloat(searchParams.max) : undefined

  let products = []
  try {
    products = await getProducts({
      isNew: true,
      sortBy: sortBy || "newest",
      minPrice,
      maxPrice,
      limit: 24,
    })
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
  }

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">New Arrivals</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">New Arrivals</h1>
          <p className="mt-1 text-muted-foreground">Discover our latest collection of premium handcrafted footwear</p>
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
          <p className="text-lg font-medium">No new arrivals found</p>
          <p className="text-muted-foreground">Check back later for our latest products.</p>
        </div>
      )}
    </div>
  )
}
