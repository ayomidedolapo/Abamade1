"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, LogOut, Package, Settings, User } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    })

    router.refresh()
    router.push("/")
  }

  const navItems = [
    {
      title: "Profile",
      href: "/account",
      icon: User,
    },
    {
      title: "Orders",
      href: "/account/orders",
      icon: Package,
    },
    {
      title: "Addresses",
      href: "/account/addresses",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/account/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">My Account</h2>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
