import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!projectsDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Find client by username
    const response = await (notion.databases as any).query({
      database_id: projectsDbId,
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
    const token = Buffer.from(JSON.stringify({
      clientId: client.id,
      username,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    })).toString('base64')

    return NextResponse.json({ 
      token,
      clientName: client.properties['Client Name']?.rich_text?.[0]?.plain_text || username
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
