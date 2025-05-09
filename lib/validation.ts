import { z } from "zod"

// Note submission schema
export const NoteSubmissionSchema = z.object({
  content: z.string().min(1, "Note content is required").max(2000, "Note content is too long"),
  is_screenshot: z.boolean().optional().default(false),
  screenshot_url: z.string().url().nullable().optional(),
})

// Admin user schema
export const AdminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Approval/rejection schema
export const NoteActionSchema = z.object({
  noteId: z.number().int().positive(),
  rejectionReason: z.string().optional(),
})

// Bulk action schema
export const BulkActionSchema = z.object({
  noteIds: z.array(z.number().int().positive()),
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().optional(),
})

// Storage bucket schema
export const StorageBucketSchema = z.object({
  name: z.string().min(1),
  public: z.boolean().optional(),
})

// Helper function to validate request data
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodType<T>,
  errorMessage = "Invalid request data",
): Promise<{ success: boolean; data?: T; error?: string; errors?: any }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      const formattedErrors = result.error.format()
      return {
        success: false,
        error: errorMessage,
        errors: formattedErrors,
      }
    }

    return { success: true, data: result.data }
  } catch (error) {
    return {
      success: false,
      error: "Failed to parse request body",
    }
  }
}
