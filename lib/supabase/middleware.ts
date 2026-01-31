import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Ensure cookies are accessible
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  // IMPORTANT: Do not use getSession() - it reads from storage without verification
  // getUser() will refresh the session if needed
  const { data: { user }, error } = await supabase.auth.getUser()

  // Optional: Protect routes that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/arena/new') ||
                           request.nextUrl.pathname.startsWith('/arena/edit') ||
                           request.nextUrl.pathname.startsWith('/arena/settings') ||
                           request.nextUrl.pathname.startsWith('/arena/bookmarks')

  if (isProtectedRoute && (error || !user)) {
    const loginUrl = new URL('/arena/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
