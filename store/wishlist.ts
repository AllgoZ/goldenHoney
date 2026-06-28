'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FSProduct } from '@/types/firebase'

export interface WishlistEntry {
  product: FSProduct
  addedAt: string
}

interface WishlistStore {
  items: WishlistEntry[]
  addItem: (product: FSProduct) => void
  removeItem: (productId: string) => void
  toggle: (product: FSProduct) => void
  has: (productId: string) => boolean
  count: () => number
  setItems: (items: WishlistEntry[]) => void
  clearAll: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().has(product.id)) return
        set((state) => ({
          items: [...state.items, { product, addedAt: new Date().toISOString() }],
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      toggle: (product) => {
        if (get().has(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      has: (productId) => get().items.some((i) => i.product.id === productId),

      count: () => get().items.length,

      setItems: (items) => set({ items }),

      clearAll: () => set({ items: [] }),
    }),
    { name: 'gh-wishlist' }
  )
)
