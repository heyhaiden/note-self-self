import { getSupabaseClient, createServerSupabaseClient } from './supabase-client'

// Constants for validation
const MAX_TITLE_LENGTH = 50
const MAX_CONTENT_LENGTH = 500

// Custom error class for validation errors
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export type Note = {
  id: number
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  artwork: {
    id: number
    image_url: string
    alt_text: string | null
  } | null
  created_at: string
  approved_at: string | null
}

// Validation functions
function validateNoteInput(title: string, content: string): void {
  if (!content.trim()) {
    throw new ValidationError('Content cannot be empty')
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new ValidationError(`Content must be ${MAX_CONTENT_LENGTH} characters or less`)
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`Title must be ${MAX_TITLE_LENGTH} characters or less`)
  }
}

function validateArtworkInput(artwork: { image_url: string; alt_text: string | null }): void {
  if (!artwork.image_url) {
    throw new ValidationError('Image URL is required')
  }

  if (!artwork.image_url.startsWith('http')) {
    throw new ValidationError('Invalid image URL format')
  }

  if (artwork.alt_text && artwork.alt_text.length > 200) {
    throw new ValidationError('Alt text must be 200 characters or less')
  }
}

export async function saveNote(content: string, title: string = ""): Promise<Note> {
  try {
    console.log('Starting saveNote with:', { content, title })
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    validateNoteInput(title, content)

    // Use client Supabase for public operations like submitting notes
    const supabase = getSupabaseClient('client')
    
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .insert([
        {
          title,
          content,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (noteError) {
      console.error('Supabase error saving note:', {
        code: noteError.code,
        message: noteError.message,
        details: noteError.details,
        hint: noteError.hint
      })
      throw noteError
    }

    if (!note) {
      throw new Error('No data returned after saving note')
    }

    // Then create the artwork record with the note ID
    const { data: artwork, error: artworkError } = await supabase
      .from('artwork')
      .insert([
        {
          note_id: note.id,
          image_url: 'https://placehold.co/500x500?text=Generating+Artwork...',
          alt_text: 'Placeholder artwork'
        }
      ])
      .select()
      .single()

    if (artworkError) {
      console.error('Error creating artwork record:', artworkError)
      // Don't throw here, as the note was created successfully
    }

    // Return the note with the artwork
    return {
      ...note,
      artwork: artwork || {
        id: note.id,
        image_url: 'https://placehold.co/500x500?text=Generating+Artwork...',
        alt_text: 'Placeholder artwork'
      }
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Original error in saveNote:', error)
    throw error
  }
}

export async function getAllNotes(): Promise<Note[]> {
  try {
    // Create a server-side Supabase client for authenticated requests
    const supabase = await createServerSupabaseClient()
    
    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      isProduction: process.env.NODE_ENV === 'production',
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...'
    })

    // Test the connection with a simple query
    const { data: testData, error: testError } = await supabase
      .from('notes')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('Database connection test failed:', {
        code: testError.code,
        message: testError.message,
        details: testError.details
      })
      throw new Error('Database connection test failed')
    }

    console.log('Database connection test successful')

    // Proceed with the full query
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error('Failed to fetch notes')
    }

    console.log('Successfully fetched notes:', {
      count: data?.length || 0,
      firstNoteId: data?.[0]?.id,
      lastNoteId: data?.[data.length - 1]?.id
    })

    return data || []
  } catch (error) {
    console.error('Unexpected error in getAllNotes:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw new Error('An unexpected error occurred while fetching notes')
  }
}

export async function getNoteById(id: number): Promise<Note | null> {
  try {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid note ID')
    }

    // For public access to a specific note, use the client Supabase
    const supabase = getSupabaseClient('client')
    
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Note not found
      }
      console.error('Error fetching note:', error)
      throw new Error('Failed to fetch note')
    }

    return data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Unexpected error fetching note:', error)
    throw new Error('An unexpected error occurred while fetching the note')
  }
}

export async function updateNoteStatus(id: number, status: 'approved' | 'rejected'): Promise<Note | null> {
  try {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid note ID')
    }

    if (!['approved', 'rejected'].includes(status)) {
      throw new ValidationError('Invalid status')
    }

    // Use server client for admin operations like approving/rejecting notes
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('notes')
      .update({
        status,
        approved_at: status === 'approved' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .single()

    if (error) {
      console.error('Error updating note status:', error)
      throw new Error('Failed to update note status')
    }

    return data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Unexpected error updating note status:', error)
    throw new Error('An unexpected error occurred while updating the note status')
  }
}

export async function updateNoteArtwork(id: number, artwork: { image_url: string; alt_text: string | null }): Promise<Note | null> {
  try {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid note ID')
    }

    validateArtworkInput(artwork)

    // Use server client for admin operations
    const supabase = await createServerSupabaseClient()
    
    // Update the artwork directly since we know it exists (created by trigger)
    const { error: updateError } = await supabase
      .from('artwork')
      .update({
        image_url: artwork.image_url,
        alt_text: artwork.alt_text
      })
      .eq('note_id', id)

    if (updateError) {
      console.error('Error updating artwork:', updateError)
      throw new Error('Failed to update artwork')
    }

    // Return the updated note with artwork
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching updated note:', error)
      throw new Error('Failed to fetch updated note')
    }

    return data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Unexpected error updating artwork:', error)
    throw new Error('An unexpected error occurred while updating the artwork')
  }
}

export async function updateNoteTitle(id: number, title: string): Promise<Note | null> {
  try {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid note ID')
    }

    if (title.length > MAX_TITLE_LENGTH) {
      throw new ValidationError(`Title must be ${MAX_TITLE_LENGTH} characters or less`)
    }

    // Use server client for admin operations
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('notes')
      .update({ title })
      .eq('id', id)
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .single()

    if (error) {
      console.error('Error updating note title:', error)
      throw new Error('Failed to update note title')
    }

    return data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Unexpected error updating note title:', error)
    throw new Error('An unexpected error occurred while updating the note title')
  }
}

// New helper function to get notes by status
export async function getNotesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Note[]> {
  try {
    // Use server client for admin operations
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        artwork:artwork (
          id,
          image_url,
          alt_text
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes by status:', error)
      throw new Error('Failed to fetch notes by status')
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching notes by status:', error)
    throw new Error('An unexpected error occurred while fetching notes by status')
  }
}

export async function deleteNote(id: number): Promise<void> {
  try {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid note ID')
    }

    // Use server client for admin operations
    const supabase = await createServerSupabaseClient()
    
    // First delete the artwork (if it exists)
    const { error: artworkError } = await supabase
      .from('artwork')
      .delete()
      .eq('note_id', id)

    if (artworkError) {
      console.error('Error deleting artwork:', artworkError)
      throw new Error('Failed to delete artwork')
    }

    // Then delete the note
    const { error: noteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (noteError) {
      console.error('Error deleting note:', noteError)
      throw new Error('Failed to delete note')
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    console.error('Unexpected error deleting note:', error)
    throw new Error('An unexpected error occurred while deleting the note')
  }
} 