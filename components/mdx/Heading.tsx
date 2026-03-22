import type { ReactNode } from 'react'

// Recursively extract plain text from React children so we can generate IDs
// from headings that may contain inline code, links, etc.
function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props?.children)
  }
  return ''
}

function slugify(children: ReactNode): string {
  return extractText(children)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Shared anchor link ──────────────────────────────────────────────────────
function AnchorLink({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-hidden="true"
      tabIndex={-1}
      className="
        ml-2 text-[#37322f]/20 hover:text-[#37322f]/55
        opacity-0 group-hover:opacity-100
        transition-opacity duration-150
        font-normal no-underline select-none
        text-[0.85em]
      "
    >
      #
    </a>
  )
}

// ── H2 ──────────────────────────────────────────────────────────────────────
export function H2({ children }: { children?: ReactNode }) {
  const id = slugify(children)
  return (
    <h2
      id={id}
      // scroll-mt-20 offsets the sticky header (~80px) when jumping to anchor
      className="group flex items-baseline scroll-mt-20"
    >
      <span>{children}</span>
      <AnchorLink id={id} />
    </h2>
  )
}

// ── H3 ──────────────────────────────────────────────────────────────────────
export function H3({ children }: { children?: ReactNode }) {
  const id = slugify(children)
  return (
    <h3
      id={id}
      className="group flex items-baseline scroll-mt-20"
    >
      <span>{children}</span>
      <AnchorLink id={id} />
    </h3>
  )
}
