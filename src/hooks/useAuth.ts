"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, setUser, logout } = useStore()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          logout()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, logout])

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
    router.push('/')
  }

  return {
    user,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
