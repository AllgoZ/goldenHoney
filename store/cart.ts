'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

type CartProduct = { id: string | number; name: string }

interface CartStore {
  items: CartItem[]
  addItem: (product: CartProduct, selectedWeight: string, unitPrice: number, quantity?: number) => void
  removeItem: (productId: string | number, selectedWeight: string) => void
  updateQuantity: (productId: string | number, selectedWeight: string, quantity: number) => void
  setItems: (items: CartItem[]) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
  shipping: () => number
  tax: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedWeight, unitPrice, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.selectedWeight === selectedWeight
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.selectedWeight === selectedWeight
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product: product as any, quantity, selectedWeight, unitPrice }],
          }
        })
      },

      removeItem: (productId, selectedWeight) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.selectedWeight === selectedWeight)
          ),
        }))
      },

      updateQuantity: (productId, selectedWeight, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedWeight)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.selectedWeight === selectedWeight
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      setItems: (items) => set({ items }),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      shipping: () => {
        const sub = get().subtotal()
        return sub > 0 && sub < 999 ? 79 : 0
      },

      tax: () => {
        const sub = get().subtotal()
        return Math.round(sub * 0.09)
      },

      total: () => {
        const { subtotal, shipping, tax } = get()
        return subtotal() + shipping() + tax()
      },
    }),
    { name: 'gh-cart' }
  )
)
