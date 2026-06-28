'use client'
import { useUserStore } from '@/store/user'
import {
  signIn,
  signUp,
  signOut,
  signInWithGoogle,
  resetPassword,
} from '@/lib/services/auth.service'

export function useAuth() {
  const { user, updateProfile } = useUserStore()

  async function login(email: string, password: string): Promise<void> {
    await signIn(email, password)
    // AuthProvider's onAuthStateChanged fires and populates the store
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await signUp(name, email, password)
  }

  async function loginWithGoogle(): Promise<void> {
    await signInWithGoogle()
  }

  async function logout(): Promise<void> {
    await signOut()
    // AuthProvider's onAuthStateChanged fires null and clears the store
  }

  return {
    user,
    isLoggedIn: !!user?.isLoggedIn,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    resetPassword,
  }
}
