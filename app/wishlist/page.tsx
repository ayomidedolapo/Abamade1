import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { getWishlistByUserId } from "@/lib/db/wishlist"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGrid } from "@/components/products/product-grid"

export const metadata = {
  title: "My Wishlist - AbaMade",
  description: "View and manage your wishlist",
}

export default async function WishlistPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const wishlistItems = await getWishlistByUserId(user.id)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">Products you've saved for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium">Your wishlist is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Save items you love to your wishlist and find them here anytime.
              </p>
              <div className="mt-6">
                <a
                  href="/products"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Explore Products
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ProductGrid products={wishlistItems.map((item) => item.product)} />
      )}
    </div>
  )
}
