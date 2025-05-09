import { ensureStorageBucketExists } from "./supabase"

export async function initializeApp() {
  // Ensure storage bucket exists
  await ensureStorageBucketExists()

  // Add other initialization tasks here

  console.log("App initialized successfully")
}
