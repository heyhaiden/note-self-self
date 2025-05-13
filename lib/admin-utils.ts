// Mock data for development
const mockNotes = [
  {
    id: 1,
    content: "Sample note 1",
    category_id: 1,
    status: "pending",
    is_screenshot: false,
    screenshot_url: null,
    rejection_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    approved_at: null,
    categories: { id: 1, name: "General", slug: "general" }
  },
  {
    id: 2,
    content: "Sample note 2",
    category_id: 2,
    status: "approved",
    is_screenshot: false,
    screenshot_url: null,
    rejection_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    categories: { id: 2, name: "Personal", slug: "personal" }
  }
];

// Function to fetch pending submissions
export async function getPendingSubmissions(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const pendingNotes = mockNotes.filter(note => note.status === "pending");
  const paginatedNotes = pendingNotes.slice(offset, offset + limit);

  return {
    submissions: paginatedNotes,
    total: pendingNotes.length,
    page,
    limit,
    hasMore: offset + limit < pendingNotes.length,
  };
}

// Function to fetch processed submissions
export async function getProcessedSubmissions(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const processedNotes = mockNotes.filter(note => note.status === "approved" || note.status === "rejected");
  const paginatedNotes = processedNotes.slice(offset, offset + limit);

  return {
    submissions: paginatedNotes,
    total: processedNotes.length,
    page,
    limit,
    hasMore: offset + limit < processedNotes.length,
  };
}

// Function to get submission counts
export async function getSubmissionCounts() {
  const pendingCount = mockNotes.filter(note => note.status === "pending").length;
  const approvedCount = mockNotes.filter(note => note.status === "approved").length;
  const rejectedCount = mockNotes.filter(note => note.status === "rejected").length;

  return {
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    todayPending: 0,
    todayApproved: 0,
    todayRejected: 0,
  };
}

// Function to get a single submission by ID
export async function getSubmissionById(id: number) {
  const note = mockNotes.find(note => note.id === id);
  if (!note) {
    throw new Error("Submission not found");
  }
  return note;
}

// Function to generate artwork for a note
export async function generateArtwork(noteId: number, noteContent: string) {
  // In a real implementation, this would call an AI service to generate artwork
  // For now, we'll create a placeholder image URL
  const imageUrl = `/placeholder.svg?height=600&width=600&query=minimalist abstract line art, black and white, ${encodeURIComponent(
    noteContent.substring(0, 50),
  )}`;

  // Return a simple object with the image URL
  return {
    id: noteId,
    note_id: noteId,
    image_url: imageUrl,
    alt_text: `Abstract representation of note: ${noteContent.substring(0, 30)}...`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
