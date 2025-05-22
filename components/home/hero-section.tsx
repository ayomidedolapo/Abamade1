"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "/placeholder.svg?height=1080&width=1920&text=Elegant+Collection",
    title: "Step Into Elegance",
    description: "Discover our handcrafted collection of premium footwear designed for the modern woman",
    primaryCta: { text: "Shop New Arrivals", link: "/category/new-arrivals" },
    secondaryCta: { text: "Our Story", link: "/about" },
  },
  {
    image: "/placeholder.svg?height=1080&width=1920&text=Summer+Collection",
    title: "Summer Essentials",
    description: "Lightweight and breathable designs perfect for warm weather",
    primaryCta: { text: "Shop Collection", link: "/category/sandals" },
    secondaryCta: { text: "Learn More", link: "/collections/summer" },
  },
  {
    image: "/placeholder.svg?height=1080&width=1920&text=Premium+Materials",
    title: "Crafted With Care",
    description: "Expertly made with premium materials for unmatched comfort and durability",
    primaryCta: { text: "Explore Craftsmanship", link: "/craftsmanship" },
    secondaryCta: { text: "Shop All", link: "/products" },
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-6 text-white max-w-3xl mx-auto"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-playfair">
                  {slide.title}
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl lg:text-2xl">{slide.description}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 min-w-[160px] rounded-full"
                    asChild
                  >
                    <Link href={slide.primaryCta.link}>{slide.primaryCta.text}</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 min-w-[160px] rounded-full"
                    asChild
                  >
                    <Link href={slide.secondaryCta.link}>{slide.secondaryCta.text}</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${currentSlide === index ? "bg-white w-6" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
