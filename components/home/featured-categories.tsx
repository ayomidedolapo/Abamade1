"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/db/categories"

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // If no categories are provided, use fallback data
  const hasCategories = categories && categories.length > 0

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 md:-left-6">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm md:h-10 md:w-10"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Scroll left</span>
        </Button>
      </div>

      <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 md:-right-6">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm md:h-10 md:w-10"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hasCategories
          ? categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[240px] snap-start"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group relative block overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={
                        category.image_url ||
                        `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(category.name) || "/placeholder.svg"}`
                      }
                      alt={category.name}
                      width={400}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 text-white">
                    <div>
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      {category.description && (
                        <p className="mt-1 text-sm text-white/80 line-clamp-2">{category.description}</p>
                      )}
                      <div className="mt-3 inline-flex items-center text-sm font-medium">
                        Shop Now <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          : // Fallback UI when no categories are available
            ["Heels", "Flats", "Boots", "Sandals", "Sneakers"].map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[240px] snap-start"
              >
                <CategoryPlaceholder name={name} />
              </motion.div>
            ))}
      </div>
    </div>
  )
}

// Helper component for fallback UI
function CategoryPlaceholder({ name }: { name: string }) {
  return (
    <Link
      href={`/category/${name.toLowerCase()}`}
      className="group relative block overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <Image
          src={`/placeholder.svg?height=400&width=400&text=${encodeURIComponent(name)}`}
          alt={name}
          width={400}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 text-white">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="mt-1 text-sm text-white/80 line-clamp-2">Explore our collection of {name.toLowerCase()}</p>
          <div className="mt-3 inline-flex items-center text-sm font-medium">
            Shop Now <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
