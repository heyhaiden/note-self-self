import fs from 'fs'
import path from 'path'

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

const DATA_FILE = path.join(process.cwd(), 'data', 'notes.json')

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]))
}

export function saveNote(content: string): Note {
  const notes = getAllNotes()
  const newNote: Note = {
    id: notes.length + 1,
    title: "", // Empty title by default
    content,
    status: 'pending',
    artwork: null,
    created_at: new Date().toISOString(),
    approved_at: null
  }
  
  notes.push(newNote)
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2))
  return newNote
}

export function getAllNotes(): Note[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading notes:', error)
    return []
  }
}

export function getNoteById(id: number): Note | null {
  const notes = getAllNotes()
  return notes.find(note => note.id === id) || null
}

export function updateNoteStatus(id: number, status: 'approved' | 'rejected'): Note | null {
  const notes = getAllNotes()
  const noteIndex = notes.findIndex(note => note.id === id)
  
  if (noteIndex === -1) return null
  
  const updatedNote = {
    ...notes[noteIndex],
    status,
    approved_at: status === 'approved' ? new Date().toISOString() : null
  }
  
  notes[noteIndex] = updatedNote
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2))
  return updatedNote
}

export function updateNoteArtwork(id: number, artwork: { id: number; image_url: string; alt_text: string | null }): Note | null {
  const notes = getAllNotes()
  const noteIndex = notes.findIndex(note => note.id === id)
  
  if (noteIndex === -1) return null
  
  const updatedNote = {
    ...notes[noteIndex],
    artwork
  }
  
  notes[noteIndex] = updatedNote
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2))
  return updatedNote
}

export function updateNoteTitle(id: number, title: string): Note | null {
  const notes = getAllNotes()
  const noteIndex = notes.findIndex(note => note.id === id)
  
  if (noteIndex === -1) return null
  
  const updatedNote = {
    ...notes[noteIndex],
    title
  }
  
  notes[noteIndex] = updatedNote
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2))
  return updatedNote
} 