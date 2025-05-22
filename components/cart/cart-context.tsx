"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

import { useToast } from "@/components/ui/use-toast"
import type { CartItem, Product, ProductVariant } from "@/types/database.types"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isLoading: boolean
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: true,
  addItem: async () => {},
  updateItemQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
})

export function useCart() {
  const context = useContext(CartContext)
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Calculate derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => {
    const price = item.product.sale_price || item.product.price
    return total + price * item.quantity
  }, 0)

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true)

      try {
        // Check if user is authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Get or create session ID for anonymous cart
        let cartSessionId = localStorage.getItem("cart_session_id")
        if (!cartSessionId) {
          cartSessionId = uuidv4()
          localStorage.setItem("cart_session_id", cartSessionId)
        }
        setSessionId(cartSessionId)

        // Fetch cart items
        let query = supabase.from("cart_items").select(`
          *,
          product:products(
            *,
            images:product_images(*),
            category:categories(*)
          ),
          variant:product_variants(*)
        `)

        if (session?.user) {
          // Fetch user's cart
          query = query.eq("user_id", session.user.id)

          // If we have a session ID, merge anonymous cart with user cart
          if (cartSessionId) {
            await supabase.rpc("merge_carts", {
              p_user_id: session.user.id,
              p_session_id: cartSessionId,
            })

            // Clear session ID after merging
            localStorage.removeItem("cart_session_id")
            setSessionId(null)
          }
        } else if (cartSessionId) {
          // Fetch anonymous cart
          query = query.eq("session_id", cartSessionId)
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setItems(data as CartItem[])
      } catch (error) {
        console.error("Error initializing cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initCart()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      initCart()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Add item to cart
  const addItem = async (product: Product, quantity: number, variant?: ProductVariant) => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id

      // Check if item already exists in cart
      const existingItemIndex = items.findIndex(
        (item) => item.product_id === product.id && (variant ? item.variant_id === variant.id : !item.variant_id),
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...items]
        updatedItems[existingItemIndex].quantity += quantity

        // Update in database
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: updatedItems[existingItemIndex].quantity })
          .eq("id", updatedItems[existingItemIndex].id)

        if (error) {
          throw error
        }

        setItems(updatedItems)
      } else {
        // Add new item
        const newItem = {
          id: uuidv4(),
          user_id: userId || null,
          session_id: !userId ? sessionId : null,
          product_id: product.id,
          variant_id: variant?.id || null,
          quantity,
          product,
          variant,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Add to database
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId || null,
            session_id: !userId ? sessionId : null,
            product_id: product.id,
            variant_id: variant?.id || null,
            quantity,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        // Update local state with the returned item
        newItem.id = data.id
        setItems([...items, newItem])
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update item quantity
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeItem(itemId)
    }

    setIsLoading(true)

    try {
      const updatedItems = items.map((item) => (item.id === itemId ? { ...item, quantity } : item))

      // Update in database
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      if (error) {
        throw error
      }

      setItems(updatedItems)
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    setIsLoading(true)

    try {
      const updatedItems = items.filter((item) => item.id !== itemId)

      // Remove from database
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) {
        throw error
      }

      setItems(updatedItems)

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id

      // Clear from database
      let query = supabase.from("cart_items").delete()

      if (userId) {
        query = query.eq("user_id", userId)
      } else if (sessionId) {
        query = query.eq("session_id", sessionId)
      } else {
        // Nothing to clear
        return
      }

      const { error } = await query

      if (error) {
        throw error
      }

      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
