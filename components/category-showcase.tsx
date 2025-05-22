import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

// Sample category data
const categories = [
  {
    id: 1,
    name: "Heels",
    image: "/placeholder.svg?height=400&width=400",
    count: 48,
  },
  {
    id: 2,
    name: "Flats",
    image: "/placeholder.svg?height=400&width=400",
    count: 36,
  },
  {
    id: 3,
    name: "Boots",
    image: "/placeholder.svg?height=400&width=400",
    count: 42,
  },
  {
    id: 4,
    name: "Sandals",
    image: "/placeholder.svg?height=400&width=400",
    count: 39,
  },
  {
    id: 5,
    name: "Sneakers",
    image: "/placeholder.svg?height=400&width=400",
    count: 27,
  },
]

export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.name.toLowerCase()}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-square overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count} Products</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
