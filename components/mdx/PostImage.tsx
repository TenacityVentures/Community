import Image from 'next/image'

interface PostImageProps {
  src: string
  alt: string
}

/**
 * Basic full-width image for use inside MDX posts.
 *
 * Usage in .mdx:
 *   <PostImage src="/images/my-photo.jpg" alt="Description" />
 */
export function PostImage({ src, alt }: PostImageProps) {
  return (
    <figure className="my-8">
      <div className="relative w-full overflow-hidden rounded-sm">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={500}
          className="w-full h-auto object-cover"
          sizes="(max-width: 672px) 100vw, 672px"
        />
      </div>
    </figure>
  )
}
