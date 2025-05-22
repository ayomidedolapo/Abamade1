"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sophia Williams",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Fashion Blogger",
    content:
      "The quality of these shoes is exceptional. I've been wearing Luxe Steps for years and they never disappoint. The comfort combined with style is unmatched.",
    rating: 5,
  },
  {
    id: 2,
    name: "Emma Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Business Executive",
    content:
      "As someone who's on her feet all day, finding stylish shoes that are also comfortable has been a game-changer. Luxe Steps delivers on both fronts.",
    rating: 5,
  },
  {
    id: 3,
    name: "Olivia Martinez",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Interior Designer",
    content:
      "The attention to detail in these shoes is remarkable. From the stitching to the materials used, everything speaks of quality and craftsmanship.",
    rating: 4,
  },
  {
    id: 4,
    name: "Isabella Thompson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Event Planner",
    content:
      "I've received countless compliments on my Luxe Steps shoes. They're not just footwear; they're conversation starters and confidence boosters.",
    rating: 5,
  },
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-lg italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
