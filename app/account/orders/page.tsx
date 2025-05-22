import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { getOrdersByUserId } from "@/lib/db/orders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export const metadata = {
  title: "My Orders - AbaMade",
  description: "View your order history",
}

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const orders = await getOrdersByUserId(user.id)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
              <div className="mt-6">
                <a
                  href="/products"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start Shopping
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                    <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge
                    className={
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "processing"
                          ? "bg-blue-500"
                          : order.status === "shipped"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={`/account/orders/${order.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View Order Details
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
