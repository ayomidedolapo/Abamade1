interface RecentSalesProps {
  orders: {
    id: string
    customer: {
      name: string
      email: string
    }
    amount: number
  }[]
}

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
          </div>
          <div className="ml-auto font-medium">${order.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
