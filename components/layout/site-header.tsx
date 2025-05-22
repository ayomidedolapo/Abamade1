"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { ShoppingBag, UserIcon, Search, Heart, Menu } from "lucide-react"

import { MainNav } from "@/components/layout/main-nav"
import { UserAccountNav } from "@/components/layout/user-account-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Fetch user session on load
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      // Check if user is admin
      if (session?.user) {
        const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        setIsAdmin(data?.role === "admin")
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      // Check admin status on auth change
      if (session?.user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin")
          })
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, router])

  // Static fallback categories
  const categories = [
    {
      id: "1",
      name: "Heels",
      slug: "heels",
      description: "",
      parent_id: null,
      gender: "women",
      image_url: "",
      created_at: "",
      updated_at: "",
    },
    {
      id: "2",
      name: "Flats",
      slug: "flats",
      description: "",
      parent_id: null,
      gender: "women",
      image_url: "",
      created_at: "",
      updated_at: "",
    },
    {
      id: "3",
      name: "Sandals",
      slug: "sandals",
      description: "",
      parent_id: null,
      gender: "women",
      image_url: "",
      created_at: "",
      updated_at: "",
    },
    {
      id: "4",
      name: "Boots",
      slug: "boots",
      description: "",
      parent_id: null,
      gender: "women",
      image_url: "",
      created_at: "",
      updated_at: "",
    },
    {
      id: "5",
      name: "Sneakers",
      slug: "sneakers",
      description: "",
      parent_id: null,
      gender: "women",
      image_url: "",
      created_at: "",
      updated_at: "",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b py-4">
                  <Link href="/" className="flex items-center space-x-2 font-medium">
                    <span className="text-xl font-bold">AbaMade</span>
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-6 overflow-auto py-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Navigation</div>
                    <Link href="/" className="text-base font-medium transition-colors hover:text-primary">
                      Home
                    </Link>
                    <Link href="/products" className="text-base font-medium transition-colors hover:text-primary">
                      All Products
                    </Link>
                    <Link
                      href="/category/new-arrivals"
                      className="text-base font-medium transition-colors hover:text-primary"
                    >
                      New Arrivals
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</div>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="text-base font-medium transition-colors hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Company</div>
                    <Link href="/about" className="text-base font-medium transition-colors hover:text-primary">
                      About
                    </Link>
                    <Link href="/contact" className="text-base font-medium transition-colors hover:text-primary">
                      Contact
                    </Link>
                  </div>
                </nav>
                <div className="border-t py-4">
                  <div className="flex items-center justify-between">
                    {user ? (
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/account">
                          <UserIcon className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth/login">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">AbaMade</span>
          </Link>
          <div className="hidden md:block">
            <MainNav categories={categories} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <form className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] pl-8 md:w-[250px] focus-visible:ring-primary"
              />
            </div>
          </form>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="lg:hidden transition-transform hover:scale-110"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Wishlist"
            className="transition-transform hover:scale-110 relative"
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">0</Badge>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="transition-transform hover:scale-110 relative"
            asChild
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">0</Badge>
            </Link>
          </Button>
          {user ? (
            <UserAccountNav user={user} isAdmin={isAdmin} />
          ) : (
            <Button variant="ghost" size="icon" aria-label="Account" asChild>
              <Link href="/auth/login">
                <UserIcon className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
