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

// Allowlist: Only these fields are exposed to clients
const CLIENT_SAFE_FIELDS = [
  'Name',
  'Status',
  'Client Name',
  'Start Date',
  'Target Completion',
  'Deliverables Link',
  'Last Updated',
] as const

// Type for Notion page properties
type NotionProperties = Record<string, any>

// Simple in-memory cache (per-instance)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Extract safe fields from Notion page
function extractSafeFields(page: any): Record<string, any> {
  const properties = page.properties as NotionProperties
  const result: Record<string, any> = {}

  for (const field of CLIENT_SAFE_FIELDS) {
    const prop = properties[field]
    if (!prop) continue

    switch (prop.type) {
      case 'title':
        result[toCamelCase(field)] = prop.title?.[0]?.plain_text || ''
        break
      case 'rich_text':
        result[toCamelCase(field)] = prop.rich_text?.[0]?.plain_text || ''
        break
      case 'select':
        result[toCamelCase(field)] = prop.select?.name || ''
        break
      case 'date':
        result[toCamelCase(field)] = prop.date?.start || null
        break
      case 'url':
        result[toCamelCase(field)] = prop.url || null
        break
      case 'last_edited_time':
        result[toCamelCase(field)] = prop.last_edited_time || null
        break
      default:
        break
    }
  }

  return result
}

// Convert "Field Name" to "fieldName"
function toCamelCase(str: string): string {
  return str
    .split(' ')
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')
}

// Fetch updates for a project
async function fetchProjectUpdates(notion: Client, projectId: string) {
  const updatesDbId = process.env.NOTION_UPDATES_DB_ID
  if (!updatesDbId) return []

  try {
    const response = await (notion.databases as any).query({
      database_id: updatesDbId,
      filter: {
        property: 'Project',
        relation: { contains: projectId },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    return response.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || '',
        message: props.Message?.rich_text?.[0]?.plain_text || '',
        type: props.Type?.select?.name || 'FYI',
        from: props.From?.select?.name || 'Studio',
        date: props.Date?.date?.start || null,
      }
    })
  } catch (error) {
    console.error('Error fetching updates:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params

  // Validate token format (must be at least 20 chars)
  if (!token || token.length < 20) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 400 }
    )
  }

  // Check cache first
  const cacheKey = `project-${token}`
  const cached = getCached(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  try {
    const notion = getNotionClient()
    const projectsDbId = process.env.NOTION_PROJECTS_DB_ID

    if (!projectsDbId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Find project by token
    const response = await (notion.databases as any).query({
      database_id: projectsDbId,
      filter: {
        property: 'Token',
        rich_text: { equals: token },
      },
    })

    if (response.results.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = response.results[0]

    // Extract only client-safe fields
    const safeData = extractSafeFields(project)

    // Fetch updates for this project
    const updates = await fetchProjectUpdates(notion, project.id)

    const responseData = {
      project: safeData,
      updates,
      meta: {
        cached_at: new Date().toISOString(),
        cache_ttl: CACHE_TTL / 1000,
      },
    }

    // Cache the response
    setCache(cacheKey, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Notion API error:', error)
    return NextResponse.json(
      { error: 'Unable to fetch project data' },
      { status: 500 }
    )
  }
}
