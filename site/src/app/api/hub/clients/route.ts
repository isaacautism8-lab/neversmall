import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  return authHeader.slice(7) === process.env.ADMIN_PASSPHRASE
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!projectsDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const response = await (notion.databases as any).query({
      database_id: projectsDbId,
      sorts: [{ property: 'Name', direction: 'ascending' }],
    })

    const clients = response.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.plain_text || 'Untitled',
        status: props.Status?.select?.name || 'Unknown',
        clientName: props['Client Name']?.rich_text?.[0]?.plain_text || '',
        startDate: props['Start Date']?.date?.start || null,
        targetCompletion: props['Target Completion']?.date?.start || null,
        deliverablesLink: props['Deliverables Link']?.url || null,
        username: props.Username?.rich_text?.[0]?.plain_text || '',
        hasPassword: !!props.Password?.rich_text?.[0]?.plain_text,
        lastEdited: page.last_edited_time,
      }
    })

    const validClients = clients.filter((c: any) => c.name && c.name.trim() !== '')
    return NextResponse.json({ clients: validClients })
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    const message = error?.message || 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to fetch clients', 
      details: message,
      hasApiKey: !!process.env.NOTION_API_KEY,
      hasDbId: !!process.env.NOTION_PROJECTS_DB_ID
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { clientId, username, password, status, startDate, targetCompletion, deliverablesLink, clientName } = body

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }

    const notion = getNotionClient()
    const properties: any = {}

    if (username !== undefined) {
      properties.Username = { rich_text: [{ text: { content: username } }] }
    }
    if (password !== undefined && password !== '') {
      properties.Password = { rich_text: [{ text: { content: password } }] }
    }
    if (status !== undefined) {
      properties.Status = { select: { name: status } }
    }
    if (startDate !== undefined) {
      properties['Start Date'] = startDate ? { date: { start: startDate } } : { date: null }
    }
    if (targetCompletion !== undefined) {
      properties['Target Completion'] = targetCompletion ? { date: { start: targetCompletion } } : { date: null }
    }
    if (deliverablesLink !== undefined) {
      properties['Deliverables Link'] = deliverablesLink ? { url: deliverablesLink } : { url: null }
    }
    if (clientName !== undefined) {
      properties['Client Name'] = { rich_text: [{ text: { content: clientName } }] }
    }

    await notion.pages.update({ page_id: clientId, properties })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}
