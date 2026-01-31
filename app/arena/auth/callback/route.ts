import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/arena'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorUrl = new URL('/arena/login', origin)
    errorUrl.searchParams.set('error', error)
    return NextResponse.redirect(errorUrl)
  }

  // No code means something went wrong
  if (!code) {
    console.error('No code in callback')
    return NextResponse.redirect(`${origin}/arena/login?error=no_code`)
  }

  // Create response first so we can attach cookies to it
  const redirectUrl = `${origin}${next}`
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              // Ensure cookies are properly accessible
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
            })
          })
        },
      },
    }
  )

  try {
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Session exchange error:', sessionError)
      return NextResponse.redirect(`${origin}/arena/login?error=session_error`)
    }

    // If we have a user, ensure their profile exists
    if (data?.user) {
      const { data: existingProfile } = await (supabase.from('profiles') as any)
        .select('id')
        .eq('id', data.user.id)
        .single()

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const metadata = data.user.user_metadata || {}
        const newProfile = {
          id: data.user.id,
          email: data.user.email || '',
          username: metadata.preferred_username || metadata.user_name ||
                   data.user.email?.split('@')[0] || `user_${data.user.id.slice(0, 8)}`,
          full_name: metadata.full_name || metadata.name || null,
          avatar_url: metadata.avatar_url || metadata.picture || null,
          bio: null,
          website: null,
          skills: [],
          role: 'builder',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: profileError } = await (supabase.from('profiles') as any)
          .upsert(newProfile, { onConflict: 'id' })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the login if profile creation fails
        }
      }
    }

    return response
  } catch (err) {
    console.error('Auth callback exception:', err)
    return NextResponse.redirect(`${origin}/arena/login?error=callback_error`)
  }
}
