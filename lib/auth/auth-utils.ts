import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export async function getSession() {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return null
    }

    return session
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession()
    return session?.user ?? null
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (error || data?.role !== "admin") {
      redirect("/")
    }

    return user
  } catch (error) {
    console.error("Failed to check admin role:", error)
    redirect("/")
  }
}
