'use client'
import { create } from 'zustand'

interface UIStore {
  cartOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  pickerOpen: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  authModal: { open: boolean; onSuccess: (() => void) | null }
  setCartOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setPickerOpen: (open: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  showAuthModal: (onSuccess: () => void) => void
  hideAuthModal: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  pickerOpen: false,
  toast: null,
  authModal: { open: false, onSuccess: null },

  setCartOpen: (open) => set({ cartOpen: open, mobileMenuOpen: false }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open, cartOpen: false }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setPickerOpen: (open) => set({ pickerOpen: open }),

  showToast: (message, type = 'success') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },
  clearToast: () => set({ toast: null }),

  showAuthModal: (onSuccess) => set({ authModal: { open: true, onSuccess } }),
  hideAuthModal: () => set({ authModal: { open: false, onSuccess: null } }),
}))
