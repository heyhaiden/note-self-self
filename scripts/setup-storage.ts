import { createClient } from "@supabase/supabase-js"

// Replace these with your actual Supabase URL and service role key
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

async function setupStorage() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or service role key")
    process.exit(1)
  }

  // Create a Supabase client with the service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check if the notes bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`)
    }

    const notesBucket = buckets.find((bucket) => bucket.name === "notes")

    if (!notesBucket) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket("notes", {
        public: true, // Make the bucket public
      })

      if (createError) {
        throw new Error(`Error creating notes bucket: ${createError.message}`)
      }

      console.log("Notes bucket created successfully")

      // Set bucket policy to public
      const { error: policyError } = await supabase.storage.from("notes").createSignedUrl("dummy.txt", 60)

      if (policyError && !policyError.message.includes("not found")) {
        console.warn(`Warning setting bucket policy: ${policyError.message}`)
      }
    } else {
      console.log("Notes bucket already exists")
    }

    console.log("Storage setup complete!")
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

setupStorage()
