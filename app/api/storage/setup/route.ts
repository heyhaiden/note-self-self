import { createSupabaseClient } from "@/lib/supabase-client"
import { createApiResponse, createErrorResponse } from "@/lib/api-utils"
import { StorageBucketSchema } from "@/lib/validation"

export async function GET() {
  try {
    // Use regular client to check bucket existence
    const supabase = createSupabaseClient()

    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return createErrorResponse("Failed to list buckets", 500)
    }

    const notesBucket = buckets.find((bucket) => bucket.name === "notes")

    return createApiResponse({
      bucketExists: !!notesBucket,
      bucketName: "notes",
    })
  } catch (error) {
    console.error("Error in storage setup API:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

// Admin-only endpoint to create bucket
export async function POST(request: Request) {
  try {
    // Validate request
    const body = await request.json()
    const result = StorageBucketSchema.safeParse(body)

    if (!result.success) {
      return createErrorResponse("Invalid bucket data", 400, result.error.format())
    }

    // Only admins should be able to create buckets
    const adminSupabase = createSupabaseClient({ admin: true })

    // Check if bucket already exists
    const { data: buckets } = await adminSupabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === result.data.name)

    if (bucketExists) {
      return createApiResponse({
        bucketExists: true,
        message: "Bucket already exists",
      })
    }

    // Create the bucket
    const { error } = await adminSupabase.storage.createBucket(result.data.name, {
      public: result.data.public ?? false,
    })

    if (error) {
      console.error("Error creating bucket:", error)
      return createErrorResponse("Failed to create bucket", 500)
    }

    return createApiResponse({
      bucketExists: true,
      message: "Bucket created successfully",
    })
  } catch (error) {
    console.error("Error in storage setup API:", error)
    return createErrorResponse("Internal server error", 500)
  }
}
