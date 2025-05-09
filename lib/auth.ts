import { createServerSupabaseClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Type for admin user
export type AdminUser = {
  id: string
  email: string
  role: string
  created_at: string
}

// Get current user if authenticated
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Check if user is an admin
export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      if (!user) return false
      userId = user.id
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("admin_users").select("role").eq("user_id", userId).single()

    return !error && data?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Get admin user data
export async function getAdminUser(userId?: string): Promise<AdminUser | null> {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      if (!user) return null
      userId = user.id
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", userId).single()

    if (error || !data) return null

    const userDetails = await supabase.auth.admin.getUserById(userId)

    return {
      id: userId,
      email: userDetails.data.user?.email || "Unknown",
      role: data.role,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error("Error getting admin user:", error)
    return null
  }
}
