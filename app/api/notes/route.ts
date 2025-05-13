import { NextResponse } from 'next/server'
import { saveNote } from '@/lib/notes-storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const note = await saveNote(content)
    return NextResponse.json(note, { status: 200 })
  } catch (error) {
    console.error('Error submitting note:', error)
    return NextResponse.json(
      { error: 'Failed to submit note' },
      { status: 500 }
    )
  }
} 