"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Fetch profile for a user
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await (supabase.from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Profile doesn't exist - create one
        if (error.code === 'PGRST116') {
          // Get user data for profile creation
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (currentUser) {
            const metadata = currentUser.user_metadata || {}
            const newProfile = {
              id: userId,
              email: currentUser.email || '',
              username: metadata.preferred_username || metadata.user_name ||
                       currentUser.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
              full_name: metadata.full_name || metadata.name || null,
              avatar_url: metadata.avatar_url || metadata.picture || null,
              bio: null,
              website: null,
              skills: [],
              role: 'builder',
            }

            const { data: created } = await (supabase.from('profiles') as any)
              .upsert(newProfile, { onConflict: 'id' })
              .select()
              .single()

            return created as Profile
          }
        }
        console.error('Profile fetch error:', error)
        return null
      }

      return data as Profile
    } catch (err) {
      console.error('Profile fetch exception:', err)
      return null
    }
  }, [supabase])

  // Handle auth state changes
  const handleAuthChange = useCallback(async (session: Session | null) => {
    if (session?.user) {
      setUser(session.user)
      const userProfile = await fetchProfile(session.user.id)
      setProfile(userProfile)
    } else {
      setUser(null)
      setProfile(null)
    }
    setLoading(false)
  }, [fetchProfile])

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      await handleAuthChange(session)
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleAuthChange(session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, handleAuthChange])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id)
      setProfile(userProfile)
    }
  }, [user, fetchProfile])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
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
