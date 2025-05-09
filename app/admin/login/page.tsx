"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "100px auto" }}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ display: "block", width: "100%", marginBottom: 8 }} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{ display: "block", width: "100%", marginBottom: 8 }} />
      <button type="submit" disabled={isLoading} style={{ width: "100%" }}>{isLoading ? "Logging in..." : "Login"}</button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  )
}
