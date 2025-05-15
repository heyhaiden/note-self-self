import { NextResponse } from 'next/server'
import { deleteNote } from '@/lib/data-access'

// Dynamic rendering is set at the route level via route.ts

export async function DELETE(
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

    await deleteNote(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete note' },
      { status: 500 }
    )
  }
} 