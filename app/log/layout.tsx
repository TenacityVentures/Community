import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log — 10na.city',
  description: 'Thinking out loud. Building in public.',
}

// The root layout owns the header/footer shell.
// This layout just applies the serif font context to all log routes.
export default function LogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-serif), serif' }}>
      {children}
    </div>
  )
}
