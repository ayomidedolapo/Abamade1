import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const callbackUrl = requestUrl.searchParams.get("callbackUrl") || "/products"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Try to create or update user record
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      // Check if user already exists in users table
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", session.user.id).single()

      if (!existingUser) {
        // Create user record
        await supabase.from("users").insert([
          {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata.full_name?.split(" ")[0] || "",
            last_name: session.user.user_metadata.full_name?.split(" ").slice(1).join(" ") || "",
            role: "customer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}${callbackUrl}`)
}
