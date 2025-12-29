import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeverSmall Studios | Creative Production & Content Strategy',
  description: 'Video production, editing, and content strategy for thoughtful brands. We craft stories that clarify and visuals that resonate.',
  keywords: ['video production', 'content strategy', 'creative studio', 'brand storytelling', 'Melbourne'],
  authors: [{ name: 'NeverSmall Studios' }],
  openGraph: {
    title: 'NeverSmall Studios',
    description: 'Creative production for thoughtful brands.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">
        {children}
      </body>
    </html>
  )
}
