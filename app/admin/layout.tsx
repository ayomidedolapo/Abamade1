import type React from "react"
import { redirect } from "next/navigation"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { requireAdmin } from "@/lib/auth/auth-utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is admin
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/auth/login?callbackUrl=/admin")
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
    </div>
  )
}
