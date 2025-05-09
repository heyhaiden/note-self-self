"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Memoize the signOut function to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }, [router])

  // Only check auth once on initial load
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!isMounted) return

        if (session?.user) {
          setUser(session.user)

          // Check if user is admin
          const { data } = await supabase.from("admin_users").select("id").eq("user_id", session.user.id).maybeSingle()

          if (isMounted) {
            setIsAdmin(!!data)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Set up auth state listener for sign out only
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && isMounted) {
        setUser(null)
        setIsAdmin(false)
      }
    })

    checkAuth()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, isAdmin, isLoading, signOut }}>{children}</AuthContext.Provider>
}
