import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"

export type User = Database["public"]["Tables"]["users"]["Row"]
export type Address = Database["public"]["Tables"]["addresses"]["Row"]
export type UserPreferences = {
  marketing_emails: boolean
  order_updates: boolean
  newsletter: boolean
  product_updates: boolean
}

export async function getUserById(id: string): Promise<User | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data as User
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Add the missing export
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  // Default preferences if not found
  const defaultPreferences: UserPreferences = {
    marketing_emails: true,
    order_updates: true,
    newsletter: true,
    product_updates: true,
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle()

    if (error || !data) {
      console.error("Error fetching user preferences:", error)
      return defaultPreferences
    }

    return {
      marketing_emails: data.marketing_emails ?? true,
      order_updates: data.order_updates ?? true,
      newsletter: data.newsletter ?? true,
      product_updates: data.product_updates ?? true,
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return defaultPreferences
  }
}

export async function createOrUpdateUser(userData: {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role?: string
}): Promise<User> {
  const supabase = createServerClient()

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userData.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking user:", fetchError)
      throw new Error("Failed to check user")
    }

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        })
        .eq("id", userData.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating user:", error)
        throw new Error("Failed to update user")
      }

      return data as User
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role || "customer",
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        throw new Error("Failed to create user")
      }

      return data as User
    }
  } catch (error) {
    console.error("Error creating or updating user:", error)
    throw new Error("Failed to create or update user")
  }
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })

    if (error) {
      console.error("Error fetching addresses:", error)
      return []
    }

    return data as Address[]
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return []
  }
}

export async function getAddressById(id: string, userId: string): Promise<Address | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("addresses").select("*").eq("id", id).eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching address:", error)
      return null
    }

    return data as Address
  } catch (error) {
    console.error("Error fetching address:", error)
    return null
  }
}

export async function createAddress(addressData: {
  user_id: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default?: boolean
}): Promise<Address> {
  const supabase = createServerClient()

  try {
    // If this is the default address, unset any existing default
    if (addressData.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", addressData.user_id)
        .eq("is_default", true)
    }

    const { data, error } = await supabase.from("addresses").insert(addressData).select().single()

    if (error) {
      console.error("Error creating address:", error)
      throw new Error("Failed to create address")
    }

    return data as Address
  } catch (error) {
    console.error("Error creating address:", error)
    throw new Error("Failed to create address")
  }
}

export async function updateAddress(
  id: string,
  userId: string,
  addressData: {
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    is_default?: boolean
  },
): Promise<Address> {
  const supabase = createServerClient()

  try {
    // If this is the default address, unset any existing default
    if (addressData.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId)
        .eq("is_default", true)
        .neq("id", id)
    }

    const { data, error } = await supabase
      .from("addresses")
      .update(addressData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating address:", error)
      throw new Error("Failed to update address")
    }

    return data as Address
  } catch (error) {
    console.error("Error updating address:", error)
    throw new Error("Failed to update address")
  }
}

export async function deleteAddress(id: string, userId: string): Promise<void> {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting address:", error)
      throw new Error("Failed to delete address")
    }
  } catch (error) {
    console.error("Error deleting address:", error)
    throw new Error("Failed to delete address")
  }
}

export async function getDefaultAddress(userId: string): Promise<Address | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle()

    if (error) {
      console.error("Error fetching default address:", error)
      return null
    }

    return data as Address | null
  } catch (error) {
    console.error("Error fetching default address:", error)
    return null
  }
}
