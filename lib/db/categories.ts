import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"

export type Category = Database["public"]["Tables"]["categories"]["Row"]

// Sample fallback data in case the database call fails
const fallbackCategories: Category[] = [
  {
    id: "1",
    name: "Heels",
    slug: "heels",
    description: "Elegant heels for any occasion",
    parent_id: null,
    gender: "women",
    image_url: "/placeholder.svg?height=400&width=400",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Flats",
    slug: "flats",
    description: "Comfortable flats for everyday wear",
    parent_id: null,
    gender: "women",
    image_url: "/placeholder.svg?height=400&width=400",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sandals",
    slug: "sandals",
    description: "Stylish sandals for warm weather",
    parent_id: null,
    gender: "women",
    image_url: "/placeholder.svg?height=400&width=400",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Boots",
    slug: "boots",
    description: "Fashionable boots for cooler weather",
    parent_id: null,
    gender: "women",
    image_url: "/placeholder.svg?height=400&width=400",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Sneakers",
    slug: "sneakers",
    description: "Trendy sneakers for casual wear",
    parent_id: null,
    gender: "women",
    image_url: "/placeholder.svg?height=400&width=400",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getCategories(options?: {
  parentId?: string | null
  gender?: string | null
}): Promise<Category[]> {
  const { parentId, gender } = options || {}

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.error("Supabase client not initialized")
      return filterFallbackCategories(parentId, gender)
    }

    let query = supabase.from("categories").select("*")

    if (parentId !== undefined) {
      query = parentId === null ? query.is("parent_id", null) : query.eq("parent_id", parentId)
    }

    if (gender) {
      query = query.eq("gender", gender)
    }

    query = query.order("name")

    const { data, error } = await query

    if (error) {
      console.error("Error fetching categories:", error)
      return filterFallbackCategories(parentId, gender)
    }

    return data as Category[]
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return filterFallbackCategories(parentId, gender)
  }
}

// Helper function to filter fallback categories based on the same criteria
function filterFallbackCategories(parentId?: string | null, gender?: string | null): Category[] {
  let filtered = [...fallbackCategories]

  if (parentId !== undefined) {
    filtered =
      parentId === null
        ? filtered.filter((cat) => cat.parent_id === null)
        : filtered.filter((cat) => cat.parent_id === parentId)
  }

  if (gender) {
    filtered = filtered.filter((cat) => cat.gender === gender)
  }

  return filtered
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.error("Supabase client not initialized")
      return fallbackCategories.find((cat) => cat.slug === slug) || null
    }

    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching category:", error)
      return fallbackCategories.find((cat) => cat.slug === slug) || null
    }

    return data as Category
  } catch (error) {
    console.error("Failed to fetch category by slug:", error)
    return fallbackCategories.find((cat) => cat.slug === slug) || null
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.error("Supabase client not initialized")
      return fallbackCategories.find((cat) => cat.id === id) || null
    }

    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching category:", error)
      return fallbackCategories.find((cat) => cat.id === id) || null
    }

    return data as Category
  } catch (error) {
    console.error("Failed to fetch category by id:", error)
    return fallbackCategories.find((cat) => cat.id === id) || null
  }
}

export async function getMainCategories(gender?: string): Promise<Category[]> {
  return getCategories({ parentId: null, gender })
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return getCategories({ parentId })
}

export async function getWomenCategories(): Promise<Category[]> {
  return getCategories({ gender: "women" })
}

export async function getMenCategories(): Promise<Category[]> {
  return getCategories({ gender: "men" })
}
