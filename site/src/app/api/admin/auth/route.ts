import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json()
  const adminPassphrase = process.env.ADMIN_PASSPHRASE

  if (!adminPassphrase) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  if (passphrase === adminPassphrase) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ error: 'Invalid passphrase' }, { status: 401 })
  }
}
