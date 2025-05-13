import { NextResponse } from 'next/server'
import { saveNote } from '@/lib/notes-storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received note submission:', body)
    const { content, title } = body

    if (!content) {
      console.log('Missing content in submission')
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    console.log('Saving note with content:', content, 'and title:', title)
    const note = await saveNote(content, title)
    console.log('Note saved successfully:', note)
    return NextResponse.json(note, { status: 200 })
  } catch (error) {
    console.error('Error submitting note:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit note' },
      { status: 500 }
    )
  }
} 