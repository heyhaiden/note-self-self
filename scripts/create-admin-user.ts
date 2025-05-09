// This is a script to create an admin user
// You would run this script manually or as part of your deployment process
// Example: npx tsx scripts/create-admin-user.ts

import { createClient } from "@supabase/supabase-js"

// Replace these with your actual Supabase URL and service role key
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Admin user details
const adminEmail = "admin@example.com"
const adminPassword = "securepassword123" // Change this to a secure password

async function createAdminUser() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or service role key")
    process.exit(1)
  }

  // Create a Supabase client with the service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check if user already exists
    const { data: existingUsers, error: searchError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", adminEmail)
      .limit(1)

    if (searchError) {
      throw new Error(`Error checking for existing user: ${searchError.message}`)
    }

    let userId

    if (existingUsers && existingUsers.length > 0) {
      console.log(`User with email ${adminEmail} already exists`)
      userId = existingUsers[0].id
    } else {
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      })

      if (createError) {
        throw new Error(`Error creating user: ${createError.message}`)
      }

      console.log(`Created new user with email ${adminEmail}`)
      userId = newUser.user.id
    }

    // Check if user already has admin role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .limit(1)

    if (roleCheckError) {
      throw new Error(`Error checking for existing role: ${roleCheckError.message}`)
    }

    if (existingRole && existingRole.length > 0) {
      console.log(`User already has admin role`)
    } else {
      // Add admin role to user
      const { error: roleError } = await supabase.from("admin_users").insert({
        user_id: userId,
        role: "admin",
      })

      if (roleError) {
        throw new Error(`Error adding admin role: ${roleError.message}`)
      }

      console.log(`Added admin role to user`)
    }

    console.log("Admin user setup complete!")
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

createAdminUser()
