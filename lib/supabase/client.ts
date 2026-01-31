import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      // Persist session in cookies
      persistSession: true,
      // Auto refresh session
      autoRefreshToken: true,
      // Detect session from URL (for OAuth callbacks)
      detectSessionInUrl: true,
    },
  })

  return client
}

// Reset client (useful for testing or when session changes)
export function resetClient() {
  client = null
}
