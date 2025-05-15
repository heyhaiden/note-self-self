import { NextResponse } from 'next/server'
import { saveNote, getAllNotes, ValidationError } from '@/lib/notes-storage'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json()
    console.log('Received request with:', { content, title })

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Environment variables are set, proceeding with saveNote')
    const note = await saveNote(content, title)
    console.log('Note saved successfully:', note)
    return NextResponse.json(note)
  } catch (error) {
    console.error('Error in POST /api/notes:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Return the actual error message to the client
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const notes = await getAllNotes()
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error in GET /api/notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
} 