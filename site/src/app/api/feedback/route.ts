import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY not configured')
  return new Client({ auth: apiKey })
}

function decodePortalToken(token: string): { clientId: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
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

    const notion = getNotionClient()
    const updatesDbId = process.env.NOTION_UPDATES_DB_ID

    if (!updatesDbId) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const session = decodePortalToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await notion.pages.create({
      parent: { database_id: updatesDbId },
      properties: {
        Title: { title: [{ text: { content: 'Client Feedback' } }] },
        ProjectId: { rich_text: [{ text: { content: session.clientId } }] },
        Message: { rich_text: [{ text: { content: message.trim() } }] },
        Type: { select: { name: 'Feedback' } },
        From: { select: { name: 'Client' } },
        Date: { date: { start: new Date().toISOString().split('T')[0] } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
