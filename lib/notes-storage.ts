import fs from 'fs'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), 'data', 'notes.json')

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// Initialize the storage file if it doesn't exist
if (!fs.existsSync(STORAGE_FILE)) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify([]))
}

export type Note = {
  id: number
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  approved_at: string | null
  artwork?: {
    id: number
    image_url: string
    alt_text: string | null
  } | null
}

export async function saveNote(content: string): Promise<Note> {
  const notes = await getAllNotes()
  
  const newNote: Note = {
    id: notes.length + 1,
    content,
    status: 'pending',
    created_at: new Date().toISOString(),
    approved_at: null,
    artwork: null
  }

  notes.push(newNote)
  await fs.promises.writeFile(STORAGE_FILE, JSON.stringify(notes, null, 2))
  
  return newNote
}

export async function getAllNotes(): Promise<Note[]> {
  const data = await fs.promises.readFile(STORAGE_FILE, 'utf-8')
  return JSON.parse(data)
}

export async function getNoteById(id: number): Promise<Note | null> {
  const notes = await getAllNotes()
  return notes.find(note => note.id === id) || null
}

export async function updateNoteStatus(id: number, status: 'approved' | 'rejected'): Promise<Note | null> {
  const notes = await getAllNotes()
  const noteIndex = notes.findIndex(note => note.id === id)
  
  if (noteIndex === -1) return null
  
  notes[noteIndex] = {
    ...notes[noteIndex],
    status,
    approved_at: status === 'approved' ? new Date().toISOString() : null
  }
  
  await fs.promises.writeFile(STORAGE_FILE, JSON.stringify(notes, null, 2))
  return notes[noteIndex]
} 