// Data access layer to centralize all database operations
// This helps with:
// 1. Code organization
// 2. Centralized error handling
// 3. Consistent data access patterns

import { getSupabaseClient, createServerSupabaseClient } from './supabase-client'
import { Note, ValidationError } from './notes-storage'

// Maximum content and title lengths
const MAX_TITLE_LENGTH = 50
const MAX_CONTENT_LENGTH = 500

// Note validation
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

// Artwork validation
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

// Notes data access
export const NoteService = {
  // Create a new note
  async createNote(content: string, title: string = ""): Promise<Note> {
    try {
      validateNoteInput(title, content)
      const supabase = getSupabaseClient('client')
      
      // Create the note
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert([{
          title,
          content,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (noteError) {
        console.error('Error creating note:', noteError)
        throw new Error('Failed to create note')
      }

      if (!note) {
        throw new Error('No data returned after creating note')
      }

      // Create placeholder artwork
      const { data: artwork, error: artworkError } = await supabase
        .from('artwork')
        .insert([{
          note_id: note.id,
          image_url: 'https://placehold.co/500x500?text=Generating+Artwork...',
          alt_text: 'Placeholder artwork'
        }])
        .select()
        .single()

      if (artworkError) {
        console.error('Error creating artwork:', artworkError)
        // Don't throw here, the note was created successfully
      }

      // Return the complete note
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
      console.error('Error in createNote:', error)
      throw error
    }
  },

  // Get all notes (admin function)
  async getAllNotes(): Promise<Note[]> {
    try {
      // Use server client for authenticated requests
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
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all notes:', error)
        throw new Error('Failed to fetch notes')
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error in getAllNotes:', error)
      throw new Error('An unexpected error occurred while fetching notes')
    }
  },

  // Get note by ID
  async getNoteById(id: number): Promise<Note | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Invalid note ID')
      }

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
        console.error('Error fetching note by ID:', error)
        throw new Error('Failed to fetch note')
      }

      return data
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      console.error('Error in getNoteById:', error)
      throw new Error('An unexpected error occurred while fetching the note')
    }
  },

  // Get notes by status (admin function)
  async getNotesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Note[]> {
    try {
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
      console.error('Error in getNotesByStatus:', error)
      throw new Error('An unexpected error occurred while fetching notes by status')
    }
  },

  // Update note status (admin function)
  async updateNoteStatus(id: number, status: 'approved' | 'rejected'): Promise<Note | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Invalid note ID')
      }

      if (!['approved', 'rejected'].includes(status)) {
        throw new ValidationError('Invalid status')
      }

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
      console.error('Error in updateNoteStatus:', error)
      throw new Error('An unexpected error occurred while updating the note status')
    }
  },

  // Update note artwork (admin function)
  async updateNoteArtwork(id: number, artwork: { image_url: string; alt_text: string | null }): Promise<Note | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Invalid note ID')
      }

      validateArtworkInput(artwork)

      const supabase = await createServerSupabaseClient()
      
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

      // Return the updated note
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
      console.error('Error in updateNoteArtwork:', error)
      throw new Error('An unexpected error occurred while updating the artwork')
    }
  },

  // Delete note (admin function)
  async deleteNote(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Invalid note ID')
      }

      const supabase = await createServerSupabaseClient()
      
      // Delete the artwork first (if it exists)
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
      console.error('Error in deleteNote:', error)
      throw new Error('An unexpected error occurred while deleting the note')
    }
  }
}

// Export for backward compatibility with existing code
export const {
  createNote: saveNote,
  getAllNotes,
  getNoteById,
  getNotesByStatus,
  updateNoteStatus,
  updateNoteArtwork,
  deleteNote
} = NoteService