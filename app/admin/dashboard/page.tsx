import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSubmissionCounts } from "@/lib/admin-utils"
import AdminSidebar from "../components/admin-sidebar"
import AdminHeader from "../components/admin-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ImageIcon, CheckCircle, XCircle, AlertTriangle, Database, Settings } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

export default async function AdminDashboardPage() {
  // Fetch submission counts - this only happens once during server-side rendering
  const counts = await getSubmissionCounts()

  // Check if the storage bucket exists
  const supabase = createServerSupabaseClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  const notesBucket = buckets?.find((bucket) => bucket.name === "notes")
  const bucketExists = !!notesBucket

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
              <h2 className="text-2xl font-light mb-2">Dashboard</h2>
              <p className="text-sm font-light text-gray-500">Overview of submission activity</p>
            </div>

            {!bucketExists && (
              <Alert className="mb-8 rounded-none bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                <AlertDescription className="text-amber-800">
                  Storage bucket not configured. Image uploads are disabled.{" "}
                  <Link href="/admin/storage-setup" className="font-medium underline">
                    Set up storage
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-light text-gray-500">Pending Review</div>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-light">{counts.pending}</div>
                    <Badge variant="outline" className="rounded-none text-black bg-gray-100 font-light">
                      +{counts.todayPending} today
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-light text-gray-500">Approved</div>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-light">{counts.approved}</div>
                    <Badge variant="outline" className="rounded-none text-black bg-gray-100 font-light">
                      +{counts.todayApproved} today
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-light text-gray-500">Rejected</div>
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-light">{counts.rejected}</div>
                    <Badge variant="outline" className="rounded-none text-black bg-gray-100 font-light">
                      +{counts.todayRejected} today
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-normal">Submission approved</div>
                          <div className="text-xs text-gray-500">2 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-normal">Submission rejected</div>
                          <div className="text-xs text-gray-500">15 minutes ago</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-normal">New submission received</div>
                          <div className="text-xs text-gray-500">1 hour ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Gallery Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-light">Total Artworks</div>
                      <div className="text-sm font-normal">{counts.approved}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-light">Most Popular Tags</div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-none bg-gray-100 text-xs font-light">
                          thoughts
                        </Badge>
                        <Badge variant="outline" className="rounded-none bg-gray-100 text-xs font-light">
                          lists
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-light">Submissions This Week</div>
                      <div className="text-sm font-normal">
                        {counts.todayPending + counts.todayApproved + counts.todayRejected}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-gray-200 hover:bg-gray-50 font-light h-auto py-4"
                    >
                      <Link href="/admin">
                        <Clock className="h-4 w-4 mr-2" />
                        Review Submissions
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-gray-200 hover:bg-gray-50 font-light h-auto py-4"
                    >
                      <Link href="/admin/gallery">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Manage Gallery
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className={`rounded-none border-gray-200 hover:bg-gray-50 font-light h-auto py-4 ${
                        !bucketExists ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : ""
                      }`}
                    >
                      <Link href="/admin/storage-setup">
                        <Database className="h-4 w-4 mr-2" />
                        Storage Setup
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-gray-200 hover:bg-gray-50 font-light h-auto py-4"
                    >
                      <Link href="/admin/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
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
