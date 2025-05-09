import { requireAdmin } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPendingSubmissions, getProcessedSubmissions, getSubmissionCounts } from "@/lib/admin-utils"
import { createServerSupabaseClient } from "@/lib/supabase"
import AdminSubmissionsClient from "./components/admin-submissions-client"
import AdminSidebar from "./components/admin-sidebar"
import AdminHeader from "./components/admin-header"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string; limit?: string }
}) {
  // Check if user is authenticated and has admin role
  const { user } = await requireAdmin()

  console.log("Admin page loaded for user:", user.email)

  // Get the current tab from the URL or default to "pending"
  const currentTab = searchParams.tab || "pending"
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10

  // Fetch submission counts
  const counts = await getSubmissionCounts()

  // Fetch categories for the approval process
  const supabase = createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch submissions based on the current tab
  const pendingData =
    currentTab === "pending"
      ? await getPendingSubmissions(page, limit)
      : { submissions: [], total: 0, page, limit, hasMore: false }
  const processedData =
    currentTab === "processed"
      ? await getProcessedSubmissions(page, limit)
      : { submissions: [], total: 0, page, limit, hasMore: false }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1">
          <AdminHeader />

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-6">
                  <div className="text-xs font-light text-gray-500 mb-2">Pending Review</div>
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
                  <div className="text-xs font-light text-gray-500 mb-2">Approved</div>
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
                  <div className="text-xs font-light text-gray-500 mb-2">Rejected</div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-light">{counts.rejected}</div>
                    <Badge variant="outline" className="rounded-none text-black bg-gray-100 font-light">
                      +{counts.todayRejected} today
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <AdminSubmissionsClient
              pendingSubmissions={pendingData.submissions}
              processedSubmissions={processedData.submissions}
              pendingTotal={pendingData.total}
              processedTotal={processedData.total}
              currentPage={page}
              limit={limit}
              currentTab={currentTab}
              categories={categories || []}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
