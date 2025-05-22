"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface UpdateUserProfileParams {
  id: string
  first_name: string
  last_name: string
  phone?: string
}

export async function updateUserProfile({ id, first_name, last_name, phone }: UpdateUserProfileParams) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("users")
    .update({
      first_name,
      last_name,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update profile")
  }

  revalidatePath("/account")
  return { success: true }
}

export async function updateUserPassword(userId: string, password: string) {
  const supabase = createServerClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error("Error updating password:", error)
    throw new Error("Failed to update password")
  }

  return { success: true }
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    marketing_emails: boolean
    order_updates: boolean
    newsletter: boolean
  },
) {
  const supabase = createServerClient()

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      marketing_emails: preferences.marketing_emails,
      order_updates: preferences.order_updates,
      newsletter: preferences.newsletter,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )

  if (error) {
    console.error("Error updating notification preferences:", error)
    throw new Error("Failed to update notification preferences")
  }

  revalidatePath("/account/settings")
  return { success: true }
}
