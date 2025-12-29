import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'neversmall studios | creative production melbourne',
  description: 'Video production, content strategy, social media management, and photography for events, hospitality, and lifestyle brands. Based in Melbourne, Australia.',
  keywords: ['video production', 'content strategy', 'social media management', 'photography', 'Melbourne', 'events', 'hospitality', 'lifestyle brands', 'meta ads'],
  authors: [{ name: 'neversmall studios' }],
  metadataBase: new URL('https://neversmall.com.au'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/assets/NSS Logo.ico',
    shortcut: '/assets/NSS Logo.ico',
    apple: '/assets/NSS Logo.ico',
  },
  openGraph: {
    title: 'neversmall studios',
    description: 'full-service creative support: content, production, and strategy. all in one place.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'neversmall studios',
    url: 'https://neversmall.com.au',
    images: [
      {
        url: '/assets/NSS Logo.png',
        width: 800,
        height: 800,
        alt: 'neversmall studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'neversmall studios',
    description: 'full-service creative support: content, production, and strategy. all in one place.',
    images: ['/assets/NSS Logo.png'],
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
