"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setUser(session?.user || null)

        if (session?.user) {
          // Check if user has admin role
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("role")
            .eq("user_id", session.user.id)
            .single()

          setIsAdmin(!adminError && adminData && adminData.role === "admin")
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      setUser(session?.user || null)

      if (session?.user) {
        // Check if user has admin role
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", session.user.id)
          .single()

        setIsAdmin(!adminError && adminData && adminData.role === "admin")
      } else {
        setIsAdmin(false)
      }

      setIsLoading(false)

      // Redirect based on auth state
      if (event === "SIGNED_IN") {
        if (pathname?.startsWith("/admin/login")) {
          router.push("/admin")
        }
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
          router.push("/admin/login")
        }
        router.refresh()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, pathname])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return <AuthContext.Provider value={{ user, isAdmin, isLoading, signOut }}>{children}</AuthContext.Provider>
}
