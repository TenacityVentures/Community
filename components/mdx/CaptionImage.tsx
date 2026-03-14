import Image from 'next/image'

interface CaptionImageProps {
  src: string
  alt: string
  caption: string
}

/**
 * Image with a caption below it.
 *
 * Usage in .mdx:
 *   <CaptionImage
 *     src="/images/my-photo.jpg"
 *     alt="Description"
 *     caption="The caption shown below the image."
 *   />
 */
export function CaptionImage({ src, alt, caption }: CaptionImageProps) {
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
      <figcaption className="mt-3 text-sm text-[#37322f]/50 text-center leading-snug">
        {caption}
      </figcaption>
    </figure>
  )
}
