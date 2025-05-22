import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  images: Database["public"]["Tables"]["product_images"]["Row"][]
  category: Database["public"]["Tables"]["categories"]["Row"]
  variants?: (Database["public"]["Tables"]["product_variants"]["Row"] & {
    options?: Database["public"]["Tables"]["variant_options"]["Row"][]
  })[]
}

export type ProductWithDetails = Product & {
  reviews: {
    average_rating: number
    review_count: number
    distribution: Record<string, number>
  }
}

// Sample fallback data in case the database call fails
const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Stiletto Heels",
    slug: "elegant-stiletto-heels",
    description:
      "Classic stiletto heels perfect for formal occasions. Features a 4-inch heel and cushioned insole for comfort.",
    price: 129.99,
    sale_price: null,
    sku: "HEEL-STL-001",
    stock_quantity: 25,
    is_featured: true,
    is_new: true,
    is_published: true,
    category_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "1",
        product_id: "1",
        url: "/placeholder.svg?height=400&width=400&text=Elegant+Stiletto+Heels",
        alt: "Elegant Stiletto Heels",
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    category: {
      id: "1",
      name: "Heels",
      slug: "heels",
      description: "Elegant heels for any occasion",
      parent_id: null,
      gender: "women",
      image_url: "/placeholder.svg?height=400&width=400&text=Heels",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "2",
    name: "Comfortable Ballet Flats",
    slug: "comfortable-ballet-flats",
    description: "Soft leather ballet flats with memory foam insoles for all-day comfort.",
    price: 79.99,
    sale_price: null,
    sku: "FLAT-BLT-001",
    stock_quantity: 40,
    is_featured: true,
    is_new: false,
    is_published: true,
    category_id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "2",
        product_id: "2",
        url: "/placeholder.svg?height=400&width=400&text=Comfortable+Ballet+Flats",
        alt: "Comfortable Ballet Flats",
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    category: {
      id: "2",
      name: "Flats",
      slug: "flats",
      description: "Comfortable flats for everyday wear",
      parent_id: null,
      gender: "women",
      image_url: "/placeholder.svg?height=400&width=400&text=Flats",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "3",
    name: "Summer Strappy Sandals",
    slug: "summer-strappy-sandals",
    description: "Lightweight sandals with adjustable straps, perfect for summer days.",
    price: 89.99,
    sale_price: 69.99,
    sku: "SNDL-STP-001",
    stock_quantity: 30,
    is_featured: false,
    is_new: true,
    is_published: true,
    category_id: "3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "3",
        product_id: "3",
        url: "/placeholder.svg?height=400&width=400&text=Summer+Strappy+Sandals",
        alt: "Summer Strappy Sandals",
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    category: {
      id: "3",
      name: "Sandals",
      slug: "sandals",
      description: "Stylish sandals for warm weather",
      parent_id: null,
      gender: "women",
      image_url: "/placeholder.svg?height=400&width=400&text=Sandals",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "4",
    name: "Ankle Leather Boots",
    slug: "ankle-leather-boots",
    description: "Stylish ankle boots made from genuine leather with a comfortable block heel.",
    price: 149.99,
    sale_price: null,
    sku: "BOOT-ANK-001",
    stock_quantity: 20,
    is_featured: true,
    is_new: false,
    is_published: true,
    category_id: "4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "4",
        product_id: "4",
        url: "/placeholder.svg?height=400&width=400&text=Ankle+Leather+Boots",
        alt: "Ankle Leather Boots",
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    category: {
      id: "4",
      name: "Boots",
      slug: "boots",
      description: "Fashionable boots for cooler weather",
      parent_id: null,
      gender: "women",
      image_url: "/placeholder.svg?height=400&width=400&text=Boots",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
]

export async function getProducts(options?: {
  limit?: number
  offset?: number
  categoryId?: string
  featured?: boolean
  isNew?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular"
}): Promise<Product[]> {
  const {
    limit = 10,
    offset = 0,
    categoryId,
    featured,
    isNew,
    search,
    minPrice,
    maxPrice,
    sortBy = "newest",
  } = options || {}

  try {
    const supabase = createServerClient()

    // Try to fetch products with a join query
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          images:product_images(*),
          category:categories(*)
        `)
        .eq("is_published", true)

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured)
      }

      if (isNew !== undefined) {
        query = query.eq("is_new", isNew)
      }

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice)
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice)
      }

      // Apply sorting
      switch (sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true })
          break
        case "price_desc":
          query = query.order("price", { ascending: false })
          break
        case "popular":
          query = query.order("is_featured", { ascending: false })
          break
        case "newest":
        default:
          query = query.order("created_at", { ascending: false })
      }

      query = query.range(offset, offset + limit - 1)

      const { data, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      return data as Product[]
    } catch (queryError) {
      console.error("Error fetching products with join:", queryError)

      // If the join query fails, try a simpler approach
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .range(offset, offset + limit - 1)

      if (productsError) {
        throw productsError
      }

      // Fetch related data separately for each product
      const products = await Promise.all(
        productsData.map(async (product) => {
          // Fetch images
          const { data: imagesData } = await supabase.from("product_images").select("*").eq("product_id", product.id)

          // Fetch category
          const { data: categoryData } = await supabase
            .from("categories")
            .select("*")
            .eq("id", product.category_id)
            .single()

          return {
            ...product,
            images: imagesData || [],
            category: categoryData || null,
          } as Product
        }),
      )

      return products
    }
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return fallbackProducts.slice(0, limit)
  }
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  try {
    const supabase = createServerClient()

    // Try to fetch the product with a join query
    const { data, error: queryError } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        variants:product_variants(*, options:variant_options(*))
      `)
      .eq("id", id)
      .eq("is_published", true)
      .single()

    if (queryError) {
      console.error("Error fetching product:", queryError)
      const fallbackProduct = fallbackProducts.find((p) => p.id === id)
      if (!fallbackProduct) return null

      return {
        ...fallbackProduct,
        reviews: {
          average_rating: 4.5,
          review_count: 12,
          distribution: {
            "5": 8,
            "4": 3,
            "3": 1,
            "2": 0,
            "1": 0,
          },
        },
      }
    }

    // Get reviews summary
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", id)
      .eq("is_published", true)

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError)
    }

    const reviews = reviewsData || []
    const reviewCount = reviews.length
    const averageRating = reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0

    // Calculate rating distribution
    const distribution: Record<string, number> = {
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0,
    }

    reviews.forEach((review) => {
      const rating = review.rating.toString()
      distribution[rating] = (distribution[rating] || 0) + 1
    })

    return {
      ...(data as Product),
      reviews: {
        average_rating: averageRating,
        review_count: reviewCount,
        distribution,
      },
    }
  } catch (error) {
    console.error("Failed to fetch product by ID:", error)
    const fallbackProduct = fallbackProducts.find((p) => p.id === id)
    if (!fallbackProduct) return null

    return {
      ...fallbackProduct,
      reviews: {
        average_rating: 4.5,
        review_count: 12,
        distribution: {
          "5": 8,
          "4": 3,
          "3": 1,
          "2": 0,
          "1": 0,
        },
      },
    }
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const supabase = createServerClient()

    // Try to fetch the product with a join query
    const { data, error: queryError } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        variants:product_variants(*, options:variant_options(*))
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (queryError) {
      console.error("Error fetching product:", queryError)
      const fallbackProduct = fallbackProducts.find((p) => p.slug === slug)
      if (!fallbackProduct) return null

      return {
        ...fallbackProduct,
        reviews: {
          average_rating: 4.5,
          review_count: 12,
          distribution: {
            "5": 8,
            "4": 3,
            "3": 1,
            "2": 0,
            "1": 0,
          },
        },
      }
    }

    // Get reviews summary
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", data.id)
      .eq("is_published", true)

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError)
    }

    const reviews = reviewsData || []
    const reviewCount = reviews.length
    const averageRating = reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0

    // Calculate rating distribution
    const distribution: Record<string, number> = {
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0,
    }

    reviews.forEach((review) => {
      const rating = review.rating.toString()
      distribution[rating] = (distribution[rating] || 0) + 1
    })

    return {
      ...(data as Product),
      reviews: {
        average_rating: averageRating,
        review_count: reviewCount,
        distribution,
      },
    }
  } catch (error) {
    console.error("Failed to fetch product by slug:", error)
    const fallbackProduct = fallbackProducts.find((p) => p.slug === slug)
    if (!fallbackProduct) return null

    return {
      ...fallbackProduct,
      reviews: {
        average_rating: 4.5,
        review_count: 12,
        distribution: {
          "5": 8,
          "4": 3,
          "3": 1,
          "2": 0,
          "1": 0,
        },
      },
    }
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  try {
    const supabase = createServerClient()

    const { data, error: queryError } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        category:categories(*)
      `)
      .eq("category_id", categoryId)
      .eq("is_published", true)
      .neq("id", productId)
      .limit(limit)

    if (queryError) {
      console.error("Error fetching related products:", queryError)
      return fallbackProducts.filter((p) => p.category_id === categoryId && p.id !== productId).slice(0, limit)
    }

    return data as Product[]
  } catch (error) {
    console.error("Failed to fetch related products:", error)
    return fallbackProducts.filter((p) => p.category_id === categoryId && p.id !== productId).slice(0, limit)
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return getProducts({ featured: true, limit })
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return getProducts({ isNew: true, limit, sortBy: "newest" })
}

export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  return getProducts({ search: query, limit })
}
