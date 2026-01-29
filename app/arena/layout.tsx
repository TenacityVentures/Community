import { AuthProvider } from "@/lib/supabase/auth-context"

export const metadata = {
  title: "The Arena | Tenacity",
  description: "A community of builders, thinkers, and doers. Share ideas, discuss ventures, and connect.",
}

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
