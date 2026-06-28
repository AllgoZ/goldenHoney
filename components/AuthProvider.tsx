'use client'
import { useEffect } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { onAuthChange } from '@/lib/services/auth.service'
import { getCustomer } from '@/lib/services/customer.service'
import { getProductById } from '@/lib/services/product.service'
import { useUserStore } from '@/store/user'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import type { CartItem } from '@/types'
import PhoneAuthModal from '@/components/PhoneAuthModal'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser    = useUserStore((s) => s.setUser)
  const logoutUser = useUserStore((s) => s.logout)
  const currentUser        = useUserStore((s) => s.user)
  const setWishlistItems   = useWishlistStore((s) => s.setItems)
  const clearWishlist      = useWishlistStore((s) => s.clearAll)
  const setCartItems       = useCartStore((s) => s.setItems)
  const clearCart          = useCartStore((s) => s.clearCart)

  // Firebase Auth — handles email/admin users only
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser?.email) {
        const uid = firebaseUser.uid
        setUser({
          id:         uid,
          name:       firebaseUser.displayName ?? firebaseUser.email.split('@')[0],
          email:      firebaseUser.email,
          phone:      firebaseUser.phoneNumber ?? undefined,
          avatar:     firebaseUser.photoURL ?? undefined,
          isLoggedIn: true,
          createdAt:  firebaseUser.metadata.creationTime,
        })
        // Ensure users doc exists (for admin panel access)
        try {
          await setDoc(doc(db, 'users', uid), {
            uid,
            name:      firebaseUser.displayName ?? firebaseUser.email.split('@')[0],
            email:     firebaseUser.email,
            role:      'customer',
            status:    'active',
            lastLogin: serverTimestamp(),
          }, { merge: true })
        } catch {}
      } else {
        // Firebase has no session — only clear if it was a Firebase email user
        const current = useUserStore.getState().user
        if (current?.email && current.email.includes('@')) {
          logoutUser()
          clearWishlist()
          clearCart()
        }
        // Phone users (no email) persist via Zustand localStorage — do not clear them
      }
    })
    return unsubscribe
  }, [])

  // Phone customer data sync — runs on mount (for returning users from localStorage)
  // and whenever user.id changes (after PhoneAuthModal sets a new user)
  useEffect(() => {
    if (!currentUser?.isLoggedIn) return
    // Phone users have 10-digit IDs; skip email users (Firebase UID is a 28-char hash)
    const isPhoneUser = /^\d{10}$/.test(currentUser.id)
    if (!isPhoneUser) return

    loadCustomerData(currentUser.id)
  }, [currentUser?.id])

  async function loadCustomerData(phoneId: string) {
    try {
      const customer = await getCustomer(phoneId)
      if (!customer) return

      // Restore cart from Firestore (merge with any in-memory items)
      if (customer.cart?.length > 0) {
        const fsItems: CartItem[] = customer.cart.map((fi) => ({
          product: {
            id:     fi.productId,
            name:   fi.productName,
            slug:   fi.productSlug,
            images: [fi.productImage],
          } as any,
          selectedWeight: fi.selectedWeight,
          unitPrice:      fi.unitPrice,
          quantity:       fi.quantity,
        }))
        const local = useCartStore.getState().items
        const merged = [...local]
        for (const fi of fsItems) {
          const exists = merged.some(
            (l) => String(l.product.id) === String(fi.product.id) && l.selectedWeight === fi.selectedWeight
          )
          if (!exists) merged.push(fi)
        }
        setCartItems(merged)
      }

      // Restore wishlist from Firestore
      if (customer.wishlist?.length > 0) {
        const products = await Promise.all(customer.wishlist.map((id) => getProductById(id)))
        setWishlistItems(
          products
            .filter((p) => p !== null)
            .map((p) => ({ product: p!, addedAt: new Date().toISOString() }))
        )
      }
    } catch {}
  }

  return (
    <>
      {children}
      <PhoneAuthModal />
    </>
  )
}
