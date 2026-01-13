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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, message } = body

    // Validation
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID
    const updatesDbId = process.env.NOTION_UPDATES_DB_ID

    if (!projectsDbId || !updatesDbId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Find project by token to get project ID
    const projectResponse = await (notion.databases as any).query({
      database_id: projectsDbId,
      filter: {
        property: 'Token',
        rich_text: { equals: token },
      },
    })

    if (projectResponse.results.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      )
    }

    const projectId = projectResponse.results[0].id

    // Create feedback entry in Updates database
    await notion.pages.create({
      parent: { database_id: updatesDbId },
      properties: {
        Title: {
          title: [{ text: { content: 'Client Feedback' } }],
        },
        Project: {
          relation: [{ id: projectId }],
        },
        Message: {
          rich_text: [{ text: { content: message.trim() } }],
        },
        Type: {
          select: { name: 'Feedback' },
        },
        From: {
          select: { name: 'Client' },
        },
        Date: {
          date: { start: new Date().toISOString().split('T')[0] },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: 'Unable to submit feedback' },
      { status: 500 }
    )
  }
}
