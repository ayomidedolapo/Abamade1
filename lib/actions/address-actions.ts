"use server"

import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { revalidatePath } from "next/cache"

export async function createAddress(data: {
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const supabase = createServerClient()

  // If this is the default address, unset any existing default
  if (data.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    address_line1: data.address_line1,
    address_line2: data.address_line2 || null,
    city: data.city,
    state: data.state,
    postal_code: data.postal_code,
    country: data.country,
    is_default: data.is_default,
  })

  if (error) {
    console.error("Error creating address:", error)
    throw new Error("Failed to create address")
  }

  revalidatePath("/account/addresses")
  return { success: true }
}

export async function updateAddress(
  addressId: string,
  data: {
    address_line1: string
    address_line2?: string
    city: string
    state: string
    postal_code: string
    country: string
    is_default: boolean
  },
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const supabase = createServerClient()

  // If this is the default address, unset any existing default
  if (data.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true)
      .neq("id", addressId)
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      is_default: data.is_default,
    })
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating address:", error)
    throw new Error("Failed to update address")
  }

  revalidatePath("/account/addresses")
  return { success: true }
}

export async function deleteAddress(addressId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const supabase = createServerClient()

  const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting address:", error)
    throw new Error("Failed to delete address")
  }

  revalidatePath("/account/addresses")
  return { success: true }
}
