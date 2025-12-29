import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'neversmall studios | creative production melbourne',
  description: 'Video production, content strategy, social media management, and photography for events, hospitality, and lifestyle brands. Based in Melbourne, Australia.',
  keywords: ['video production', 'content strategy', 'social media management', 'photography', 'Melbourne', 'events', 'hospitality', 'lifestyle brands', 'meta ads'],
  authors: [{ name: 'neversmall studios' }],
  metadataBase: new URL('https://neversmall.com.au'),
  icons: {
    icon: '/assets/nss-logo.ico',
    shortcut: '/assets/nss-logo.ico',
    apple: '/assets/nss-logo.png',
  },
  openGraph: {
    title: 'neversmall studios',
    description: 'Don\'t sell yourself short.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'neversmall studios',
    url: 'https://neversmall.com.au',
    images: [
      {
        url: '/assets/nss-logo.png',
        width: 800,
        height: 800,
        alt: 'neversmall studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'neversmall studios',
    description: 'Don\'t sell yourself short.',
    images: ['/assets/nss-logo.png'],
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
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
