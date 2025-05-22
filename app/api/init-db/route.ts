import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/supabase/init-db"
import { seedDatabase } from "@/lib/db/seed"

export async function GET() {
  try {
    // Step 1: Initialize the database schema
    const initResult = await initializeDatabase()

    if (!initResult.success) {
      return NextResponse.json({ error: "Database initialization failed", details: initResult.error }, { status: 500 })
    }

    // Step 2: Seed the database with initial data
    const seedResult = await seedDatabase()

    return NextResponse.json({
      message: "Database initialization complete",
      initResult,
      seedResult,
    })
  } catch (error) {
    console.error("Error in init-db route:", error)
    return NextResponse.json({ error: "Database initialization failed", details: error }, { status: 500 })
  }
}
