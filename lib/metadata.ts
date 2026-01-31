import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10na.city'
const SITE_NAME = 'Tenacity'

interface GenerateMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: GenerateMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@tenacity',
    },
    alternates: {
      canonical: url,
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
  }
}

// Arena-specific metadata
export const arenaMetadata: Metadata = {
  title: 'The Arena | Tenacity',
  description: 'Where builders share ideas, discuss ventures, and forge connections. Step in, speak up, and grow together.',
  openGraph: {
    title: 'The Arena',
    description: 'Where builders share ideas, discuss ventures, and forge connections. Step in, speak up, and grow together.',
    url: `${SITE_URL}/arena`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/arena-og.png`,
        width: 1200,
        height: 630,
        alt: 'The Arena - A community for builders',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Arena | Tenacity',
    description: 'Where builders share ideas, discuss ventures, and forge connections.',
    images: [`${SITE_URL}/arena-og.png`],
  },
}
