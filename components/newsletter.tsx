import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="border-t bg-muted/50 py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Newsletter</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
              Subscribe to receive updates, exclusive offers, and style inspiration directly to your inbox.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md space-y-2">
            <form className="flex flex-col gap-2 sm:flex-row">
              <Input type="email" placeholder="Enter your email" className="flex-1" required />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our{" "}
              <a href="/privacy-policy" className="underline underline-offset-2">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
