'use client'
import { useUserStore } from '@/store/user'
import { useUIStore } from '@/store/ui'

export function useAuthGate() {
  const user          = useUserStore((s) => s.user)
  const showAuthModal = useUIStore((s) => s.showAuthModal)

  function requireAuth(action: () => void) {
    if (user?.isLoggedIn) {
      action()
    } else {
      showAuthModal(action)
    }
  }

  return { requireAuth, isLoggedIn: !!user?.isLoggedIn }
}
