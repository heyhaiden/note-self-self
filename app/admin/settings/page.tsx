import { requireAdmin } from "@/lib/auth"
import AdminSidebar from "../components/admin-sidebar"
import AdminHeader from "../components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminSettingsPage() {
  // Check if user is authenticated and has admin role
  const { user } = await requireAdmin()

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1">
          <AdminHeader />

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-light mb-2">Settings</h2>
              <p className="text-sm font-light text-gray-500">Manage your admin account and application settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">Email</div>
                      <div className="text-sm font-normal">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">Role</div>
                      <div className="text-sm font-normal">Administrator</div>
                    </div>
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">Last Sign In</div>
                      <div className="text-sm font-normal">
                        {new Date(user.last_sign_in_at || "").toLocaleString() || "Never"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">Password</div>
                      <div className="text-sm font-normal">••••••••••••</div>
                    </div>
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">Two-Factor Authentication</div>
                      <div className="text-sm font-normal">Not enabled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
