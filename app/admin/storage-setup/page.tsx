import AdminSidebar from "../components/admin-sidebar"
import AdminHeader from "../components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react"
import { createAdminSupabaseClient } from "@/lib/supabase"

export default async function StorageSetupPage() {
  // Check if the bucket exists
  const supabase = createAdminSupabaseClient()
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

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
              <h2 className="text-2xl font-light mb-2">Storage & Database Setup</h2>
              <p className="text-sm font-light text-gray-500">
                Configure storage and database permissions for note submissions
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Storage Bucket Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {bucketExists ? (
                    <Alert className="rounded-none bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <AlertTitle className="text-green-800 font-normal">Storage Bucket Ready</AlertTitle>
                      <AlertDescription className="text-green-700">
                        The "notes" storage bucket is properly configured and ready to use.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="rounded-none bg-amber-50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      <AlertTitle className="text-amber-800 font-normal">Storage Bucket Not Found</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        The "notes" storage bucket does not exist. Image uploads will not work until this is set up.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-6 space-y-4">
                    <h3 className="text-base font-normal">How to Set Up the Storage Bucket</h3>
                    <p className="text-sm font-light">
                      To enable image uploads, you need to create a storage bucket named "notes" in your Supabase
                      project. Follow these steps:
                    </p>

                    <div className="space-y-2 text-sm font-light">
                      <p className="font-normal">1. Go to the Supabase Dashboard</p>
                      <p className="pl-4">Log in to your Supabase account and select your project.</p>

                      <p className="font-normal">2. Navigate to Storage</p>
                      <p className="pl-4">In the left sidebar, click on "Storage".</p>

                      <p className="font-normal">3. Create a New Bucket</p>
                      <p className="pl-4">Click the "New Bucket" button and enter "notes" as the bucket name.</p>

                      <p className="font-normal">4. Make the Bucket Public</p>
                      <p className="pl-4">Check the "Public" option to make the bucket publicly accessible.</p>

                      <p className="font-normal">5. Configure RLS Policies</p>
                      <p className="pl-4">
                        After creating the bucket, click on "Policies" and add the following policies:
                      </p>
                      <ul className="pl-8 list-disc space-y-1">
                        <li>Allow anonymous uploads: SELECT, INSERT for anon</li>
                        <li>Allow public access: SELECT for public</li>
                      </ul>

                      <p className="font-normal">6. Refresh This Page</p>
                      <p className="pl-4">
                        After setting up the bucket, refresh this page to verify that it's properly configured.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-light">Database Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <ShieldCheck className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="text-base font-normal">Row Level Security (RLS) Policies</h3>
                  </div>

                  <p className="text-sm font-light mb-4">
                    To allow users to submit notes, you need to configure Row Level Security (RLS) policies for the
                    "notes" table. Follow these steps:
                  </p>

                  <div className="space-y-2 text-sm font-light">
                    <p className="font-normal">1. Go to the Supabase Dashboard</p>
                    <p className="pl-4">Log in to your Supabase account and select your project.</p>

                    <p className="font-normal">2. Navigate to Table Editor</p>
                    <p className="pl-4">In the left sidebar, click on "Table Editor".</p>

                    <p className="font-normal">3. Select the "notes" Table</p>
                    <p className="pl-4">Find and click on the "notes" table in the list.</p>

                    <p className="font-normal">4. Go to "Policies" Tab</p>
                    <p className="pl-4">Click on the "Policies" tab at the top of the table view.</p>

                    <p className="font-normal">5. Add New Policy for Anonymous Inserts</p>
                    <p className="pl-4">Click "New Policy" and configure it as follows:</p>
                    <ul className="pl-8 list-disc space-y-1">
                      <li>Policy name: "Allow anonymous inserts"</li>
                      <li>Target roles: Leave blank for public access</li>
                      <li>
                        Policy definition: <code className="bg-gray-100 px-1 py-0.5">true</code>
                      </li>
                      <li>Operations: SELECT, INSERT</li>
                    </ul>

                    <p className="font-normal">6. Add Policy for Admin Access</p>
                    <p className="pl-4">Create another policy for admin access:</p>
                    <ul className="pl-8 list-disc space-y-1">
                      <li>Policy name: "Allow admin full access"</li>
                      <li>Target roles: authenticated</li>
                      <li>
                        Policy definition:{" "}
                        <code className="bg-gray-100 px-1 py-0.5">auth.uid() IN (SELECT user_id FROM admin_users)</code>
                      </li>
                      <li>Operations: SELECT, INSERT, UPDATE, DELETE</li>
                    </ul>

                    <p className="font-normal">7. Refresh This Page</p>
                    <p className="pl-4">
                      After setting up the policies, refresh this page to verify that everything is working.
                    </p>
                  </div>

                  <Alert className="mt-6 rounded-none bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>Note:</strong> If you prefer not to modify RLS policies, the application will still work
                      because our API routes use the service role key to bypass RLS. However, setting up proper RLS
                      policies is recommended for security.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
