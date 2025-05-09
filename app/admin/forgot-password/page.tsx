"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        throw error
      }

      setSuccess("Password reset link sent to your email.")
    } catch (error) {
      console.error("Error resetting password:", error)
      setError(
        error instanceof Error ? error.message : "Failed to send reset link. Please check your email and try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <Link href="/" className="text-xl font-light tracking-wider">
              NOTE<span className="font-normal">SELF</span>SELF
            </Link>
            <h1 className="text-2xl font-light mt-6 mb-2">Reset Password</h1>
            <p className="text-sm font-light text-gray-500">Enter your email to receive a password reset link</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 rounded-none bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-none bg-black text-white hover:bg-gray-800 py-6 text-sm font-light tracking-wide"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs font-light text-gray-500">
              Remember your password?{" "}
              <Link href="/admin/login" className="text-black hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
