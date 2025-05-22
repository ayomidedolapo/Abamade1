import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { AccountSidebar } from "@/components/account/account-sidebar"

export const metadata = {
  title: "Account - AbaMade",
  description: "Manage your account and view your orders",
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login?callbackUrl=/account")
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-1/4">
          <AccountSidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
