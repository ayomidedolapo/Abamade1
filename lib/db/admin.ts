import { createServerClient } from "../supabase/server"
import type { Database } from "@/types/database.types"
import type { Product } from "./products"
import type { Category } from "./categories"
import type { Order } from "./orders"
import type { User } from "./users"

// Products
export async function adminCreateProduct(productData: {
  name: string
  slug: string
  description?: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  is_featured?: boolean
  is_new?: boolean
  is_published?: boolean
  category_id: string
}): Promise<Product> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("products").insert(productData).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }

  return data as Product
}

export async function adminUpdateProduct(
  id: string,
  productData: {
    name?: string
    slug?: string
    description?: string
    price?: number
    sale_price?: number
    sku?: string
    stock_quantity?: number
    is_featured?: boolean
    is_new?: boolean
    is_published?: boolean
    category_id?: string
  },
): Promise<Product> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }

  return data as Product
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

export async function adminAddProductImage(
  productId: string,
  imageData: {
    url: string
    alt?: string
    is_primary?: boolean
  },
): Promise<Database["public"]["Tables"]["product_images"]["Row"]> {
  const supabase = createServerClient()

  // If this is the primary image, unset any existing primary
  if (imageData.is_primary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId)
      .eq("is_primary", true)
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url: imageData.url,
      alt: imageData.alt,
      is_primary: imageData.is_primary,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding product image:", error)
    throw new Error("Failed to add product image")
  }

  return data
}

export async function adminDeleteProductImage(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("product_images").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product image:", error)
    throw new Error("Failed to delete product image")
  }
}

// Categories
export async function adminCreateCategory(categoryData: {
  name: string
  slug: string
  description?: string
  parent_id?: string
  gender?: string
  image_url?: string
}): Promise<Category> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

  if (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }

  return data as Category
}

export async function adminUpdateCategory(
  id: string,
  categoryData: {
    name?: string
    slug?: string
    description?: string
    parent_id?: string
    gender?: string
    image_url?: string
  },
): Promise<Category> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }

  return data as Category
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }
}

// Orders
export async function adminGetAllOrders(options?: {
  limit?: number
  offset?: number
  status?: string
  sortBy?: "newest" | "oldest" | "highest" | "lowest"
}): Promise<Order[]> {
  const { limit = 10, offset = 0, status, sortBy = "newest" } = options || {}

  const supabase = createServerClient()

  let query = supabase.from("orders").select(`
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

  if (status) {
    query = query.eq("status", status)
  }

  // Apply sorting
  switch (sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "highest":
      query = query.order("total", { ascending: false })
      break
    case "lowest":
      query = query.order("total", { ascending: true })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }

  return data as Order[]
}

// Users
export async function adminGetAllUsers(options?: {
  limit?: number
  offset?: number
  role?: string
  search?: string
}): Promise<User[]> {
  const { limit = 10, offset = 0, role, search } = options || {}

  const supabase = createServerClient()

  let query = supabase.from("users").select("*")

  if (role) {
    query = query.eq("role", role)
  }

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data as User[]
}

export async function adminUpdateUserRole(id: string, role: string): Promise<User> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("users").update({ role }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating user role:", error)
    throw new Error("Failed to update user role")
  }

  return data as User
}

// Dashboard stats
export async function adminGetDashboardStats(): Promise<{
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: Order[]
  topProducts: {
    product: Product
    total_sold: number
    revenue: number
  }[]
  salesByDay: {
    date: string
    total: number
    orders: number
  }[]
}> {
  const supabase = createServerClient()

  // Get total sales
  const { data: salesData, error: salesError } = await supabase.from("orders").select("total").eq("status", "completed")

  if (salesError) {
    console.error("Error fetching sales data:", salesError)
    throw new Error("Failed to fetch sales data")
  }

  const totalSales = salesData.reduce((sum, order) => sum + order.total, 0)

  // Get total orders
  const { count: totalOrders, error: ordersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  if (ordersError) {
    console.error("Error counting orders:", ordersError)
    throw new Error("Failed to count orders")
  }

  // Get total customers
  const { count: totalCustomers, error: customersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer")

  if (customersError) {
    console.error("Error counting customers:", customersError)
    throw new Error("Failed to count customers")
  }

  // Get total products
  const { count: totalProducts, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  if (productsError) {
    console.error("Error counting products:", productsError)
    throw new Error("Failed to count products")
  }

  // Get recent orders
  const { data: recentOrders, error: recentOrdersError } = await supabase
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
    .limit(5)

  if (recentOrdersError) {
    console.error("Error fetching recent orders:", recentOrdersError)
    throw new Error("Failed to fetch recent orders")
  }

  // Get top products
  const { data: topProductsData, error: topProductsError } = await supabase.rpc("get_top_products", {
    limit_count: 5,
  })

  if (topProductsError) {
    console.error("Error fetching top products:", topProductsError)
    throw new Error("Failed to fetch top products")
  }

  // Get product details for top products
  const topProducts = []
  for (const item of topProductsData) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        category:categories(*)
      `)
      .eq("id", item.product_id)
      .single()

    if (!productError && product) {
      topProducts.push({
        product: product as Product,
        total_sold: item.total_sold,
        revenue: item.revenue,
      })
    }
  }

  // Get sales by day for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: salesByDay, error: salesByDayError } = await supabase.rpc("get_sales_by_day", {
    start_date: thirtyDaysAgo.toISOString(),
  })

  if (salesByDayError) {
    console.error("Error fetching sales by day:", salesByDayError)
    throw new Error("Failed to fetch sales by day")
  }

  return {
    totalSales,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalProducts: totalProducts || 0,
    recentOrders: recentOrders as Order[],
    topProducts,
    salesByDay,
  }
}
