import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

async function notionGetPage(pageId: string, apiKey: string) {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }
  return response.json()
}

async function notionGetBlocks(blockId: string, apiKey: string) {
  const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
  })
  if (!response.ok) {
    return { results: [] } // Return empty if can't fetch blocks
  }
  return response.json()
}

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

// Extract text from rich text array
function extractText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return ''
  return richText.map(t => t.plain_text || '').join('')
}

// Parse Notion blocks into a simpler format
function parseBlocks(blocks: any[]): any[] {
  return blocks.map(block => {
    const type = block.type
    const content = block[type]
    
    const parsed: any = {
      id: block.id,
      type,
      hasChildren: block.has_children,
    }

    switch (type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'bulleted_list_item':
      case 'numbered_list_item':
      case 'quote':
      case 'callout':
        parsed.text = extractText(content?.rich_text)
        if (content?.icon) parsed.icon = content.icon.emoji || content.icon.external?.url
        if (content?.color) parsed.color = content.color
        break
      case 'to_do':
        parsed.text = extractText(content?.rich_text)
        parsed.checked = content?.checked || false
        break
      case 'code':
        parsed.text = extractText(content?.rich_text)
        parsed.language = content?.language
        break
      case 'image':
        parsed.url = content?.file?.url || content?.external?.url
        parsed.caption = extractText(content?.caption)
        break
      case 'video':
        parsed.url = content?.file?.url || content?.external?.url
        break
      case 'file':
        parsed.url = content?.file?.url || content?.external?.url
        parsed.name = content?.name || 'File'
        break
      case 'bookmark':
      case 'embed':
        parsed.url = content?.url
        parsed.caption = extractText(content?.caption)
        break
      case 'divider':
        break
      case 'child_page':
        parsed.title = content?.title
        break
      case 'child_database':
        parsed.title = content?.title
        break
      case 'toggle':
        parsed.text = extractText(content?.rich_text)
        break
      default:
        parsed.raw = content
    }

    return parsed
  })
}

function verifyToken(token: string): { clientId: string; username: string } | null {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) return null
    return { clientId: decoded.clientId, username: decoded.username }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
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
    const apiKey = process.env.NOTION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const page = await notionGetPage(session.clientId, apiKey) as any
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
      notionUrl: page.url, // Direct link to Notion page
    }

    // Fetch page content (blocks)
    let content: any[] = []
    let childPages: any[] = []
    
    try {
      const blocksResponse = await notionGetBlocks(session.clientId, apiKey)
      const parsedBlocks = parseBlocks(blocksResponse.results || [])
      
      // Separate child pages from content
      childPages = parsedBlocks.filter(b => b.type === 'child_page' || b.type === 'child_database')
      content = parsedBlocks.filter(b => b.type !== 'child_page' && b.type !== 'child_database')
      
      // Fetch content for child pages (first level only)
      for (const childPage of childPages) {
        try {
          const childBlocks = await notionGetBlocks(childPage.id, apiKey)
          childPage.content = parseBlocks(childBlocks.results || [])
        } catch (e) {
          childPage.content = []
        }
      }
    } catch (e) {
      console.error('Error fetching page content:', e)
    }

    // Fetch updates from Updates database
    const updatesDbId = process.env.NOTION_UPDATES_DB_ID
    let updates: any[] = []
    
    if (updatesDbId) {
      try {
        const updatesResponse = await notionQuery(updatesDbId, apiKey, {
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
      }
    }

    return NextResponse.json({ 
      project: projectData, 
      content,
      childPages,
      updates 
    })
  } catch (error) {
    console.error('Error fetching client data:', error)
    return NextResponse.json({ error: 'Failed to fetch client data' }, { status: 500 })
  }
}
