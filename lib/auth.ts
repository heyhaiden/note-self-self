import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

// Type for admin user
export type AdminUser = {
  id: string
  email: string
  role: string
  created_at: string
}

// Check if user is authenticated and has admin role
export async function requireAdmin() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("No session found in requireAdmin, redirecting to login")
      redirect("/admin/login")
    }

    // Check if user has admin role in user_roles table
    const { data: userRole, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("Error checking admin role:", error)
      await supabase.auth.signOut()
      redirect("/admin/login?error=server_error")
    }

    if (!userRole || userRole.role !== "admin") {
      console.log("User is not an admin in requireAdmin, signing out and redirecting")
      await supabase.auth.signOut()
      redirect("/admin/login?error=unauthorized")
    }

    console.log("User is authenticated and is an admin in requireAdmin")
    return {
      user: session.user,
      role: userRole.role,
    }
  } catch (error) {
    console.error("Error in requireAdmin:", error)
    redirect("/admin/login?error=server_error")
  }
}

// Get current user if authenticated
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}

// Check if user is an admin
export async function isAdmin() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  // Check if user has admin role in admin_users table
  const { data: userRole, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", session.user.id)
    .single()

  if (error || !userRole || userRole.role !== "admin") {
    return false
  }

  return true
}
