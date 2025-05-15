import { NextResponse } from 'next/server'
import { getNoteById, updateNoteArtwork } from '@/lib/notes-storage'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

const MINDSTUDIO_API_KEY = process.env.MINDSTUDIO_API_KEY
const MINDSTUDIO_API_URL = 'https://api.mindstudio.ai/developer/v2/apps/run'
const MINDSTUDIO_AGENT_ID = process.env.MINDSTUDIO_AGENT_ID

export async function POST(
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

    const note = await getNoteById(id)
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    if (!MINDSTUDIO_AGENT_ID) {
      throw new Error('MindStudio agent ID is not configured')
    }

    if (!MINDSTUDIO_API_KEY) {
      throw new Error('MindStudio API key is not configured')
    }

    console.log('Calling MindStudio API for note:', id)
    console.log('Note content:', note.content)
    console.log('Using agent ID:', MINDSTUDIO_AGENT_ID)
    
    // Call MindStudio API to generate image
    const response = await fetch(MINDSTUDIO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINDSTUDIO_API_KEY}`,
      },
      body: JSON.stringify({
        appId: MINDSTUDIO_AGENT_ID,
        variables: {
          journalText: note.content
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MindStudio API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`MindStudio API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    // Get the response as text
    const responseText = await response.text()
    console.log('Raw response from MindStudio API:', responseText)

    // Parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
      console.log('Parsed MindStudio API response:', JSON.stringify(data, null, 2))
    } catch (parseError) {
      console.error('Failed to parse MindStudio API response as JSON:', parseError)
      throw new Error('Invalid JSON response from MindStudio API')
    }

    // Extract the image URL from the response
    let imageUrl = ''
    if (data && typeof data === 'object') {
      console.log('Response data type:', typeof data)
      console.log('Response data keys:', Object.keys(data))
      
      // Check for different possible response formats
      if (data.image_url && typeof data.image_url === 'string') {
        // Format 1: Direct image_url
        console.log('Found image_url:', data.image_url)
        if (data.image_url.startsWith('http')) {
          imageUrl = data.image_url
          console.log('Using direct URL:', imageUrl)
        } else if (data.image_url === '{{generatedArtwork}}') {
          // Format 2: Template that needs resolution
          console.log('Found template, waiting for resolution')
          const resolvedResponse = await fetch(MINDSTUDIO_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${MINDSTUDIO_API_KEY}`,
            },
            body: JSON.stringify({
              appId: MINDSTUDIO_AGENT_ID,
              variables: {
                journalText: note.content
              }
            }),
          })

          if (!resolvedResponse.ok) {
            const errorText = await resolvedResponse.text()
            console.error('Failed to get resolved image URL:', {
              status: resolvedResponse.status,
              statusText: resolvedResponse.statusText,
              body: errorText
            })
            throw new Error('Failed to get resolved image URL')
          }

          const resolvedText = await resolvedResponse.text()
          console.log('Raw resolved response:', resolvedText)
          
          const resolvedData = JSON.parse(resolvedText)
          console.log('Parsed resolved response:', JSON.stringify(resolvedData, null, 2))

          if (resolvedData && resolvedData.image_url && resolvedData.image_url.startsWith('http')) {
            imageUrl = resolvedData.image_url
            console.log('Using resolved URL:', imageUrl)
          } else if (resolvedData && resolvedData.generatedArtwork && typeof resolvedData.generatedArtwork === 'string') {
            // Format 3: generatedArtwork field
            imageUrl = resolvedData.generatedArtwork
            console.log('Using generatedArtwork URL:', imageUrl)
          } else {
            console.error('Invalid resolved response format:', resolvedData)
          }
        }
      } else if (data.generatedArtwork && typeof data.generatedArtwork === 'string') {
        // Format 4: Direct generatedArtwork field
        imageUrl = data.generatedArtwork
        console.log('Using direct generatedArtwork URL:', imageUrl)
      } else if (data.result && typeof data.result === 'object') {
        // Format 5: Nested result object
        if (data.result.image_url && typeof data.result.image_url === 'string') {
          imageUrl = data.result.image_url
          console.log('Using nested result image_url:', imageUrl)
        } else if (data.result.generatedArtwork && typeof data.result.generatedArtwork === 'string') {
          imageUrl = data.result.generatedArtwork
          console.log('Using nested result generatedArtwork:', imageUrl)
        }
      }
    }

    // Validate the URL
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      console.error('Invalid or missing image URL in response:', data)
      throw new Error('Could not extract a valid image URL from the response')
    }

    // Use the trimmed URL to remove any whitespace
    const cleanImageUrl = imageUrl.trim()
    console.log('Final clean image URL:', cleanImageUrl)
    
    // Update the artwork with the URL
    const finalNote = await updateNoteArtwork(id, {
      image_url: cleanImageUrl,
      alt_text: `Generated artwork for note ${note.id}`
    })
    
    console.log('Note updated with artwork:', finalNote)
    return NextResponse.json(finalNote)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}