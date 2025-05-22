import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { ProfileForm } from "@/components/account/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createServerClient } from "@/lib/supabase/server"

export const metadata = {
  title: "My Account - AbaMade",
  description: "View and update your profile information",
}

export default async function AccountPage() {
  const authUser = await getCurrentUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const supabase = createServerClient()
  const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {userData?.first_name || authUser.email?.split("@")[0] || "User"}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal information and contact details.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={userData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Your account details and activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">{authUser.email}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium">Member Since</h3>
                <p className="text-sm text-muted-foreground">
                  {userData?.created_at
                    ? new Date(userData.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date().toLocaleDateString()}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Orders</h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <h3 className="font-medium">Wishlist Items</h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
