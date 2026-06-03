import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deleteCookie, getCookie, setCookie } from '@/lib/cookies'

// ========================================
// ZUSTAND STORE - AUTENTICAÇÃO
// ========================================

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'GUEST' | 'STAFF' | 'ADMIN'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      setToken: (token) => {
        setCookie('auth_token', token, 7, { secure: true, sameSite: 'Lax' })
      },

      logout: () => {
        deleteCookie('auth_token')
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: () => {
        const token = getCookie('auth_token')
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return false
        }
        return true
      },
    }),
    {
      name: 'recanto-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
