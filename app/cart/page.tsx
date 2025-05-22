import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import CartPageClient from "@/components/cart/cart-page-client"

export const dynamic = "force-dynamic"

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[400px] items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CartPageClient />
    </Suspense>
  )
}
