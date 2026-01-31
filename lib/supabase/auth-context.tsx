"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabase = createClient()
  const fetchingProfile = useRef(false)

  // Fetch or create profile for a user
  const fetchProfile = useCallback(async (currentUser: User): Promise<Profile | null> => {
    if (fetchingProfile.current) return null
    fetchingProfile.current = true

    try {
      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (existingProfile) {
        fetchingProfile.current = false
        return existingProfile as Profile
      }

      // If no profile exists (PGRST116 = not found), create one
      if (fetchError?.code === 'PGRST116') {
        const metadata = currentUser.user_metadata || {}
        const newProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          username: metadata.preferred_username || metadata.user_name ||
                   currentUser.email?.split('@')[0] || `user_${currentUser.id.slice(0, 8)}`,
          full_name: metadata.full_name || metadata.name || null,
          avatar_url: metadata.avatar_url || metadata.picture || null,
          bio: null,
          website: null,
          skills: [],
          role: 'builder',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: createdProfile, error: createError } = await (supabase
          .from('profiles') as any)
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          fetchingProfile.current = false
          return null
        }

        fetchingProfile.current = false
        return createdProfile as Profile
      }

      if (fetchError) {
        console.error('Error fetching profile:', fetchError)
      }

      fetchingProfile.current = false
      return null
    } catch (err) {
      console.error('Profile fetch exception:', err)
      fetchingProfile.current = false
      return null
    }
  }, [supabase])

  // Handle session change (both initial and updates)
  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
      setUser(session.user)
      const userProfile = await fetchProfile(session.user)
      setProfile(userProfile)
    } else {
      setUser(null)
      setProfile(null)
    }
  }, [fetchProfile])

  // Refresh session from server
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        setUser(null)
        setProfile(null)
        return
      }

      await handleSession(session)
    } catch (err) {
      console.error('Session refresh exception:', err)
      setUser(null)
      setProfile(null)
    }
  }, [supabase, handleSession])

  // Refresh just the profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      const userProfile = await fetchProfile(user)
      setProfile(userProfile)
    }
  }, [user, fetchProfile])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Initial session error:', error)
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            const userProfile = await fetchProfile(session.user)
            if (mounted) {
              setProfile(userProfile)
            }
          }
          setLoading(false)
          setInitialized(true)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes AFTER initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        // Skip INITIAL_SESSION as we handle it above
        if (event === 'INITIAL_SESSION') {
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user)
            const userProfile = await fetchProfile(session.user)
            if (mounted) {
              setProfile(userProfile)
              setLoading(false)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  // Handle OAuth redirect - check session when page gets focus after redirect
  useEffect(() => {
    if (!initialized) return

    let debounceTimer: NodeJS.Timeout | null = null

    const checkSession = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        // Only refresh if we don't have a user yet
        if (!user) {
          await refreshSession()
        }
      }, 100)
    }

    // Check if returning from OAuth redirect
    const url = new URL(window.location.href)
    if (url.searchParams.has('code') || url.hash.includes('access_token')) {
      checkSession()
    }

    window.addEventListener('focus', checkSession)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkSession()
      }
    })

    return () => {
      window.removeEventListener('focus', checkSession)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [initialized, user, refreshSession])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
