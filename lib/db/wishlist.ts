import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"
import type { Product } from "./products"

export type WishlistItem = Database["public"]["Tables"]["wishlist_items"]["Row"] & {
  product: Product
}

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select(`
        *,
        product:products(
          *,
          images:product_images(*),
          category:categories(*)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlist:", error)
      return []
    }

    return data as WishlistItem[]
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }
}

// Add the missing export
export async function getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
  return getWishlist(userId)
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("wishlist_items").insert({
      user_id: userId,
      product_id: productId,
    })

    if (error && error.code !== "23505") {
      // Ignore unique constraint violations
      console.error("Error adding to wishlist:", error)
      throw new Error("Failed to add to wishlist")
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw new Error("Failed to add to wishlist")
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", productId)

    if (error) {
      console.error("Error removing from wishlist:", error)
      throw new Error("Failed to remove from wishlist")
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw new Error("Failed to remove from wishlist")
  }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle()

    if (error) {
      console.error("Error checking wishlist:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

export async function clearWishlist(userId: string): Promise<void> {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", userId)

    if (error) {
      console.error("Error clearing wishlist:", error)
      throw new Error("Failed to clear wishlist")
    }
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    throw new Error("Failed to clear wishlist")
  }
}
