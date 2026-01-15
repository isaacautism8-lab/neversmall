import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

// Verify session token
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
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const session = verifyToken(token)
  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  try {
    const notion = getNotionClient()

    // Fetch client page
    const page = await notion.pages.retrieve({ page_id: session.clientId }) as any
    const props = page.properties

    const clientData = {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text || 'Client',
      status: props.Status?.select?.name || 'Active',
      startDate: props['Start Date']?.date?.start || null,
      targetCompletion: props['Target Completion']?.date?.start || null,
      deliverablesLink: props['Deliverables Link']?.url || null,
      clientName: props['Client Name']?.rich_text?.[0]?.plain_text || '',
    }

    // Fetch child blocks (portal content)
    const blocks = await notion.blocks.children.list({ block_id: session.clientId })
    
    // Extract databases and pages from blocks
    const childDatabases: any[] = []
    const childPages: any[] = []

    for (const block of blocks.results as any[]) {
      if (block.type === 'child_database') {
        try {
          const db = await notion.databases.retrieve({ database_id: block.id })
          const dbTitle = (db as any).title?.[0]?.plain_text || 'Database'
          childDatabases.push({ id: block.id, title: dbTitle, type: 'database' })
        } catch (e) {
          // Skip if can't access
        }
      } else if (block.type === 'child_page') {
        try {
          const pg = await notion.pages.retrieve({ page_id: block.id }) as any
          const pgTitle = pg.properties?.title?.title?.[0]?.plain_text || 'Page'
          childPages.push({ id: block.id, title: pgTitle, type: 'page' })
        } catch (e) {
          // Skip if can't access
        }
      }
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
          title: u.properties.Title?.title?.[0]?.plain_text || '',
          message: u.properties.Message?.rich_text?.[0]?.plain_text || '',
          type: u.properties.Type?.select?.name || 'FYI',
          from: u.properties.From?.select?.name || 'Studio',
          date: u.properties.Date?.date?.start || null,
        }))
      } catch (e) {
        console.error('Error fetching updates:', e)
      }
    }

    return NextResponse.json({
      client: clientData,
      content: {
        databases: childDatabases,
        pages: childPages,
      },
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
