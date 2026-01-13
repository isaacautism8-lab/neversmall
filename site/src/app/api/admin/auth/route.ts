import { NextRequest, NextResponse } from 'next/server'

// Edge runtime for Cloudflare Pages
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { passphrase } = body

    if (!passphrase || typeof passphrase !== 'string') {
      return NextResponse.json(
        { error: 'Passphrase is required' },
        { status: 400 }
      )
    }

    const correctPassphrase = process.env.ADMIN_PASSPHRASE

    if (!correctPassphrase) {
      console.error('ADMIN_PASSPHRASE not configured')
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    // Timing-safe comparison would be ideal, but for MVP simple comparison is acceptable
    if (passphrase !== correctPassphrase) {
      return NextResponse.json(
        { error: 'Invalid passphrase' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
