import { createServerClient } from "../supabase/server"

// This function can be called from the API route or directly
export async function seedDatabase() {
  try {
    const supabase = createServerClient()

    console.log("Seeding database...")

    // Check if categories table exists and has data
    const { data: existingCategories, error: checkError } = await supabase.from("categories").select("count")

    if (
      checkError &&
      (checkError.message.includes("does not exist") ||
        checkError.message.includes("relation") ||
        checkError.code === "42P01")
    ) {
      console.log("Categories table doesn't exist yet, cannot seed")
      return { success: false, error: "Table doesn't exist" }
    }

    // Check if we already have data
    if (existingCategories && existingCategories.length > 0) {
      console.log("Database already has data, skipping seed")
      return { success: true, message: "Database already seeded" }
    }

    // Create categories
    console.log("Creating categories...")
    const categories = [
      {
        name: "Heels",
        slug: "heels",
        description: "Elegant heels for any occasion",
        gender: "women",
        image_url: "/placeholder.svg?height=400&width=400&text=Heels",
      },
      {
        name: "Flats",
        slug: "flats",
        description: "Comfortable flats for everyday wear",
        gender: "women",
        image_url: "/placeholder.svg?height=400&width=400&text=Flats",
      },
      {
        name: "Sandals",
        slug: "sandals",
        description: "Stylish sandals for warm weather",
        gender: "women",
        image_url: "/placeholder.svg?height=400&width=400&text=Sandals",
      },
      {
        name: "Boots",
        slug: "boots",
        description: "Fashionable boots for cooler weather",
        gender: "women",
        image_url: "/placeholder.svg?height=400&width=400&text=Boots",
      },
      {
        name: "Sneakers",
        slug: "sneakers",
        description: "Trendy sneakers for casual wear",
        gender: "women",
        image_url: "/placeholder.svg?height=400&width=400&text=Sneakers",
      },
    ]

    const categoryIds = {}

    for (const category of categories) {
      const { data, error } = await supabase.from("categories").insert(category).select().single()

      if (error) {
        console.error(`Error creating category ${category.name}:`, error)
      } else {
        console.log(`Created category: ${data.name}`)
        categoryIds[category.slug] = data.id
      }
    }

    // Create products
    console.log("Creating products...")
    const products = [
      {
        name: "Elegant Stiletto Heels",
        slug: "elegant-stiletto-heels",
        description:
          "Classic stiletto heels perfect for formal occasions. Features a 4-inch heel and cushioned insole for comfort.",
        price: 129.99,
        sku: "HEEL-STL-001",
        stock_quantity: 25,
        is_featured: true,
        is_new: true,
        category_id: categoryIds["heels"],
      },
      {
        name: "Comfortable Ballet Flats",
        slug: "comfortable-ballet-flats",
        description: "Soft leather ballet flats with memory foam insoles for all-day comfort.",
        price: 79.99,
        sku: "FLAT-BLT-001",
        stock_quantity: 40,
        is_featured: true,
        category_id: categoryIds["flats"],
      },
      {
        name: "Summer Strappy Sandals",
        slug: "summer-strappy-sandals",
        description: "Lightweight sandals with adjustable straps, perfect for summer days.",
        price: 89.99,
        sku: "SNDL-STP-001",
        stock_quantity: 30,
        is_new: true,
        category_id: categoryIds["sandals"],
      },
      {
        name: "Ankle Leather Boots",
        slug: "ankle-leather-boots",
        description: "Stylish ankle boots made from genuine leather with a comfortable block heel.",
        price: 149.99,
        sku: "BOOT-ANK-001",
        stock_quantity: 20,
        is_featured: true,
        category_id: categoryIds["boots"],
      },
      {
        name: "Casual Canvas Sneakers",
        slug: "casual-canvas-sneakers",
        description: "Lightweight canvas sneakers perfect for casual everyday wear.",
        price: 59.99,
        sku: "SNKR-CNV-001",
        stock_quantity: 50,
        is_new: true,
        category_id: categoryIds["sneakers"],
      },
    ]

    for (const product of products) {
      if (!product.category_id) {
        console.warn(`Skipping product ${product.name} due to missing category_id`)
        continue
      }

      const { data, error } = await supabase.from("products").insert(product).select().single()

      if (error) {
        console.error(`Error creating product ${product.name}:`, error)
      } else {
        console.log(`Created product: ${data.name}`)

        // Add product images
        const images = [
          {
            product_id: data.id,
            url: `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(data.name)}`,
            alt: data.name,
            is_primary: true,
          },
          {
            product_id: data.id,
            url: `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(data.name + " - Side")}`,
            alt: `${data.name} - Side View`,
          },
          {
            product_id: data.id,
            url: `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(data.name + " - Back")}`,
            alt: `${data.name} - Back View`,
          },
        ]

        for (const image of images) {
          const { error: imageError } = await supabase.from("product_images").insert(image)

          if (imageError) {
            console.error(`Error creating image for ${data.name}:`, imageError)
          }
        }

        // Add product variants (sizes)
        const sizes = ["5", "6", "7", "8", "9", "10"]
        for (const size of sizes) {
          const variant = {
            product_id: data.id,
            name: `Size ${size}`,
            sku: `${data.sku}-SZ${size}`,
            stock_quantity: Math.floor(Math.random() * 10) + 5,
          }

          const { data: variantData, error: variantError } = await supabase
            .from("product_variants")
            .insert(variant)
            .select()
            .single()

          if (variantError) {
            console.error(`Error creating variant for ${data.name}:`, variantError)
          } else {
            // Add variant options
            const option = {
              variant_id: variantData.id,
              name: "Size",
              value: size,
            }

            const { error: optionError } = await supabase.from("variant_options").insert(option)

            if (optionError) {
              console.error(`Error creating option for variant:`, optionError)
            }
          }
        }
      }
    }

    console.log("Database seeding completed!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}
