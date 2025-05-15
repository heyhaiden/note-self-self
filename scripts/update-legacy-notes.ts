import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateLegacyNotes() {
  try {
    // Get all notes
    const { data: notes, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .order('id', { ascending: true })

    if (fetchError) {
      console.error('Error fetching notes:', fetchError)
      return
    }

    console.log(`Found ${notes.length} notes to update`)

    // Update each note to approved status
    for (const note of notes) {
      console.log(`\nUpdating note ${note.id}: ${note.title || 'Untitled'}`)

      const { error: updateError } = await supabase
        .from('notes')
        .update({
          status: 'approved',
          approved_at: note.approved_at || note.created_at
        })
        .eq('id', note.id)

      if (updateError) {
        console.error('Error updating note:', updateError)
      } else {
        console.log('Note updated successfully')
      }
    }

    console.log('\nUpdate complete!')
  } catch (error) {
    console.error('Error updating legacy notes:', error)
  }
}

// Run the update
updateLegacyNotes() 