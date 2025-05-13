import { NextResponse } from 'next/server'
import { updateNoteStatus } from '@/lib/notes-storage'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedNote = await updateNoteStatus(id, status as 'approved' | 'rejected')
    
    if (!updatedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Error updating note status:', error)
    return NextResponse.json(
      { error: 'Failed to update note status' },
      { status: 500 }
    )
  }
} 