"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        // Check if user has admin role
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", data.session.user.id)
          .single()

        if (!adminError && adminData && adminData.role === "admin") {
          // User is already logged in and is an admin, redirect to dashboard
          router.push("/admin")
        }
      }

      setIsCheckingSession(false)
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.session) {
        throw new Error("No session created")
      }

      // Check if user has admin role
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", data.session.user.id)
        .single()

      if (adminError || !adminData || adminData.role !== "admin") {
        // Sign out if not an admin
        await supabase.auth.signOut()
        throw new Error("You do not have permission to access the admin area")
      }

      // Wait for auth state to be updated
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          console.log("Auth state changed to SIGNED_IN, redirecting...")
          router.push("/admin")
          router.refresh()
        }
      })

      // Cleanup subscription after 5 seconds if not redirected
      setTimeout(() => {
        subscription.unsubscribe()
      }, 5000)
    } catch (error) {
      console.error("Error logging in:", error)
      setError(
        error instanceof Error ? error.message : "Failed to log in. Please check your credentials and try again.",
      )
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-sm font-light">Checking authentication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <Link href="/" className="text-xl font-light tracking-wider">
              NOTE<span className="font-normal">SELF</span>SELF
            </Link>
            <h1 className="text-2xl font-light mt-6 mb-2">Admin Login</h1>
            <p className="text-sm font-light text-gray-500">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-light">
                  Password
                </Label>
                <Link href="/admin/forgot-password" className="text-xs font-light text-gray-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-none border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-none bg-black text-white hover:bg-gray-800 py-6 text-sm font-light tracking-wide"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs font-light text-gray-500">
              This area is restricted to administrators only.
              <br />
              <Link href="/" className="text-black hover:underline">
                Return to homepage
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
