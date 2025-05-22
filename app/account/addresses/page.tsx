import { getCurrentUser } from "@/lib/auth/auth-utils"
import { getUserAddresses } from "@/lib/db/users"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddressForm } from "@/components/account/address-form"
import { AddressList } from "@/components/account/address-list"

export const metadata = {
  title: "Addresses - AbaMade",
  description: "Manage your shipping and billing addresses",
}

export default async function AddressesPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const addresses = await getUserAddresses(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
        <p className="text-muted-foreground">Manage your shipping and billing addresses.</p>
      </div>
      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Addresses</CardTitle>
            <CardDescription>Addresses you've saved for shipping and billing.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressList addresses={addresses} />
          </CardContent>
          <CardFooter>
            <AddressForm>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </AddressForm>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
