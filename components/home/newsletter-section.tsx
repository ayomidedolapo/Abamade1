"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Mail, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/lib/db/newsletter"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="rounded-r-md rounded-l-none">
      {pending ? "Subscribing..." : <ArrowRight className="h-4 w-4" />}
    </Button>
  )
}

export function NewsletterSection() {
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  async function handleSubscribe(formData: FormData) {
    const result = await subscribeToNewsletter(formData)

    setMessage({
      text: result.message,
      type: result.success ? "success" : "error",
    })

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stay Updated</h2>
            <p className="text-muted-foreground md:text-lg">
              Subscribe to our newsletter to receive updates on new arrivals, special offers, and exclusive content.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md space-y-3">
            <form action={handleSubscribe} className="flex">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="pl-10 rounded-l-md rounded-r-none border-r-0 focus-visible:ring-primary"
                  required
                />
              </div>
              <SubmitButton />
            </form>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={message.type === "success" ? "text-green-600 text-sm" : "text-red-600 text-sm"}
              >
                {message.text}
              </motion.p>
            )}
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
