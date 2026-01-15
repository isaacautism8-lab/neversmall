import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

async function notionCreatePage(apiKey: string, parent: object, properties: object) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parent, properties }),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }
  return response.json()
}

function decodePortalToken(token: string): { clientId: string } | null {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) return null
    return { clientId: decoded.clientId }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, message } = await request.json()

    if (!token || !message || message.length > 2000 || message.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const apiKey = process.env.NOTION_API_KEY
    const updatesDbId = process.env.NOTION_UPDATES_DB_ID

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    if (!updatesDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const session = decodePortalToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await notionCreatePage(
      apiKey,
      { database_id: updatesDbId },
      {
        Title: { title: [{ text: { content: 'Client Feedback' } }] },
        ProjectId: { rich_text: [{ text: { content: session.clientId } }] },
        Message: { rich_text: [{ text: { content: message.trim() } }] },
        Type: { select: { name: 'Feedback' } },
        From: { select: { name: 'Client' } },
        Date: { date: { start: new Date().toISOString().split('T')[0] } },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
