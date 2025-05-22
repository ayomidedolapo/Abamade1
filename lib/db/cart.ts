import { cookies } from "next/headers"
import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"
import type { Product } from "./products"

export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"] & {
  product: Product
  variant?: Database["public"]["Tables"]["product_variants"]["Row"]
}

export async function getCart(userId?: string): Promise<CartItem[]> {
  const supabase = createServerClient()

  // Get session ID from cookies if no user ID
  let sessionId: string | undefined
  if (!userId) {
    const cookieStore = cookies()
    sessionId = cookieStore.get("cart_session_id")?.value

    if (!sessionId) {
      return []
    }
  }

  let query = supabase.from("cart_items").select(`
      *,
      product:products(
        *,
        images:product_images(*),
        category:categories(*)
      ),
      variant:product_variants(*)
    `)

  if (userId) {
    query = query.eq("user_id", userId)
  } else if (sessionId) {
    query = query.eq("session_id", sessionId)
  } else {
    return []
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching cart:", error)
    throw new Error("Failed to fetch cart")
  }

  return data as CartItem[]
}

export async function addToCart(
  productId: string,
  quantity: number,
  variantId?: string,
  userId?: string,
): Promise<void> {
  const supabase = createServerClient()

  // Get or create session ID if no user ID
  let sessionId: string | undefined
  if (!userId) {
    const cookieStore = cookies()
    sessionId = cookieStore.get("cart_session_id")?.value

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      // In a real implementation, you'd set the cookie here
      // but we can't modify cookies in a server component directly
    }
  }

  // Check if item already exists in cart
  let query = supabase.from("cart_items").select("*")

  if (userId) {
    query = query.eq("user_id", userId)
  } else if (sessionId) {
    query = query.eq("session_id", sessionId)
  }

  query = query.eq("product_id", productId)

  if (variantId) {
    query = query.eq("variant_id", variantId)
  } else {
    query = query.is("variant_id", null)
  }

  const { data: existingItem, error: fetchError } = await query.maybeSingle()

  if (fetchError) {
    console.error("Error checking cart:", fetchError)
    throw new Error("Failed to check cart")
  }

  if (existingItem) {
    // Update quantity of existing item
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)

    if (updateError) {
      console.error("Error updating cart:", updateError)
      throw new Error("Failed to update cart")
    }
  } else {
    // Add new item to cart
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: userId,
      session_id: sessionId,
      product_id: productId,
      variant_id: variantId,
      quantity,
    })

    if (insertError) {
      console.error("Error adding to cart:", insertError)
      throw new Error("Failed to add to cart")
    }
  }
}

export async function updateCartItem(itemId: string, quantity: number, userId?: string): Promise<void> {
  const supabase = createServerClient()

  let query = supabase.from("cart_items").update({ quantity }).eq("id", itemId)

  if (userId) {
    query = query.eq("user_id", userId)
  } else {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("cart_session_id")?.value

    if (sessionId) {
      query = query.eq("session_id", sessionId)
    }
  }

  const { error } = await query

  if (error) {
    console.error("Error updating cart item:", error)
    throw new Error("Failed to update cart item")
  }
}

export async function removeCartItem(itemId: string, userId?: string): Promise<void> {
  const supabase = createServerClient()

  let query = supabase.from("cart_items").delete().eq("id", itemId)

  if (userId) {
    query = query.eq("user_id", userId)
  } else {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("cart_session_id")?.value

    if (sessionId) {
      query = query.eq("session_id", sessionId)
    }
  }

  const { error } = await query

  if (error) {
    console.error("Error removing cart item:", error)
    throw new Error("Failed to remove cart item")
  }
}

export async function clearCart(userId?: string): Promise<void> {
  const supabase = createServerClient()

  let query = supabase.from("cart_items").delete()

  if (userId) {
    query = query.eq("user_id", userId)
  } else {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("cart_session_id")?.value

    if (sessionId) {
      query = query.eq("session_id", sessionId)
    } else {
      return // Nothing to clear
    }
  }

  const { error } = await query

  if (error) {
    console.error("Error clearing cart:", error)
    throw new Error("Failed to clear cart")
  }
}

export async function mergeAnonymousCartWithUserCart(userId: string, sessionId: string): Promise<void> {
  const supabase = createServerClient()

  // Get anonymous cart items
  const { data: anonymousItems, error: fetchError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("session_id", sessionId)

  if (fetchError) {
    console.error("Error fetching anonymous cart:", fetchError)
    throw new Error("Failed to fetch anonymous cart")
  }

  if (!anonymousItems || anonymousItems.length === 0) {
    return // No items to merge
  }

  // Get user's cart items
  const { data: userItems, error: userFetchError } = await supabase.from("cart_items").select("*").eq("user_id", userId)

  if (userFetchError) {
    console.error("Error fetching user cart:", userFetchError)
    throw new Error("Failed to fetch user cart")
  }

  const userItemsMap = new Map(
    (userItems || []).map((item) => [`${item.product_id}:${item.variant_id || "null"}`, item]),
  )

  // Begin transaction
  const { error: transactionError } = await supabase.rpc("merge_carts", {
    p_user_id: userId,
    p_session_id: sessionId,
  })

  if (transactionError) {
    console.error("Error merging carts:", transactionError)
    throw new Error("Failed to merge carts")
  }
}
