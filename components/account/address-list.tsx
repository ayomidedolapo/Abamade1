"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddressForm } from "@/components/account/address-form"
import { deleteAddress } from "@/lib/actions/address-actions"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Address } from "@/lib/db/users"

interface AddressListProps {
  addresses: Address[]
}

export function AddressList({ addresses }: AddressListProps) {
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    try {
      await deleteAddress(addressToDelete)
      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddressToDelete(null)
    }
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h3 className="text-lg font-semibold">No addresses yet</h3>
        <p className="text-sm text-muted-foreground">Add an address to make checkout faster.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {addresses.map((address) => (
        <Card key={address.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </h3>
                  {address.is_default && <Badge variant="outline">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p className="text-sm text-muted-foreground">{address.country}</p>
              </div>
              <div className="flex gap-2">
                <AddressForm address={address}>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </AddressForm>
                <AlertDialog
                  open={addressToDelete === address.id}
                  onOpenChange={(open) => !open && setAddressToDelete(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setAddressToDelete(address.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Address</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this address? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAddress}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
