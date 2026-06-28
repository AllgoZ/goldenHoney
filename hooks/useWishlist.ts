'use client'
import { useWishlistStore } from '@/store/wishlist'
import { useUIStore } from '@/store/ui'
import { useUserStore } from '@/store/user'
import { addToCustomerWishlist, removeFromCustomerWishlist } from '@/lib/services/customer.service'
import type { FSProduct } from '@/types/firebase'

export function useWishlist() {
  const store     = useWishlistStore()
  const showToast = useUIStore((s) => s.showToast)
  const user      = useUserStore((s) => s.user)

  async function toggle(product: FSProduct) {
    const was = store.has(product.id)
    store.toggle(product)
    showToast(was ? `Removed from wishlist` : `${product.name} saved to wishlist`)

    if (user?.id) {
      try {
        if (was) {
          await removeFromCustomerWishlist(user.id, product.id)
        } else {
          await addToCustomerWishlist(user.id, product.id)
        }
      } catch {
        // revert optimistic update on failure
        store.toggle(product)
        showToast('Failed to update wishlist. Please try again.')
      }
    }
  }

  return {
    items:    store.items,
    toggle,
    has:      (id: string) => store.has(id),
    count:    store.count(),
    clearAll: store.clearAll,
  }
}
