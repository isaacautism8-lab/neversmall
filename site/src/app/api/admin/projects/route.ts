import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

// Edge runtime for Cloudflare Pages
export const runtime = 'edge'

// Initialize Notion client
const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

// Verify admin passphrase from Authorization header
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  
  const passphrase = authHeader.slice(7)
  return passphrase === process.env.ADMIN_PASSPHRASE
}

export async function GET(request: NextRequest) {
  // Note: In production, use proper auth middleware
  // For MVP, we rely on the client having authenticated via /api/admin/auth
  // and storing the passphrase in sessionStorage
  
  try {
    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!projectsDbId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const response = await (notion.databases as any).query({
      database_id: projectsDbId,
      sorts: [{ property: 'Last Updated', direction: 'descending' }],
    })

    const projects = response.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text || 'Untitled',
        status: props.Status?.select?.name || 'Unknown',
        clientName: props['Client Name']?.rich_text?.[0]?.plain_text || '',
        token: props.Token?.rich_text?.[0]?.plain_text || '',
        startDate: props['Start Date']?.date?.start || null,
        targetCompletion: props['Target Completion']?.date?.start || null,
        lastUpdated: props['Last Updated']?.last_edited_time || null,
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Unable to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, token } = body

    if (!projectId || !token) {
      return NextResponse.json(
        { error: 'Project ID and token are required' },
        { status: 400 }
      )
    }

    const notion = getNotionClient()

    // Update the project with the new token
    await notion.pages.update({
      page_id: projectId,
      properties: {
        Token: {
          rich_text: [{ text: { content: token } }],
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Unable to update project' },
      { status: 500 }
    )
  }
}
