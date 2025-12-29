import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeverSmall Studios | Creative Production Melbourne',
  description: 'Video production, content strategy, social media management, and photography for events, hospitality, and lifestyle brands. Based in Melbourne, Australia.',
  keywords: ['video production', 'content strategy', 'social media management', 'photography', 'Melbourne', 'events', 'hospitality', 'lifestyle brands', 'meta ads'],
  authors: [{ name: 'NeverSmall Studios' }],
  metadataBase: new URL('https://neversmall.com.au'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/assets/NSS Logo.jpg',
    shortcut: '/assets/NSS Logo.jpg',
    apple: '/assets/NSS Logo.jpg',
  },
  openGraph: {
    title: 'NeverSmall Studios',
    description: 'Full-service creative support: content, production, and strategy. All in one place.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'NeverSmall Studios',
    url: 'https://neversmall.com.au',
    images: [
      {
        url: '/assets/NSS Logo.jpg',
        width: 800,
        height: 800,
        alt: 'NeverSmall Studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeverSmall Studios',
    description: 'Full-service creative support: content, production, and strategy. All in one place.',
    images: ['/assets/NSS Logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
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
