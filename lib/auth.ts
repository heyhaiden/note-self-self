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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Check if user has admin role in user_roles table
  const { data: userRole, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", session.user.id)
    .single()

  if (error || !userRole || userRole.role !== "admin") {
    // Sign out the user if they're not an admin
    await supabase.auth.signOut()
    redirect("/admin/login?error=unauthorized")
  }

  return {
    user: session.user,
    role: userRole.role,
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
