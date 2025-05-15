import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadLegacyNotes() {
  try {
    // Read the legacy notes file
    const notesPath = path.join(process.cwd(), 'data', 'notes.json')
    const notesData = JSON.parse(fs.readFileSync(notesPath, 'utf-8'))

    console.log(`Found ${notesData.length} legacy notes to upload`)

    // Upload each note and its artwork
    for (const note of notesData) {
      console.log(`\nProcessing note ${note.id}: ${note.title || 'Untitled'}`)

      // First, create the note
      const { data: newNote, error: noteError } = await supabase
        .from('notes')
        .insert([
          {
            title: note.title,
            content: note.content,
            status: note.status,
            created_at: note.created_at,
            approved_at: note.approved_at
          }
        ])
        .select()
        .single()

      if (noteError) {
        console.error('Error creating note:', noteError)
        continue
      }

      console.log(`Created note with ID: ${newNote.id}`)

      // Then create the artwork if it exists
      if (note.artwork) {
        const { error: artworkError } = await supabase
          .from('artwork')
          .insert([
            {
              note_id: newNote.id,
              image_url: note.artwork.image_url,
              alt_text: note.artwork.alt_text
            }
          ])

        if (artworkError) {
          console.error('Error creating artwork:', artworkError)
        } else {
          console.log('Created artwork successfully')
        }
      }
    }

    console.log('\nUpload complete!')
  } catch (error) {
    console.error('Error uploading legacy notes:', error)
  }
}

// Run the upload
uploadLegacyNotes() 