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
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!projectsDbId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
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
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const client = response.results[0]
    const storedPassword = client.properties.Password?.rich_text?.[0]?.plain_text

    if (!storedPassword || storedPassword !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return client info (without password)
    const clientData = {
      id: client.id,
      name: client.properties.Name?.title?.[0]?.plain_text || 'Client',
      status: client.properties.Status?.select?.name || 'Active',
    }

    // Generate a simple session token (in production, use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      clientId: client.id,
      username,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64')

    return NextResponse.json({
      success: true,
      client: clientData,
      token: sessionToken,
    })
  } catch (error) {
    console.error('Portal auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
