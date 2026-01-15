import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

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

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const apiKey = process.env.NOTION_API_KEY
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    if (!projectsDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Find client by username
    const response = await notionQuery(projectsDbId, apiKey, {
      filter: {
        property: 'Username',
        rich_text: { equals: username },
      },
    })

    if (response.results.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const client = response.results[0]
    const storedPassword = client.properties.Password?.rich_text?.[0]?.plain_text

    if (!storedPassword || storedPassword !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session token (simple base64 encoded JSON with expiry)
    const token = btoa(JSON.stringify({
      clientId: client.id,
      username,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    }))

    return NextResponse.json({ 
      token,
      clientName: client.properties['Client Name']?.rich_text?.[0]?.plain_text || username
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
