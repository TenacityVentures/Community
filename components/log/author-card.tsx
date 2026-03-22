import Image from 'next/image'
import type { Author } from '@/lib/authors'

// ── Minimal SVG icons ────────────────────────────────────────────────────────
function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// ── Author card ──────────────────────────────────────────────────────────────
export function AuthorCard({ author }: { author: Author }) {
  const socialLinks = [
    author.social.twitter  && { href: author.social.twitter,  label: 'X / Twitter', icon: <TwitterIcon /> },
    author.social.github   && { href: author.social.github,   label: 'GitHub',      icon: <GitHubIcon /> },
    author.social.linkedin && { href: author.social.linkedin, label: 'LinkedIn',     icon: <LinkedInIcon /> },
    author.social.website  && { href: author.social.website,  label: 'Website',      icon: <GlobeIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  return (
    <div className="mt-16 pt-10 border-t border-[#37322f]/10">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-[#37322f]/10 relative">
          <Image
            src={author.image}
            alt={author.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p
            className="text-[#37322f] font-semibold text-base leading-snug"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            {author.name}
          </p>
          <p className="text-[#37322f]/50 text-xs mt-0.5">{author.title}</p>
          <p
            className="text-[#37322f]/70 text-sm mt-2 leading-relaxed"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            {author.bio}
          </p>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-[#37322f]/35 hover:text-[#37322f] transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
