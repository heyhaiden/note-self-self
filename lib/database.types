export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number
          content: string
          status: "pending" | "approved" | "rejected"
          is_screenshot: boolean
          screenshot_url: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
          approved_at: string | null
        }
        Insert: {
          id?: number
          content: string
          status?: "pending" | "approved" | "rejected"
          is_screenshot?: boolean
          screenshot_url?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: number
          content?: string
          status?: "pending" | "approved" | "rejected"
          is_screenshot?: boolean
          screenshot_url?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
      }
      artwork: {
        Row: {
          id: number
          note_id: number
          image_url: string
          alt_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          note_id: number
          image_url: string
          alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          note_id?: number
          image_url?: string
          alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: number
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}
