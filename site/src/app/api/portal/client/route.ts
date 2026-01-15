import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

// Verify session token and return session data
function verifyToken(token: string): { clientId: string; username: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) return null
    return { clientId: decoded.clientId, username: decoded.username }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  // Support both query param and bearer token
  const url = new URL(request.url)
  let token = url.searchParams.get('token')
  
  if (!token) {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const session = verifyToken(token)
  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  try {
    const notion = getNotionClient()

    // Fetch client page
    const page = await notion.pages.retrieve({ page_id: session.clientId }) as any
    const props = page.properties

    const projectData = {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text || 'Your Project',
      status: props.Status?.select?.name || 'In Progress',
      clientName: props['Client Name']?.rich_text?.[0]?.plain_text || session.username,
      startDate: props['Start Date']?.date?.start || null,
      targetCompletion: props['Target Completion']?.date?.start || null,
      deliverablesLink: props['Deliverables Link']?.url || null,
      lastEdited: page.last_edited_time,
    }

    // Fetch updates for this client
    const updatesDbId = process.env.NOTION_UPDATES_DB_ID
    let updates: any[] = []
    
    if (updatesDbId) {
      try {
        const updatesResponse = await (notion.databases as any).query({
          database_id: updatesDbId,
          filter: {
            property: 'ProjectId',
            rich_text: { equals: session.clientId },
          },
          sorts: [{ property: 'Date', direction: 'descending' }],
        })

        updates = updatesResponse.results.map((u: any) => ({
          id: u.id,
          title: u.properties.Title?.title?.[0]?.plain_text || 'Update',
          message: u.properties.Message?.rich_text?.[0]?.plain_text || '',
          type: u.properties.Type?.select?.name || 'FYI',
          from: u.properties.From?.select?.name || 'Studio',
          date: u.properties.Date?.date?.start || null,
        }))
      } catch (e) {
        console.error('Error fetching updates:', e)
        // Continue without updates
      }
    }

    return NextResponse.json({
      project: projectData,
      updates,
    })
  } catch (error) {
    console.error('Error fetching client data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    )
  }
}
