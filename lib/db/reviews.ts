import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"

export type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  user: Database["public"]["Tables"]["users"]["Row"]
}

export async function getProductReviews(
  productId: string,
  options?: {
    limit?: number
    offset?: number
    sortBy?: "newest" | "highest" | "lowest"
  },
): Promise<Review[]> {
  const { limit = 10, offset = 0, sortBy = "newest" } = options || {}

  try {
    const supabase = createServerClient()

    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        user:users(*)
      `,
      )
      .eq("product_id", productId)
      .eq("is_published", true)

    // Apply sorting
    switch (sortBy) {
      case "highest":
        query = query.order("rating", { ascending: false })
        break
      case "lowest":
        query = query.order("rating", { ascending: true })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching product reviews:", error)
      return []
    }

    return data as Review[]
  } catch (error) {
    console.error("Failed to fetch product reviews:", error)
    return []
  }
}

export async function getProductRating(productId: string): Promise<{
  average: number
  count: number
  distribution: Record<string, number>
}> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("is_published", true)

    if (error) {
      console.error("Error fetching product ratings:", error)
      return {
        average: 0,
        count: 0,
        distribution: {
          "5": 0,
          "4": 0,
          "3": 0,
          "2": 0,
          "1": 0,
        },
      }
    }

    const reviews = data || []
    const count = reviews.length
    const average = count > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0

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
      average,
      count,
      distribution,
    }
  } catch (error) {
    console.error("Failed to fetch product rating:", error)
    return {
      average: 0,
      count: 0,
      distribution: {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0,
      },
    }
  }
}

export async function createReview(review: {
  product_id: string
  user_id: string
  rating: number
  title?: string
  content?: string
  is_verified_purchase?: boolean
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("reviews").insert({
      ...review,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating review:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to create review:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
