import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/products/product-grid"
import { getCategoryBySlug } from "@/lib/db/categories"
import { getProducts } from "@/lib/db/products"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    min?: string
    max?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  // Parse search params
  const sortBy = searchParams.sort as "price_asc" | "price_desc" | "newest" | "popular" | undefined
  const minPrice = searchParams.min ? Number.parseFloat(searchParams.min) : undefined
  const maxPrice = searchParams.max ? Number.parseFloat(searchParams.max) : undefined

  const products = await getProducts({
    categoryId: category.id,
    sortBy: sortBy || "newest",
    minPrice,
    maxPrice,
    limit: 12,
  })

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="mt-1 text-muted-foreground">{category.description}</p>}
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
