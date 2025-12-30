import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'neversmall studios | Video Production & Content Strategy Melbourne',
    template: '%s | neversmall studios',
  },
  description: 'Melbourne creative studio specialising in video production, photography, social media management, and Meta ads for events, hospitality, and lifestyle brands. Don\'t sell yourself short.',
  keywords: [
    'video production melbourne',
    'content strategy melbourne',
    'social media management melbourne',
    'photography melbourne',
    'event videography melbourne',
    'hospitality photography',
    'lifestyle brand content',
    'meta ads agency melbourne',
    'instagram content creation',
    'brand videography',
    'creative studio melbourne',
    'neversmall studios',
  ],
  authors: [{ name: 'neversmall studios', url: 'https://neversmall.com.au' }],
  creator: 'neversmall studios',
  publisher: 'neversmall studios',
  metadataBase: new URL('https://neversmall.com.au'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/assets/nss-logo.ico', sizes: 'any' },
      { url: '/assets/nss-logo.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/assets/nss-logo.ico',
    apple: [
      { url: '/assets/nss-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'neversmall studios | Creative Production Melbourne',
    description: 'Video production, photography, social media management, and Meta ads for events, hospitality, and lifestyle brands. Based in Melbourne, Australia. Don\'t sell yourself short.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'neversmall studios',
    url: 'https://neversmall.com.au',
    images: [
      {
        url: '/assets/nss-logo.png',
        width: 800,
        height: 800,
        alt: 'neversmall studios - Melbourne Creative Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'neversmall studios | Creative Production Melbourne',
    description: 'Video production, photography, social media & Meta ads for events, hospitality, and lifestyle brands. Melbourne, Australia.',
    images: ['/assets/nss-logo.png'],
    creator: '@neversmallstudios',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  category: 'Creative Services',
  classification: 'Video Production, Photography, Social Media Marketing',
  other: {
    'geo.region': 'AU-VIC',
    'geo.placename': 'Melbourne',
    'geo.position': '-37.8136;144.9631',
    'ICBM': '-37.8136, 144.9631',
  },
}

// JSON-LD Structured Data for Google & LLM SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://neversmall.com.au/#organization',
      name: 'neversmall studios',
      alternateName: 'neversmall',
      url: 'https://neversmall.com.au',
      logo: {
        '@type': 'ImageObject',
        url: 'https://neversmall.com.au/assets/nss-logo.png',
        width: 800,
        height: 800,
      },
      image: 'https://neversmall.com.au/assets/nss-logo.png',
      description: 'Melbourne creative studio specialising in video production, photography, social media management, and Meta ads for events, hospitality, and lifestyle brands.',
      slogan: "Don't sell yourself short.",
      email: 'hello@neversmall.com.au',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: -37.8136,
          longitude: 144.9631,
        },
        geoRadius: '50000',
      },
      sameAs: [
        'https://instagram.com/neversmall.studios',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@neversmall.com.au',
        availableLanguage: 'English',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://neversmall.com.au/#website',
      url: 'https://neversmall.com.au',
      name: 'neversmall studios',
      description: 'Creative production studio in Melbourne',
      publisher: {
        '@id': 'https://neversmall.com.au/#organization',
      },
      inLanguage: 'en-AU',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://neversmall.com.au/#localbusiness',
      name: 'neversmall studios',
      image: 'https://neversmall.com.au/assets/nss-logo.png',
      '@additionalType': [
        'https://schema.org/ProfessionalService',
        'https://schema.org/CreativeAgency',
      ],
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -37.8136,
        longitude: 144.9631,
      },
      email: 'hello@neversmall.com.au',
      url: 'https://neversmall.com.au',
      sameAs: [
        'https://instagram.com/neversmall.studios',
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Video Production',
            description: 'Event coverage, brand campaigns, short-form social content, interviews & storytelling',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photography',
            description: 'Product photography, lifestyle & campaign shoots, event photography, creative direction',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Management',
            description: 'Content calendar, caption writing, analytics & reporting, strategy consulting',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Meta Ads',
            description: 'Campaign strategy, retargeting, A/B testing, performance tracking & optimisation',
          },
        },
      ],
    },
  ],
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
        <link rel="canonical" href="https://neversmall.com.au" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
