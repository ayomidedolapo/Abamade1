import Image from "next/image"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Us",
  description: "Learn about AbaMade Footwear and our commitment to quality and craftsmanship.",
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">About AbaMade Footwear</h1>
          <p className="text-xl text-muted-foreground">
            Handcrafted footwear made with quality materials and exceptional craftsmanship.
          </p>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image src="/placeholder.svg?height=720&width=1280" alt="AbaMade workshop" fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            AbaMade Footwear was founded with a simple mission: to create beautiful, comfortable, and durable footwear
            that celebrates the rich tradition of Nigerian craftsmanship. Our journey began in Aba, a city renowned for
            its skilled artisans and vibrant leather industry.
          </p>
          <p className="text-muted-foreground">
            What started as a small workshop has grown into a brand that combines traditional techniques with modern
            design, creating footwear that stands out for its quality and style. Each pair of AbaMade shoes is a
            testament to our commitment to excellence and our pride in our heritage.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Values</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <span className="font-medium">Quality</span> - We use only the finest materials and pay meticulous
                  attention to every detail.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <span className="font-medium">Craftsmanship</span> - Our skilled artisans bring years of experience
                  and passion to every pair they create.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <span className="font-medium">Sustainability</span> - We're committed to ethical practices and
                  minimizing our environmental impact.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <span className="font-medium">Community</span> - We support local artisans and invest in the
                  communities where we work.
                </div>
              </li>
            </ul>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-full">
            <Image src="/placeholder.svg?height=600&width=600" alt="Handcrafted shoes" fill className="object-cover" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Process</h2>
          <p className="text-muted-foreground">
            Every pair of AbaMade shoes goes through a meticulous process that combines traditional craftsmanship with
            modern techniques. From selecting the finest leathers to the final quality check, we ensure that each step
            meets our exacting standards.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-lg font-medium">1. Material Selection</div>
              <p className="text-sm text-muted-foreground">
                We source premium materials that meet our quality and sustainability standards.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-lg font-medium">2. Handcrafting</div>
              <p className="text-sm text-muted-foreground">
                Our skilled artisans cut, stitch, and shape each component with precision and care.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-lg font-medium">3. Quality Control</div>
              <p className="text-sm text-muted-foreground">
                Every pair undergoes rigorous testing to ensure comfort, durability, and aesthetic perfection.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Meet the Team</h2>
          <p className="text-muted-foreground">
            Behind AbaMade is a dedicated team of designers, craftspeople, and professionals who share a passion for
            creating exceptional footwear. Our diverse backgrounds and expertise come together to bring you shoes that
            combine style, comfort, and durability.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              { name: "Chioma Okonkwo", role: "Founder & Creative Director" },
              { name: "Emeka Nwosu", role: "Master Craftsman" },
              { name: "Ngozi Eze", role: "Design Lead" },
            ].map((person) => (
              <div key={person.name} className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image src="/placeholder.svg?height=128&width=128" alt={person.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-medium">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Join the AbaMade Family</h2>
          <p className="mb-6 text-muted-foreground">
            Experience the perfect blend of tradition and innovation with our handcrafted footwear.
          </p>
          <Button size="lg" asChild>
            <a href="/products">Shop Our Collection</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
