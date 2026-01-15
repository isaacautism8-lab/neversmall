import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Direct Notion API calls (SDK doesn't work in edge runtime)
async function notionQuery(databaseId: string, apiKey: string, body: object = {}) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }
  return response.json()
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
    const apiKey = process.env.NOTION_API_KEY
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    if (!projectsDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const response = await notionQuery(projectsDbId, apiKey, {
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
    return NextResponse.json({ error: 'Failed to fetch clients', details: error?.message }, { status: 500 })
  }
}

async function notionUpdatePage(pageId: string, apiKey: string, properties: object) {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }
  return response.json()
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const apiKey = process.env.NOTION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { clientId, username, password, status, startDate, targetCompletion, deliverablesLink, clientName } = body

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }

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

    await notionUpdatePage(clientId, apiKey, properties)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client', details: error?.message }, { status: 500 })
  }
}
