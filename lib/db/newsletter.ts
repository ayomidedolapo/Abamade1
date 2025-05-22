"use server"

import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"

export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"]

export async function subscribeToNewsletter(
  formData: FormData,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const email = formData.get("email") as string

    if (!email) {
      return { success: false, message: "Email is required", error: "Email is required" }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address", error: "Invalid email format" }
    }

    const supabase = createServerClient()

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking existing subscriber:", checkError)
      return { success: false, message: "An error occurred. Please try again.", error: checkError.message }
    }

    if (existingSubscriber) {
      // If already subscribed but not active, update to active
      if (!existingSubscriber.is_subscribed) {
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ is_subscribed: true, updated_at: new Date().toISOString() })
          .eq("id", existingSubscriber.id)

        if (updateError) {
          console.error("Error updating subscriber:", updateError)
          return { success: false, message: "An error occurred. Please try again.", error: updateError.message }
        }

        return { success: true, message: "Welcome back! You've been resubscribed to our newsletter." }
      }

      return { success: true, message: "You're already subscribed to our newsletter!" }
    }

    // Add new subscriber
    const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
      email,
      is_subscribed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error adding subscriber:", insertError)
      return { success: false, message: "An error occurred. Please try again.", error: insertError.message }
    }

    return { success: true, message: "Thank you for subscribing to our newsletter!" }
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function unsubscribeFromNewsletter(
  email: string,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    if (!email) {
      return { success: false, message: "Email is required", error: "Email is required" }
    }

    const supabase = createServerClient()

    // Check if email exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError) {
      console.error("Error checking existing subscriber:", checkError)
      return { success: false, message: "Email not found in our subscription list.", error: checkError.message }
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({ is_subscribed: false, updated_at: new Date().toISOString() })
      .eq("id", existingSubscriber.id)

    if (updateError) {
      console.error("Error unsubscribing:", updateError)
      return { success: false, message: "An error occurred. Please try again.", error: updateError.message }
    }

    return { success: true, message: "You have been successfully unsubscribed from our newsletter." }
  } catch (error) {
    console.error("Failed to unsubscribe from newsletter:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
