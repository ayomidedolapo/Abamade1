import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">AbaMade</h3>
            <p className="text-sm text-muted-foreground">
              Handcrafted footwear made with quality materials and exceptional craftsmanship.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <div className="grid gap-2">
              <Link
                href="/category/heels"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Heels
              </Link>
              <Link
                href="/category/flats"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Flats
              </Link>
              <Link
                href="/category/sandals"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sandals
              </Link>
              <Link
                href="/category/boots"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Boots
              </Link>
              <Link
                href="/category/sneakers"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sneakers
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <div className="grid gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Careers
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link
                href="/sustainability"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sustainability
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <div className="grid gap-2">
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping & Returns
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/size-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Size Guide
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>123 Fashion Street, Design District, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@abamade.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AbaMade Footwear. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
