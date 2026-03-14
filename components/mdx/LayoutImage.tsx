import Image from 'next/image'

type Layout = 'full' | 'wide' | 'left' | 'right' | 'split'

interface LayoutImageProps {
  src: string
  alt: string
  caption?: string
  layout?: Layout
  /** Second image src — only used when layout="split" */
  src2?: string
  alt2?: string
}

/**
 * Image with layout control. Supports five layouts:
 *
 * - "full"  (default) — full column width
 * - "wide"  — breaks out of the column, bleeds wider
 * - "left"  — floats left, text wraps right
 * - "right" — floats right, text wraps left
 * - "split" — two images side by side (requires src2 + alt2)
 *
 * Usage in .mdx:
 *   <LayoutImage src="/images/a.jpg" alt="..." layout="wide" />
 *   <LayoutImage src="/images/a.jpg" alt="..." layout="left" caption="Optional caption" />
 *   <LayoutImage src="/images/a.jpg" alt="Left" layout="split" src2="/images/b.jpg" alt2="Right" />
 */
export function LayoutImage({
  src,
  alt,
  caption,
  layout = 'full',
  src2,
  alt2,
}: LayoutImageProps) {
  if (layout === 'split') {
    return (
      <figure className="my-8 -mx-4 sm:-mx-8">
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-sm">
            <Image
              src={src}
              alt={alt}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          {src2 && (
            <div className="flex-1 overflow-hidden rounded-sm">
              <Image
                src={src2}
                alt={alt2 ?? ''}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-[#37322f]/50 text-center leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (layout === 'wide') {
    return (
      <figure className="my-8 -mx-4 sm:-mx-12 md:-mx-24">
        <div className="overflow-hidden rounded-sm">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            sizes="100vw"
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-[#37322f]/50 text-center leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (layout === 'left') {
    return (
      <figure className="my-6 sm:float-left sm:mr-6 sm:mb-2 sm:w-64 clear-left">
        <div className="overflow-hidden rounded-sm">
          <Image
            src={src}
            alt={alt}
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-xs text-[#37322f]/50 leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (layout === 'right') {
    return (
      <figure className="my-6 sm:float-right sm:ml-6 sm:mb-2 sm:w-64 clear-right">
        <div className="overflow-hidden rounded-sm">
          <Image
            src={src}
            alt={alt}
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-xs text-[#37322f]/50 leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // Default: full
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-sm">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={500}
          className="w-full h-auto object-cover"
          sizes="(max-width: 672px) 100vw, 672px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-[#37322f]/50 text-center leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
