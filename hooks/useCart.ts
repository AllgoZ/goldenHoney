'use client'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useUserStore } from '@/store/user'
import { saveCustomerCart } from '@/lib/services/customer.service'
import type { FSCartItem } from '@/types/firebase'

type CartProduct = { id: string | number; name: string; slug?: string; images?: string[] }

function toFSCartItems(items: ReturnType<typeof useCartStore.getState>['items']): FSCartItem[] {
  return items.map((i) => ({
    productId:      String(i.product.id),
    productName:    i.product.name,
    productSlug:    (i.product as any).slug ?? '',
    productImage:   ((i.product as any).images?.[0] ?? ''),
    selectedWeight: i.selectedWeight,
    unitPrice:      i.unitPrice,
    quantity:       i.quantity,
  }))
}

export function useCart() {
  const store      = useCartStore()
  const showToast  = useUIStore((s) => s.showToast)
  const setCartOpen = useUIStore((s) => s.setCartOpen)
  const uid        = useUserStore((s) => s.user?.id)

  function syncToFirestore(updatedItems: ReturnType<typeof useCartStore.getState>['items']) {
    if (!uid) return
    saveCustomerCart(uid, toFSCartItems(updatedItems)).catch(() => {})
  }

  function addToCart(product: CartProduct, selectedWeight: string, unitPrice: number, quantity = 1) {
    store.addItem(product, selectedWeight, unitPrice, quantity)
    showToast(`${product.name} added to cart`)
    setCartOpen(true)
    // Read updated items after state mutation
    const updated = useCartStore.getState().items
    syncToFirestore(updated)
  }

  function removeItem(productId: string | number, selectedWeight: string) {
    store.removeItem(productId, selectedWeight)
    const updated = useCartStore.getState().items
    syncToFirestore(updated)
  }

  function updateQuantity(productId: string | number, selectedWeight: string, quantity: number) {
    store.updateQuantity(productId, selectedWeight, quantity)
    const updated = useCartStore.getState().items
    syncToFirestore(updated)
  }

  function clearCart() {
    store.clearCart()
    if (uid) saveCustomerCart(uid, []).catch(() => {})
  }

  return {
    items: store.items,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount:  store.itemCount(),
    subtotal:   store.subtotal(),
    shipping:   store.shipping(),
    tax:        store.tax(),
    total:      store.total(),
  }
}
