import { ImageResponse } from 'next/og'
import { getPost } from '@/lib/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f7f5f3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
        }}
      >
        {/* Top: wordmark */}
        <div style={{ color: '#37322f', fontSize: 24, opacity: 0.5 }}>log.10na.city</div>

        {/* Middle: title */}
        <div
          style={{
            color: '#37322f',
            fontSize: post?.title && post.title.length > 60 ? 52 : 64,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {post?.title ?? 'log.10na.city'}
        </div>

        {/* Bottom: tags + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {post?.tags?.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                color: '#37322f',
                opacity: 0.45,
                fontSize: 18,
                border: '1px solid rgba(55,50,47,0.25)',
                borderRadius: 99,
                padding: '4px 14px',
              }}
            >
              {tag}
            </div>
          ))}
          {post?.date && (
            <div style={{ color: '#37322f', opacity: 0.35, fontSize: 18, marginLeft: 8 }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
