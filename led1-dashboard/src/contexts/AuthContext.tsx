'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: 'email' | 'google'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage
    const savedUser = localStorage.getItem('led1-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)

    // Simulamos autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: '1',
      name: 'Usuario Demo',
      email,
      provider: 'email'
    }

    setUser(mockUser)
    localStorage.setItem('led1-user', JSON.stringify(mockUser))
    setLoading(false)
  }

  const loginWithGoogle = async () => {
    setLoading(true)

    try {
      // En una implementación real, aquí usarías Google OAuth
      // Por ahora simulamos el login
      await new Promise(resolve => setTimeout(resolve, 1500))

      const googleUser: User = {
        id: 'google-123',
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google'
      }

      setUser(googleUser)
      localStorage.setItem('led1-user', JSON.stringify(googleUser))
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('led1-user')
    // Redirigir al login
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithGoogle,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}