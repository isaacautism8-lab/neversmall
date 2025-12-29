import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeverSmall Studios | Creative Production Melbourne',
  description: 'Video production, content strategy, and post-production for events, hospitality, and lifestyle brands. Based in Melbourne, Australia.',
  keywords: ['video production', 'content strategy', 'creative studio', 'Melbourne', 'events', 'hospitality', 'lifestyle brands'],
  authors: [{ name: 'NeverSmall Studios' }],
  openGraph: {
    title: 'NeverSmall Studios',
    description: 'Creative production for thoughtful brands.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'NeverSmall Studios',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeverSmall Studios',
    description: 'Creative production for thoughtful brands.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="grain">
        {children}
      </body>
    </html>
  )
}
