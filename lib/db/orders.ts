import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"
import type { Product } from "./products"

export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    product: Product
    variant?: Database["public"]["Tables"]["product_variants"]["Row"]
  })[]
  shipping_address?: Database["public"]["Tables"]["addresses"]["Row"]
  billing_address?: Database["public"]["Tables"]["addresses"]["Row"]
}

export async function getOrders(userId: string): Promise<Order[]> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(*),
            category:categories(*)
          ),
          variant:product_variants(*)
        ),
        shipping_address:addresses!shipping_address_id(*),
        billing_address:addresses!billing_address_id(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return []
    }

    return data as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Add the missing export
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return getOrders(userId)
}

export async function getOrderById(id: string, userId?: string): Promise<Order | null> {
  const supabase = createServerClient()

  try {
    let query = supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(*),
            category:categories(*)
          ),
          variant:product_variants(*)
        ),
        shipping_address:addresses!shipping_address_id(*),
        billing_address:addresses!billing_address_id(*)
      `)
      .eq("id", id)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function createOrder(orderData: {
  user_id?: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  payment_intent_id?: string
  shipping_address_id?: string
  billing_address_id?: string
  items: {
    product_id: string
    variant_id?: string
    quantity: number
    price: number
  }[]
}): Promise<string> {
  const supabase = createServerClient()

  try {
    // Start a transaction
    // Note: Supabase doesn't support true transactions in the client library
    // In a real app, you might want to use a stored procedure for this

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        status: orderData.status,
        total: orderData.total,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        discount: orderData.discount,
        payment_intent_id: orderData.payment_intent_id,
        shipping_address_id: orderData.shipping_address_id,
        billing_address_id: orderData.billing_address_id,
      })
      .select("id")
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      throw new Error("Failed to create order")
    }

    // 2. Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // In a real app, you would roll back the order here
      throw new Error("Failed to create order items")
    }

    // 3. Update product inventory (decrement stock)
    for (const item of orderData.items) {
      if (item.variant_id) {
        // Update variant stock
        const { error: variantError } = await supabase.rpc("decrement_variant_stock", {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity,
        })

        if (variantError) {
          console.error("Error updating variant stock:", variantError)
          // In a real app, you would roll back the order here
        }
      } else {
        // Update product stock
        const { error: productError } = await supabase.rpc("decrement_product_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })

        if (productError) {
          console.error("Error updating product stock:", productError)
          // In a real app, you would roll back the order here
        }
      }
    }

    return order.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export async function updateOrderStatus(orderId: string, status: string, paymentIntentId?: string): Promise<void> {
  const supabase = createServerClient()

  try {
    const updates: any = { status }
    if (paymentIntentId) {
      updates.payment_intent_id = paymentIntentId
    }

    const { error } = await supabase.from("orders").update(updates).eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      throw new Error("Failed to update order status")
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}

export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(*),
            category:categories(*)
          ),
          variant:product_variants(*)
        ),
        shipping_address:addresses!shipping_address_id(*),
        billing_address:addresses!billing_address_id(*)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders by status:", error)
      return []
    }

    return data as Order[]
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    return []
  }
}

export async function getRecentOrders(limit = 10): Promise<Order[]> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(*),
            category:categories(*)
          ),
          variant:product_variants(*)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent orders:", error)
      return []
    }

    return data as Order[]
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return []
  }
}
