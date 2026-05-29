import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Retrieve the current session once at startup
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error("Error retrieving active session:", err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    // Setup listener for state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event)
      if (isMounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const redirectToUrl = `${window.location.origin}/dashboard`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })
      
      if (error) throw error
    } catch (err) {
      setLoading(false)
      console.error("OAuth Error:", err)
      throw err
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      setLoading(false)
      console.error("Logout Error:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
